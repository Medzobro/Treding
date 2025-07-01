
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

interface Signal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  target1: number;
  target2: number;
  stopLoss: number;
  time: string;
  status: 'active' | 'completed' | 'stopped';
}

const SignalsList = () => {
  const signals: Signal[] = [
    {
      id: '1',
      symbol: 'BTCUSDT',
      type: 'BUY',
      price: 45250.00,
      target1: 46000.00,
      target2: 47000.00,
      stopLoss: 44500.00,
      time: '14:30',
      status: 'active'
    },
    {
      id: '2',
      symbol: 'XAUUSD',
      type: 'SELL',
      price: 2055.50,
      target1: 2045.00,
      target2: 2035.00,
      stopLoss: 2065.00,
      time: '13:45',
      status: 'active'
    },
    {
      id: '3',
      symbol: 'BTCUSDT',
      type: 'BUY',
      price: 44800.00,
      target1: 45500.00,
      target2: 46200.00,
      stopLoss: 44200.00,
      time: '12:15',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'stopped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'completed': return 'مكتمل';
      case 'stopped': return 'متوقف';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="space-y-4">
      {signals.map((signal) => (
        <Card key={signal.id} className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  signal.type === 'BUY' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {signal.type === 'BUY' ? 
                    <TrendingUp className="h-4 w-4 text-green-600" /> : 
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div>
                  <h3 className="font-semibold">{signal.symbol}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {signal.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={signal.type === 'BUY' ? 'default' : 'destructive'}>
                  {signal.type === 'BUY' ? 'شراء' : 'بيع'}
                </Badge>
                <Badge className={getStatusColor(signal.status)}>
                  {getStatusText(signal.status)}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">سعر الدخول</p>
                <p className="font-semibold">${signal.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">الهدف الأول</p>
                <p className="font-semibold text-green-600">${signal.target1.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">الهدف الثاني</p>
                <p className="font-semibold text-green-600">${signal.target2.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">وقف الخسارة</p>
                <p className="font-semibold text-red-600">${signal.stopLoss.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SignalsList;
