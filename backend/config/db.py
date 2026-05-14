from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["ecommerce_app"]

users_collection = db["users"]
products_collection = db["products"]
orders_collection = db["orders"]
cart_collection = db["cart"]
wishlist_collection = db["wishlist"]
promotions_collection = db["promotions"]
