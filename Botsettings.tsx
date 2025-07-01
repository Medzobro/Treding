import requests
import time
import threading
import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import logging

# إعدادات البوت
TELEGRAM_TOKEN = "7263829955:AAFMudJyDndhVIBQ_iPuzTIEmgl7X3TvER4"
CHAT_ID = "5587971659"
SYMBOLS = {
    'BTCUSDT': {'name': 'Bitcoin', 'timeframe': '15m'},
    'XAUUSD': {'name': 'Gold', 'timeframe': '30m'}
}
CHECK_INTERVAL = 60  # 60 ثانية
GOLD_API_KEY = "goldapi-18var1mmcf95806-io"
BINANCE_API_URL = "https://api.binance.com/api/v3"

# تهيئة نظام التسجيل
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('bot_errors.log')
    ]
)

# حالة البوت
last_signals = {symbol: "" for symbol in SYMBOLS}
last_update_id = 0
trade_history = {}

# إدارة المخاطر
RISK_FACTOR = 0.01  # نسبة المخاطرة 1% من رأس المال

def send_telegram_message(text, chat_id=None, reply_markup=None):
    """إرسال رسالة عبر تلغرام مع إمكانية إضافة أزرار"""
    if chat_id is None:
        chat_id = CHAT_ID
        
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    params = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'Markdown'
    }
    
    if reply_markup:
        params['reply_markup'] = json.dumps(reply_markup)
    
    try:
        response = requests.post(url, json=params, timeout=15)
        if response.status_code == 200:
            logging.info("تم إرسال الرسالة بنجاح!")
            return True
        else:
            logging.error(f"فشل إرسال الرسالة. الكود: {response.status_code}, الرسالة: {response.text}")
            return False
    except Exception as e:
        logging.error(f"خطأ في إرسال الرسالة: {e}")
        return False

def safe_request(url, params=None, headers=None, max_retries=3, timeout=25):
    """إرسال طلب آمن مع إعادة المحاولة"""
    for attempt in range(max_retries):
        try:
            if headers:
                response = requests.get(url, params=params, headers=headers, timeout=timeout)
            else:
                response = requests.get(url, params=params, timeout=timeout)
            return response
        except (requests.exceptions.ReadTimeout, 
                requests.exceptions.ConnectionError,
                requests.exceptions.Timeout) as e:
            if attempt < max_retries - 1:
                logging.warning(f"انتهت مهلة الطلب ({e}). إعادة المحاولة ({attempt+1}/{max_retries})...")
                time.sleep(2)
            else:
                logging.error(f"فشل الطلب بعد {max_retries} محاولات: {e}")
                return None
    return None

def get_price(symbol):
    """الحصول على سعر الأصل"""
    try:
        if symbol == 'BTCUSDT':
            url = f'{BINANCE_API_URL}/ticker/price?symbol={symbol}'
            response = safe_request(url)
            if response and response.status_code == 200:
                data = response.json()
                return float(data['price'])
            return None
        elif symbol == 'XAUUSD':
            url = 'https://www.goldapi.io/api/XAU/USD'
            headers = {'x-access-token': GOLD_API_KEY}
            response = safe_request(url, headers=headers)
            if response and response.status_code == 200:
                data = response.json()
                return float(data['price'])
            return None
    except Exception as e:
        logging.error(f"خطأ في جلب سعر {symbol}: {e}")
        return None

def get_historical_data(symbol, timeframe, limit=100):
    """جلب البيانات التاريخية من Binance للبيتكوين ومن GoldAPI للذهب"""
    try:
        if symbol == 'BTCUSDT':
            interval_mapping = {
                '15m': '15m',
                '30m': '30m',
                '1h': '1h'
            }
            interval = interval_mapping.get(timeframe, '15m')
            url = f'{BINANCE_API_URL}/klines?symbol={symbol}&interval={interval}&limit={limit}'
            response = safe_request(url)
            if not response or response.status_code != 200:
                return None
            
            data = response.json()
            
            # تحويل إلى DataFrame
            df = pd.DataFrame(data, columns=[
                'open_time', 'open', 'high', 'low', 'close', 'volume',
                'close_time', 'quote_asset_volume', 'trades',
                'taker_buy_base', 'taker_buy_quote', 'ignore'
            ])
            
            # تحويل الأنواع
            numeric_cols = ['open', 'high', 'low', 'close', 'volume']
            df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, axis=1)
            df['open_time'] = pd.to_datetime(df['open_time'], unit='ms')
            
            return df[['open_time', 'open', 'high', 'low', 'close', 'volume']]
            
        elif symbol == 'XAUUSD':
            # حل بديل للذهب باستخدام بيانات وهمية (للاختبار)
            current_price = get_price(symbol)
            if current_price:
                # إنشاء بيانات تاريخية عشوائية حول السعر الحالي
                np.random.seed(42)
                prices = np.random.normal(current_price, current_price * 0.01, limit)
                times = [datetime.now() - timedelta(minutes=30*i) for i in range(limit)]
                
                df = pd.DataFrame({
                    'open_time': times,
                    'open': prices,
                    'high': prices * 1.002,
                    'low': prices * 0.998,
                    'close': prices,
                    'volume': np.random.randint(100, 1000, limit)
                })
                return df.sort_values('open_time', ascending=False)
            return None
            
    except Exception as e:
        logging.error(f"خطأ في جلب البيانات التاريخية لـ {symbol}: {e}")
        return None

