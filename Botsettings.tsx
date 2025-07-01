
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, RefreshCw } from "lucide-react";

interface BotConfig {
  capital: number;
  riskFactor: number;
  checkInterval: number;
  btcEnabled: boolean;
  goldEnabled: boolean;
  telegramToken: string;
  chatId: string;
}

const BotSettings = () => {
  const [config, setConfig] = useState<BotConfig>({
    capital: 10000,
    riskFactor: 0.01,
    checkInterval: 60,
    btcEnabled: true,
    goldEnabled: true,
    telegramToken: "7263829955:AAFMudJyDndhVIBQ_iPuzTIEmgl7X3TvER4",
    chatId: "5587971659"
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // محاكاة حفظ الإعدادات
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('تم حفظ الإعدادات بنجاح!');
  };

  const handleReset = () => {
    setConfig({
      capital: 10000,
      riskFactor: 0.01,
      checkInterval: 60,
      btcEnabled: true,
      goldEnabled: true,
      telegramToken: "",
      chatId: ""
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إعدادات التداول</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capital">رأس المال ($)</Label>
              <Input
                id="capital"
                type="number"
                value={config.capital}
                onChange={(e) => setConfig({...config, capital: parseFloat(e.target.value)})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="risk">نسبة المخاطرة (%)</Label>
              <Input
                id="risk"
                type="number"
                step="0.01"
                value={config.riskFactor * 100}
                onChange={(e) => setConfig({...config, riskFactor: parseFloat(e.target.value) / 100})}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="interval">فترة التحقق (ثانية)</Label>
            <Input
              id="interval"
              type="number"
              value={config.checkInterval}
              onChange={(e) => setConfig({...config, checkInterval: parseInt(e.target.value)})}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الأصول المراقبة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="btc-switch">البيتكوين (BTCUSDT)</Label>
              <p className="text-sm text-gray-600">مراقبة إشارات البيتكوين</p>
            </div>
            <Switch
              id="btc-switch"
              checked={config.btcEnabled}
              onCheckedChange={(checked) => setConfig({...config, btcEnabled: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="gold-switch">الذهب (XAUUSD)</Label>
              <p className="text-sm text-gray-600">مراقبة إشارات الذهب</p>
            </div>
            <Switch
              id="gold-switch"
              checked={config.goldEnabled}
              onCheckedChange={(checked) => setConfig({...config, goldEnabled: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات تلغرام</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="token">رمز البوت</Label>
            <Input
              id="token"
              type="password"
              value={config.telegramToken}
              onChange={(e) => setConfig({...config, telegramToken: e.target.value})}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="chat-id">معرف المحادثة</Label>
            <Input
              id="chat-id"
              value={config.chatId}
              onChange={(e) => setConfig({...config, chatId: e.target.value})}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </Button>
        <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          إعادة تعيين
        </Button>
      </div>
    </div>
  );
};

export default BotSettings;
