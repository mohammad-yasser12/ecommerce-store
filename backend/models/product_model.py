from config.db import db

products_collection = db["products"]

# ✅ CREATE PRODUCT
def create_product(data):
    return products_collection.insert_one(data)

# ✅ GET PRODUCTS
def get_products(query={}, sort_query=None):
    if sort_query:
        return list(products_collection.find(query).sort(sort_query))
    return list(products_collection.find(query))