from flask import Flask, render_template, request, jsonify
import requests
import finnhub

finnhub_client = finnhub.Client(api_key="")
print(finnhub_client.company_profile2(symbol='AAPL'))

app = Flask(__name__)

@app.route('/api/stock', methods=['GET'])
def get_stock():
    ticker = request.args.get('ticker', default = '*', type = str)
    response = requests.get(f'https://finnhub.io/api/v1/quote?symbol={ticker}&token=YOUR_API_KEY')
    data = response.json()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)