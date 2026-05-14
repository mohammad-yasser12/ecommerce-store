from flask import Blueprint

from controllers.product_controller import (
    create_product_controller,
    get_categories_controller,
    get_products_controller
)

from controllers.admin_controller import (
    update_product_controller,
    delete_product_controller
)

from middleware.admin_middleware import admin_required

product_routes = Blueprint("product_routes", __name__)


# CREATE PRODUCT
product_routes.route(
    "/product",
    methods=["POST"]
)(create_product_controller)


# GET PRODUCTS
product_routes.route(
    "/products",
    methods=["GET"]
)(get_products_controller)


# GET CATEGORIES
product_routes.route(
    "/products/categories",
    methods=["GET"]
)(
    get_categories_controller
)


# ✏️ UPDATE PRODUCT
@product_routes.route(
    "/admin/product/<product_id>",
    methods=["PUT"]
)
@admin_required
def update_product(product_id):
    return update_product_controller(product_id)


# 🗑️ DELETE PRODUCT
@product_routes.route(
    "/admin/product/<product_id>",
    methods=["DELETE"]
)
@admin_required
def delete_product(product_id):
    return delete_product_controller(product_id)