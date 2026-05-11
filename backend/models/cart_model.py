# models/cart_model.py

from config.db import cart_collection
from bson import ObjectId

def get_cart_by_user(user_id):
    return list(cart_collection.find({"user_id": user_id}))

def add_to_cart_db(user_id, product):
    existing = cart_collection.find_one({
        "user_id": user_id,
        "product_id": product["_id"]
    })

    if existing:
        cart_collection.update_one(
            {"_id": existing["_id"]},
            {"$inc": {"quantity": 1}}
        )
    else:
        cart_collection.insert_one({
            "user_id": user_id,
            "product_id": product["_id"],
            "name": product["name"],
            "price": product["price"],
            "image": product["image"],
            "quantity": 1
        })

def remove_from_cart_db(user_id, product_id):
    cart_collection.delete_one({
        "user_id": user_id,
        "product_id": product_id
    })