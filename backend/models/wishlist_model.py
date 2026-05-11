from config.db import wishlist_collection
from bson import ObjectId

# 🔥 Get wishlist
def get_wishlist(user_id):
    return list(wishlist_collection.find({"user_id": user_id}))


# 🔥 Add item
def add_to_wishlist(user_id, product_id):
    wishlist_collection.insert_one({
        "user_id": user_id,
        "product_id": product_id
    })


# 🔥 Remove item
def remove_from_wishlist(user_id, product_id):
    wishlist_collection.delete_one({
        "user_id": user_id,
        "product_id": product_id
    })