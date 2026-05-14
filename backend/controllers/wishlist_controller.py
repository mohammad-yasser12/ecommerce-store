from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from models.wishlist_model import *
from bson import ObjectId
from config.db import users_collection, products_collection, wishlist_collection

# 🔥 GET



def get_wishlist_controller():
    try:
        user_id = get_jwt_identity()

        wishlist = list(wishlist_collection.find({"user_id": user_id}))

        result = []

        for item in wishlist:

            product_id = item.get("product_id")

            if not product_id:
                continue

            product = None

            try:
                # 🔥 TRY ObjectId first
                product = products_collection.find_one(
                    {"_id": ObjectId(product_id)},
                    {"name": 1, "price": 1, "image": 1}
                )
            except:
                # 🔥 fallback if _id is string
                product = products_collection.find_one(
                    {"_id": product_id},
                    {"name": 1, "price": 1, "image": 1}
                )

            result.append({
    "_id": str(item["_id"]),
    "product": {
        "id": str(product_id),
        "name": product.get("name") if product else "Unknown",
        "price": product.get("price", 0) if product else 0,
        "image": product.get("image", "") if product else ""
    }
})

        return jsonify(result), 200

    except Exception as e:
        print("WISHLIST ERROR:", e)
        return jsonify({"error": str(e)}), 500
# 🔥 ADD
def add_to_wishlist_controller():
    try:
        user_id = get_jwt_identity()
        data = request.json

        product_id = data.get("product_id")

        if not product_id:
            return jsonify({"msg": "product_id required"}), 400

        # 🔥 validate product exists
        product = products_collection.find_one({
            "_id": ObjectId(product_id)
        })

        if not product:
            return jsonify({"msg": "Product not found"}), 404

        # 🔥 prevent duplicates
        existing = wishlist_collection.find_one({
            "user_id": user_id,
            "product_id": product_id
        })

        if existing:
            return jsonify({"msg": "Already in wishlist"}), 200

        # 🔥 insert
        wishlist_collection.insert_one({
            "user_id": user_id,
            "product_id": product_id
        })

        return jsonify({"msg": "added"}), 200

    except Exception as e:
        print("WISHLIST ERROR:", e)
        return jsonify({"error": str(e)}), 500


# 🔥 REMOVE

def remove_from_wishlist_controller(product_id):
    try:
        user_id = get_jwt_identity()

        wishlist_collection.delete_one({
            "user_id": str(user_id),
            "product_id": str(product_id)
        })

        return jsonify({"msg": "removed"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_all_wishlist_controller():
    try:
        wishlist = list(wishlist_collection.find())

        result = []

        for w in wishlist:

            user = users_collection.find_one(
                {"_id": ObjectId(w["user_id"])}
            )

            product = products_collection.find_one(
                {"_id": ObjectId(w["product_id"])}
            )

            result.append({
                "_id": str(w["_id"]),
                "user": {
                    "id": str(user["_id"]) if user else None,
                    "username": user["username"] if user else "Unknown"
                },
                "product": {
                    "id": str(product["_id"]) if product else None,
                    "name": product["name"] if product else "Unknown"
                }
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def toggle_wishlist_controller():
    user_id = get_jwt_identity()
    data = request.json
    product_id = data.get("product_id")

    existing = wishlist_collection.find_one({
        "user_id": user_id,
        "product_id": product_id
    })

    if existing:
        wishlist_collection.delete_one({
            "user_id": user_id,
            "product_id": product_id
        })
        return jsonify({"msg": "removed"}), 200

    else:
        wishlist_collection.insert_one({
            "user_id": user_id,
            "product_id": product_id
        })
        return jsonify({"msg": "added"}), 200