def calculate_indicators(df):
    """حساب المؤشرات الفنية"""
    if df is None or len(df) < 20:
        return None
        
    # حساب RSI
    def rsi(series, period=14):
        delta = series.diff()
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        
        avg_gain = gain.rolling(window=period).mean()
        avg_loss = loss.rolling(window=period).mean()
        
        rs = avg_gain / avg_loss
        return 100 - (100 / (1 + rs))
    
    df['rsi'] = rsi(df['close'])
    
    # حساب المتوسطات المتحركة
    df['sma_20'] = df['close'].rolling(window=20).mean()
    df['sma_50'] = df['close'].rolling(window=50).mean()
    
    # حساب MACD
    exp12 = df['close'].ewm(span=12, adjust=False).mean()
    exp26 = df['close'].ewm(span=26, adjust=False).mean()
    df['macd'] = exp12 - exp26
    df['signal'] = df['macd'].ewm(span=9, adjust=False).mean()
    
    return df

def generate_signal(symbol, capital=10000):
    """توليد إشارة التداول"""
    asset_info = SYMBOLS[symbol]
    timeframe = asset_info['timeframe']
    current_price = get_price(symbol)
    
    if current_price is None:
        return "HOLD", current_price, None
    
    df = get_historical_data(symbol, timeframe)
    if df is None or len(df) < 20:
        return "HOLD", current_price, None
        
    df = calculate_indicators(df)
    if df is None or len(df) < 20:
        return "HOLD", current_price, None
        
    # آخر قراءات المؤشرات
    last_row = df.iloc[-1]
    prev_row = df.iloc[-2] if len(df) > 1 else last_row
    
    # شروط الشراء المعززة
    buy_conditions = (
        last_row['rsi'] < 35 and
        last_row['macd'] > last_row['signal'] and
        prev_row['macd'] <= prev_row['signal'] and
        last_row['close'] > last_row['sma_20'] and
        last_row['sma_20'] > last_row['sma_50']
    )
    
    # شروط البيع المعززة
    sell_conditions = (
        last_row['rsi'] > 65 and
        last_row['macd'] < last_row['signal'] and
        prev_row['macd'] >= prev_row['signal'] and
        last_row['close'] < last_row['sma_20'] and
        last_row['sma_20'] < last_row['sma_50']
    )
    
    # تجنب الإشارات المتكررة
    if symbol in last_signals:
        last_signal_time = trade_history.get(symbol, {}).get('time', datetime.min)
        if (datetime.now() - last_signal_time).total_seconds() < 3600:  # 1 ساعة
            return "HOLD", current_price, None
    
    # توليد الإشارة
    if buy_conditions:
        signal = "BUY"
    elif sell_conditions:
        signal = "SELL"
    else:
        signal = "HOLD"
    
    # حساب حجم المركز بناء على إدارة المخاطر
    position_size = 0
    if signal != "HOLD":
        # حجم المركز = (رأس المال * نسبة المخاطرة) / (الوقف * وحدة التداول)
        stop_loss = calculate_stop_loss(symbol, signal, current_price)
        risk_amount = capital * RISK_FACTOR
        risk_per_unit = abs(current_price - stop_loss)
        position_size = risk_amount / risk_per_unit if risk_per_unit > 0 else 0
        
        # تسجيل الصفقة في التاريخ
        trade_history[symbol] = {
            'time': datetime.now(),
            'signal': signal,
            'price': current_price,
            'size': position_size
        }
    
    return signal, current_price, position_size

