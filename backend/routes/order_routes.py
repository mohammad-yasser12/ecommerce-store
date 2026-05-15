from flask import Blueprint
from controllers.order_controller import (
    create_order_controller,
    get_all_orders_controller,
    get_orders_controller,
    get_paid_orders
)
from flask_jwt_extended import jwt_required

order_routes = Blueprint("order_routes", __name__)

# 🔥 CREATE ORDER
order_routes.route("/orders", methods=["POST"])(
    jwt_required()(create_order_controller)
)

# 🔥 GET ORDERS
order_routes.route("/orders", methods=["GET"])(
    jwt_required()(get_orders_controller)
)

order_routes.route("/admin/orders", methods=["GET"])(get_all_orders_controller)

@order_routes.route("/orders/paid", methods=["GET"])
@jwt_required()
def paid_orders():
    return get_paid_orders()