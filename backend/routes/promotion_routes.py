from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.promotion_controller import (
    create_promotion_controller,
    get_promotions_controller,
    get_active_promotions_controller
)

promotion_routes = Blueprint("promotion_routes", __name__)

# =========================
# ADMIN ROUTES
# =========================

@promotion_routes.route("/promotions", methods=["POST"])
@jwt_required()
def create_promotion():
    return create_promotion_controller()


@promotion_routes.route("/promotions", methods=["GET"])
@jwt_required()
def get_promotions():
    return get_promotions_controller()


# =========================
# USER ROUTES
# =========================

@promotion_routes.route("/promotions/active", methods=["GET"])
def get_active_promotions():
    return get_active_promotions_controller()