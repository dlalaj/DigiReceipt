import os
import logging

from flask import Flask, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import db, DigiReceiptUser
from sqlalchemy.exc import OperationalError

from dotenv import load_dotenv

# Load all environment variables
load_dotenv()
USERNAME = os.getenv('DB_USERNAME')
PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
DB_URL = f"postgresql://{USERNAME}:{PASSWORD}@localhost:5432/{DB_NAME}"

# Configure Flask app with PostgreSQL database - import table schemas from model file
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DB_URL
db.init_app(app)

# Configure database engine for interactions with PostgreSQL and make DB session
engine = create_engine(DB_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define routes
@app.route('/',methods=['GET'])
def index():
    # Database connection test here: should print out 'Database connection established successfully' in your shell
    try:
        with app.app_context():
            db.session.execute('SELECT 1')
            logger.info('Database connection established successfully')

            # Below is dummy example for creating user
            # denis_user = DigiReceiptUser(username="denislalaj", password="denisspassword")
            # session.add(denis_user)
            # session.commit()
    except OperationalError as e:
        logger.error('Failed to connect to database:', exc_info=True)

    return 'Hello, World'

# TODO - complete backend in here

# BACKEND ROUTES START HERE
@app.route('/signup', methods=['POST'])
def signup():
    pass
# BACKEND ROUTES END HERE


# Run the web server with the database connection established
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host="127.0.0.1", port=5000, debug=True)
