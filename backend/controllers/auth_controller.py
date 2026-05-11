from flask import request, jsonify
from models.user_model import (
    create_user,
    find_user_by_email,
    find_user_by_username
)
from flask_jwt_extended import create_access_token, get_jwt
from utils.token_blacklist import blacklist
import bcrypt


def signup_controller():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # 🔒 validation
    if not username or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    # 🔍 check existing email
    if find_user_by_email(email):
        return jsonify({"message": "Email already exists"}), 400

    # 🔍 check existing username
    if find_user_by_username(username):
        return jsonify({"message": "Username already taken"}), 400

    # 🔐 hash password
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # 💾 store user
    create_user({
    "username": username,
    "email": email,
    "password": hashed_pw,
    "role": "user",   # default
    "isBlocked": False 
})

    return jsonify({
        "message": "Signup successful"
    }), 201

# ✅ LOGIN
def login_controller():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    # 🔒 validation
    if not username or not password:
        return jsonify({"message": "Username and password required"}), 400

    # 🔍 find user
    user = find_user_by_username(username)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # 🚫 blocked check
    if user.get("isBlocked"):
        return jsonify({"message": "Your account is blocked"}), 403

    # 🔐 check password
    if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"message": "Invalid password"}), 401

    # 🎟️ generate JWT (FIXED)
    token = create_access_token(
        identity=str(user["_id"]),   # ✅ MUST be string
        additional_claims={
            "role": user.get("role", "user")
        }
    )

    return jsonify({
        "message": "Login successful",
        "token": token,
        "role": user.get("role", "user")
    })


# ✅ LOGOUT
def logout_controller():
    jti = get_jwt()["jti"]   # unique token id
    blacklist.add(jti)

    return jsonify({
        "message": "Logged out successfully"
    })