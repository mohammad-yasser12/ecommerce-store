from flask import Blueprint
from controllers.product_controller import create_product_controller, get_products_controller

product_routes = Blueprint("product_routes", __name__)

product_routes.route("/product", methods=["POST"])(create_product_controller)
product_routes.route("/products", methods=["GET"])(get_products_controller)