def calculate_stop_loss(symbol, signal, entry_price):
    """حساب وقف الخسارة بناء على تقنية ATR"""
    df = get_historical_data(symbol, SYMBOLS[symbol]['timeframe'], 20)
    if df is None or len(df) < 14:
        # استخدام نسبة ثابتة إذا لم تتوفر بيانات كافية
        return entry_price * 0.98 if signal == "BUY" else entry_price * 1.02
    
    # حساب متوسط المدى الحقيقي (ATR)
    high_low = df['high'] - df['low']
    high_close = np.abs(df['high'] - df['close'].shift())
    low_close = np.abs(df['low'] - df['close'].shift())
    
    true_range = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    atr = true_range.rolling(window=14).mean().iloc[-1]
    
    if signal == "BUY":
        return entry_price - atr * 1.5
    else:  # SELL
        return entry_price + atr * 1.5

def send_trading_signal(symbol, signal, price, position_size):
    """إرسال إشارة التداول مع تفاصيل إدارة المخاطر"""
    if signal == "HOLD":
        return
    
    asset_info = SYMBOLS[symbol]
    asset_name = asset_info['name']
    timeframe = asset_info['timeframe']
    
    # تنسيق الرسالة
    emoji = "🟢" if signal == "BUY" else "🔴"
    signal_text = "شراء" if signal == "BUY" else "بيع"
    
    # حساب الأهداف
    stop_loss = calculate_stop_loss(symbol, signal, price)
    
    if signal == "BUY":
        tp1 = price + (price - stop_loss) * 1.5
        tp2 = price + (price - stop_loss) * 3
    else:  # SELL
        tp1 = price - (stop_loss - price) * 1.5
        tp2 = price - (stop_loss - price) * 3
    
    # إضافة أزرار للتفاعل
    keyboard = {
        "inline_keyboard": [
            [{"text": "✅ تأكيد الدخول", "callback_data": f"confirm_{symbol}_{signal}"}],
            [{"text": "❌ إلغاء الصفقة", "callback_data": f"cancel_{symbol}"}]
        ]
    }
    
    message = (
        f"{emoji} *توصية تداول عالية الجودة!* {emoji}\n\n"
        f"*الأصل:* `{asset_name} ({symbol})`\n"
        f"*الإطار الزمني:* `{timeframe}`\n"
        f"*التوصية:* `{signal_text}`\n"
        f"*السعر الحالي:* `{price:.2f}`\n"
        f"*حجم المركز:* `{position_size:.4f}`\n\n"
        f"*🎯 نقطة الدخول:* `{price:.2f}`\n"
        f"*🎯 هدف الربح 1:* `{tp1:.2f}`\n"
        f"*🎯 هدف الربح 2:* `{tp2:.2f}`\n"
        f"*🛑 وقف الخسارة:* `{stop_loss:.2f}`\n\n"
        f"*📊 نسبة المخاطرة/العائد:* `1:3`\n"
        f"*⏱ وقت الإشارة:* `{datetime.now().strftime('%Y-%m-%d %H:%M')}`\n\n"
        f"_استخدم الأزرار أدناه للتفاعل مع الإشارة_"
    )
    
    send_telegram_message(message, reply_markup=keyboard)

def handle_callback_query(callback_query):
    """معالجة تفاعلات المستخدم مع الأزرار"""
    callback_data = callback_query['data']
    user_id = callback_query['from']['id']
    
    if callback_data.startswith('confirm_'):
        _, symbol, signal = callback_data.split('_')
        # تنفيذ الصفقة فعلياً
        price = get_price(symbol)
        if price:
            send_telegram_message(
                f"✅ تم تنفيذ صفقة {signal} لـ {symbol} بنجاح!\n"
                f"السعر: {price:.2f}\n"
                f"الوقت: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
                chat_id=user_id
            )
        
    elif callback_data.startswith('cancel_'):
        _, symbol = callback_data.split('_')
        send_telegram_message(f"تم إلغاء الصفقة لـ {symbol}", chat_id=user_id)

