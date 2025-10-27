"""
Advanced Options Trading Strategies
Iron Condor, Butterfly, Straddle, Strangle, and more
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
import pandas as pd
import numpy as np
from dataclasses import dataclass
from enum import Enum

from app.strategies.base_strategy import BaseStrategy, StrategyConfig, Signal, SignalType, OrderType

class OptionsStrategyType(Enum):
    """Options strategy types"""
    IRON_CONDOR = "IRON_CONDOR"
    IRON_CONDOR_SHORT = "IRON_CONDOR_SHORT"
    IRON_CONDOR_LONG = "IRON_CONDOR_LONG"
    BUTTERFLY = "BUTTERFLY"
    BUTTERFLY_LONG = "BUTTERFLY_LONG"
    BUTTERFLY_SHORT = "BUTTERFLY_SHORT"
    STRADDLE = "STRADDLE"
    STRADDLE_LONG = "STRADDLE_LONG"
    STRADDLE_SHORT = "STRADDLE_SHORT"
    STRANGLE = "STRANGLE"
    STRANGLE_LONG = "STRANGLE_LONG"
    STRANGLE_SHORT = "STRANGLE_SHORT"
    CALL_SPREAD = "CALL_SPREAD"
    PUT_SPREAD = "PUT_SPREAD"
    COVERED_CALL = "COVERED_CALL"
    PROTECTIVE_PUT = "PROTECTIVE_PUT"
    COLLAR = "COLLAR"
    CALENDAR_SPREAD = "CALENDAR_SPREAD"
    DIAGONAL_SPREAD = "DIAGONAL_SPREAD"

@dataclass
class OptionsLeg:
    """Options leg definition"""
    option_type: str  # 'CALL' or 'PUT'
    strike_price: float
    quantity: int
    action: str  # 'BUY' or 'SELL'
    expiration_date: datetime
    premium: float = 0.0

@dataclass
class OptionsStrategy:
    """Options strategy definition"""
    name: str
    strategy_type: OptionsStrategyType
    legs: List[OptionsLeg]
    max_profit: float
    max_loss: float
    breakeven_points: List[float]
    risk_reward_ratio: float
    probability_of_profit: float
    days_to_expiration: int
    implied_volatility: float
    delta: float
    gamma: float
    theta: float
    vega: float

class IronCondorStrategy(BaseStrategy):
    """Iron Condor Options Strategy"""
    
    def __init__(self, config: StrategyConfig):
        super().__init__(config)
        self.strategy_type = OptionsStrategyType.IRON_CONDOR
        self.short_call_strike = getattr(config, 'short_call_strike', 0)
        self.long_call_strike = getattr(config, 'long_call_strike', 0)
        self.short_put_strike = getattr(config, 'short_put_strike', 0)
        self.long_put_strike = getattr(config, 'long_put_strike', 0)
        self.expiration_days = getattr(config, 'expiration_days', 30)
        self.quantity = getattr(config, 'quantity', 1)
        
    async def generate_signals(self, data: pd.DataFrame, symbol: str) -> List[Signal]:
        """Generate Iron Condor signals"""
        signals = []
        
        if len(data) < 20:
            return signals
        
        current_price = data['close'].iloc[-1]
        volatility = data['close'].pct_change().std() * np.sqrt(252)
        
        # Calculate Iron Condor strikes based on current price and volatility
        if self.short_call_strike == 0:
            self.short_call_strike = current_price * 1.02
            self.long_call_strike = current_price * 1.05
            self.short_put_strike = current_price * 0.98
            self.long_put_strike = current_price * 0.95
        
        # Check if we can trade this symbol
        if not await self.can_trade(symbol):
            return signals
        
        # Iron Condor setup signal
        if self._should_setup_iron_condor(current_price, volatility):
            signal = Signal(
                symbol=symbol,
                signal_type=SignalType.BUY,
                price=current_price,
                quantity=self.quantity,
                order_type=OrderType.MARKET,
                stop_loss=current_price * 0.95,
                target_price=current_price * 1.05,
                confidence=0.8,
                reason=f"Iron Condor setup: {self.short_call_strike}/{self.long_call_strike} calls, {self.short_put_strike}/{self.long_put_strike} puts"
            )
            signals.append(signal)
        
        return signals
    
    def _should_setup_iron_condor(self, current_price: float, volatility: float) -> bool:
        """Determine if Iron Condor should be set up"""
        # Setup when volatility is moderate and price is in range
        return 0.15 < volatility < 0.35 and \
               self.long_put_strike < current_price < self.short_call_strike
    
    async def should_exit_position(self, position: Dict, current_data: pd.DataFrame) -> bool:
        """Check if Iron Condor should be closed"""
        current_price = current_data['close'].iloc[-1]
        
        # Close if price moves outside the profit zone
        if current_price < self.long_put_strike or current_price > self.long_call_strike:
            return True
        
        # Close if approaching expiration (last 5 days)
        days_to_exp = (datetime.now() - position.get('entry_date', datetime.now())).days
        if days_to_exp >= self.expiration_days - 5:
            return True
        
        return False

class ButterflyStrategy(BaseStrategy):
    """Butterfly Options Strategy"""
    
    def __init__(self, config: StrategyConfig):
        super().__init__(config)
        self.strategy_type = OptionsStrategyType.BUTTERFLY
        self.center_strike = getattr(config, 'center_strike', 0)
        self.wing_strikes = getattr(config, 'wing_strikes', 0)
        self.expiration_days = getattr(config, 'expiration_days', 30)
        self.quantity = getattr(config, 'quantity', 1)
        
    async def generate_signals(self, data: pd.DataFrame, symbol: str) -> List[Signal]:
        """Generate Butterfly signals"""
        signals = []
        
        if len(data) < 20:
            return signals
        
        current_price = data['close'].iloc[-1]
        volatility = data['close'].pct_change().std() * np.sqrt(252)
        
        # Calculate Butterfly strikes
        if self.center_strike == 0:
            self.center_strike = current_price
            self.wing_strikes = current_price * 0.05  # 5% wing spread
        
        if not await self.can_trade(symbol):
            return signals
        
        # Butterfly setup signal
        if self._should_setup_butterfly(current_price, volatility):
            signal = Signal(
                symbol=symbol,
                signal_type=SignalType.BUY,
                price=current_price,
                quantity=self.quantity,
                order_type=OrderType.MARKET,
                stop_loss=current_price * 0.95,
                target_price=current_price * 1.05,
                confidence=0.75,
                reason=f"Butterfly setup: {self.center_strike - self.wing_strikes}/{self.center_strike}/{self.center_strike + self.wing_strikes}"
            )
            signals.append(signal)
        
        return signals
    
    def _should_setup_butterfly(self, current_price: float, volatility: float) -> bool:
        """Determine if Butterfly should be set up"""
        # Setup when volatility is low and price is near center strike
        return volatility < 0.25 and \
               abs(current_price - self.center_strike) / current_price < 0.02
    
    async def should_exit_position(self, position: Dict, current_data: pd.DataFrame) -> bool:
        """Check if Butterfly should be closed"""
        current_price = current_data['close'].iloc[-1]
        
        # Close if price moves significantly away from center
        if abs(current_price - self.center_strike) / self.center_strike > 0.1:
            return True
        
        return False

class StraddleStrategy(BaseStrategy):
    """Straddle Options Strategy"""
    
    def __init__(self, config: StrategyConfig):
        super().__init__(config)
        self.strategy_type = OptionsStrategyType.STRADDLE
        self.strike_price = getattr(config, 'strike_price', 0)
        self.expiration_days = getattr(config, 'expiration_days', 30)
        self.quantity = getattr(config, 'quantity', 1)
        
    async def generate_signals(self, data: pd.DataFrame, symbol: str) -> List[Signal]:
        """Generate Straddle signals"""
        signals = []
        
        if len(data) < 20:
            return signals
        
        current_price = data['close'].iloc[-1]
        volatility = data['close'].pct_change().std() * np.sqrt(252)
        
        if self.strike_price == 0:
            self.strike_price = current_price
        
        if not await self.can_trade(symbol):
            return signals
        
        # Straddle setup signal
        if self._should_setup_straddle(current_price, volatility):
            signal = Signal(
                symbol=symbol,
                signal_type=SignalType.BUY,
                price=current_price,
                quantity=self.quantity,
                order_type=OrderType.MARKET,
                stop_loss=current_price * 0.90,
                target_price=current_price * 1.10,
                confidence=0.7,
                reason=f"Straddle setup: {self.strike_price} strike"
            )
            signals.append(signal)
        
        return signals
    
    def _should_setup_straddle(self, current_price: float, volatility: float) -> bool:
        """Determine if Straddle should be set up"""
        # Setup when expecting high volatility
        return volatility > 0.3 and \
               abs(current_price - self.strike_price) / current_price < 0.01
    
    async def should_exit_position(self, position: Dict, current_data: pd.DataFrame) -> bool:
        """Check if Straddle should be closed"""
        current_price = current_data['close'].iloc[-1]
        
        # Close if price moves significantly
        if abs(current_price - self.strike_price) / self.strike_price > 0.15:
            return True
        
        return False

class StrangleStrategy(BaseStrategy):
    """Strangle Options Strategy"""
    
    def __init__(self, config: StrategyConfig):
        super().__init__(config)
        self.strategy_type = OptionsStrategyType.STRANGLE
        self.call_strike = getattr(config, 'call_strike', 0)
        self.put_strike = getattr(config, 'put_strike', 0)
        self.expiration_days = getattr(config, 'expiration_days', 30)
        self.quantity = getattr(config, 'quantity', 1)
        
    async def generate_signals(self, data: pd.DataFrame, symbol: str) -> List[Signal]:
        """Generate Strangle signals"""
        signals = []
        
        if len(data) < 20:
            return signals
        
        current_price = data['close'].iloc[-1]
        volatility = data['close'].pct_change().std() * np.sqrt(252)
        
        if self.call_strike == 0:
            self.call_strike = current_price * 1.05
            self.put_strike = current_price * 0.95
        
        if not await self.can_trade(symbol):
            return signals
        
        # Strangle setup signal
        if self._should_setup_strangle(current_price, volatility):
            signal = Signal(
                symbol=symbol,
                signal_type=SignalType.BUY,
                price=current_price,
                quantity=self.quantity,
                order_type=OrderType.MARKET,
                stop_loss=current_price * 0.90,
                target_price=current_price * 1.10,
                confidence=0.65,
                reason=f"Strangle setup: {self.put_strike} put, {self.call_strike} call"
            )
            signals.append(signal)
        
        return signals
    
    def _should_setup_strangle(self, current_price: float, volatility: float) -> bool:
        """Determine if Strangle should be set up"""
        # Setup when expecting high volatility but not immediate
        return volatility > 0.25 and \
               self.put_strike < current_price < self.call_strike
    
    async def should_exit_position(self, position: Dict, current_data: pd.DataFrame) -> bool:
        """Check if Strangle should be closed"""
        current_price = current_data['close'].iloc[-1]
        
        # Close if price moves outside the range
        if current_price < self.put_strike or current_price > self.call_strike:
            return True
        
        return False

class OptionsStrategyManager:
    """Manager for all options strategies"""
    
    def __init__(self):
        self.strategies = {
            'iron_condor': IronCondorStrategy,
            'butterfly': ButterflyStrategy,
            'straddle': StraddleStrategy,
            'strangle': StrangleStrategy
        }
    
    def get_available_strategies(self) -> List[Dict[str, Any]]:
        """Get list of available options strategies"""
        return [
            {
                'name': 'Iron Condor',
                'type': 'iron_condor',
                'description': 'Neutral strategy with limited risk and reward',
                'max_profit': 'Limited',
                'max_loss': 'Limited',
                'market_outlook': 'Neutral',
                'volatility': 'Low to Moderate',
                'time_decay': 'Positive'
            },
            {
                'name': 'Butterfly',
                'type': 'butterfly',
                'description': 'Neutral strategy with maximum profit at center strike',
                'max_profit': 'Limited',
                'max_loss': 'Limited',
                'market_outlook': 'Neutral',
                'volatility': 'Low',
                'time_decay': 'Positive'
            },
            {
                'name': 'Straddle',
                'type': 'straddle',
                'description': 'Volatility strategy betting on big moves',
                'max_profit': 'Unlimited',
                'max_loss': 'Limited',
                'market_outlook': 'Volatile',
                'volatility': 'High',
                'time_decay': 'Negative'
            },
            {
                'name': 'Strangle',
                'type': 'strangle',
                'description': 'Volatility strategy with wider breakeven',
                'max_profit': 'Unlimited',
                'max_loss': 'Limited',
                'market_outlook': 'Volatile',
                'volatility': 'High',
                'time_decay': 'Negative'
            },
            {
                'name': 'Call Spread',
                'type': 'call_spread',
                'description': 'Bullish strategy with limited risk',
                'max_profit': 'Limited',
                'max_loss': 'Limited',
                'market_outlook': 'Bullish',
                'volatility': 'Any',
                'time_decay': 'Positive'
            },
            {
                'name': 'Put Spread',
                'type': 'put_spread',
                'description': 'Bearish strategy with limited risk',
                'max_profit': 'Limited',
                'max_loss': 'Limited',
                'market_outlook': 'Bearish',
                'volatility': 'Any',
                'time_decay': 'Positive'
            },
            {
                'name': 'Covered Call',
                'type': 'covered_call',
                'description': 'Income strategy on owned stock',
                'max_profit': 'Limited',
                'max_loss': 'Unlimited',
                'market_outlook': 'Neutral to Bullish',
                'volatility': 'Any',
                'time_decay': 'Positive'
            },
            {
                'name': 'Protective Put',
                'type': 'protective_put',
                'description': 'Insurance strategy for owned stock',
                'max_profit': 'Unlimited',
                'max_loss': 'Limited',
                'market_outlook': 'Bullish with Protection',
                'volatility': 'Any',
                'time_decay': 'Negative'
            }
        ]
    
    def create_strategy(self, strategy_type: str, config: StrategyConfig) -> BaseStrategy:
        """Create a strategy instance"""
        if strategy_type in self.strategies:
            return self.strategies[strategy_type](config)
        else:
            raise ValueError(f"Unknown strategy type: {strategy_type}")
    
    def calculate_strategy_payoff(self, strategy: OptionsStrategy, stock_price: float) -> float:
        """Calculate strategy payoff at given stock price"""
        total_payoff = 0
        
        for leg in strategy.legs:
            if leg.option_type == 'CALL':
                if stock_price > leg.strike_price:
                    payoff = (stock_price - leg.strike_price) * leg.quantity
                else:
                    payoff = 0
            else:  # PUT
                if stock_price < leg.strike_price:
                    payoff = (leg.strike_price - stock_price) * leg.quantity
                else:
                    payoff = 0
            
            if leg.action == 'BUY':
                total_payoff += payoff
            else:  # SELL
                total_payoff -= payoff
        
        return total_payoff

