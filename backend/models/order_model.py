from config.db import orders_collection

# ✅ CREATE ORDER
def create_order(data):
    return orders_collection.insert_one(data)

# ✅ GET ORDERS BY USER
def get_orders_by_user(user_id):
    return list(orders_collection.find({"user_id": user_id}))