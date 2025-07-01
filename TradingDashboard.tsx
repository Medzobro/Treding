
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface TradingDashboardProps {
  currentPrice: {
    BTCUSDT: number;
    XAUUSD: number;
  };
  botStatus: string;
}

const TradingDashboard: React.FC<TradingDashboardProps> = ({ currentPrice, botStatus }) => {
  const recentTrades = [
    { id: 1, symbol: 'BTCUSDT', type: 'BUY', price: 43180.50, profit: 156.78, status: 'closed', time: '10:30' },
    { id: 2, symbol: 'XAUUSD', type: 'SELL', price: 2047.25, profit: -43.21, status: 'closed', time: '09:15' },
    { id: 3, symbol: 'BTCUSDT', type: 'BUY', price: 43250.00, profit: 89.45, status: 'open', time: '11:45' },
    { id: 4, symbol: 'XAUUSD', type: 'BUY', price: 2048.75, profit: 123.67, status: 'open', time: '12:20' },
  ];

  const assets = [
    {
      symbol: 'BTCUSDT',
      name: 'Bitcoin',
      price: currentPrice.BTCUSDT,
      change: '+2.45%',
      volume: '1.2M',
      signal: 'BUY',
      strength: 75
    },
    {
      symbol: 'XAUUSD',
      name: 'Gold',
      price: currentPrice.XAUUSD,
      change: '-0.12%',
      volume: '850K',
      signal: 'HOLD',
      strength: 45
    }
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Assets Overview */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              الأصول المتداولة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.symbol} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{asset.name}</h3>
                    <p className="text-sm text-slate-400">{asset.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">${asset.price.toFixed(2)}</p>
                    <p className={`text-sm ${asset.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.change}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">قوة الإشارة</span>
                  <Badge 
                    variant={asset.signal === 'BUY' ? 'default' : asset.signal === 'SELL' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {asset.signal}
                  </Badge>
                </div>
                <Progress value={asset.strength} className="h-2" />
                <p className="text-xs text-slate-400 mt-1">الحجم: {asset.volume}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            الصفقات الأخيرة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTrades.map((trade) => (
            <div key={trade.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-white text-sm">{trade.symbol}</p>
                  <p className="text-xs text-slate-400">{trade.time}</p>
                </div>
                <Badge 
                  variant={trade.type === 'BUY' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {trade.type}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">${trade.price}</span>
                <div className="flex items-center gap-1">
                  {trade.profit > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${trade.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${Math.abs(trade.profit).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <Badge 
                variant={trade.status === 'open' ? 'default' : 'secondary'}
                className="text-xs mt-2"
              >
                {trade.status === 'open' ? 'مفتوحة' : 'مغلقة'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingDashboard;
