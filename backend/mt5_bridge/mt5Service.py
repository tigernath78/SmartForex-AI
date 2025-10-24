from flask import Flask, request, jsonify
import MetaTrader5 as mt5
app = Flask(__name__)
if not mt5.initialize():
    print('MT5 init failed')
@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_json() or {}
    symbol = data.get('symbol')
    signal = data.get('signal')
    volume = float(data.get('volume', 0.1))
    if signal.lower() == 'buy':
        order_type = mt5.ORDER_TYPE_BUY
    else:
        order_type = mt5.ORDER_TYPE_SELL
    tick = mt5.symbol_info_tick(symbol)
    price = tick.ask if order_type == mt5.ORDER_TYPE_BUY else tick.bid
    request_trade = {
        'action': mt5.TRADE_ACTION_DEAL,
        'symbol': symbol,
        'volume': volume,
        'type': order_type,
        'price': price,
        'deviation': 20,
        'magic': 234000,
        'comment': 'SmartForexAI',
        'type_filling': mt5.ORDER_FILLING_IOC,
    }
    result = mt5.order_send(request_trade)
    return jsonify({'ok': True, 'result': str(result)})
if __name__ == '__main__':
    app.run(port=5005, debug=True)
