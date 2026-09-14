"""API routes for handling JSON requests."""

from flask import Blueprint, request, jsonify

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/booking', methods=['POST'])
def booking():
    """Handle booking submissions."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        # Here we would normally process the booking data
        # For now, just return success
        return jsonify({'success': True, 'message': 'Booking received successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submissions."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
            
        # Here we would normally process the contact form data
        # For now, just return success
        return jsonify({'success': True, 'message': 'Contact message received successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
