"""
Base Strategy Classes for ALFA ALGO Trading System
"""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum
import pandas as pd

class SignalType(Enum):
    """Signal types"""
    BUY = "BUY"
    SELL = "SELL"
    HOLD = "HOLD"

class OrderType(Enum):
    """Order types"""
    MARKET = "MARKET"
    LIMIT = "LIMIT"
    STOP = "STOP"
    STOP_LIMIT = "STOP_LIMIT"

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
    confidence: float = 0.5
    reason: str = ""
    timestamp: datetime = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now()

@dataclass
class StrategyConfig:
    """Strategy configuration"""
    name: str
    enabled: bool = True
    risk_level: float = 0.02  # 2% risk per trade
    max_positions: int = 10
    min_confidence: float = 0.6
    stop_loss_pct: float = 0.05  # 5% stop loss
    take_profit_pct: float = 0.10  # 10% take profit
    lookback_period: int = 20
    parameters: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.parameters is None:
            self.parameters = {}

class BaseStrategy(ABC):
    """Base class for all trading strategies"""
    
    def __init__(self, config: StrategyConfig):
        self.config = config
        self.name = config.name
        self.enabled = config.enabled
        self.risk_level = config.risk_level
        self.max_positions = config.max_positions
        self.min_confidence = config.min_confidence
        self.stop_loss_pct = config.stop_loss_pct
        self.take_profit_pct = config.take_profit_pct
        self.lookback_period = config.lookback_period
        self.parameters = config.parameters or {}
        
        # Strategy state
        self.positions = {}
        self.signals_history = []
        self.performance_metrics = {
            'total_trades': 0,
            'winning_trades': 0,
            'losing_trades': 0,
            'total_pnl': 0.0,
            'max_drawdown': 0.0,
            'win_rate': 0.0
        }
    
    @abstractmethod
    async def generate_signals(self, data: pd.DataFrame, symbol: str) -> List[Signal]:
        """Generate trading signals for given data and symbol"""
        pass
    
    async def can_trade(self, symbol: str) -> bool:
        """Check if we can trade this symbol"""
        # Basic checks
        if not self.enabled:
            return False
        
        # Check if we have too many positions
        if len(self.positions) >= self.max_positions:
            return False
        
        # Check if we already have a position in this symbol
        if symbol in self.positions:
            return False
        
        return True
    
    async def should_exit_position(self, position: Dict, current_data: pd.DataFrame) -> bool:
        """Check if we should exit a position"""
        current_price = current_data['close'].iloc[-1]
        entry_price = position.get('entry_price', 0)
        
        if entry_price == 0:
            return False
        
        # Check stop loss
        if current_price <= entry_price * (1 - self.stop_loss_pct):
            return True
        
        # Check take profit
        if current_price >= entry_price * (1 + self.take_profit_pct):
            return True
        
        return False
    
    def calculate_position_size(self, account_value: float, price: float, risk_amount: float = None) -> int:
        """Calculate position size based on risk management"""
        if risk_amount is None:
            risk_amount = account_value * self.risk_level
        
        # Calculate quantity based on risk amount and stop loss
        stop_loss_price = price * (1 - self.stop_loss_pct)
        risk_per_share = price - stop_loss_price
        
        if risk_per_share <= 0:
            return 0
        
        quantity = int(risk_amount / risk_per_share)
        return max(1, quantity)  # At least 1 share
    
    def update_performance(self, trade_result: Dict):
        """Update performance metrics"""
        self.performance_metrics['total_trades'] += 1
        
        if trade_result.get('pnl', 0) > 0:
            self.performance_metrics['winning_trades'] += 1
        else:
            self.performance_metrics['losing_trades'] += 1
        
        self.performance_metrics['total_pnl'] += trade_result.get('pnl', 0)
        
        # Update win rate
        total = self.performance_metrics['total_trades']
        wins = self.performance_metrics['winning_trades']
        self.performance_metrics['win_rate'] = wins / total if total > 0 else 0
        
        # Update max drawdown
        current_pnl = self.performance_metrics['total_pnl']
        if current_pnl < self.performance_metrics['max_drawdown']:
            self.performance_metrics['max_drawdown'] = current_pnl
    
    def get_performance_summary(self) -> Dict[str, Any]:
        """Get performance summary"""
        return {
            'strategy_name': self.name,
            'enabled': self.enabled,
            'active_positions': len(self.positions),
            'total_signals': len(self.signals_history),
            **self.performance_metrics
        }
    
    def reset_strategy(self):
        """Reset strategy state"""
        self.positions = {}
        self.signals_history = []
        self.performance_metrics = {
            'total_trades': 0,
            'winning_trades': 0,
            'losing_trades': 0,
            'total_pnl': 0.0,
            'max_drawdown': 0.0,
            'win_rate': 0.0
        }
