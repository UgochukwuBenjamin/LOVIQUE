from flask import Flask
from flask_cors import CORS
from config import Config
from .extensions import db
from .routes.health import health_bp
from .routes.communities import communities_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r'/api/*': {'origins': ['http://localhost:5173']}})
    db.init_app(app)
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(communities_bp, url_prefix='/api/communities')
    with app.app_context():
        db.create_all()
    return app
