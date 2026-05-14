from functools import wraps
from flask import jsonify

from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt
)


def admin_required(fn):

    @wraps(fn)
    def wrapper(*args, **kwargs):

        try:
            verify_jwt_in_request()

            claims = get_jwt()

            if claims.get("role") != "admin":
                return jsonify({
                    "message": "Admin access only"
                }), 403

            return fn(*args, **kwargs)

        except Exception as e:
            return jsonify({
                "message": "Unauthorized"
            }), 401

    return wrapper