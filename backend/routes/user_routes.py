from flask import Blueprint
from controllers.user_controller import (
    create_user_controller,
    get_users_controller,
    delete_user_controller   # ✅ ADD THIS
)
from middleware.auth_middleware import auth_required
from controllers.user_controller import block_user_controller

user_routes = Blueprint("user_routes", __name__)

# ✅ Public route (optional)
user_routes.route("/user", methods=["POST"])(create_user_controller)
user_routes.route("/users", methods=["GET"])(get_users_controller)
user_routes.route("/user/<id>", methods=["DELETE"])(delete_user_controller)
user_routes.route("/user/block/<id>", methods=["PATCH"])(block_user_controller)

# 🔐 Protected route
@user_routes.route("/users", methods=["GET"])
def get_users():
    auth = auth_required()
    if auth:
        return auth

    return get_users_controller()