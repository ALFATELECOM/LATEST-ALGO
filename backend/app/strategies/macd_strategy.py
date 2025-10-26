"""
MACD-based trading strategy
Implements MACD crossover and histogram signals
"""

import pandas as pd
import numpy as np
from datetime import datetime
from typing import List, Dict, Any
import ta

from app.strategies.base_strategy import BaseStrategy, StrategyConfig, Signal, SignalType, OrderType

class MACDStrategy(BaseStrategy):
    """MACD crossover strategy"""
    
    def __init__(self, config: StrategyConfig):
        super().__init__(config)
        self.fast_period = getattr(config, 'fast_period', 12)
        self.slow_period = getattr(config, 'slow_period', 26)
        self.signal_period = getattr(config, 'signal_period', 9)
        self.histogram_threshold = getattr(config, 'histogram_threshold', 0.0)
        
    async def generate_signals(self, data: pd.DataFrame, symbol: str) -> List[Signal]:
        """Generate MACD-based trading signals"""
        signals = []
        
        if len(data) < self.slow_period + self.signal_period:
            return signals
        
        # Calculate MACD
        macd_indicator = ta.trend.MACD(
            data['close'], 
            window_fast=self.fast_period, 
            window_slow=self.slow_period, 
            window_sign=self.signal_period
        )
        
        data['macd'] = macd_indicator.macd()
        data['macd_signal'] = macd_indicator.macd_signal()
        data['macd_histogram'] = macd_indicator.macd_diff()
        
        # Get current and previous values
        current_macd = data['macd'].iloc[-1]
        prev_macd = data['macd'].iloc[-2]
        current_signal = data['macd_signal'].iloc[-1]
        prev_signal = data['macd_signal'].iloc[-2]
        current_histogram = data['macd_histogram'].iloc[-1]
        prev_histogram = data['macd_histogram'].iloc[-2]
        current_price = data['close'].iloc[-1]
        
        # Check if we can trade this symbol
        if not await self.can_trade(symbol):
            return signals
        
        # MACD crossover signals
        if (prev_macd <= prev_signal and current_macd > current_signal):
            # Bullish crossover - BUY signal
            signal = Signal(
                symbol=symbol,
                signal_type=SignalType.BUY,
                price=current_price,
                quantity=await self.calculate_position_size(symbol, current_price, 
                                                          self.config.max_position_size * self.config.risk_per_trade),
                order_type=OrderType.MARKET,
                stop_loss=await self.calculate_stop_loss(current_price, SignalType.BUY),
                target_price=await self.calculate_target_price(current_price, SignalType.BUY),
                confidence=min(1.0, abs(current_histogram) / 10),  # Confidence based on histogram strength
                reason=f"MACD bullish crossover: MACD={current_macd:.4f}, Signal={current_signal:.4f}"
            )
            signals.append(signal)
            
        elif (prev_macd >= prev_signal and current_macd < current_signal):
            # Bearish crossover - SELL signal
            signal = Signal(
                symbol=symbol,
                signal_type=SignalType.SELL,
                price=current_price,
                quantity=await self.calculate_position_size(symbol, current_price, 
                                                          self.config.max_position_size * self.config.risk_per_trade),
                order_type=OrderType.MARKET,
                stop_loss=await self.calculate_stop_loss(current_price, SignalType.SELL),
                target_price=await self.calculate_target_price(current_price, SignalType.SELL),
                confidence=min(1.0, abs(current_histogram) / 10),
                reason=f"MACD bearish crossover: MACD={current_macd:.4f}, Signal={current_signal:.4f}"
            )
            signals.append(signal)
        
        return signals
    
    async def should_exit_position(self, position: Dict, current_data: pd.DataFrame) -> bool:
        """Check if position should be exited based on MACD"""
        if len(current_data) < self.slow_period + self.signal_period:
            return False
        
        # Calculate MACD
        macd_indicator = ta.trend.MACD(
            current_data['close'], 
            window_fast=self.fast_period, 
            window_slow=self.slow_period, 
            window_sign=self.signal_period
        )
        
        current_data['macd'] = macd_indicator.macd()
        current_data['macd_signal'] = macd_indicator.macd_signal()
        
        current_macd = current_data['macd'].iloc[-1]
        current_signal = current_data['macd_signal'].iloc[-1]
        
        # Exit conditions
        if position['side'] == 'LONG' and current_macd < current_signal:
            return True
        elif position['side'] == 'SHORT' and current_macd > current_signal:
            return True
        
        return False

