from ..extensions import db

class Community(db.Model):
    __tablename__ = 'communities'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(500), nullable=True)
