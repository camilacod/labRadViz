import pandas as pd
from flask import Flask, jsonify, render_template
import os
import json

app = Flask(__name__)

@app.route('/')
def index():
    # Load the iris dataset
    csv_path = os.path.join(os.path.dirname(__file__), 'iris-1.csv')
    df = pd.read_csv(csv_path)
    # Detect numeric columns (for Radviz anchors)
    numeric_cols = df.select_dtypes(include='number').columns.tolist()
    # Detect categorical column (for coloring)
    categorical_cols = [col for col in df.columns if col not in numeric_cols]
    label_col = categorical_cols[0] if categorical_cols else None
    # Normalize numeric columns
    norm_df = df.copy()
    for col in numeric_cols:
        min_val = df[col].min()
        max_val = df[col].max()
        norm_df[col] = (df[col] - min_val) / (max_val - min_val) if max_val != min_val else 0
    # Prepare data for the frontend
    data = norm_df.to_dict(orient="records")
    return render_template(
        'index-2.html',
        data=json.dumps(data),
        dimensions=json.dumps(numeric_cols),
        label_col=label_col
    )

if __name__ == '__main__':
    app.run(debug=True)
