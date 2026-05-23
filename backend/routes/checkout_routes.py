from flask import Blueprint

checkout_routes = Blueprint("checkout_routes", __name__)

@checkout_routes.route("/checkout/product/<product_id>", methods=["GET"])
@jwt_required()
def checkout_product(product_id):
    return get_checkout_product_controller(product_id)