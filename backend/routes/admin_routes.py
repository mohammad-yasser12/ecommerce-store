from flask import Blueprint

from middleware.admin_middleware import admin_required

from controllers.admin_controller import (
    get_wishlist_stats_controller
)

from controllers.wishlist_controller import (
    get_all_wishlist_controller
)

admin_routes = Blueprint("admin_routes", __name__)


# 📊 Wishlist Stats
@admin_routes.route("/admin/wishlist-stats", methods=["GET"])
@admin_required
def wishlist_stats_route():
    return get_wishlist_stats_controller()


# ❤️ All Wishlist Items
@admin_routes.route("/admin/wishlist", methods=["GET"])
@admin_required
def all_wishlist_route():
    return get_all_wishlist_controller()


# 🧪 Admin Test
@admin_routes.route("/admin/test", methods=["GET"])
@admin_required
def admin_test():
    return {"message": "Welcome Admin 🎉"}