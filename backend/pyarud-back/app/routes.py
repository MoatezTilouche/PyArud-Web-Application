"""
API Routes Blueprint
"""
from flask import Blueprint, request, jsonify
from app.services import PyArudService
from marshmallow import Schema, fields, ValidationError


# Create blueprint
api_bp = Blueprint('api', __name__)

# Initialize service
pyarud_service = PyArudService()


# Request validation schema
class AnalyzePoemSchema(Schema):
    """Schema for poem analysis request"""
    verses = fields.List(
        fields.Str(required=True),
        required=True,
        validate=lambda x: len(x) > 0,
        error_messages={'required': 'Verses are required'}
    )


# ==================== API Routes ====================

@api_bp.route('/analyze', methods=['POST'])
def analyze_poem():
    """
    Analyze a poem using PyArud
    
    Request JSON:
    {
        "verses": ["verse1", "verse2", ...]
    }
    
    Response JSON:
    {
        "success": true,
        "data": {
            "bahr": "المتقارب",
            "verses_analysis": [...]
        }
    }
    """
    try:
        # Validate request data
        schema = AnalyzePoemSchema()
        data = schema.load(request.json)
        
        verses = data['verses']
        
        # Validate verse count
        from flask import current_app
        max_verses = current_app.config.get('MAX_VERSES_PER_REQUEST', 50)
        if len(verses) > max_verses:
            return jsonify({
                'success': False,
                'error': f'Maximum {max_verses} verses allowed per request'
            }), 400
        
        # Validate each verse
        for idx, verse in enumerate(verses, 1):
            if not pyarud_service.validate_verse(verse):
                return jsonify({
                    'success': False,
                    'error': f'Invalid verse at line {idx}. Please provide valid Arabic text.'
                }), 400
        
        # Analyze poem
        result = pyarud_service.analyze_poem(verses)
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except ValidationError as err:
        return jsonify({
            'success': False,
            'error': 'Invalid request format',
            'details': err.messages
        }), 400
        
    except ValueError as err:
        return jsonify({
            'success': False,
            'error': str(err)
        }), 400
        
    except Exception as err:
        return jsonify({
            'success': False,
            'error': f'Analysis failed: {str(err)}'
        }), 500


@api_bp.route('/bahr/<bahr_name>', methods=['GET'])
def get_bahr_info(bahr_name):
    """
    Get information about a specific bahr (meter)
    
    Response JSON:
    {
        "success": true,
        "data": {
            "name": "المتقارب",
            "pattern": "فعولن فعولن فعولن فعولن"
        }
    }
    """
    try:
        info = pyarud_service.get_bahr_info(bahr_name)
        
        return jsonify({
            'success': True,
            'data': info
        }), 200
        
    except Exception as err:
        return jsonify({
            'success': False,
            'error': str(err)
        }), 500


@api_bp.route('/validate', methods=['POST'])
def validate_verse():
    """
    Validate a single verse
    
    Request JSON:
    {
        "verse": "verse text"
    }
    
    Response JSON:
    {
        "success": true,
        "is_valid": true
    }
    """
    try:
        data = request.json
        
        if not data or 'verse' not in data:
            return jsonify({
                'success': False,
                'error': 'Verse text is required'
            }), 400
        
        verse = data['verse']
        is_valid = pyarud_service.validate_verse(verse)
        
        return jsonify({
            'success': True,
            'is_valid': is_valid
        }), 200
        
    except Exception as err:
        return jsonify({
            'success': False,
            'error': str(err)
        }), 500


@api_bp.route('/status', methods=['GET'])
def api_status():
    """
    Get API status
    
    Response JSON:
    {
        "status": "running",
        "version": "1.0.0",
        "service": "PyArud API"
    }
    """
    return jsonify({
        'status': 'running',
        'version': '1.0.0',
        'service': 'PyArud API',
        'endpoints': {
            'analyze': '/api/analyze [POST]',
            'bahr_info': '/api/bahr/<bahr_name> [GET]',
            'validate': '/api/validate [POST]',
            'status': '/api/status [GET]'
        }
    }), 200
