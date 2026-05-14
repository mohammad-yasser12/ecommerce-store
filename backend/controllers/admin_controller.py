from flask import jsonify, request
from bson import ObjectId
from datetime import datetime

from config.db import (
    wishlist_collection,
    products_collection
)


# =========================
# WISHLIST STATS
# =========================
def get_wishlist_stats_controller():

    wishlist = list(wishlist_collection.find())

    stats = {}

    for item in wishlist:

        product_id = item.get("product_id")

        if not product_id:
            continue

        if product_id not in stats:
            stats[product_id] = 1
        else:
            stats[product_id] += 1

    result = []

    for product_id, count in stats.items():

        product = products_collection.find_one({
            "_id": ObjectId(product_id)
        })

        result.append({
            "product": {
                "id": product_id,
                "name": product["name"] if product else "Unknown"
            },
            "count": count
        })

    return jsonify(result), 200


# =========================
# UPDATE PRODUCT
# =========================
def update_product_controller(product_id):

    data = request.json

    existing_product = products_collection.find_one({
        "_id": ObjectId(product_id)
    })

    if not existing_product:
        return jsonify({
            "message": "Product not found"
        }), 404

    updated_data = {
        "name": data.get("name"),
        "brand": data.get("brand"),
        "price": float(data.get("price", 0)),
        "description": data.get("description"),
        "updatedAt": datetime.utcnow()
    }

    products_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": updated_data}
    )

    updated_product = products_collection.find_one({
        "_id": ObjectId(product_id)
    })

    updated_product["_id"] = str(updated_product["_id"])

    return jsonify(updated_product), 200


# =========================
# DELETE PRODUCT
# =========================
def delete_product_controller(product_id):

    existing_product = products_collection.find_one({
        "_id": ObjectId(product_id)
    })

    if not existing_product:
        return jsonify({
            "message": "Product not found"
        }), 404

    products_collection.delete_one({
        "_id": ObjectId(product_id)
    })

    return jsonify({
        "message": "Product deleted successfully"
    }), 200