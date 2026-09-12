from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models import User, Attributes, Quest

settings_bp = Blueprint("settings", __name__, url_prefix="/api/settings")

PROFILE_FIELDS = {"displayName": "display_name", "title": "title", "dailyGoal": "daily_goal"}
NOTIF_FIELDS = {
    "questReminders": "quest_reminders",
    "streakAlerts": "streak_alerts",
    "levelUpCelebrations": "levelup_celebrations",
    "achievementUnlocks": "achievement_unlocks",
}


@settings_bp.patch("")
@jwt_required()
def update_settings():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    for incoming, column in {**PROFILE_FIELDS, **NOTIF_FIELDS}.items():
        if incoming in data:
            setattr(user, column, data[incoming])

    db.session.commit()
    return jsonify(user.to_dict())


@settings_bp.post("/reset-streak")
@jwt_required()
def reset_streak():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    user.streak = 0
    user.last_active_date = None
    db.session.commit()
    return jsonify({"streak": user.streak})


@settings_bp.post("/reset-character")
@jwt_required()
def reset_character():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    user.level = 1
    user.xp = 0
    user.xp_to_next = 500
    user.gold = 100
    user.streak = 0
    user.last_active_date = None

    if user.attributes:
        user.attributes.strength = 0
        user.attributes.intelligence = 0
        user.attributes.discipline = 0
        user.attributes.creativity = 0
        user.attributes.vitality = 0

    Quest.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify(user.to_dict(quests_done=0))
