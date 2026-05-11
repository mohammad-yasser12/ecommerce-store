from config.db import users_collection

# ✅ CREATE USER (with default role)
def create_user(data):
    # set default role if not provided
    if "role" not in data:
        data["role"] = "user"

    return users_collection.insert_one(data)


# ✅ FIND BY EMAIL
def find_user_by_email(email):
    return users_collection.find_one({"email": email})


# ✅ FIND BY USERNAME
def find_user_by_username(username):
    return users_collection.find_one({"username": username})


# ✅ GET ALL USERS (hide password)
def get_users():
    return list(users_collection.find({"role": "user"}, {"password": 0}))
    return list(users_collection.find({}, {"password": 0}))

def get_normal_users():
    return list(users_collection.find({"role": "user"}, {"password": 0}))