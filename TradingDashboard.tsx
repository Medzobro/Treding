import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import SignalsList from "./SignalsList";
import PerformanceChart from "./PerformanceChart";
import BotSettings from "./BotSettings";

interface BotStats {
  dailyProfit: number;
  activeSignals: number;
  successRate: number;
  totalProfit: number;
  isRunning: boolean;
}

const TradingDashboard = () => {
  const [stats, setStats] = useState<BotStats>({
    dailyProfit: 125.50,
    activeSignals: 3,
    successRate: 72.5,
    totalProfit: 2840.75,
    isRunning: true
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'signals' | 'performance' | 'settings'>('dashboard');

  const toggleBot = () => {
    setStats(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم بوت التداول</h1>
            <p className="text-gray-600 mt-2">مراقبة وإدارة إشارات التداول الآلي</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={stats.isRunning ? "default" : "secondary"} className="px-3 py-1">
              {stats.isRunning ? "يعمل" : "متوقف"}
            </Badge>
            <Button
              onClick={toggleBot}
              variant={stats.isRunning ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {stats.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {stats.isRunning ? "إيقاف البوت" : "تشغيل البوت"}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'dashboard', label: 'لوحة التحكم' },
            { id: 'signals', label: 'الإشارات' },
            { id: 'performance', label: 'الأداء' },
            { id: 'settings', label: 'الإعدادات' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'dashboard' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الربح اليومي</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${stats.dailyProfit.toFixed(2)}
                </div>
                <p className="text-xs text-gray-600">+12.5% من أمس</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الإشارات النشطة</CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSignals}</div>
                <p className="text-xs text-gray-600">2 شراء، 1 بيع</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">نسبة النجاح</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.successRate.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-600">+2.1% هذا الأسبوع</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الأرباح</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${stats.totalProfit.toFixed(2)}
                </div>
                <p className="text-xs text-gray-600">منذ بداية الشهر</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>آخر الإشارات</CardTitle>
              </CardHeader>
              <CardContent>
                <SignalsList />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الأداء السريع</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'signals' && <SignalsList />}
      {activeTab === 'performance' && <PerformanceChart />}
      {activeTab === 'settings' && <BotSettings />}
    </div>
  );
};
