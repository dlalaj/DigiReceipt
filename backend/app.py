import os
import logging

from flask import Flask, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import db, DigiReceiptUser, Transaction
from sqlalchemy.exc import OperationalError

from dotenv import load_dotenv
from receiveReceipts import receiveReceipts

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
app.route('/receiveReceipts', methods=['POST'])(receiveReceipts)
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

@app.route('/query', methods=['GET'])
def getRecipt():
    transactions = Transaction.query.all()

    serialized_transactions = []
    for trans in transactions:
        serialized_transactions.append({
            'tid': trans.tid,
            'cid': trans.cid,
            'mid': trans.mid,
            'time': trans.time,
            'purchases': trans.purchases
        })

    return jsonify(serialized_transactions)

@app.route('/sendreceipt', methods=['POST'])
def sendRecipt():
    data = request.json
    cid = data.get('cid')
    mid = data.get('mid')
    time = data.get('time')
    purchases = data.get('purchases')

    new_trans = Transaction(cid=cid, mid=mid, time=time, purchases=purchases)

    db.session.add(new_trans)
    db.session.commit()

    return jsonify({'message': 'Transaction created successfully'}), 201

@app.route('/remove-receipts', methods=['POST'])
def removeReceipts():
    try:
        db.session.query(Transaction).delete()
        db.session.commit()
        Transaction.__table__.drop(engine)
        return jsonify({'message': 'Table removed successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# BACKEND ROUTES END HERE



# Run the web server with the database connection established
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host="127.0.0.1", port=5000, debug=True)
