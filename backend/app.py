import os
import logging

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import db, User
from sqlalchemy.exc import OperationalError

from dotenv import load_dotenv
from receiveReceipts import receiveReceipts

# Load all environment variables
load_dotenv()
USERNAME = os.getenv('DB_USERNAME')
PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')

# Configure Flask app with PostgreSQL database - import table schemas from model file
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{USERNAME}:{PASSWORD}@localhost:5432/{DB_NAME}"
db.init_app(app)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define routes
app.route('/receiveReceipts', methods=['POST'])(receiveReceipts)
@app.route('/',methods=['GET'])
def index():
    # Database connection test here: should print out 'Database connection established successfully' in your shell
    try:
        with app.app_context():
            db.session.execute('SELECT 1')
            logger.info('Database connection established successfully')
    except OperationalError as e:
        logger.error('Failed to connect to database:', exc_info=True)

    return 'Hello, World'

# TODO - complete backend in here

# BACKEND ROUTES START HERE
#
#
#
#
# BACKEND ROUTES END HERE


# Run the web server with the database connection established
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host="127.0.0.1", port=5000, debug=True)
