
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Target, StopCircle, Clock, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const SignalsList = () => {
  const { toast } = useToast();
  const [signals, setSignals] = useState([
    {
      id: 1,
      symbol: 'BTCUSDT',
      name: 'Bitcoin',
      type: 'BUY',
      entryPrice: 43250.00,
      currentPrice: 43380.50,
      tp1: 43500.00,
      tp2: 43750.00,
      stopLoss: 42850.00,
      positionSize: 0.025,
      profit: 130.50,
      status: 'active',
      time: '2024-01-15 12:30',
      confidence: 85
    },
    {
      id: 2,
      symbol: 'XAUUSD',
      name: 'Gold',
      type: 'SELL',
      entryPrice: 2048.75,
      currentPrice: 2045.20,
      tp1: 2035.00,
      tp2: 2025.00,
      stopLoss: 2055.50,
      positionSize: 0.1,
      profit: 35.50,
      status: 'active',
      time: '2024-01-15 11:15',
      confidence: 72
    },
    {
      id: 3,
      symbol: 'BTCUSDT',
      name: 'Bitcoin',
      type: 'BUY',
      entryPrice: 42980.00,
      currentPrice: 43250.00,
      tp1: 43200.00,
      tp2: 43500.00,
      stopLoss: 42650.00,
      positionSize: 0.03,
      profit: 270.00,
      status: 'tp1_hit',
      time: '2024-01-15 09:45',
      confidence: 90
    }
  ]);

  const handleCloseSignal = (signalId: number) => {
    setSignals(prev => prev.map(signal => 
      signal.id === signalId 
        ? { ...signal, status: 'closed' }
        : signal
    ));
    toast({
      title: "تم إغلاق الإشارة",
      description: "تم إغلاق الصفقة بنجاح",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'tp1_hit': return 'bg-green-500';
      case 'tp2_hit': return 'bg-green-600';
      case 'closed': return 'bg-gray-500';
      case 'stopped': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشطة';
      case 'tp1_hit': return 'هدف 1 محقق';
      case 'tp2_hit': return 'هدف 2 محقق';
      case 'closed': return 'مغلقة';
      case 'stopped': return 'وقف خسارة';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-200">إشارات التداول النشطة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {signals.map((signal) => (
            <div key={signal.id} className="p-6 bg-slate-700/30 rounded-lg border border-slate-600">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{signal.name}</h3>
                  <p className="text-sm text-slate-400">{signal.symbol}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={signal.type === 'BUY' ? 'default' : 'destructive'}
                    className="text-sm"
                  >
                    {signal.type === 'BUY' ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {signal.type}
                  </Badge>
                  <Badge 
                    className={`text-xs ${getStatusColor(signal.status)} text-white`}
                  >
                    {getStatusText(signal.status)}
                  </Badge>
                </div>
              </div>

              {/* Price Info */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-600/30 rounded">
                  <p className="text-xs text-slate-400 mb-1">سعر الدخول</p>
                  <p className="text-sm font-semibold text-white">${signal.entryPrice.toFixed(2)}</p>
                </div>
                <div className="text-center p-3 bg-slate-600/30 rounded">
                  <p className="text-xs text-slate-400 mb-1">السعر الحالي</p>
                  <p className="text-sm font-semibold text-blue-400">${signal.currentPrice.toFixed(2)}</p>
                </div>
                <div className="text-center p-3 bg-slate-600/30 rounded">
                  <p className="text-xs text-slate-400 mb-1">الربح/الخسارة</p>
                  <p className={`text-sm font-semibold ${signal.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${signal.profit.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Targets */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/20">
                  <Target className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-xs text-slate-400">هدف 1</p>
                    <p className="text-sm font-medium text-green-400">${signal.tp1.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/20">
                  <Target className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-xs text-slate-400">هدف 2</p>
                    <p className="text-sm font-medium text-green-400">${signal.tp2.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded border border-red-500/20">
                  <StopCircle className="w-4 h-4 text-red-400" />
                  <div>
                    <p className="text-xs text-slate-400">وقف الخسارة</p>
                    <p className="text-sm font-medium text-red-400">${signal.stopLoss.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex justify-between items-center text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-4">
                  <span>حجم المركز: {signal.positionSize}</span>
                  <span>الثقة: {signal.confidence}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{signal.time}</span>
                </div>
              </div>

              {/* Actions */}
              {signal.status === 'active' && (
                <div className="flex gap-2 pt-2 border-t border-slate-600">
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleCloseSignal(signal.id)}
                  >
                    إغلاق الصفقة
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    تعديل الأهداف
                  </Button>
                </div>
              )}
              
              {signal.status === 'tp1_hit' && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-600 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">تم تحقيق الهدف الأول!</span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignalsList;
