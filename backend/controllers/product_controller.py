import os
import time
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename
from models.product_model import create_product, get_products
from config.db import products_collection
from config.db import promotions_collection


from flask import Blueprint, jsonify


product = Blueprint("product", __name__)

# ✅ GET PRODUCTS



def get_products_controller():
    try:
        search = request.args.get("search")
        category = request.args.get("category")
        sort = request.args.get("sort")

        query = {}

        # 🔍 SEARCH (name + brand)
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"brand": {"$regex": search, "$options": "i"}}
            ]

        # 📦 CATEGORY FILTER
        if category and category != "All":
            query["category"] = {
                "$regex": f"^{category}$",
                "$options": "i"
            }

        # 📊 SORT
        sort_query = None

        if sort == "price_asc":
            sort_query = [("price", 1)]

        elif sort == "price_desc":
            sort_query = [("price", -1)]

        # 🔥 FETCH
        products = get_products(query, sort_query)

        for product in products:
            product["_id"] = str(product["_id"])

        return jsonify(products), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# ✅ CREATE PRODUCT
def create_product_controller():

    name = request.form.get("name")
    price = request.form.get("price")
    category = request.form.get("category")
    brand = request.form.get("brand")   # ✅ NEW FIELD
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
        "category": category,
        "brand": brand,   # ✅ SAVE BRAND
        "description": description,
        "image": image_path
    })

    return jsonify({"message": "Product created"}), 201

# ✅ GET UNIQUE CATEGORIES
def get_categories_controller():
    try:
        categories = products_collection.distinct("category")

        clean = set()

        for c in categories:
            if c:
                clean.add(c.strip().lower())   # remove spaces + normalize

        return jsonify(list(clean)), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


def apply_promotion(product):

    product["final_price"] = product["price"]

    promo = promotions_collection.find_one({
        "product_id": str(product["_id"]),
        "is_active": True
    })

    if promo:
        if promo["type"] == "percentage":
            discount = product["price"] * promo["value"] / 100
            product["final_price"] = round(product["price"] - discount, 2)

        elif promo["type"] == "fixed":
            product["final_price"] = product["price"] - promo["value"]

    return product



def get_products_by_category_controller(category):
    try:
        products = list(products_collection.find({
            "category": category
        }))

        for p in products:
            p["_id"] = str(p["_id"])

        return products   # ONLY return data

    except Exception as e:
        print("Error:", e)
        return []