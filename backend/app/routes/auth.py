import bcrypt
from datetime import date
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from app.extensions import db
from app.models import User, Attributes, Quest

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    display_name = data.get("displayName", username)

    if not username or not email or not password:
        return jsonify({"error": "username, email and password are required"}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "username or email already taken"}), 409

    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    user = User(
        username=username,
        email=email,
        password_hash=password_hash,
        display_name=display_name,
        title="Adventurer",
        avatar="🧙",
        gold=100,
        last_active_date=date.today(),
    )
    db.session.add(user)
    db.session.flush()  # get user.id before commit

    db.session.add(Attributes(user_id=user.id))
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    identifier = data.get("username") or data.get("email") or ""
    password = data.get("password", "")

    user = User.query.filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

    if not user or not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return jsonify({"error": "invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    quests_done = Quest.query.filter_by(user_id=user.id, status="COMPLETED").count()
    return jsonify({"token": token, "user": user.to_dict(quests_done)})


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    quests_done = Quest.query.filter_by(user_id=user.id, status="COMPLETED").count()
    return jsonify(user.to_dict(quests_done))
