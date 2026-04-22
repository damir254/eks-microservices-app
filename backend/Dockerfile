FROM python:3.13.13-slim-trixie AS builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

COPY app.py .

FROM gcr.io/distroless/python3-debian13

WORKDIR /app

COPY --from=builder /install /usr/local
COPY --from=builder /app/app.py /app/app.py

ENV PYTHONPATH=/usr/local/lib/python3.13/site-packages

USER 65532:65532

EXPOSE 5000

CMD ["/usr/local/bin/gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
