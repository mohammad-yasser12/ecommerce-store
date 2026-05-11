from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask_jwt_extended import verify_jwt_in_request, get_jwt

# ✅ Check if user is logged in
def auth_required():
    try:
        verify_jwt_in_request()  # checks token
    except Exception as e:
        return jsonify({"message": "Unauthorized"}), 401


# ✅ Check if user is admin

def admin_required():
    try:
        verify_jwt_in_request()

        claims = get_jwt()   # ✅ CORRECT

        if claims.get("role") != "admin":
            return jsonify({"message": "Admin access only"}), 403

    except Exception as e:
        return jsonify({"message": "Unauthorized"}), 401