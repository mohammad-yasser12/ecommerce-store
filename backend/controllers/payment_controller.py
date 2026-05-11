from flask import request, jsonify
from config.razorpay_config import client
from flask_jwt_extended import get_jwt_identity

# 💳 Create Razorpay Order



def create_payment_order_controller():
    try:
        data = request.json
        amount = int(data["amount"])

        order = client.order.create({
            "amount": amount * 100,  # paise
            "currency": "INR",
            "payment_capture": 1
        })

        return jsonify(order), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🔐 OPTIONAL: verify payment (important for real apps)
def verify_payment_controller():
    try:
        data = request.json

        params_dict = {
            "razorpay_order_id": data.get("razorpay_order_id"),
            "razorpay_payment_id": data.get("razorpay_payment_id"),
            "razorpay_signature": data.get("razorpay_signature"),
        }

        client.utility.verify_payment_signature(params_dict)

        return jsonify({"message": "Payment verified successfully"}), 200

    except Exception as e:
        return jsonify({"message": "Payment verification failed", "error": str(e)}), 400