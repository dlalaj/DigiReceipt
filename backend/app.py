import os
import logging
import json
import time
import uuid

from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import db, DigiReceiptUser, Transaction
from sqlalchemy.exc import OperationalError
from flask_cors import CORS

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
HOST_IP = os.getenv('HOST_IP')
KEY_LENGTH = 16
EXPIRY_TIME = 60
NONCE = b'noncenoncenoncen'

# Configure Flask app with PostgreSQL database - import table schemas from model file
app = Flask(__name__)
CORS(app)
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

def _refreshUserKey(user, db):
    user.private_key = get_random_bytes(KEY_LENGTH)
    db.session.commit()

def _setTransExpiry(trans, db):
    trans.expiry_time = int(time.time()) + EXPIRY_TIME
    db.session.commit()

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
    user = session.query(DigiReceiptUser).filter_by(id=user_cid).first()
    transactions = Transaction.query.with_entities(Transaction).filter(Transaction.cid == user_cid).all()

    if not transactions:
        return jsonify({'error': f'No client with cid: {user_cid}'}), 500
    
    print(f"Key before refresh: {user.private_key}")
    _refreshUserKey(user, db)
    print(f"Key after refresh: {user.private_key}")

    for trans in transactions:
        # Check if expired user.private_key
        _setTransExpiry(trans, db)

        cipher = AES.new(key=user.private_key, mode=AES.MODE_GCM, nonce=NONCE, mac_len=KEY_LENGTH)
        print(f"Key used for encryption: {user.private_key}")
        print(f"Transaction ID before encryption: {trans.tid}")
        ciphertext = cipher.encrypt(str(trans.tid).encode('utf-8'))
        print(f"Transaction ID after encryption: {ciphertext}")
        print(f"Transaction ID in HEX: {ciphertext.hex()}")

        serialized_transactions.append({
            'cid': trans.cid,
            'mid': trans.mid,
            'time': trans.time,
            'qrdata': ciphertext.hex(),
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
        tid = str(uuid.uuid1())
        new_trans = Transaction(tid=tid, cid=cid, mid=mid, purchases=purchases)

        db.session.add(new_trans)
        db.session.commit()

        return jsonify({'message': 'Transaction created successfully'}), 201
    else:
        return jsonify({'error': 'Incorrect user ID'}), 404

@app.route('/validatereceipt', methods=['POST'])
def validate():
    cid = request.json.get("cid", None)
    #tid = request.json.get("tid", None)
    qrdata = request.json.get("qrdata", None)
    print(f"QRdata from request: {qrdata}")

    user = session.query(DigiReceiptUser).filter_by(id=cid).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    cipher = AES.new(key=user.private_key, mode=AES.MODE_GCM, nonce=NONCE, mac_len=KEY_LENGTH)
    print(f"Key used for decryption: {user.private_key}")

    print(f"Encrypted TID: {bytes.fromhex(qrdata)}")
    user_tid = cipher.decrypt(bytes.fromhex(qrdata))
    print(f"Transaction ID after decryption: {user_tid}")

    transaction = session.query(Transaction).filter_by(tid=user_tid.decode('utf-8')).first()

    if transaction:
        if transaction.expiry_time < int(time.time()):
            return jsonify({"error": "Potential Receipt Fraud (QR Expired)"}), 403
        else:
            return jsonify({"id": transaction.id, "time": transaction.time, "purchases": transaction.purchases}), 200
    else:
        return jsonify({"error": "Potential Receipt Fraud (Invalid transaction ID)"}), 403


# @app.route('/remove-receipts', methods=['POST'])
# Used for debugging
# def removeReceipts():
#     try:
#         db.session.query(Transaction).delete()
#         db.session.commit()
#         Transaction.__table__.drop(engine)
#         return jsonify({'message': 'Table removed successfully'}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500

# BACKEND ROUTES END HERE


# Run the web server with the database connection established
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(CERT_PATH, KEY_PATH)
    app.run(host=HOST_IP, port=5000, debug=True, ssl_context=context)
