from flask import request, jsonify
from datetime import datetime
from bson import ObjectId
from config.db import promotions_collection
from config.db import promotions_collection, products_collection



def create_promotion_controller():
    data = request.json

    promotion = {
        "title": data["title"],
        "type": data["type"],  # percentage / fixed
        "value": float(data["value"]),
        "product_id": data.get("product_id"),
        "start_date": data["start_date"],
        "end_date": data["end_date"],
        "is_active": True,
        "createdAt": datetime.utcnow()
    }

    promotions_collection.insert_one(promotion)

    return jsonify({"message": "Promotion created"}), 201



def get_promotions_controller():
    promotions = list(promotions_collection.find())

    for p in promotions:
        p["_id"] = str(p["_id"])

        product = products_collection.find_one({
            "_id": ObjectId(p["product_id"])
        })

        if product:
            product["_id"] = str(product["_id"])
            p["product"] = product   # ✅ THIS IS WHAT YOU NEED
        else:
            p["product"] = None

    return jsonify(promotions), 200

# GET ACTIVE PROMOTIONS (USER SIDE)
def get_active_promotions_controller():
    promotions = list(promotions_collection.find({"is_active": True}))

    for p in promotions:
        p["_id"] = str(p["_id"])

    return jsonify(promotions), 200


def get_active_promotions():
    promotions = list(
        promotions_collection.find({"is_active": True})
    )

    result = []

    for promo in promotions:
        product = products_collection.find_one(
            {"_id": ObjectId(promo["product_id"])},
            {"name": 1, "price": 1, "image": 1}
        )

        if not product:
            continue

        result.append({
            "_id": str(promo["_id"]),
            "title": promo["title"],
            "discount": promo["value"],
            "type": promo["type"],
            "product": {
                "id": str(product["_id"]),
                "name": product["name"],
                "price": product["price"],
                "image": product["image"],
            }
        })

    return jsonify(result), 200