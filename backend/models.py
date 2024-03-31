from flask_sqlalchemy import SQLAlchemy
import json

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

    transid = db.Column(db.Integer, primary_key=True)
    clientid = db.Column(db.Integer)
    merchantid = db.Column(db.Integer)
    purchases = db.Column(db.String)


