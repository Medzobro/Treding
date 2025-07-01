
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Bot, Bell, Database } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const BotSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // إعدادات التداول
    riskFactor: 0.01,
    checkInterval: 60,
    maxPositions: 5,
    autoTrading: true,
    
    // إعدادات الإشعارات
    telegramNotifications: true,
    emailNotifications: false,
    profitAlerts: true,
    lossAlerts: true,
    
    // إعدادات المؤشرات
    rsiPeriod: 14,
    rsiBuyLevel: 35,
    rsiSellLevel: 65,
    macdFast: 12,
    macdSlow: 26,
    macdSignal: 9,
    
    // إعدادات API
    telegramToken: '7263829955:AAF***************',
    chatId: '5587971659',
    goldApiKey: 'goldapi-18var1mmcf95806-io',
  });

  const handleSaveSettings = () => {
    // هنا يمكن إرسال الإعدادات إلى السيرفر
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تطبيق جميع التغييرات بنجاح",
    });
  };

  const handleResetSettings = () => {
    toast({
      title: "تم إعادة تعيين الإعدادات",
      description: "تم استرجاع الإعدادات الافتراضية",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="trading" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="trading" className="data-[state=active]:bg-blue-600">
            <Bot className="w-4 h-4 mr-2" />
            التداول
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
            <Bell className="w-4 h-4 mr-2" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="indicators" className="data-[state=active]:bg-blue-600">
            <Settings className="w-4 h-4 mr-2" />
            المؤشرات
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-blue-600">
            <Database className="w-4 h-4 mr-2" />
            API
          </TabsTrigger>
        </TabsList>

        {/* إعدادات التداول */}
        <TabsContent value="trading" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                إدارة المخاطر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="riskFactor" className="text-slate-300">نسبة المخاطرة (%)</Label>
                  <Input
                    id="riskFactor"
                    type="number"
                    step="0.01"
                    value={settings.riskFactor * 100}
                    onChange={(e) => setSettings({...settings, riskFactor: parseFloat(e.target.value) / 100})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPositions" className="text-slate-300">أقصى عدد صفقات متزامنة</Label>
                  <Input
                    id="maxPositions"
                    type="number"
                    value={settings.maxPositions}
                    onChange={(e) => setSettings({...settings, maxPositions: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="checkInterval" className="text-slate-300">فترة فحص السوق (ثانية)</Label>
                <Select value={settings.checkInterval.toString()} onValueChange={(value) => setSettings({...settings, checkInterval: parseInt(value)})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="30">30 ثانية</SelectItem>
                    <SelectItem value="60">60 ثانية</SelectItem>
                    <SelectItem value="120">2 دقيقة</SelectItem>
                    <SelectItem value="300">5 دقائق</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                <div>
                  <Label className="text-slate-300">التداول التلقائي</Label>
                  <p className="text-sm text-slate-400">تفعيل التداول الآلي بناء على الإشارات</p>
                </div>
                <Switch
                  checked={settings.autoTrading}
                  onCheckedChange={(checked) => setSettings({...settings, autoTrading: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات الإشعارات */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200">إعدادات الإشعارات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                  <div>
                    <Label className="text-slate-300">إشعارات تلجرام</Label>
                    <p className="text-sm text-slate-400">إرسال الإشارات عبر تلجرام</p>
                  </div>
                  <Switch
                    checked={settings.telegramNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, telegramNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                  <div>
                    <Label className="text-slate-300">إشعارات البريد الإلكتروني</Label>
                    <p className="text-sm text-slate-400">إرسال تقارير يومية بالبريد</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                  <div>
                    <Label className="text-slate-300">تنبيهات الأرباح</Label>
                    <p className="text-sm text-slate-400">إشعار عند تحقيق أهداف الربح</p>
                  </div>
                  <Switch
                    checked={settings.profitAlerts}
                    onCheckedChange={(checked) => setSettings({...settings, profitAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                  <div>
                    <Label className="text-slate-300">تنبيهات الخسائر</Label>
                    <p className="text-sm text-slate-400">إشعار عند وصول وقف الخسارة</p>
                  </div>
                  <Switch
                    checked={settings.lossAlerts}
                    onCheckedChange={(checked) => setSettings({...settings, lossAlerts: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات المؤشرات */}
        <TabsContent value="indicators" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200">إعدادات المؤشرات الفنية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">فترة RSI</Label>
                  <Input
                    type="number"
                    value={settings.rsiPeriod}
                    onChange={(e) => setSettings({...settings, rsiPeriod: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">مستوى الشراء RSI</Label>
                  <Input
                    type="number"
                    value={settings.rsiBuyLevel}
                    onChange={(e) => setSettings({...settings, rsiBuyLevel: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">مستوى البيع RSI</Label>
                  <Input
                    type="number"
                    value={settings.rsiSellLevel}
                    onChange={(e) => setSettings({...settings, rsiSellLevel: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">MACD سريع</Label>
                  <Input
                    type="number"
                    value={settings.macdFast}
                    onChange={(e) => setSettings({...settings, macdFast: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">MACD بطيء</Label>
                  <Input
                    type="number"
                    value={settings.macdSlow}
                    onChange={(e) => setSettings({...settings, macdSlow: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">إشارة MACD</Label>
                  <Input
                    type="number"
                    value={settings.macdSignal}
                    onChange={(e) => setSettings({...settings, macdSignal: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات API */}
        <TabsContent value="api" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200">إعدادات API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">رمز تلجرام</Label>
                <Input
                  type="password"
                  value={settings.telegramToken}
                  onChange={(e) => setSettings({...settings, telegramToken: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">معرف المحادثة</Label>
                <Input
                  value={settings.chatId}
                  onChange={(e) => setSettings({...settings, chatId: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">مفتاح Gold API</Label>
                <Input
                  type="password"
                  value={settings.goldApiKey}
                  onChange={(e) => setSettings({...settings, goldApiKey: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* أزرار الحفظ */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={handleResetSettings} className="border-slate-600 text-slate-300 hover:bg-slate-700">
          إعادة تعيين
        </Button>
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );
};

export default BotSettings;
