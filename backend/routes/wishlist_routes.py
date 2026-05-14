from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.wishlist_controller import (
    get_wishlist_controller,
    add_to_wishlist_controller,
    toggle_wishlist_controller,
    remove_from_wishlist_controller
)

wishlist_routes = Blueprint("wishlist_routes", __name__)

# 👤 USER WISHLIST
wishlist_routes.route("/wishlist", methods=["GET"])(
    jwt_required()(get_wishlist_controller)
)

wishlist_routes.route("/wishlist", methods=["POST"])(
    jwt_required()(add_to_wishlist_controller)
)

@wishlist_routes.route("/wishlist/<product_id>", methods=["DELETE"])
@jwt_required()
def remove_from_wishlist_route(product_id):
    return remove_from_wishlist_controller(product_id)

wishlist_routes.route("/wishlist/toggle", methods=["POST"])(
    jwt_required()(toggle_wishlist_controller)
)