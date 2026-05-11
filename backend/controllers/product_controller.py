import os
import time
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename
from models.product_model import create_product, get_products


# ✅ GET PRODUCTS


def get_products_controller():
    try:
        sort = request.args.get("sort")

        # default no sorting
        sort_query = None

        # 👉 price ascending
        if sort == "price_asc":
            sort_query = [("price", 1)]

        # 👉 price descending
        elif sort == "price_desc":
            sort_query = [("price", -1)]

        # fetch products
        products = get_products(sort_query)

        for product in products:
            product["_id"] = str(product["_id"])

        return jsonify(products), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ CREATE PRODUCT
def create_product_controller():
    name = request.form.get("name")
    price = request.form.get("price")
    description = request.form.get("description")
    file = request.files.get("image")

    if not name or not price:
        return jsonify({"message": "Name and price required"}), 400

    try:
        price = float(price)
    except:
        return jsonify({"message": "Invalid price"}), 400

    image_path = None

    if file:
        filename = f"{int(time.time())}_{secure_filename(file.filename)}"
        filepath = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)
        image_path = f"/uploads/{filename}"

    create_product({
        "name": name,
        "price": price,
        "description": description,
        "image": image_path
    })

    return jsonify({"message": "Product created"}), 201

