from flask import Flask, render_template, jsonify
import pandas as pd
import numpy as np
import json

app = Flask(__name__)

# Ruta principal que sirve la página HTML
@app.route('/')
def index():
    return render_template('index.html')

# API para obtener datos para D3.js
@app.route('/api/data')
def get_data():
    # Ejemplo de datos generados
    # En un caso real, aquí procesarías tus datos con pandas/numpy
    np.random.seed(42)
    data = []
    for i in range(50):
        data.append({
            'id': i,
            'x': np.random.randint(1, 100),
            'y': np.random.randint(1, 100),
            'categoria': np.random.choice(['A', 'B', 'C']),
            'valor': np.random.normal(50, 15)
        })
    
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True) 