class MACDHistogramStrategy(BaseStrategy):
    """MACD histogram strategy"""
    
    def __init__(self, config: StrategyConfig):
        super().__init__(config)
        self.fast_period = getattr(config, 'fast_period', 12)
        self.slow_period = getattr(config, 'slow_period', 26)
        self.signal_period = getattr(config, 'signal_period', 9)
        self.histogram_threshold = getattr(config, 'histogram_threshold', 0.0)
        self.histogram_momentum_periods = getattr(config, 'histogram_momentum_periods', 3)
        
    async def generate_signals(self, data: pd.DataFrame, symbol: str) -> List[Signal]:
        """Generate MACD histogram-based signals"""
        signals = []
        
        if len(data) < self.slow_period + self.signal_period + self.histogram_momentum_periods:
            return signals
        
        # Calculate MACD
        macd_indicator = ta.trend.MACD(
            data['close'], 
            window_fast=self.fast_period, 
            window_slow=self.slow_period, 
            window_sign=self.signal_period
        )
        
        data['macd_histogram'] = macd_indicator.macd_diff()
        
        # Get current and previous histogram values
        current_histogram = data['macd_histogram'].iloc[-1]
        prev_histogram = data['macd_histogram'].iloc[-2]
        current_price = data['close'].iloc[-1]
        
        # Calculate histogram momentum (rate of change)
        if len(data) >= self.histogram_momentum_periods + 1:
            histogram_momentum = (current_histogram - data['macd_histogram'].iloc[-self.histogram_momentum_periods-1]) / self.histogram_momentum_periods
        else:
            histogram_momentum = 0
        
        # Check if we can trade this symbol
        if not await self.can_trade(symbol):
            return signals
        
        # Histogram momentum signals
        if (current_histogram > self.histogram_threshold and 
            prev_histogram <= self.histogram_threshold and 
            histogram_momentum > 0):
            # Histogram turning positive with momentum - BUY signal
            signal = Signal(
                symbol=symbol,
                signal_type=SignalType.BUY,
                price=current_price,
                quantity=await self.calculate_position_size(symbol, current_price, 
                                                          self.config.max_position_size * self.config.risk_per_trade),
                order_type=OrderType.MARKET,
                stop_loss=await self.calculate_stop_loss(current_price, SignalType.BUY),
                target_price=await self.calculate_target_price(current_price, SignalType.BUY),
                confidence=min(1.0, abs(histogram_momentum) * 10),
                reason=f"MACD histogram bullish momentum: {current_histogram:.4f}, momentum: {histogram_momentum:.4f}"
            )
            signals.append(signal)
            
        elif (current_histogram < -self.histogram_threshold and 
              prev_histogram >= -self.histogram_threshold and 
              histogram_momentum < 0):
            # Histogram turning negative with momentum - SELL signal
            signal = Signal(
                symbol=symbol,
                signal_type=SignalType.SELL,
                price=current_price,
                quantity=await self.calculate_position_size(symbol, current_price, 
                                                          self.config.max_position_size * self.config.risk_per_trade),
                order_type=OrderType.MARKET,
                stop_loss=await self.calculate_stop_loss(current_price, SignalType.SELL),
                target_price=await self.calculate_target_price(current_price, SignalType.SELL),
                confidence=min(1.0, abs(histogram_momentum) * 10),
                reason=f"MACD histogram bearish momentum: {current_histogram:.4f}, momentum: {histogram_momentum:.4f}"
            )
            signals.append(signal)
        
        return signals
    
    async def should_exit_position(self, position: Dict, current_data: pd.DataFrame) -> bool:
        """Check if position should be exited based on MACD histogram"""
        if len(current_data) < self.slow_period + self.signal_period:
            return False
        
        # Calculate MACD histogram
        macd_indicator = ta.trend.MACD(
            current_data['close'], 
            window_fast=self.fast_period, 
            window_slow=self.slow_period, 
            window_sign=self.signal_period
        )
        
        current_data['macd_histogram'] = macd_indicator.macd_diff()
        current_histogram = current_data['macd_histogram'].iloc[-1]
        
        # Exit conditions based on histogram
        if position['side'] == 'LONG' and current_histogram < -self.histogram_threshold:
            return True
        elif position['side'] == 'SHORT' and current_histogram > self.histogram_threshold:
            return True
        
        return False

