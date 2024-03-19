from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    # Example user for now, we might want to revise this carefully
    # Could be useful to have perhaps two types of users: merchants and consumers

    __tablename__ = 'User'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)

# TODO: Add more models for transactions - need to confirm the schema for this carefully
