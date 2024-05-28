from flask import Flask, render_template, request, jsonify
from requests.exceptions import RequestException
from datetime import datetime
from dateutil.relativedelta import relativedelta
import os
import requests

API_KEY = 'co271lhr01qvggedsuogco271lhr01qvggedsup0'

app = Flask(__name__, static_folder='static', template_folder='templates')
app.debug = True

@app.route('/')
def home():
    return render_template('din3d4Assign2.html')

@app.route('/api/stock', methods=['GET'])
def get_stock_profile():
    stock = request.args.get('symbol', '').upper()
    response = requests.get(f'https://finnhub.io/api/v1/stock/profile2?symbol={stock}&token={API_KEY}')
    if response.status_code != 200:
        return jsonify(error=f'Error: {response.status_code}'), 500
    else:
        data = response.json()
        if not data:
            return jsonify(error=f'Error: No record has been found, please enter a valid symbol'), 404
        
        return jsonify(data)

@app.route('/api/stock/summary', methods=['GET'])
def get_stock_summary():
    stock = request.args.get('symbol', '').upper()
    response = requests.get(f'https://finnhub.io/api/v1/quote?symbol={stock}&token={API_KEY}')
    if response.status_code != 200:
        return jsonify(error=f'Error: {response.status_code}'), 500
    else:
        data = response.json()
        if not data:
            return jsonify(error=f'Error: No record has been found, please enter a valid symbol'), 404
        
        return jsonify(data)
    
@app.route('/api/stock/recommendation', methods=['GET'])
def get_stock_recommendation():
    stock = request.args.get('symbol', '').upper()
    response = requests.get(f'https://finnhub.io/api/v1/stock/recommendation?symbol={stock}&token={API_KEY}')
    if response.status_code != 200:
        return jsonify(error=f'Error: {response.status_code}'), 500
    else:
        data = response.json()
        if not data:
            return jsonify(error=f'Error: No record has been found, please enter a valid symbol'), 404
        
        return jsonify(data)

@app.route('/api/stock/charts', methods=['GET'])
def get_stock_charts():
    stock = request.args.get('symbol', '').upper()
    current_date = datetime.now().strftime('%Y-%m-%d')
    past_date = (datetime.now() - relativedelta(months=6, days=1)).strftime('%Y-%m-%d')
    response = requests.get(f'https://api.polygon.io/v2/aggs/ticker/{stock}/range/1/day/{past_date}/{current_date}?adjusted=true&sort=asc&apiKey=i5ppHPBsTV1OWhtbCpigMuLzc7MYn3F7')
    if response.status_code != 200:
        return jsonify(error=f'Error: {response.status_code}'), 500
    else:
        data = response.json()
        if not data:
            return jsonify(error=f'Error: No record has been found, please enter a valid symbol'), 404
        
        return jsonify(data)
    
@app.route('/api/stock/news', methods=['GET'])
def get_stock_news():
    stock = request.args.get('symbol', '').upper()
    from_date = (datetime.now() + relativedelta(days=-30)).strftime('%Y-%m-%d')
    to_date = datetime.now().strftime('%Y-%m-%d')
    response = requests.get(f'https://finnhub.io/api/v1/company-news?symbol={stock}&from={from_date}&to={to_date}&token={API_KEY}')
    if response.status_code != 200:
        return jsonify(error=f'Error: {response.status_code}'), 500
    else:
        data = response.json()
        if not data:
            return jsonify(error=f'Error: No news has been found'), 404
        
        return jsonify(data)

if __name__ == '__main__':
    app.run()