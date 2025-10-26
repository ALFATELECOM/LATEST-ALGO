"""
Base strategy class for all trading strategies
"""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Dict, List, Optional, Any, Tuple
import pandas as pd
import numpy as np
from dataclasses import dataclass
from enum import Enum

class SignalType(Enum):
    """Signal types"""
    BUY = "BUY"
    SELL = "SELL"
    HOLD = "HOLD"
    EXIT = "EXIT"

class OrderType(Enum):
    """Order types"""
    MARKET = "MARKET"
    LIMIT = "LIMIT"
    SL = "SL"
    SL_M = "SL-M"

@dataclass
class Signal:
    """Trading signal"""
    symbol: str
    signal_type: SignalType
    price: float
    quantity: int
    order_type: OrderType
    stop_loss: Optional[float] = None
    target_price: Optional[float] = None
    trailing_stop: Optional[float] = None
    timestamp: datetime = None
    confidence: float = 1.0
    reason: str = ""
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now()

@dataclass
class StrategyConfig:
    """Strategy configuration"""
    name: str
    enabled: bool = True
    max_position_size: float = 10000.0
    stop_loss_percent: float = 2.0
    target_percent: float = 4.0
    trailing_stop_percent: float = 1.0
    risk_per_trade: float = 0.02
    max_trades_per_day: int = 10
    min_confidence: float = 0.6
    timeframe: str = "1min"
    symbols: List[str] = None
    
    def __post_init__(self):
        if self.symbols is None:
            self.symbols = []

class BaseStrategy(ABC):
    """Base class for all trading strategies"""
    
    def __init__(self, config: StrategyConfig):
        self.config = config
        self.name = config.name
        self.enabled = config.enabled
        self.positions = {}
        self.trades = []
        self.performance_metrics = {}
        self.last_signal_time = {}
        
    @abstractmethod
    async def generate_signals(self, data: pd.DataFrame, symbol: str) -> List[Signal]:
        """Generate trading signals based on data"""
        pass
    
    @abstractmethod
    async def should_exit_position(self, position: Dict, current_data: pd.DataFrame) -> bool:
        """Check if position should be exited"""
        pass
    
    async def calculate_position_size(self, symbol: str, price: float, risk_amount: float) -> int:
        """Calculate position size based on risk management"""
        if self.config.stop_loss_percent <= 0:
            return 0
        
        stop_loss_price = price * (1 - self.config.stop_loss_percent / 100)
        risk_per_share = price - stop_loss_price
        
        if risk_per_share <= 0:
            return 0
        
        position_size = int(risk_amount / risk_per_share)
        max_position_value = self.config.max_position_size
        
        # Limit position size based on max position size
        max_shares = int(max_position_value / price)
        position_size = min(position_size, max_shares)
        
        return max(0, position_size)
    
    async def calculate_stop_loss(self, entry_price: float, signal_type: SignalType) -> float:
        """Calculate stop loss price"""
        if signal_type == SignalType.BUY:
            return entry_price * (1 - self.config.stop_loss_percent / 100)
        else:  # SELL
            return entry_price * (1 + self.config.stop_loss_percent / 100)
    
    async def calculate_target_price(self, entry_price: float, signal_type: SignalType) -> float:
        """Calculate target price"""
        if signal_type == SignalType.BUY:
            return entry_price * (1 + self.config.target_percent / 100)
        else:  # SELL
            return entry_price * (1 - self.config.target_percent / 100)
    
    async def calculate_trailing_stop(self, entry_price: float, current_price: float, signal_type: SignalType) -> float:
        """Calculate trailing stop price"""
        if signal_type == SignalType.BUY:
            # For long positions, trail stop below current price
            trailing_stop = current_price * (1 - self.config.trailing_stop_percent / 100)
            # Don't let trailing stop go below entry price
            return max(trailing_stop, entry_price * (1 - self.config.stop_loss_percent / 100))
        else:  # SELL
            # For short positions, trail stop above current price
            trailing_stop = current_price * (1 + self.config.trailing_stop_percent / 100)
            # Don't let trailing stop go above entry price
            return min(trailing_stop, entry_price * (1 + self.config.stop_loss_percent / 100))
    
    async def update_position(self, symbol: str, position: Dict):
        """Update position information"""
        self.positions[symbol] = position
    
    async def add_trade(self, trade: Dict):
        """Add completed trade to history"""
        self.trades.append(trade)
    
    async def get_performance_metrics(self) -> Dict[str, Any]:
        """Calculate strategy performance metrics"""
        if not self.trades:
            return {}
        
        trades_df = pd.DataFrame(self.trades)
        
        # Basic metrics
        total_trades = len(trades_df)
        winning_trades = len(trades_df[trades_df['pnl'] > 0])
        losing_trades = len(trades_df[trades_df['pnl'] < 0])
        
        win_rate = winning_trades / total_trades if total_trades > 0 else 0
        
        # P&L metrics
        total_pnl = trades_df['pnl'].sum()
        avg_win = trades_df[trades_df['pnl'] > 0]['pnl'].mean() if winning_trades > 0 else 0
        avg_loss = trades_df[trades_df['pnl'] < 0]['pnl'].mean() if losing_trades > 0 else 0
        
        # Risk metrics
        max_drawdown = trades_df['cumulative_pnl'].min() if 'cumulative_pnl' in trades_df.columns else 0
        
        # Sharpe ratio (simplified)
        returns = trades_df['pnl'].pct_change().dropna()
        sharpe_ratio = returns.mean() / returns.std() if returns.std() > 0 else 0
        
        self.performance_metrics = {
            'total_trades': total_trades,
            'winning_trades': winning_trades,
            'losing_trades': losing_trades,
            'win_rate': win_rate,
            'total_pnl': total_pnl,
            'avg_win': avg_win,
            'avg_loss': avg_loss,
            'max_drawdown': max_drawdown,
            'sharpe_ratio': sharpe_ratio,
            'profit_factor': abs(avg_win / avg_loss) if avg_loss != 0 else 0
        }
        
        return self.performance_metrics
    
    async def is_symbol_allowed(self, symbol: str) -> bool:
        """Check if symbol is allowed for this strategy"""
        return not self.config.symbols or symbol in self.config.symbols
    
    async def can_trade(self, symbol: str) -> bool:
        """Check if strategy can trade (not at daily limit, etc.)"""
        if not self.enabled:
            return False
        
        # Check daily trade limit
        today = datetime.now().date()
        today_trades = [t for t in self.trades if t.get('timestamp', datetime.now()).date() == today]
        
        if len(today_trades) >= self.config.max_trades_per_day:
            return False
        
        return True
    
    async def reset(self):
        """Reset strategy state"""
        self.positions = {}
        self.trades = []
        self.performance_metrics = {}
        self.last_signal_time = {}
    
    def __str__(self):
        return f"{self.name} Strategy"
    
    def __repr__(self):
        return f"BaseStrategy(name='{self.name}', enabled={self.enabled})"
