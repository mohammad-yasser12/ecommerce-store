from flask import request, jsonify
from config.db import orders_collection
from datetime import datetime
import hmac
import hashlib
import os
from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from config.razorpay_config import client

from datetime import datetime



# =========================
# VERIFY PAYMENT (FIXED)
# =========================

def verify_payment_controller():
    try:
        data = request.json

        params = {
            "razorpay_order_id": data["razorpay_order_id"],
            "razorpay_payment_id": data["razorpay_payment_id"],
            "razorpay_signature": data["razorpay_signature"],
        }

        client.utility.verify_payment_signature(params)

        orders_collection.update_one(
            {"razorpay_order_id": data["razorpay_order_id"]},
            {"$set": {"status": "paid"}}
        )

        return jsonify({"message": "Payment success"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    
    
def create_payment_order_controller():
    try:
        data = request.json
        print("DATA:", data)

        items = data.get("items", [])

        if not items:
            return jsonify({"message": "Items missing"}), 400

        # 🔥 CALCULATE TOTAL SAFELY (FIXES YOUR BUG)
        total_amount = 0

        for item in items:
            price = float(item.get("price", 0))   # FIX string issue
            qty = int(item.get("quantity", 1))

            total_amount += price * qty

        print("CALCULATED TOTAL:", total_amount)

        if total_amount <= 0:
            return jsonify({"message": "Invalid total"}), 400

        # 💳 CREATE RAZORPAY ORDER
        razorpay_order = client.order.create({
            "amount": int(total_amount * 100),
            "currency": "INR",
            "payment_capture": 1
        })

        print("RAZORPAY RESPONSE:", razorpay_order)

        return jsonify({
            "order_id": razorpay_order.get("id"),
            "amount": razorpay_order.get("amount"),
            "currency": razorpay_order.get("currency")
        }), 200

    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500