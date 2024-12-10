FROM python:3.10.16

WORKDIR /opt/recommendation-api

COPY ./main.py ./main.py
COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./models ./models

CMD ["fastapi", "run", "main.py", "--proxy-headers", "--port", "80"]