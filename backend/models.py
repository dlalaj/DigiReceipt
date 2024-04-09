from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON, BYTEA
import json
import datetime

db = SQLAlchemy()

class DigiReceiptUser(db.Model):

    __tablename__ = 'DigiReceiptUser'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    private_key = db.Column(BYTEA)
    
class Transaction(db.Model):

    __tablename__ = 'Transaction'

    tid = db.Column(db.Integer, primary_key=True)
    cid = db.Column(db.String)
    mid = db.Column(db.String)
    time = db.Column(db.DateTime, default=datetime.datetime.now)
    purchases = db.Column(JSON)
    tag = db.Column(db.String)
