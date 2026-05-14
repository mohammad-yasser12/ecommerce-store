from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request


def auth_required(fn):

    @wraps(fn)
    def wrapper(*args, **kwargs):

        try:
            verify_jwt_in_request()
            return fn(*args, **kwargs)

        except:
            return jsonify({
                "message": "Unauthorized"
            }), 401

    return wrapper