from flask import Blueprint
from middleware.auth_middleware import admin_required

from controllers.admin_controller import (
    get_wishlist_stats_controller
)

from controllers.wishlist_controller import (
    get_all_wishlist_controller
)

admin_routes = Blueprint("admin_routes", __name__)

# 📊 Wishlist Stats
@admin_routes.route("/admin/wishlist-stats", methods=["GET"])
def wishlist_stats_route():

    auth = admin_required()

    if auth:
        return auth

    return get_wishlist_stats_controller()


# ❤️ All Wishlist Items
@admin_routes.route("/admin/wishlist", methods=["GET"])
def all_wishlist_route():

    auth = admin_required()

    if auth:
        return auth

    return get_all_wishlist_controller()


# 🧪 Admin Test
@admin_routes.route("/admin/test", methods=["GET"])
def admin_test():

    auth = admin_required()

    if auth:
        return auth

    return {"message": "Welcome Admin 🎉"}