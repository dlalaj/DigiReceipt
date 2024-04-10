import os
import logging

from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import db, DigiReceiptUser, Transaction, Merchant
from sqlalchemy.exc import OperationalError

from dotenv import load_dotenv

# Load all environment variables
load_dotenv()
USERNAME = os.getenv('DB_USERNAME')
PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
DB_URL = f"postgresql://{USERNAME}:{PASSWORD}@localhost:5432/{DB_NAME}"
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

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
        new_user = DigiReceiptUser(username=username, password=generate_password_hash(password))
        session.add(new_user)
        session.commit()
        return jsonify({"username": username}), 201

@app.route('/addMerchant', methods=['POST'])
def add_merchant():
    data = request.get_json()
    name = data.get('name')
    
    # Check if the name is not empty
    if not name:
        return jsonify({'error': 'The name is required!'}), 400

    # Instantiate a new Merchant
    new_merchant = Merchant(name=name)

    # Add the new merchant to the database session and commit
    db.session.add(new_merchant)
    try:
        db.session.commit()
        return jsonify({'message': f'Merchant {name} added successfully!'}), 201
    except Exception as e:
        db.session.rollback()  
        return jsonify({'error': str(e)}), 500
    
    
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
            return jsonify({"username": username, "token": access_token, "userId": 1}), 200 #TODO update userId dynamically
        else:
            # Incorrect password entered
            return jsonify({"error": "Incorrect password entered"}), 401
    else:
        # User not found
        return jsonify({"error": "User not found"}), 404

@app.route('/query-transaction', methods=['POST'])
def getTransaction():
    user_tid = request.json.get("tid", None)
    user_cid = request.json.get("cid", None)

    trans = Transaction.query.with_entities(Transaction).filter(Transaction.tid == int(user_tid), Transaction.cid == user_cid).first()
    
    if trans:
        return jsonify({
            'tid': trans.tid,
            'cid': trans.cid,
            'mid': trans.mid,
            'time': trans.time,
            'purchases': trans.purchases
        })
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
            'purchases': trans.purchases
        })

    return jsonify(serialized_transactions)

@app.route('/query-user-receipt', methods=['POST'])
def getUserReceipt():
    user_cid = request.json.get("cid", None)

    serialized_transactions = []
    transactions = (db.session.query(Transaction)
                    .filter(Transaction.cid == user_cid)
                    .all())


    if not transactions:
        return jsonify({'error': f'No client with cid: {user_cid}'}), 500

    for trans  in transactions:
        serialized_transactions.append({
            'tid': trans.tid,
            'cid': trans.cid,
            'mid': trans.mid,
            'time': trans.time,
            'merchantName': "Store442",
            'purchases': trans.purchases
        })
    
    return jsonify(serialized_transactions)

@app.route('/sendreceipt', methods=['POST'])
def sendRecipt():
    data = request.json
    cid = data.get('cid')
    mid = data.get('mid')
    tid = data.get('tid')
    purchases = data.get('purchases')

    new_trans = Transaction(cid=cid, mid=mid, purchases=purchases)

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