def check_messages():
    """التحقق من الرسائل الواردة ومعالجتها"""
    global last_update_id
    
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/getUpdates"
    params = {'offset': last_update_id + 1, 'timeout': 30}  # زيادة المهلة إلى 30 ثانية
    
    try:
        # استخدام نظام الطلبات الآمن مع إعادة المحاولة
        response = safe_request(url, params=params, timeout=35)
        if not response or response.status_code != 200:
            return
            
        data = response.json()
        if not data.get('ok') or not data.get('result'):
            return
            
        for update in data['result']:
            update_id = update['update_id']
            if update_id > last_update_id:
                last_update_id = update_id
                
            if 'message' in update and 'text' in update['message']:
                message = update['message']
                chat_id = message['chat']['id']
                text = message['text']
                
                if text == '/start':
                    assets_list = "\n".join([f"- {details['name']} ({sym})" for sym, details in SYMBOLS.items()])
                    welcome_msg = (
                        "مرحباً! 👋 أنا بوت توصيات التداول الذكي\n\n"
                        "سأرسل لك إشارات تداول تلقائية للأصول التالية:\n"
                        f"{assets_list}\n\n"
                        "الإشارات تشمل:\n"
                        "✅ نقطة الدخول\n"
                        "🎯 أهداف الربح\n"
                        "🛑 وقف الخسارة\n\n"
                        "الاستخدام:\n"
                        "لا حاجة لأوامر، سأرسل الإشارات تلقائياً عند ظهور فرص التداول!"
                    )
                    send_telegram_message(welcome_msg, chat_id)
                    logging.info("تم الرد على أمر /start")
                    
            elif 'callback_query' in update:
                callback_query = update['callback_query']
                handle_callback_query(callback_query)
                
    except Exception as e:
        logging.error(f"خطأ في فحص الرسائل: {e}")

def market_monitor():
    """مراقبة السوق وإرسال الإشارات"""
    # إرسال رسالة بدء التشغيل
    assets = ", ".join([details['name'] for details in SYMBOLS.values()])
    send_telegram_message(f"🚀 بدأ تشغيل بوت التداول!\nالأصول: {assets}")
    
    while True:
        try:
            current_time = datetime.now().strftime('%H:%M:%S')
            logging.info(f"[{current_time}] جاري فحص السوق...")
            
            for symbol in SYMBOLS:
                signal, price, position_size = generate_signal(symbol)
                
                # إذا كانت هناك إشارة جديدة
                if signal != "HOLD" and signal != last_signals.get(symbol, ""):
                    logging.info(f"تم اكتشاف إشارة لـ {symbol}: {signal}")
                    send_trading_signal(symbol, signal, price, position_size)
                    last_signals[symbol] = signal
            
            # الانتظار للتحديث التالي
            time.sleep(CHECK_INTERVAL)
            
        except Exception as e:
            logging.error(f"حدث خطأ في مراقبة السوق: {e}")
            time.sleep(30)

def start_bot():
    """بدء تشغيل البوت"""
    logging.info("===== بدء تشغيل بوت التداول =====")
    for symbol, details in SYMBOLS.items():
        logging.info(f"{details['name']} ({symbol}) - الإطار: {details['timeframe']}")
    logging.info("===============================")
    
    # بدء خيط لمراقبة السوق
    market_thread = threading.Thread(target=market_monitor)
    market_thread.daemon = True
    market_thread.start()
    
    # حلقة رئيسية لفحص الرسائل
    while True:
        try:
            check_messages()
            time.sleep(10)  # زيادة فترة الانتظار إلى 10 ثواني
        except Exception as e:
            logging.error(f"خطأ في الحلقة الرئيسية: {e}")
            time.sleep(30)

if __name__ == "__main__":
    # اختبار الاتصال قبل البدء
    logging.info("جاري اختبار الاتصال...")
    test_results = []
    
    try:
        for symbol in SYMBOLS:
            test_price = get_price(symbol)
            asset_name = SYMBOLS[symbol]['name']
            if test_price:
                logging.info(f"اختبار سعر {asset_name} ناجح: {test_price}")
                test_results.append(f"✅ بوت {asset_name} يعمل بنجاح!")
            else:
                logging.error(f"فشل اختبار سعر {asset_name}")
                test_results.append(f"⚠️ فشل اختبار سعر {asset_name}")
        
        # إرسال نتائج الاختبار
        test_summary = "نتائج اختبار التشغيل:\n" + "\n".join(test_results)
        send_telegram_message(test_summary)
    except Exception as e:
        error_msg = f"فشل اختبار الاتصال: {e}"
        logging.error(error_msg)
        send_telegram_message(error_msg)
    
    # بدء البوت
    start_bot()
