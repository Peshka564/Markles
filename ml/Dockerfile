FROM tensorflow/tensorflow

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "waitressServer.py"]