"""
RSI-based trading strategy
Implements RSI divergence and overbought/oversold signals
"""

import pandas as pd
import numpy as np
from datetime import datetime
from typing import List, Dict, Any
import ta

from app.strategies.base_strategy import BaseStrategy, StrategyConfig, Signal, SignalType, OrderType

class RSIStrategy(BaseStrategy):
    """RSI-based trading strategy"""
    
    def __init__(self, config: StrategyConfig):
        super().__init__(config)
        self.rsi_period = getattr(config, 'rsi_period', 14)
        self.oversold_threshold = getattr(config, 'oversold_threshold', 30)
        self.overbought_threshold = getattr(config, 'overbought_threshold', 70)
        self.rsi_exit_threshold = getattr(config, 'rsi_exit_threshold', 50)
        
    async def generate_signals(self, data: pd.DataFrame, symbol: str) -> List[Signal]:
        """Generate RSI-based trading signals"""
        signals = []
        
        if len(data) < self.rsi_period + 1:
            return signals
        
        # Calculate RSI
        data['rsi'] = ta.momentum.RSIIndicator(data['close'], window=self.rsi_period).rsi()
        
        # Get current and previous RSI values
        current_rsi = data['rsi'].iloc[-1]
        prev_rsi = data['rsi'].iloc[-2]
        current_price = data['close'].iloc[-1]
        
        # Check if we can trade this symbol
        if not await self.can_trade(symbol):
            return signals
        
        # Generate signals based on RSI conditions
        if current_rsi < self.oversold_threshold and prev_rsi >= self.oversold_threshold:
            # RSI crossed above oversold threshold - BUY signal
            signal = Signal(
                symbol=symbol,
                signal_type=SignalType.BUY,
                price=current_price,
                quantity=await self.calculate_position_size(symbol, current_price, 
                                                          self.config.max_position_size * self.config.risk_per_trade),
                order_type=OrderType.MARKET,
                stop_loss=await self.calculate_stop_loss(current_price, SignalType.BUY),
                target_price=await self.calculate_target_price(current_price, SignalType.BUY),
                confidence=min(1.0, (self.oversold_threshold - current_rsi) / self.oversold_threshold),
                reason=f"RSI oversold: {current_rsi:.2f}"
            )
            signals.append(signal)
            
        elif current_rsi > self.overbought_threshold and prev_rsi <= self.overbought_threshold:
            # RSI crossed below overbought threshold - SELL signal
            signal = Signal(
                symbol=symbol,
                signal_type=SignalType.SELL,
                price=current_price,
                quantity=await self.calculate_position_size(symbol, current_price, 
                                                          self.config.max_position_size * self.config.risk_per_trade),
                order_type=OrderType.MARKET,
                stop_loss=await self.calculate_stop_loss(current_price, SignalType.SELL),
                target_price=await self.calculate_target_price(current_price, SignalType.SELL),
                confidence=min(1.0, (current_rsi - self.overbought_threshold) / (100 - self.overbought_threshold)),
                reason=f"RSI overbought: {current_rsi:.2f}"
            )
            signals.append(signal)
        
        return signals
    
    async def should_exit_position(self, position: Dict, current_data: pd.DataFrame) -> bool:
        """Check if position should be exited based on RSI"""
        if len(current_data) < self.rsi_period + 1:
            return False
        
        # Calculate RSI
        current_data['rsi'] = ta.momentum.RSIIndicator(current_data['close'], window=self.rsi_period).rsi()
        current_rsi = current_data['rsi'].iloc[-1]
        
        # Exit conditions
        if position['side'] == 'LONG' and current_rsi > self.rsi_exit_threshold:
            return True
        elif position['side'] == 'SHORT' and current_rsi < self.rsi_exit_threshold:
            return True
        
        return False

