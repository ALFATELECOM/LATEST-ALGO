"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Shield, 
  Target, 
  AlertTriangle,
  Play,
  Pause,
  Settings,
  BarChart3,
  DollarSign,
  Clock,
  Zap
} from 'lucide-react';

interface OptionsStrategy {
  name: string;
  type: string;
  description: string;
  max_profit: string;
  max_loss: string;
  market_outlook: string;
  volatility: string;
  time_decay: string;
  breakeven_points: number;
  risk_reward_ratio: string;
  status: string;
  pnl: number;
}

interface OptionsStrategiesProps {
  strategies: OptionsStrategy[];
  onStrategyAction: (strategyType: string, action: string) => void;
}

const OptionsStrategies: React.FC<OptionsStrategiesProps> = ({ 
  strategies, 
  onStrategyAction 
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<OptionsStrategy | null>(null);
  const [setupParams, setSetupParams] = useState<any>({});
  const [showSetup, setShowSetup] = useState(false);

  const getOutlookIcon = (outlook: string) => {
    switch (outlook.toLowerCase()) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'volatile':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getVolatilityColor = (volatility: string) => {
    switch (volatility.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeDecayColor = (decay: string) => {
    switch (decay.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSetupStrategy = (strategy: OptionsStrategy) => {
    setSelectedStrategy(strategy);
    setSetupParams({
      symbol: 'NIFTY',
      quantity: 1,
      expiration_days: 30,
      strike_price: 0,
      call_strike: 0,
      put_strike: 0,
      center_strike: 0,
      wing_strikes: 0
    });
    setShowSetup(true);
  };

  const handleStartStrategy = (strategyType: string) => {
    onStrategyAction(strategyType, 'start');
  };

  const handleStopStrategy = (strategyType: string) => {
    onStrategyAction(strategyType, 'stop');
  };

  const renderSetupForm = () => {
    if (!selectedStrategy) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Setup {selectedStrategy.name}</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={setupParams.symbol}
                onChange={(e) => setSetupParams({...setupParams, symbol: e.target.value})}
                placeholder="e.g., NIFTY, BANKNIFTY"
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={setupParams.quantity}
                onChange={(e) => setSetupParams({...setupParams, quantity: parseInt(e.target.value)})}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="expiration">Expiration (Days)</Label>
              <Select
                value={setupParams.expiration_days.toString()}
                onValueChange={(value) => setSetupParams({...setupParams, expiration_days: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="15">15 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="45">45 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedStrategy.type === 'straddle' && (
              <div>
                <Label htmlFor="strike">Strike Price</Label>
                <Input
                  id="strike"
                  type="number"
                  value={setupParams.strike_price}
                  onChange={(e) => setSetupParams({...setupParams, strike_price: parseFloat(e.target.value)})}
                  placeholder="At-the-money strike"
                />
              </div>
            )}

            {selectedStrategy.type === 'strangle' && (
              <>
                <div>
                  <Label htmlFor="call_strike">Call Strike</Label>
                  <Input
                    id="call_strike"
                    type="number"
                    value={setupParams.call_strike}
                    onChange={(e) => setSetupParams({...setupParams, call_strike: parseFloat(e.target.value)})}
                    placeholder="Out-of-the-money call"
                  />
                </div>
                <div>
                  <Label htmlFor="put_strike">Put Strike</Label>
                  <Input
                    id="put_strike"
                    type="number"
                    value={setupParams.put_strike}
                    onChange={(e) => setSetupParams({...setupParams, put_strike: parseFloat(e.target.value)})}
                    placeholder="Out-of-the-money put"
                  />
                </div>
              </>
            )}

            {selectedStrategy.type === 'butterfly' && (
              <>
                <div>
                  <Label htmlFor="center_strike">Center Strike</Label>
                  <Input
                    id="center_strike"
                    type="number"
                    value={setupParams.center_strike}
                    onChange={(e) => setSetupParams({...setupParams, center_strike: parseFloat(e.target.value)})}
                    placeholder="Center strike price"
                  />
                </div>
                <div>
                  <Label htmlFor="wing_strikes">Wing Spread</Label>
                  <Input
                    id="wing_strikes"
                    type="number"
                    value={setupParams.wing_strikes}
                    onChange={(e) => setSetupParams({...setupParams, wing_strikes: parseFloat(e.target.value)})}
                    placeholder="Wing spread amount"
                  />
                </div>
              </>
            )}

            {selectedStrategy.type === 'iron_condor' && (
              <>
                <div>
                  <Label htmlFor="short_call">Short Call Strike</Label>
                  <Input
                    id="short_call"
                    type="number"
                    value={setupParams.short_call_strike}
                    onChange={(e) => setSetupParams({...setupParams, short_call_strike: parseFloat(e.target.value)})}
                    placeholder="Short call strike"
                  />
                </div>
                <div>
                  <Label htmlFor="long_call">Long Call Strike</Label>
                  <Input
                    id="long_call"
                    type="number"
                    value={setupParams.long_call_strike}
                    onChange={(e) => setSetupParams({...setupParams, long_call_strike: parseFloat(e.target.value)})}
                    placeholder="Long call strike"
                  />
                </div>
                <div>
                  <Label htmlFor="short_put">Short Put Strike</Label>
                  <Input
                    id="short_put"
                    type="number"
                    value={setupParams.short_put_strike}
                    onChange={(e) => setSetupParams({...setupParams, short_put_strike: parseFloat(e.target.value)})}
                    placeholder="Short put strike"
                  />
                </div>
                <div>
                  <Label htmlFor="long_put">Long Put Strike</Label>
                  <Input
                    id="long_put"
                    type="number"
                    value={setupParams.long_put_strike}
                    onChange={(e) => setSetupParams({...setupParams, long_put_strike: parseFloat(e.target.value)})}
                    placeholder="Long put strike"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <Button 
              onClick={() => setShowSetup(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                onStrategyAction(selectedStrategy.type, 'setup');
                setShowSetup(false);
              }}
              className="flex-1"
            >
              Setup Strategy
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Options Strategies</h2>
          <p className="text-gray-600">Advanced options trading strategies for different market conditions</p>
        </div>
        <Button onClick={() => setShowSetup(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Setup Strategy
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Strategies</TabsTrigger>
          <TabsTrigger value="neutral">Neutral</TabsTrigger>
          <TabsTrigger value="volatile">Volatile</TabsTrigger>
          <TabsTrigger value="bullish">Bullish</TabsTrigger>
          <TabsTrigger value="bearish">Bearish</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((strategy) => (
              <Card key={strategy.type} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getOutlookIcon(strategy.market_outlook)}
                      <Badge variant={strategy.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {strategy.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-green-600">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium">Max Profit</span>
                      </div>
                      <p className="text-gray-600">{strategy.max_profit}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="font-medium">Max Loss</span>
                      </div>
                      <p className="text-gray-600">{strategy.max_loss}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Volatility</span>
                      <Badge className={getVolatilityColor(strategy.volatility)}>
                        {strategy.volatility}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time Decay</span>
                      <Badge className={getTimeDecayColor(strategy.time_decay)}>
                        {strategy.time_decay}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Risk/Reward</span>
                      <span className="text-sm font-medium">{strategy.risk_reward_ratio}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetupStrategy(strategy)}
                      className="flex-1"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Setup
                    </Button>
                    {strategy.status === 'ACTIVE' ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStopStrategy(strategy.type)}
                        className="flex-1"
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleStartStrategy(strategy.type)}
                        className="flex-1"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="neutral" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.filter(s => s.market_outlook.toLowerCase() === 'neutral').map((strategy) => (
              <Card key={strategy.type} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getOutlookIcon(strategy.market_outlook)}
                      <Badge variant={strategy.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {strategy.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-green-600">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium">Max Profit</span>
                      </div>
                      <p className="text-gray-600">{strategy.max_profit}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="font-medium">Max Loss</span>
                      </div>
                      <p className="text-gray-600">{strategy.max_loss}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Volatility</span>
                      <Badge className={getVolatilityColor(strategy.volatility)}>
                        {strategy.volatility}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time Decay</span>
                      <Badge className={getTimeDecayColor(strategy.time_decay)}>
                        {strategy.time_decay}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Risk/Reward</span>
                      <span className="text-sm font-medium">{strategy.risk_reward_ratio}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetupStrategy(strategy)}
                      className="flex-1"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Setup
                    </Button>
                    {strategy.status === 'ACTIVE' ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStopStrategy(strategy.type)}
                        className="flex-1"
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleStartStrategy(strategy.type)}
                        className="flex-1"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="volatile" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.filter(s => s.market_outlook.toLowerCase() === 'volatile').map((strategy) => (
              <Card key={strategy.type} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getOutlookIcon(strategy.market_outlook)}
                      <Badge variant={strategy.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {strategy.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-green-600">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium">Max Profit</span>
                      </div>
                      <p className="text-gray-600">{strategy.max_profit}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="font-medium">Max Loss</span>
                      </div>
                      <p className="text-gray-600">{strategy.max_loss}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Volatility</span>
                      <Badge className={getVolatilityColor(strategy.volatility)}>
                        {strategy.volatility}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time Decay</span>
                      <Badge className={getTimeDecayColor(strategy.time_decay)}>
                        {strategy.time_decay}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Risk/Reward</span>
                      <span className="text-sm font-medium">{strategy.risk_reward_ratio}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetupStrategy(strategy)}
                      className="flex-1"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Setup
                    </Button>
                    {strategy.status === 'ACTIVE' ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStopStrategy(strategy.type)}
                        className="flex-1"
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleStartStrategy(strategy.type)}
                        className="flex-1"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bullish" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.filter(s => s.market_outlook.toLowerCase().includes('bullish')).map((strategy) => (
              <Card key={strategy.type} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getOutlookIcon(strategy.market_outlook)}
                      <Badge variant={strategy.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {strategy.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-green-600">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium">Max Profit</span>
                      </div>
                      <p className="text-gray-600">{strategy.max_profit}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="font-medium">Max Loss</span>
                      </div>
                      <p className="text-gray-600">{strategy.max_loss}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Volatility</span>
                      <Badge className={getVolatilityColor(strategy.volatility)}>
                        {strategy.volatility}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time Decay</span>
                      <Badge className={getTimeDecayColor(strategy.time_decay)}>
                        {strategy.time_decay}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Risk/Reward</span>
                      <span className="text-sm font-medium">{strategy.risk_reward_ratio}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetupStrategy(strategy)}
                      className="flex-1"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Setup
                    </Button>
                    {strategy.status === 'ACTIVE' ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStopStrategy(strategy.type)}
                        className="flex-1"
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleStartStrategy(strategy.type)}
                        className="flex-1"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bearish" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.filter(s => s.market_outlook.toLowerCase().includes('bearish')).map((strategy) => (
              <Card key={strategy.type} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getOutlookIcon(strategy.market_outlook)}
                      <Badge variant={strategy.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {strategy.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-green-600">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium">Max Profit</span>
                      </div>
                      <p className="text-gray-600">{strategy.max_profit}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="font-medium">Max Loss</span>
                      </div>
                      <p className="text-gray-600">{strategy.max_loss}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Volatility</span>
                      <Badge className={getVolatilityColor(strategy.volatility)}>
                        {strategy.volatility}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time Decay</span>
                      <Badge className={getTimeDecayColor(strategy.time_decay)}>
                        {strategy.time_decay}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Risk/Reward</span>
                      <span className="text-sm font-medium">{strategy.risk_reward_ratio}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetupStrategy(strategy)}
                      className="flex-1"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Setup
                    </Button>
                    {strategy.status === 'ACTIVE' ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStopStrategy(strategy.type)}
                        className="flex-1"
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleStartStrategy(strategy.type)}
                        className="flex-1"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {showSetup && renderSetupForm()}
    </div>
  );
};

export default OptionsStrategies;


