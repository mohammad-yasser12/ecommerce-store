from flask import jsonify
from bson import ObjectId

from config.db import (
    wishlist_collection,
    products_collection
)

def get_wishlist_stats_controller():

    wishlist = list(wishlist_collection.find())

    stats = {}

    # count products
    for item in wishlist:

        product_id = item.get("product_id")

        if not product_id:
            continue

        if product_id not in stats:
            stats[product_id] = 1
        else:
            stats[product_id] += 1

    result = []

    # fetch product info
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