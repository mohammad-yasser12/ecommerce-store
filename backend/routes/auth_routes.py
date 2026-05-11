from flask import Blueprint
from controllers.auth_controller import signup_controller, login_controller
from controllers.auth_controller import logout_controller
from flask_jwt_extended import jwt_required

auth_routes = Blueprint("auth_routes", __name__)

auth_routes.route("/signup", methods=["POST"])(signup_controller)
auth_routes.route("/login", methods=["POST"])(login_controller)
auth_routes.route("/logout", methods=["POST"])(jwt_required()(logout_controller))
