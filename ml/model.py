import numpy as np
import pandas as pd
import pandas_datareader as web
import datetime as dt
import matplotlib.pyplot as plt
import joblib

from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler(feature_range=(0, 1))
def load_data():
    start_date = dt.datetime(2000, 1, 1)
    end_date = dt.datetime.now()
    yahoo_data = web.DataReader('GE', 'yahoo', start_date, end_date)
    yahoo_data = yahoo_data.resample('D').sum()
    yahoo_data = yahoo_data['Close'].values.reshape(-1, 1)
    print(yahoo_data)
    yahoo_data = scaler.fit_transform(yahoo_data)
    return yahoo_data

def split_data(data):
    train = data[: -250]
    test = data[-250:]
    return np.reshape(train, (-1, 1)), np.reshape(test, (-1, 1))

def segment_data(data, prediction_period):
    data = data.reshape(data.shape[0] * data.shape [1], 1)
    x, y = [], []
    for i in range(prediction_period, len(data)):
        x.append(data[i - prediction_period:i])
    y.append(data[prediction_period:])
    return np.reshape(x, (-1, prediction_period, 1)), np.reshape(y, (-1))

def build_model(x, y):
    model = Sequential()
    model.add(LSTM(200, activation='relu', input_shape=(x.shape[1], 1)))
    model.add(Dropout(0.5))
    model.add(Dense(100, activation='relu'))
    model.add(Dense(1))
    model.compile(loss='mean_squared_error', optimizer='adam')
    model.fit(x, y, epochs=25, batch_size=32)

    model.save('test_model')
    joblib.dump(scaler, "scaler.save")
    return model

data = load_data()
print(data.shape)
prediction_period = 60
train_data, test_data = split_data(data)
print(train_data.shape, test_data.shape)

train_x, train_y = segment_data(train_data, prediction_period)

model = build_model(train_x, train_y)

all_values = np.concatenate((train_data, test_data), axis=0)
test_values = all_values[len(train_data) - prediction_period:]
test_x, test_y = segment_data(test_values, prediction_period)

predictions = np.array(model.predict(test_x)).reshape(-1, 1)
plt.plot(test_data, color='blue', label="actual")
plt.plot(predictions, color='red', label="predicted")
plt.show()