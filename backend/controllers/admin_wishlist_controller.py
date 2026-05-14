from flask import jsonify
from bson import ObjectId

from config.db import (
    wishlist_collection,
    users_collection,
    products_collection
)

def get_wishlist_stats_controller():

    try:
        wishlist = list(wishlist_collection.find())

        result = []

        for w in wishlist:

            # 👤 Find user
            user = users_collection.find_one({
                "_id": ObjectId(w["user_id"])
            })

            # 📦 Find product
            product = products_collection.find_one({
                "_id": ObjectId(w["product_id"])
            })

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
        print("🔥 ERROR:", e)
        return jsonify({"error": str(e)}), 500

#     pipeline = [
#         # 1. convert string -> ObjectId
#         {
#             "$addFields": {
#                 "product_obj_id": {
#                     "$toObjectId": "$product_id"
#                 }
#             }
#         },

#         # 2. group by ObjectId
#         {
#             "$group": {
#                 "_id": "$product_obj_id",
#                 "count": {"$sum": 1}
#             }
#         },

#         # 3. join products
#         {
#             "$lookup": {
#                 "from": "products",
#                 "localField": "_id",
#                 "foreignField": "_id",
#                 "as": "product"
#             }
#         },

#         # 4. flatten
#         {
#             "$unwind": "$product"
#         },

#         # 5. clean output
#         {
#             "$project": {
#                 "_id": 0,
#                 "product": {
#                     "id": {"$toString": "$product._id"},
#                     "name": "$product.name"
#                 },
#                 "count": 1
#             }
#         }
#     ]

#     result = list(wishlist_collection.aggregate(pipeline))

#     return jsonify(result), 200