class RSIDivergenceStrategy(BaseStrategy):
    """RSI Divergence strategy"""
    
    def __init__(self, config: StrategyConfig):
        super().__init__(config)
        self.rsi_period = getattr(config, 'rsi_period', 14)
        self.lookback_period = getattr(config, 'lookback_period', 20)
        self.min_divergence_strength = getattr(config, 'min_divergence_strength', 0.1)
        
    async def generate_signals(self, data: pd.DataFrame, symbol: str) -> List[Signal]:
        """Generate RSI divergence signals"""
        signals = []
        
        if len(data) < self.rsi_period + self.lookback_period:
            return signals
        
        # Calculate RSI
        data['rsi'] = ta.momentum.RSIIndicator(data['close'], window=self.rsi_period).rsi()
        
        # Look for divergences in the last lookback_period
        recent_data = data.tail(self.lookback_period)
        
        # Find price and RSI peaks and troughs
        price_peaks = self._find_peaks(recent_data['close'])
        price_troughs = self._find_troughs(recent_data['close'])
        rsi_peaks = self._find_peaks(recent_data['rsi'])
        rsi_troughs = self._find_troughs(recent_data['rsi'])
        
        current_price = data['close'].iloc[-1]
        current_rsi = data['rsi'].iloc[-1]
        
        # Check for bullish divergence (price makes lower low, RSI makes higher low)
        if len(price_troughs) >= 2 and len(rsi_troughs) >= 2:
            latest_price_trough = price_troughs[-1]
            prev_price_trough = price_troughs[-2]
            latest_rsi_trough = rsi_troughs[-1]
            prev_rsi_trough = rsi_troughs[-2]
            
            if (latest_price_trough['value'] < prev_price_trough['value'] and 
                latest_rsi_trough['value'] > prev_rsi_trough['value']):
                
                divergence_strength = abs(latest_rsi_trough['value'] - prev_rsi_trough['value']) / 100
                
                if divergence_strength >= self.min_divergence_strength:
                    signal = Signal(
                        symbol=symbol,
                        signal_type=SignalType.BUY,
                        price=current_price,
                        quantity=await self.calculate_position_size(symbol, current_price, 
                                                                  self.config.max_position_size * self.config.risk_per_trade),
                        order_type=OrderType.MARKET,
                        stop_loss=await self.calculate_stop_loss(current_price, SignalType.BUY),
                        target_price=await self.calculate_target_price(current_price, SignalType.BUY),
                        confidence=min(1.0, divergence_strength * 2),
                        reason=f"Bullish RSI divergence: {divergence_strength:.2f}"
                    )
                    signals.append(signal)
        
        # Check for bearish divergence (price makes higher high, RSI makes lower high)
        if len(price_peaks) >= 2 and len(rsi_peaks) >= 2:
            latest_price_peak = price_peaks[-1]
            prev_price_peak = price_peaks[-2]
            latest_rsi_peak = rsi_peaks[-1]
            prev_rsi_peak = rsi_peaks[-2]
            
            if (latest_price_peak['value'] > prev_price_peak['value'] and 
                latest_rsi_peak['value'] < prev_rsi_peak['value']):
                
                divergence_strength = abs(prev_rsi_peak['value'] - latest_rsi_peak['value']) / 100
                
                if divergence_strength >= self.min_divergence_strength:
                    signal = Signal(
                        symbol=symbol,
                        signal_type=SignalType.SELL,
                        price=current_price,
                        quantity=await self.calculate_position_size(symbol, current_price, 
                                                                  self.config.max_position_size * self.config.risk_per_trade),
                        order_type=OrderType.MARKET,
                        stop_loss=await self.calculate_stop_loss(current_price, SignalType.SELL),
                        target_price=await self.calculate_target_price(current_price, SignalType.SELL),
                        confidence=min(1.0, divergence_strength * 2),
                        reason=f"Bearish RSI divergence: {divergence_strength:.2f}"
                    )
                    signals.append(signal)
        
        return signals
    
    def _find_peaks(self, series: pd.Series, order: int = 3) -> List[Dict]:
        """Find peaks in a series"""
        from scipy.signal import find_peaks
        
        peaks, _ = find_peaks(series.values, order=order)
        return [{'index': peak, 'value': series.iloc[peak]} for peak in peaks]
    
    def _find_troughs(self, series: pd.Series, order: int = 3) -> List[Dict]:
        """Find troughs in a series"""
        from scipy.signal import find_peaks
        
        troughs, _ = find_peaks(-series.values, order=order)
        return [{'index': trough, 'value': series.iloc[trough]} for trough in troughs]
    
    async def should_exit_position(self, position: Dict, current_data: pd.DataFrame) -> bool:
        """Check if position should be exited based on RSI divergence"""
        # For divergence strategy, we typically hold positions longer
        # Exit based on opposite divergence or stop loss/target
        return False
