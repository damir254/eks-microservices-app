from flask import Flask, jsonify
import os
import socket
import psycopg2

app = Flask(__name__)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "appdb")
DB_USER = os.getenv("DB_USER", "appuser")
DB_PASSWORD = os.getenv("DB_PASSWORD", "apppassword")
DB_PORT = os.getenv("DB_PORT", "5432")


@app.route("/")
def home():
    return jsonify({
        "message": "EKS microservices backend is running",
        "hostname": socket.gethostname()
    })


@app.route("/health")
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/db-check")
def db_check():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT
        )
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()
        cur.close()
        conn.close()

        return jsonify({
            "database": "connected",
            "version": version[0]
        }), 200

    except Exception as e:
        return jsonify({
            "database": "failed",
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
