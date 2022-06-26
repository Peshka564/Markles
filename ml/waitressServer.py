import pandas as pd
import numpy as np
import tensorflow as tf
import keras
import joblib

from flask import Flask, request, jsonify

from flask_cors import CORS, cross_origin
from sklearn.preprocessing import MinMaxScaler

# initialize app and allow CORS
app = Flask(__name__)
CORS(app, support_credentials=True)

# load the same scaler and model from training
scaler = joblib.load('scaler.save')
model = keras.models.load_model('test_model')

def preprocess_data(data):
    df = pd.DataFrame.from_dict(data)
    scaled_data = scaler.transform(df['amount'].values.reshape(-1, 1))
    return scaled_data.reshape(1, scaled_data.shape[0], 1)

def predict_data(data):
    history = data
    final = []
    for i in range(30):
        prediction = model.predict(history)
        final.append(prediction)
        # from [[x]] to [[[x]]]
        prediction = np.array(prediction)
        # remove the first element and add the prediction
        history = np.delete(np.roll(history, -1), -1)
        history = np.reshape(history, (1, history.shape[0], 1))
        history = np.concatenate((history[0], prediction), axis=0)
        history = np.reshape(history, (1, history.shape[0], 1))
    final = np.array(final)
    final = scaler.inverse_transform(final.reshape(-1, 1)).reshape(-1)
    return final

@app.route('/', methods=['POST'])
@cross_origin(supports_credentials=True)
def predict():
    data = request.get_json(force=True)
    data = preprocess_data(data)
    predictions = predict_data(data)
    return jsonify(predictions.tolist())

if __name__ == "__main__":
  from waitress import serve
  serve(app, host="0.0.0.0", port=8080)