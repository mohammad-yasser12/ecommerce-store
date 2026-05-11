from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.payment_controller import (
    create_payment_order_controller,
    verify_payment_controller
)

payment_routes = Blueprint("payment_routes", __name__)

# 💳 Create order (frontend calls this before Razorpay popup)
payment_routes.route("/payment/create-order", methods=["POST"])(
    jwt_required()(create_payment_order_controller)
)

# 🔐 Verify payment (call after success)
payment_routes.route("/payment/verify", methods=["POST"])(
    jwt_required()(verify_payment_controller)
)