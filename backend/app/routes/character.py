from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models import User, Quest, UserInventory, ShopItem

character_bp = Blueprint("character", __name__, url_prefix="/api/character")


@character_bp.get("")
@jwt_required()
def get_character():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    quests_done = Quest.query.filter_by(user_id=user_id, status="COMPLETED").count()

    equipped_rows = (
        UserInventory.query.join(ShopItem)
        .filter(UserInventory.user_id == user_id, UserInventory.equipped.is_(True))
        .all()
    )
    equipped = [
        {"category": row.item.category, "name": row.item.name, "icon": row.item.icon}
        for row in equipped_rows
    ]

    return jsonify({
        "user": user.to_dict(quests_done),
        "attributes": user.attributes.to_dict() if user.attributes else {},
        "equipped": equipped,
    })
