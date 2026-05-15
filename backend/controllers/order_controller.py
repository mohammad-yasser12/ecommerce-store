from flask import request, jsonify
from models.order_model import create_order, get_orders_by_user
from flask_jwt_extended import get_jwt_identity
from config.db import orders_collection
from flask import jsonify, request
from math import ceil


# ✅ CREATE ORDER



from flask import request, jsonify

from datetime import datetime



from config.razorpay_config import client
from models.order_model import create_order, get_orders_by_user


def get_paid_orders():
    orders = list(
        orders_collection.find({"status": "paid"}).sort("created_at", -1)
    )

    for o in orders:
        o["_id"] = str(o["_id"])

    return jsonify(orders), 200



# def create_razorpay_order():
#     try:
#         user_id = get_jwt_identity()
#         data = request.json

#         items = data.get("items", [])
#         total = data.get("total")

#         if not items or total is None:
#             return jsonify({"message": "Invalid data"}), 400

#         # Create Razorpay order
#         razorpay_order = client.order.create({
#             "amount": int(total) * 100,
#             "currency": "INR",
#             "payment_capture": 1
#         })

#         # Save in DB
#         order_data = {
#             "user_id": user_id,
#             "items": items,
#             "total": total,
#             "status": "pending",
#             "razorpay_order_id": razorpay_order["id"],
#             "created_at": datetime.utcnow()
#         }

#         db_result = orders_collection.insert_one(order_data)

#         return jsonify({
#             "order_id": razorpay_order["id"],
#             "db_id": str(db_result.inserted_id),
#             "amount": razorpay_order["amount"]
#         }), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

def create_order_controller():
    try:
        data = request.json

        items = data.get("items", [])

        if not items:
            return jsonify({"message": "Invalid order"}), 400

        user_id = get_jwt_identity()

        # 🔥 CALCULATE TOTAL SAFELY
        total_amount = 0

        clean_items = []
        for item in items:
            price = float(item.get("price", 0))
            qty = int(item.get("quantity", 1))

            total_amount += price * qty

            clean_items.append({
                "product_id": item.get("_id"),
                "name": item.get("name"),
                "price": price,
                "quantity": qty,
                "image": item.get("image"),
            })

        # 💳 CREATE RAZORPAY ORDER
        razorpay_order = client.order.create({
            "amount": int(total_amount * 100),
            "currency": "INR",
            "payment_capture": 1
        })

        print("RAZORPAY RESPONSE:", razorpay_order)

        order_id = razorpay_order.get("id")
        amount = razorpay_order.get("amount")
        currency = razorpay_order.get("currency")

        # 🚨 SAFE CHECK
        if not order_id:
            return jsonify({
                "error": "Razorpay order creation failed",
                "raw": razorpay_order
            }), 500

        # 💾 SAVE ORDER IN DB (PENDING)
        order_data = {
            "user_id": user_id,
            "items": clean_items,
            "total": total_amount,
            "status": "pending",
            "razorpay_order_id": order_id,
            "created_at": datetime.utcnow()
        }

        create_order(order_data)

        return jsonify({
            "order_id": order_id,
            "amount": amount,
            "currency": currency
        }), 200

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"message": "Server error"}), 500


def get_orders_controller():
    user_id = get_jwt_identity()

    orders = get_orders_by_user(user_id)

    # convert ObjectId
    for order in orders:
        order["_id"] = str(order["_id"])

    return jsonify(orders), 200

# controllers/order_controller.py



def get_all_orders_controller():
    try:
        user_id = request.args.get("user_id")
        search = request.args.get("search")
        min_price = request.args.get("minPrice")
        max_price = request.args.get("maxPrice")
        sort = request.args.get("sort")

        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        skip = (page - 1) * limit

        query = {}

        # USER FILTER
        if user_id:
            query["user_id"] = user_id

        # PRICE FILTER
        if min_price or max_price:
            query["total"] = {}
            if min_price:
                query["total"]["$gte"] = float(min_price)
            if max_price:
                query["total"]["$lte"] = float(max_price)

        # SEARCH
        if search:
            query["user_id"] = {"$regex": search, "$options": "i"}

        # SORT
        sort_query = None
        if sort == "total_asc":
            sort_query = [("total", 1)]
        elif sort == "total_desc":
            sort_query = [("total", -1)]

        # TOTAL COUNT (IMPORTANT FOR PAGINATION)
        total = orders_collection.count_documents(query)

        cursor = orders_collection.find(query)

        if sort_query:
            cursor = cursor.sort(sort_query)

        # PAGINATION APPLY
        cursor = cursor.skip(skip).limit(limit)

        orders = list(cursor)

        for order in orders:
            order["_id"] = str(order["_id"])
            order["user_id"] = str(order.get("user_id", "N/A"))

        return jsonify({
            "orders": orders,
            "page": page,
            "pages": ceil(total / limit) if limit else 1,
            "total": total
        }), 200

    except Exception as e:
        print("🔥 ERROR:", e)
        return jsonify({"error": str(e)}), 500
    
   