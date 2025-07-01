
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity, DollarSign, Bot, Settings, BarChart3, AlertTriangle } from 'lucide-react';
import TradingDashboard from '@/components/TradingDashboard';
import SignalsList from '@/components/SignalsList';
import PerformanceChart from '@/components/PerformanceChart';
import BotSettings from '@/components/BotSettings';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [botStatus, setBotStatus] = useState('active');
  const [currentPrice, setCurrentPrice] = useState({ BTCUSDT: 43250.50, XAUUSD: 2048.75 });
  const [totalProfit, setTotalProfit] = useState(1234.56);
  const [activeSignals, setActiveSignals] = useState(3);
  const [winRate, setWinRate] = useState(68.5);
  const { toast } = useToast();

  // محاكاة تحديث البيانات في الوقت الفعلي
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => ({
        BTCUSDT: prev.BTCUSDT + (Math.random() - 0.5) * 100,
        XAUUSD: prev.XAUUSD + (Math.random() - 0.5) * 5
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleBotToggle = () => {
    const newStatus = botStatus === 'active' ? 'inactive' : 'active';
    setBotStatus(newStatus);
    toast({
      title: newStatus === 'active' ? "تم تشغيل البوت" : "تم إيقاف البوت",
      description: `البوت الآن ${newStatus === 'active' ? 'يعمل' : 'متوقف'}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              لوحة تحكم بوت التداول
            </h1>
            <p className="text-slate-300 mt-2">مراقبة وإدارة إشارات التداول الذكية</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant={botStatus === 'active' ? 'default' : 'destructive'}
              className="px-3 py-1 text-sm"
            >
              <Bot className="w-4 h-4 mr-1" />
              {botStatus === 'active' ? 'يعمل' : 'متوقف'}
            </Badge>
            <Button 
              onClick={handleBotToggle}
              variant={botStatus === 'active' ? 'destructive' : 'default'}
              size="sm"
            >
              {botStatus === 'active' ? 'إيقاف البوت' : 'تشغيل البوت'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">إجمالي الأرباح</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">${totalProfit.toFixed(2)}</div>
              <p className="text-xs text-slate-400">+12.5% من الشهر الماضي</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">معدل النجاح</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{winRate}%</div>
              <p className="text-xs text-slate-400">من إجمالي الصفقات</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">الإشارات النشطة</CardTitle>
              <Activity className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{activeSignals}</div>
              <p className="text-xs text-slate-400">صفقات مفتوحة</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">سعر البيتكوين</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">${currentPrice.BTCUSDT.toFixed(2)}</div>
              <p className="text-xs text-slate-400">BTCUSDT</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              لوحة التحكم
            </TabsTrigger>
            <TabsTrigger value="signals" className="data-[state=active]:bg-blue-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              الإشارات
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              الأداء
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">
              <Settings className="w-4 h-4 mr-2" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <TradingDashboard currentPrice={currentPrice} botStatus={botStatus} />
          </TabsContent>

          <TabsContent value="signals" className="space-y-6">
            <SignalsList />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceChart />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <BotSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
