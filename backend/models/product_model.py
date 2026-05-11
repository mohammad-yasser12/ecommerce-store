from config.db import db

products_collection = db["products"]

def create_product(data):
    return products_collection.insert_one(data)

# ✅ FIXED FUNCTION
def get_products(sort_query=None):
    if sort_query:
        return list(products_collection.find().sort(sort_query))
    return list(products_collection.find())