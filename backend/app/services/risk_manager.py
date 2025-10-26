"""
Risk Management System
Handles position sizing, stop losses, and portfolio risk management
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
import pandas as pd
import numpy as np
from dataclasses import dataclass
from enum import Enum

from app.core.config import settings
from app.core.exceptions import RiskManagementException

logger = logging.getLogger(__name__)

class RiskLevel(Enum):
    """Risk levels"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

@dataclass
class RiskMetrics:
    """Risk metrics for a position or portfolio"""
    current_value: float
    max_risk: float
    current_risk: float
    risk_percentage: float
    stop_loss_price: float
    max_loss: float
    risk_level: RiskLevel
    recommendations: List[str]

@dataclass
class PositionRisk:
    """Position risk assessment"""
    symbol: str
    quantity: int
    entry_price: float
    current_price: float
    stop_loss: float
    target_price: float
    max_loss: float
    risk_percentage: float
    risk_level: RiskLevel
    is_valid: bool
    warnings: List[str]

class RiskManager:
    """Risk management system"""
    
    def __init__(self):
        self.max_portfolio_risk = settings.MAX_PORTFOLIO_RISK
        self.max_position_size = settings.MAX_POSITION_SIZE
        self.max_daily_loss = settings.MAX_DAILY_LOSS
        self.max_daily_trades = settings.MAX_DAILY_TRADES
        self.max_correlation_risk = settings.MAX_CORRELATION_RISK
        self.default_stop_loss_percent = settings.DEFAULT_STOP_LOSS_PERCENT
        self.default_trailing_stop_percent = settings.DEFAULT_TRAILING_STOP_PERCENT
        
        # Track daily metrics
        self.daily_trades = 0
        self.daily_pnl = 0.0
        self.daily_reset_date = datetime.now().date()
        
        # Portfolio tracking
        self.portfolio_value = 0.0
        self.positions = {}
        self.correlation_matrix = {}
        
    async def initialize(self):
        """Initialize risk manager"""
        logger.info("✅ Risk Manager initialized")
        
    async def reset_daily_metrics(self):
        """Reset daily metrics if new day"""
        today = datetime.now().date()
        if today != self.daily_reset_date:
            self.daily_trades = 0
            self.daily_pnl = 0.0
            self.daily_reset_date = today
            logger.info("📅 Daily risk metrics reset")
    
    async def validate_trade(self, symbol: str, quantity: int, price: float, 
                           side: str, stop_loss: Optional[float] = None) -> PositionRisk:
        """Validate a trade before execution"""
        await self.reset_daily_metrics()
        
        # Check daily trade limit
        if self.daily_trades >= self.max_daily_trades:
            return PositionRisk(
                symbol=symbol,
                quantity=0,
                entry_price=price,
                current_price=price,
                stop_loss=0,
                target_price=0,
                max_loss=0,
                risk_percentage=0,
                risk_level=RiskLevel.CRITICAL,
                is_valid=False,
                warnings=["Daily trade limit exceeded"]
            )
        
        # Check daily loss limit
        if self.daily_pnl <= -self.max_daily_loss:
            return PositionRisk(
                symbol=symbol,
                quantity=0,
                entry_price=price,
                current_price=price,
                stop_loss=0,
                target_price=0,
                max_loss=0,
                risk_percentage=0,
                risk_level=RiskLevel.CRITICAL,
                is_valid=False,
                warnings=["Daily loss limit exceeded"]
            )
        
        # Calculate position value
        position_value = quantity * price
        
        # Check maximum position size
        if position_value > self.max_position_size:
            quantity = int(self.max_position_size / price)
            position_value = quantity * price
        
        # Calculate stop loss if not provided
        if stop_loss is None:
            if side.upper() == 'BUY':
                stop_loss = price * (1 - self.default_stop_loss_percent / 100)
            else:
                stop_loss = price * (1 + self.default_stop_loss_percent / 100)
        
        # Calculate maximum loss
        if side.upper() == 'BUY':
            max_loss = (price - stop_loss) * quantity
        else:
            max_loss = (stop_loss - price) * quantity
        
        # Calculate risk percentage
        risk_percentage = (max_loss / self.portfolio_value) * 100 if self.portfolio_value > 0 else 0
        
        # Determine risk level
        risk_level = self._determine_risk_level(risk_percentage)
        
        # Generate warnings
        warnings = []
        if risk_percentage > self.max_portfolio_risk * 100:
            warnings.append(f"Position risk ({risk_percentage:.2f}%) exceeds portfolio limit ({self.max_portfolio_risk * 100:.2f}%)")
        
        if position_value > self.max_position_size * 0.8:
            warnings.append(f"Position size ({position_value:.2f}) is close to maximum limit ({self.max_position_size:.2f})")
        
        if max_loss > self.max_daily_loss * 0.5:
            warnings.append(f"Potential loss ({max_loss:.2f}) is significant relative to daily limit ({self.max_daily_loss:.2f})")
        
        # Check correlation risk
        correlation_warnings = await self._check_correlation_risk(symbol, position_value)
        warnings.extend(correlation_warnings)
        
        is_valid = len(warnings) == 0 and risk_level != RiskLevel.CRITICAL
        
        return PositionRisk(
            symbol=symbol,
            quantity=quantity,
            entry_price=price,
            current_price=price,
            stop_loss=stop_loss,
            target_price=price * (1.02 if side.upper() == 'BUY' else 0.98),  # 2% target
            max_loss=max_loss,
            risk_percentage=risk_percentage,
            risk_level=risk_level,
            is_valid=is_valid,
            warnings=warnings
        )
    
    async def calculate_position_size(self, symbol: str, price: float, risk_amount: float, 
                                    stop_loss_percent: float = None) -> int:
        """Calculate optimal position size based on risk management"""
        if stop_loss_percent is None:
            stop_loss_percent = self.default_stop_loss_percent
        
        stop_loss_price = price * (1 - stop_loss_percent / 100)
        risk_per_share = price - stop_loss_price
        
        if risk_per_share <= 0:
            return 0
        
        # Calculate position size based on risk amount
        position_size = int(risk_amount / risk_per_share)
        
        # Limit by maximum position size
        max_position_value = self.max_position_size
        max_shares = int(max_position_value / price)
        position_size = min(position_size, max_shares)
        
        # Limit by portfolio risk
        max_risk_value = self.portfolio_value * self.max_portfolio_risk
        max_risk_shares = int(max_risk_value / risk_per_share)
        position_size = min(position_size, max_risk_shares)
        
        return max(0, position_size)
    
    async def calculate_stop_loss(self, entry_price: float, side: str, 
                                 stop_loss_percent: float = None) -> float:
        """Calculate stop loss price"""
        if stop_loss_percent is None:
            stop_loss_percent = self.default_stop_loss_percent
        
        if side.upper() == 'BUY':
            return entry_price * (1 - stop_loss_percent / 100)
        else:
            return entry_price * (1 + stop_loss_percent / 100)
    
    async def calculate_trailing_stop(self, entry_price: float, current_price: float, 
                                    side: str, trailing_percent: float = None) -> float:
        """Calculate trailing stop price"""
        if trailing_percent is None:
            trailing_percent = self.default_trailing_stop_percent
        
        if side.upper() == 'BUY':
            # For long positions, trail stop below current price
            trailing_stop = current_price * (1 - trailing_percent / 100)
            # Don't let trailing stop go below initial stop loss
            initial_stop = entry_price * (1 - self.default_stop_loss_percent / 100)
            return max(trailing_stop, initial_stop)
        else:
            # For short positions, trail stop above current price
            trailing_stop = current_price * (1 + trailing_percent / 100)
            # Don't let trailing stop go above initial stop loss
            initial_stop = entry_price * (1 + self.default_stop_loss_percent / 100)
            return min(trailing_stop, initial_stop)
    
    async def update_position(self, symbol: str, position: Dict[str, Any]):
        """Update position in risk manager"""
        self.positions[symbol] = position
        await self._update_portfolio_metrics()
    
    async def remove_position(self, symbol: str):
        """Remove position from risk manager"""
        if symbol in self.positions:
            del self.positions[symbol]
            await self._update_portfolio_metrics()
    
    async def update_daily_pnl(self, pnl: float):
        """Update daily P&L"""
        self.daily_pnl += pnl
        await self.reset_daily_metrics()
    
    async def increment_daily_trades(self):
        """Increment daily trade count"""
        self.daily_trades += 1
        await self.reset_daily_metrics()
    
    async def get_portfolio_risk_metrics(self) -> RiskMetrics:
        """Get portfolio risk metrics"""
        await self._update_portfolio_metrics()
        
        total_risk = sum(pos.get('max_loss', 0) for pos in self.positions.values())
        current_risk_percentage = (total_risk / self.portfolio_value) * 100 if self.portfolio_value > 0 else 0
        
        risk_level = self._determine_risk_level(current_risk_percentage)
        
        recommendations = []
        if current_risk_percentage > self.max_portfolio_risk * 100:
            recommendations.append("Reduce position sizes to lower portfolio risk")
        
        if self.daily_pnl < -self.max_daily_loss * 0.5:
            recommendations.append("Consider reducing trading activity due to daily losses")
        
        if self.daily_trades > self.max_daily_trades * 0.8:
            recommendations.append("Approaching daily trade limit")
        
        return RiskMetrics(
            current_value=self.portfolio_value,
            max_risk=self.max_portfolio_risk * self.portfolio_value,
            current_risk=total_risk,
            risk_percentage=current_risk_percentage,
            stop_loss_price=0,  # Not applicable for portfolio
            max_loss=total_risk,
            risk_level=risk_level,
            recommendations=recommendations
        )
    
    async def check_risk_limits(self) -> List[str]:
        """Check if any risk limits are breached"""
        violations = []
        
        # Check daily loss limit
        if self.daily_pnl <= -self.max_daily_loss:
            violations.append(f"Daily loss limit breached: {self.daily_pnl:.2f}")
        
        # Check daily trade limit
        if self.daily_trades >= self.max_daily_trades:
            violations.append(f"Daily trade limit breached: {self.daily_trades}")
        
        # Check portfolio risk
        portfolio_metrics = await self.get_portfolio_risk_metrics()
        if portfolio_metrics.risk_percentage > self.max_portfolio_risk * 100:
            violations.append(f"Portfolio risk limit breached: {portfolio_metrics.risk_percentage:.2f}%")
        
        return violations
    
    def _determine_risk_level(self, risk_percentage: float) -> RiskLevel:
        """Determine risk level based on percentage"""
        if risk_percentage >= self.max_portfolio_risk * 100:
            return RiskLevel.CRITICAL
        elif risk_percentage >= self.max_portfolio_risk * 75:
            return RiskLevel.HIGH
        elif risk_percentage >= self.max_portfolio_risk * 50:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.LOW
    
    async def _check_correlation_risk(self, symbol: str, position_value: float) -> List[str]:
        """Check correlation risk with existing positions"""
        warnings = []
        
        # This is a simplified correlation check
        # In a real implementation, you would calculate actual correlations
        # between instruments based on historical price data
        
        if len(self.positions) > 1:
            # Check if adding this position would increase correlation risk
            total_exposure = sum(pos.get('value', 0) for pos in self.positions.values())
            new_total = total_exposure + position_value
            
            if new_total > self.portfolio_value * self.max_correlation_risk:
                warnings.append("Adding this position may increase correlation risk")
        
        return warnings
    
    async def _update_portfolio_metrics(self):
        """Update portfolio-level metrics"""
        # Calculate total portfolio value
        self.portfolio_value = sum(pos.get('value', 0) for pos in self.positions.values())
        
        # Update correlation matrix (simplified)
        # In a real implementation, you would calculate actual correlations
        symbols = list(self.positions.keys())
        if len(symbols) > 1:
            # Placeholder for correlation calculation
            pass
    
    async def get_risk_report(self) -> Dict[str, Any]:
        """Generate comprehensive risk report"""
        portfolio_metrics = await self.get_portfolio_risk_metrics()
        risk_violations = await self.check_risk_limits()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "portfolio_metrics": portfolio_metrics,
            "daily_metrics": {
                "trades": self.daily_trades,
                "pnl": self.daily_pnl,
                "max_trades": self.max_daily_trades,
                "max_loss": self.max_daily_loss
            },
            "positions": len(self.positions),
            "risk_violations": risk_violations,
            "recommendations": portfolio_metrics.recommendations
        }

# Global risk manager instance
risk_manager = RiskManager()
