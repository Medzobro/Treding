
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Activity, Target } from 'lucide-react';

const PerformanceChart = () => {
  // بيانات وهمية لأداء البوت
  const performanceData = [
    { date: '2024-01-01', profit: 0, trades: 0 },
    { date: '2024-01-02', profit: 156.78, trades: 3 },
    { date: '2024-01-03', profit: 289.45, trades: 5 },
    { date: '2024-01-04', profit: 234.12, trades: 4 },
    { date: '2024-01-05', profit: 445.67, trades: 7 },
    { date: '2024-01-06', profit: 398.23, trades: 6 },
    { date: '2024-01-07', profit: 567.89, trades: 8 },
    { date: '2024-01-08', profit: 623.45, trades: 9 },
    { date: '2024-01-09', profit: 789.12, trades: 11 },
    { date: '2024-01-10', profit: 856.78, trades: 12 },
    { date: '2024-01-11', profit: 1023.45, trades: 14 },
    { date: '2024-01-12', profit: 1156.89, trades: 16 },
    { date: '2024-01-13', profit: 1234.56, trades: 18 },
  ];

  const assetDistribution = [
    { name: 'BTCUSDT', value: 65, color: '#f97316' },
    { name: 'XAUUSD', value: 35, color: '#eab308' },
  ];

  const monthlyStats = [
    { month: 'ديسمبر', winRate: 72, totalTrades: 45 },
    { month: 'يناير', winRate: 68, totalTrades: 52 },
  ];

  const COLORS = ['#f97316', '#eab308'];

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              منحنى الأرباح التراكمية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('ar')}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value, name) => [`$${value}`, name === 'profit' ? 'الربح' : 'الصفقات']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('ar')}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              توزيع الأصول
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={assetDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => [`${value}%`, 'النسبة']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {assetDistribution.map((asset, index) => (
                <div key={asset.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: asset.color }}
                    />
                    <span className="text-sm text-slate-300">{asset.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{asset.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center gap-2">
            <Target className="w-5 h-5" />
            الأداء الشهري
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value, name) => [
                  name === 'winRate' ? `${value}%` : value,
                  name === 'winRate' ? 'معدل النجاح' : 'إجمالي الصفقات'
                ]}
              />
              <Bar dataKey="winRate" fill="#3b82f6" radius={4} />
              <Bar dataKey="totalTrades" fill="#10b981" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">أفضل صفقة</p>
                <p className="text-lg font-bold text-green-400">$289.45</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">أسوأ صفقة</p>
                <p className="text-lg font-bold text-red-400">-$67.23</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-400 rotate-180" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">متوسط الربح</p>
                <p className="text-lg font-bold text-blue-400">$94.89</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">إجمالي الصفقات</p>
                <p className="text-lg font-bold text-purple-400">97</p>
              </div>
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceChart;
