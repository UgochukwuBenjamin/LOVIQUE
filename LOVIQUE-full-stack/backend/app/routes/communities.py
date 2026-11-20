from flask import Blueprint, jsonify

communities_bp = Blueprint('communities', __name__)

# Starter sample data. Replace with database-backed queries as the project develops.
SAMPLE_COMMUNITIES = [
    {'id': 1, 'name': 'Creative Corner', 'category': 'Art & design'},
    {'id': 2, 'name': 'Tech Circle', 'category': 'Technology'},
    {'id': 3, 'name': 'Book Club', 'category': 'Reading'},
]

@communities_bp.get('/')
def list_communities():
    return jsonify({'communities': SAMPLE_COMMUNITIES})
