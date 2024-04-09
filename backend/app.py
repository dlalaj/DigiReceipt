import os
import logging
import json

from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import db, DigiReceiptUser, Transaction
from sqlalchemy.exc import OperationalError

from Crypto.Random import get_random_bytes
from Crypto.Cipher import AES

import ssl

from dotenv import load_dotenv

# Load all environment variables
load_dotenv()
USERNAME = os.getenv('DB_USERNAME')
PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
DB_URL = f"postgresql://{USERNAME}:{PASSWORD}@localhost:5432/{DB_NAME}"
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
CERT_PATH = os.getenv('CERT_PATH')
KEY_PATH = os.getenv('KEY_PATH')
KEY_LENGTH = 16

# Configure Flask app with PostgreSQL database - import table schemas from model file
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DB_URL
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
jwt = JWTManager(app)
db.init_app(app)

# Configure database engine for interactions with PostgreSQL and make DB session
engine = create_engine(DB_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define all API routes starting below. To ensure confidentiality we use JWT, for each route that 
# needs to be protected because it serves secret resources make sure to use the decorator:
# @jwt_required() so as to only allow users who provide a bearer token

# BACKEND ROUTES START HERE
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

@app.route('/signup', methods=['POST'])
def signup():
    # Get username and password from request
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    # Check that the user does not already exist
    if session.query(DigiReceiptUser).filter_by(username=username).first():
        return jsonify({"error": "Username in use"}), 400
    else:

        # Else create new user and hash their password to not store it in plaintext
        new_user = DigiReceiptUser(username=username, password=generate_password_hash(password), 
                                   private_key=get_random_bytes(KEY_LENGTH))
        session.add(new_user)
        session.commit()
        return jsonify({"username": username}), 201

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    # Query the User table for the user with the specified username
    user = session.query(DigiReceiptUser).filter_by(username=username).first()

    if user:
        if check_password_hash(user.password, password):
            # Password hash checking complete - send user token for login session
            access_token = create_access_token(identity=username, expires_delta=False)
            return jsonify({"username": username, "token": access_token, "cid": str(user.id)}), 200
        else:
            # Incorrect password entered
            return jsonify({"error": "Incorrect password entered"}), 401
    else:
        # User not found
        return jsonify({"error": "User not found"}), 404

@app.route('/query-transaction', methods=['GET'])
# @jwt_required() # Uncomment this eventually to allow route protection
def getTransaction():
    user_tid = request.args.get("tid")
    user_cid = request.args.get("cid")

    trans = Transaction.query.with_entities(Transaction).filter(Transaction.tid == int(user_tid), Transaction.cid == user_cid).first()
    
    if trans:
        return jsonify({
            'tid': trans.tid,
            'cid': trans.cid,
            'mid': trans.mid,
            'time': trans.time,
            'purchases': trans.purchases,
            "tag": trans.tag
        }), 200
    else:
        return jsonify({'error': f'No transaction with tid: {user_tid} and cid: {user_cid}'}), 500

@app.route('/query', methods=['GET'])
# @jwt_required() # Uncomment this eventually to allow route protection
def getRecipt():
    transactions = Transaction.query.all()

    serialized_transactions = []
    for trans in transactions:
        serialized_transactions.append({
            'tid': trans.tid,
            'cid': trans.cid,
            'mid': trans.mid,
            'purchases': trans.purchases,
            'tag': trans.tag
        })

    return jsonify(serialized_transactions)

@app.route('/query-user-receipt', methods=['POST'])
# @jwt_required() # Uncomment this eventually to allow route protection
def getUserReceipt():
    user_cid = request.json.get("cid", None)

    serialized_transactions = []
    transactions = Transaction.query.with_entities(Transaction).filter(Transaction.cid == user_cid).all()

    if not transactions:
        return jsonify({'error': f'No client with cid: {user_cid}'}), 500

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
    purchases = data.get('purchases')

    user = session.query(DigiReceiptUser).filter_by(id=cid).first()

    if user:
        cipher = AES.new(key=user.private_key, mode=AES.MODE_GCM, nonce=get_random_bytes(KEY_LENGTH), mac_len=KEY_LENGTH)

        _, receipt_tag = cipher.encrypt_and_digest(json.dumps({
            "cid": cid,
            "mid": mid,
            "purchases": purchases
        }).encode())

        new_trans = Transaction(cid=cid, mid=mid, purchases=purchases, tag=receipt_tag.hex())

        db.session.add(new_trans)
        db.session.commit()

        return jsonify({'message': 'Transaction created successfully'}), 201
    else:
        return jsonify({'error': 'Incorrect user ID'}), 404

@app.route('/validatereceipt', methods=['POST'])
def validate():
    cid = request.json.get("cid", None)
    tid = request.json.get("tid", None)
    tag = request.json.get("tag", None)

    transaction = session.query(Transaction).filter_by(tid=tid).first()

    if transaction:
        if transaction.cid != cid or transaction.tag != tag:
            return jsonify({"error": "Potional Receipt Fraud"}), 403
        else:
            return jsonify({"message": "Receipt validated"}), 200
    else:
        return jsonify({"error": "No transaction found"}), 404


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
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(CERT_PATH, KEY_PATH)
    app.run(host="127.0.0.1", port=5000, debug=True, ssl_context=context)
