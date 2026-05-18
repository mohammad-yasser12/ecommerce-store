from flask import Flask
from routes.auth_routes import auth_routes
from routes.user_routes import user_routes
from routes.product_routes import product_routes
from routes.cart_routes import cart_routes
from routes.wishlist_routes import wishlist_routes
from routes.admin_routes import admin_routes
from routes.payment_routes import payment_routes
from routes.promotion_routes import promotion_routes




from flask_cors import CORS
import os
from flask import send_from_directory
from routes.order_routes import order_routes
from datetime import timedelta






from flask_jwt_extended import JWTManager
from utils.token_blacklist import blacklist   # ✅ use utils file

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "supersecretkey"

jwt = JWTManager(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

CORS(app)
# ✅ JWT blacklist check (CORRECT PLACE)
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return jwt_payload["jti"] in blacklist


# ✅ routes
app.register_blueprint(user_routes, url_prefix="/api")
app.register_blueprint(product_routes, url_prefix="/api")
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(order_routes, url_prefix="/api")
app.register_blueprint(cart_routes, url_prefix="/api")
app.register_blueprint(wishlist_routes, url_prefix="/api")
app.register_blueprint(admin_routes, url_prefix="/api")
app.register_blueprint(promotion_routes, url_prefix="/api")



app.register_blueprint(payment_routes, url_prefix="/api")



@app.route("/uploads/<filename>")
def get_image(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# ✅ home route
@app.route("/")
def home():
    return "E-commerce API running 🚀"


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)