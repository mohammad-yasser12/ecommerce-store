from flask import request, jsonify
from datetime import datetime
from bson import ObjectId
from config.db import promotions_collection
from config.db import promotions_collection, products_collection




def create_promotion_controller():
    data = request.json

    required_fields = [
        "title",
        "type",
        "value",
        "product_id",
        "start_date",
        "end_date"
    ]

    # ❌ Check missing fields
    missing_fields = [field for field in required_fields if not data.get(field)]

    if missing_fields:
        return jsonify({
            "message": "All fields are required",
            "missing_fields": missing_fields
        }), 400

    # ❌ Validate type
    if data["type"] not in ["percentage", "fixed"]:
        return jsonify({
            "message": "Invalid promotion type"
        }), 400

    # ❌ Validate value
    try:
        value = float(data["value"])
        if value <= 0:
            return jsonify({"message": "Value must be greater than 0"}), 400
    except:
        return jsonify({"message": "Invalid value format"}), 400

    # ❌ Validate dates
    try:
        start_date = datetime.strptime(data["start_date"], "%Y-%m-%d")
        end_date = datetime.strptime(data["end_date"], "%Y-%m-%d")

        if end_date < start_date:
            return jsonify({
                "message": "End date cannot be before start date"
            }), 400

    except:
        return jsonify({"message": "Invalid date format"}), 400

    # ✅ Create promotion
    promotion = {
        "title": data["title"],
        "type": data["type"],
        "value": value,
        "product_id": data["product_id"],
        "start_date": data["start_date"],
        "end_date": data["end_date"],
        "is_active": True,
        "createdAt": datetime.utcnow()
    }

    promotions_collection.insert_one(promotion)

    return jsonify({"message": "Promotion created successfully 🎉"}), 201



# def get_promotions_controller():
#     promotions = list(promotions_collection.find())

#     for p in promotions:
#         p["_id"] = str(p["_id"])

#         product = products_collection.find_one({
#             "_id": ObjectId(p["product_id"])
#         })

#         if product:
#             product["_id"] = str(product["_id"])
#             p["product"] = product   # ✅ THIS IS WHAT YOU NEED
#         else:
#             p["product"] = None

#     return jsonify(promotions), 200



def get_promotions_controller():

    promotions = list(promotions_collection.find())

    for p in promotions:

        p["_id"] = str(p["_id"])

        try:

            product = products_collection.find_one({
                "_id": ObjectId(p["product_id"])
            })

            if product:
                product["_id"] = str(product["_id"])
                p["product"] = product
            else:
                p["product"] = None

        except Exception as e:

            print("PRODUCT ERROR:", e)

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

def apply_promotion(product):

    price = product["price"]
    final_price = price
    discount = 0

    promo = promotions_collection.find_one({
        "product_id": str(product["_id"]),
        "is_active": True
    })

    if promo:
        if promo["type"] == "percentage":
            discount = (price * promo["value"]) / 100

        elif promo["type"] == "fixed":
            discount = promo["value"]

        final_price = price - discount

    product["discount"] = round(discount, 2)
    product["final_price"] = round(max(final_price, 0), 2)

    return product

def get_checkout_product_controller(product_id):

    product = products_collection.find_one({
        "_id": ObjectId(product_id)
    })

    if not product:
        return jsonify({"message": "Product not found"}), 404

    product["_id"] = str(product["_id"])

    # ✅ APPLY PROMOTION HERE
    product = apply_promotion(product)

    return jsonify(product), 200