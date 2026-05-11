# controllers/cart_controller.py

from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.cart_model import *

@jwt_required()
def get_cart_controller():
    user_id = get_jwt_identity()

    cart = get_cart_by_user(user_id)

    for item in cart:
        item["_id"] = str(item["_id"])

    return jsonify(cart), 200


@jwt_required()
def add_to_cart_controller():
    user_id = get_jwt_identity()
    data = request.json

    add_to_cart_db(user_id, data)

    return jsonify({"msg": "Added to cart"}), 200


@jwt_required()
def remove_from_cart_controller():
    user_id = get_jwt_identity()
    product_id = request.json.get("product_id")

    remove_from_cart_db(user_id, product_id)

    return jsonify({"msg": "Removed"}), 200

@jwt_required()
def decrease_quantity_controller():
    user_id = get_jwt_identity()
    product_id = request.json.get("product_id")

    item = cart_collection.find_one({
        "user_id": user_id,
        "product_id": product_id
    })

    if item and item["quantity"] > 1:
        cart_collection.update_one(
            {"_id": item["_id"]},
            {"$inc": {"quantity": -1}}
        )
    else:
        cart_collection.delete_one({"_id": item["_id"]})

    return jsonify({"msg": "updated"}), 200