from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models import ShopItem, UserInventory, User

shop_bp = Blueprint("shop", __name__, url_prefix="/api/shop")


@shop_bp.get("")
@jwt_required()
def list_items():
    user_id = get_jwt_identity()
    category = request.args.get("category")

    query = ShopItem.query
    if category and category != "All":
        query = query.filter_by(category=category)
    items = query.all()

    owned_ids = {
        inv.item_id for inv in UserInventory.query.filter_by(user_id=user_id).all()
    }
    return jsonify([item.to_dict(owned=item.id in owned_ids) for item in items])


@shop_bp.post("/<int:item_id>/buy")
@jwt_required()
def buy_item(item_id):
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    item = ShopItem.query.get_or_404(item_id)

    already_owned = UserInventory.query.filter_by(user_id=user_id, item_id=item_id).first()
    if already_owned:
        return jsonify({"error": "item already owned"}), 400

    if user.gold < item.price:
        return jsonify({"error": "not enough gold"}), 400

    user.gold -= item.price
    db.session.add(UserInventory(user_id=user_id, item_id=item_id))
    db.session.commit()

    return jsonify({"item": item.to_dict(owned=True), "goldRemaining": user.gold})
