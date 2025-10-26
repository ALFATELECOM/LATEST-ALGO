"""
Zerodha API integration service
Handles authentication, data fetching, and order placement
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
import httpx
from kiteconnect import KiteConnect
from kiteconnect.exceptions import KiteException

from app.core.config import settings
from app.models.portfolio import Position, Order
from app.core.exceptions import TradingException

logger = logging.getLogger(__name__)

class ZerodhaService:
    """Zerodha API service for trading operations"""
    
    def __init__(self):
        self.kite = None
        self.access_token = None
        self.user_id = None
        self.is_authenticated = False
        self.last_token_refresh = None
        self.token_expiry = None
        
    async def initialize(self):
        """Initialize Zerodha service"""
        try:
            self.kite = KiteConnect(api_key=settings.ZERODHA_API_KEY)
            logger.info("✅ Zerodha service initialized")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Zerodha service: {e}")
            raise TradingException(f"Zerodha initialization failed: {e}")
    
    async def authenticate(self, request_token: str) -> Dict[str, Any]:
        """Authenticate with Zerodha using request token"""
        try:
            # Generate access token
            data = self.kite.generate_session(request_token, api_secret=settings.ZERODHA_API_SECRET)
            
            self.access_token = data["access_token"]
            self.user_id = data["user_id"]
            self.is_authenticated = True
            self.last_token_refresh = datetime.now()
            
            # Set access token for future requests
            self.kite.set_access_token(self.access_token)
            
            # Get user profile
            profile = self.kite.profile()
            
            logger.info(f"✅ Authenticated user: {profile['user_name']}")
            
            return {
                "access_token": self.access_token,
                "user_id": self.user_id,
                "profile": profile,
                "expires_at": self.last_token_refresh + timedelta(hours=8)
            }
            
        except KiteException as e:
            logger.error(f"❌ Zerodha authentication failed: {e}")
            raise TradingException(f"Authentication failed: {e}")
        except Exception as e:
            logger.error(f"❌ Unexpected error during authentication: {e}")
            raise TradingException(f"Authentication error: {e}")
    
    async def set_access_token(self, access_token: str):
        """Set access token for authenticated session"""
        try:
            self.access_token = access_token
            self.kite.set_access_token(access_token)
            self.is_authenticated = True
            self.last_token_refresh = datetime.now()
            
            # Verify token by getting profile
            profile = self.kite.profile()
            self.user_id = profile["user_id"]
            
            logger.info(f"✅ Access token set for user: {profile['user_name']}")
            
        except Exception as e:
            logger.error(f"❌ Failed to set access token: {e}")
            raise TradingException(f"Invalid access token: {e}")
    
    async def get_instruments(self, exchange: str = "NSE") -> List[Dict[str, Any]]:
        """Get list of instruments"""
        try:
            if not self.is_authenticated:
                raise TradingException("Not authenticated with Zerodha")
            
            instruments = self.kite.instruments(exchange)
            logger.info(f"✅ Fetched {len(instruments)} instruments from {exchange}")
            return instruments
            
        except KiteException as e:
            logger.error(f"❌ Failed to fetch instruments: {e}")
            raise TradingException(f"Failed to fetch instruments: {e}")
    
    async def get_quote(self, instruments: List[str]) -> Dict[str, Any]:
        """Get real-time quotes for instruments"""
        try:
            if not self.is_authenticated:
                raise TradingException("Not authenticated with Zerodha")
            
            quotes = self.kite.quote(instruments)
            return quotes
            
        except KiteException as e:
            logger.error(f"❌ Failed to fetch quotes: {e}")
            raise TradingException(f"Failed to fetch quotes: {e}")
    
    async def get_historical_data(
        self, 
        instrument_token: int, 
        from_date: datetime, 
        to_date: datetime, 
        interval: str = "minute"
    ) -> List[Dict[str, Any]]:
        """Get historical data for instrument"""
        try:
            if not self.is_authenticated:
                raise TradingException("Not authenticated with Zerodha")
            
            data = self.kite.historical_data(
                instrument_token=instrument_token,
                from_date=from_date,
                to_date=to_date,
                interval=interval
            )
            
            logger.info(f"✅ Fetched {len(data)} historical records")
            return data
            
        except KiteException as e:
            logger.error(f"❌ Failed to fetch historical data: {e}")
            raise TradingException(f"Failed to fetch historical data: {e}")
    
    async def place_order(
        self,
        variety: str,
        exchange: str,
        tradingsymbol: str,
        transaction_type: str,
        quantity: int,
        product: str = "MIS",
        order_type: str = "MARKET",
        price: Optional[float] = None,
        trigger_price: Optional[float] = None,
        tag: Optional[str] = None
    ) -> str:
        """Place order on Zerodha"""
        try:
            if not self.is_authenticated:
                raise TradingException("Not authenticated with Zerodha")
            
            order_params = {
                "variety": variety,
                "exchange": exchange,
                "tradingsymbol": tradingsymbol,
                "transaction_type": transaction_type,
                "quantity": quantity,
                "product": product,
                "order_type": order_type,
                "tag": tag or "ALFA_ALGO"
            }
            
            if price is not None:
                order_params["price"] = price
            if trigger_price is not None:
                order_params["trigger_price"] = trigger_price
            
            order_id = self.kite.place_order(**order_params)
            
            logger.info(f"✅ Order placed: {order_id} for {tradingsymbol}")
            return order_id
            
        except KiteException as e:
            logger.error(f"❌ Failed to place order: {e}")
            raise TradingException(f"Failed to place order: {e}")
    
    async def modify_order(
        self,
        order_id: str,
        variety: str,
        quantity: Optional[int] = None,
        price: Optional[float] = None,
        order_type: Optional[str] = None,
        trigger_price: Optional[float] = None
    ) -> str:
        """Modify existing order"""
        try:
            if not self.is_authenticated:
                raise TradingException("Not authenticated with Zerodha")
            
            modify_params = {
                "order_id": order_id,
                "variety": variety
            }
            
            if quantity is not None:
                modify_params["quantity"] = quantity
            if price is not None:
                modify_params["price"] = price
            if order_type is not None:
                modify_params["order_type"] = order_type
            if trigger_price is not None:
                modify_params["trigger_price"] = trigger_price
            
            order_id = self.kite.modify_order(**modify_params)
            
            logger.info(f"✅ Order modified: {order_id}")
            return order_id
            
        except KiteException as e:
            logger.error(f"❌ Failed to modify order: {e}")
            raise TradingException(f"Failed to modify order: {e}")
    
    async def cancel_order(self, order_id: str, variety: str = "regular") -> str:
        """Cancel order"""
        try:
            if not self.is_authenticated:
                raise TradingException("Not authenticated with Zerodha")
            
            order_id = self.kite.cancel_order(order_id=order_id, variety=variety)
            
            logger.info(f"✅ Order cancelled: {order_id}")
            return order_id
            
        except KiteException as e:
            logger.error(f"❌ Failed to cancel order: {e}")
            raise TradingException(f"Failed to cancel order: {e}")
    
    async def get_orders(self) -> List[Dict[str, Any]]:
        """Get all orders"""
        try:
            if not self.is_authenticated:
                raise TradingException("Not authenticated with Zerodha")
            
            orders = self.kite.orders()
            return orders
            
        except KiteException as e:
            logger.error(f"❌ Failed to fetch orders: {e}")
            raise TradingException(f"Failed to fetch orders: {e}")
    
    async def get_positions(self) -> Dict[str, List[Dict[str, Any]]]:
        """Get current positions"""
        try:
            if not self.is_authenticated:
                raise TradingException("Not authenticated with Zerodha")
            
            positions = self.kite.positions()
            return positions
            
        except KiteException as e:
            logger.error(f"❌ Failed to fetch positions: {e}")
            raise TradingException(f"Failed to fetch positions: {e}")
    
    async def get_holdings(self) -> List[Dict[str, Any]]:
        """Get current holdings"""
        try:
            if not self.is_authenticated:
                raise TradingException("Not authenticated with Zerodha")
            
            holdings = self.kite.holdings()
            return holdings
            
        except KiteException as e:
            logger.error(f"❌ Failed to fetch holdings: {e}")
            raise TradingException(f"Failed to fetch holdings: {e}")
    
    async def get_margins(self) -> Dict[str, Any]:
        """Get account margins"""
        try:
            if not self.is_authenticated:
                raise TradingException("Not authenticated with Zerodha")
            
            margins = self.kite.margins()
            return margins
            
        except KiteException as e:
            logger.error(f"❌ Failed to fetch margins: {e}")
            raise TradingException(f"Failed to fetch margins: {e}")
    
    async def get_profile(self) -> Dict[str, Any]:
        """Get user profile"""
        try:
            if not self.is_authenticated:
                raise TradingException("Not authenticated with Zerodha")
            
            profile = self.kite.profile()
            return profile
            
        except KiteException as e:
            logger.error(f"❌ Failed to fetch profile: {e}")
            raise TradingException(f"Failed to fetch profile: {e}")
    
    async def is_token_valid(self) -> bool:
        """Check if access token is still valid"""
        try:
            if not self.is_authenticated or not self.access_token:
                return False
            
            # Try to get profile to validate token
            self.kite.profile()
            return True
            
        except Exception:
            return False
    
    async def refresh_token_if_needed(self):
        """Refresh token if it's about to expire"""
        if not self.last_token_refresh:
            return
        
        # Check if token is close to expiry (refresh 1 hour before)
        if datetime.now() > self.last_token_refresh + timedelta(hours=7):
            logger.warning("⚠️ Access token is close to expiry, please re-authenticate")
            self.is_authenticated = False

# Global Zerodha service instance
zerodha_service = ZerodhaService()