class MACDZeroLineStrategy(BaseStrategy):
    """MACD zero line crossover strategy"""
    
    def __init__(self, config: StrategyConfig):
        super().__init__(config)
        self.fast_period = getattr(config, 'fast_period', 12)
        self.slow_period = getattr(config, 'slow_period', 26)
        self.signal_period = getattr(config, 'signal_period', 9)
        
    async def generate_signals(self, data: pd.DataFrame, symbol: str) -> List[Signal]:
        """Generate MACD zero line crossover signals"""
        signals = []
        
        if len(data) < self.slow_period + self.signal_period:
            return signals
        
        # Calculate MACD
        macd_indicator = ta.trend.MACD(
            data['close'], 
            window_fast=self.fast_period, 
            window_slow=self.slow_period, 
            window_sign=self.signal_period
        )
        
        data['macd'] = macd_indicator.macd()
        
        # Get current and previous MACD values
        current_macd = data['macd'].iloc[-1]
        prev_macd = data['macd'].iloc[-2]
        current_price = data['close'].iloc[-1]
        
        # Check if we can trade this symbol
        if not await self.can_trade(symbol):
            return signals
        
        # Zero line crossover signals
        if prev_macd <= 0 and current_macd > 0:
            # MACD crosses above zero line - BUY signal
            signal = Signal(
                symbol=symbol,
                signal_type=SignalType.BUY,
                price=current_price,
                quantity=await self.calculate_position_size(symbol, current_price, 
                                                          self.config.max_position_size * self.config.risk_per_trade),
                order_type=OrderType.MARKET,
                stop_loss=await self.calculate_stop_loss(current_price, SignalType.BUY),
                target_price=await self.calculate_target_price(current_price, SignalType.BUY),
                confidence=min(1.0, abs(current_macd) * 100),
                reason=f"MACD zero line bullish crossover: {current_macd:.4f}"
            )
            signals.append(signal)
            
        elif prev_macd >= 0 and current_macd < 0:
            # MACD crosses below zero line - SELL signal
            signal = Signal(
                symbol=symbol,
                signal_type=SignalType.SELL,
                price=current_price,
                quantity=await self.calculate_position_size(symbol, current_price, 
                                                          self.config.max_position_size * self.config.risk_per_trade),
                order_type=OrderType.MARKET,
                stop_loss=await self.calculate_stop_loss(current_price, SignalType.SELL),
                target_price=await self.calculate_target_price(current_price, SignalType.SELL),
                confidence=min(1.0, abs(current_macd) * 100),
                reason=f"MACD zero line bearish crossover: {current_macd:.4f}"
            )
            signals.append(signal)
        
        return signals
    
    async def should_exit_position(self, position: Dict, current_data: pd.DataFrame) -> bool:
        """Check if position should be exited based on MACD zero line"""
        if len(current_data) < self.slow_period + self.signal_period:
            return False
        
        # Calculate MACD
        macd_indicator = ta.trend.MACD(
            current_data['close'], 
            window_fast=self.fast_period, 
            window_slow=self.slow_period, 
            window_sign=self.signal_period
        )
        
        current_data['macd'] = macd_indicator.macd()
        current_macd = current_data['macd'].iloc[-1]
        
        # Exit conditions
        if position['side'] == 'LONG' and current_macd < 0:
            return True
        elif position['side'] == 'SHORT' and current_macd > 0:
            return True
        
        return False
