from flask import request, jsonify
from models.user_model import create_user, get_users, get_normal_users, users_collection
from bson import ObjectId


from config.db import users_collection


def create_user_controller():
    data = request.json

    if not data.get("username") or not data.get("email"):
        return jsonify({"message": "Missing fields"}), 400

    create_user(data)

    return jsonify({"message": "User created successfully"}), 201





from flask import request, jsonify
from config.db import users_collection

def get_users_controller():

    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))

        skip = (page - 1) * limit

        # ✅ ONLY USERS (NOT ADMINS)
        query = {"role": "user"}

        cursor = users_collection.find(query).skip(skip).limit(limit)

        users = []

        for u in cursor:
            users.append({
                "_id": str(u["_id"]),
                "username": u.get("username"),
                "email": u.get("email"),
                "role": u.get("role"),
                "isBlocked": u.get("isBlocked", False)
            })

        total = users_collection.count_documents(query)

        return jsonify({
            "users": users,
            "total": total,
            "page": page,
            "pages": (total // limit) + (1 if total % limit else 0)
        })

    except Exception as e:
        print("🔥 USERS ERROR:", e)
        return jsonify({
            "message": "Server error",
            "error": str(e)
        }), 500

def delete_user_controller(id):

    if not ObjectId.is_valid(id):
        return jsonify({"message": "Invalid user id"}), 400

    user = users_collection.find_one({"_id": ObjectId(id)})

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user.get("role") == "admin":
        return jsonify({"message": "Cannot delete admin"}), 403

    users_collection.delete_one({"_id": ObjectId(id)})

    return jsonify({"message": "User deleted"}), 200


def block_user_controller(id):

    if not ObjectId.is_valid(id):
        return jsonify({"message": "Invalid user id"}), 400

    user = users_collection.find_one({"_id": ObjectId(id)})

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user.get("role") == "admin":
        return jsonify({"message": "Cannot block admin"}), 403

    new_status = not user.get("isBlocked", False)

    users_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"isBlocked": new_status}}
    )

    return jsonify({
        "message": "User blocked" if new_status else "User unblocked"
    }), 200