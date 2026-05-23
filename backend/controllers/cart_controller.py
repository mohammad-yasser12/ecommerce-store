# controllers/cart_controller.py

from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers.promotion_controller import apply_promotion
from config.db import products_collection, promotions_collection
from models.cart_model import *

@jwt_required()
def get_cart_controller():
    user_id = get_jwt_identity()

    cart = get_cart_by_user(user_id)

    result = []

    for item in cart:
        item["_id"] = str(item["_id"])

        # 🔥 GET PRODUCT
        product = products_collection.find_one({
            "_id": ObjectId(item["product_id"])
        })

        if product:
            product["_id"] = str(product["_id"])

            # 🔥 APPLY PROMOTION
            product = apply_promotion(product)

            item["product"] = product
        else:
            item["product"] = None

        result.append(item)

    return jsonify(result), 200


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