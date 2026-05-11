# routes/cart_routes.py

from flask import Blueprint
from controllers.cart_controller import *

cart_routes = Blueprint("cart_routes", __name__)

cart_routes.route("/cart", methods=["GET"])(get_cart_controller)
cart_routes.route("/cart", methods=["POST"])(add_to_cart_controller)
cart_routes.route("/cart", methods=["DELETE"])(remove_from_cart_controller)
# routes
cart_routes.route("/cart/decrease", methods=["PUT"])(decrease_quantity_controller)