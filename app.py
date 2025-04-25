import pandas as pd
from flask import Flask, jsonify, render_template
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    csv_path = os.path.join(os.path.dirname(__file__), 'data.csv')
    df = pd.read_csv(csv_path)
    return df.to_json(orient='records')

if __name__ == '__main__':
    app.run(debug=True)
