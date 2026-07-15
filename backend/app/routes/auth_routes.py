from flask import Blueprint, request, jsonify
from app.models.user_model import users_collection
from app.utils.jwt_handler import generate_token
import bcrypt

auth_bp = Blueprint("auth", __name__)

# SIGNUP
@auth_bp.route("/signup", methods=["POST"])
def signup():

    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    existing_user = users_collection.find_one({"email": email})

    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    user = {
        "name": name,
        "email": email,
        "password": hashed_password
    }

    result = users_collection.insert_one(user)

    token = generate_token(result.inserted_id)

    return jsonify({
        "message": "Signup successful",
        "token": token
    })


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"message": "User not found"}), 404

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"]
    ):
        return jsonify({"message": "Invalid password"}), 401

    token = generate_token(user["_id"])

    return jsonify({
        "message": "Login successful",
        "token": token
    })