from flask import Blueprint
from controllers.user_controller import (
    create_user_controller,
    get_users_controller,
    delete_user_controller,
    block_user_controller
)

from middleware.auth_middleware import auth_required

user_routes = Blueprint("user_routes", __name__)


# ✅ Public
@user_routes.route("/user", methods=["POST"])
def create_user():
    return create_user_controller()


# 🔐 Protected (FIXED)
@user_routes.route("/users", methods=["GET"])
@auth_required
def get_users():
    return get_users_controller()


@user_routes.route("/user/<id>", methods=["DELETE"])
def delete_user(id):
    return delete_user_controller(id)


@user_routes.route("/user/block/<id>", methods=["PATCH"])
def block_user(id):
    return block_user_controller(id)