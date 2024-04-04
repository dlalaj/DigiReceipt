from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON
import json
import datetime

db = SQLAlchemy()

class DigiReceiptUser(db.Model):
    # Example user for now, we might want to revise this carefully
    # Could be useful to have perhaps two types of users: merchants and consumers

    __tablename__ = 'DigiReceiptUser'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)


# TODO: Add more models for transactions - need to confirm the schema for this carefully
    
class Transaction(db.Model):

    __tablename__ = 'Transaction'

    tid = db.Column(db.Integer, primary_key=True)
    cid = db.Column(db.String)
    mid = db.Column(db.String)
    time = db.Column(db.DateTime, default=datetime.datetime.now)
    purchases = db.Column(JSON)


