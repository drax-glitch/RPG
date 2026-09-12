from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models import Quest, User
from app.services import apply_quest_reward

quests_bp = Blueprint("quests", __name__, url_prefix="/api/quests")


@quests_bp.get("")
@jwt_required()
def list_quests():
    user_id = get_jwt_identity()
    status = request.args.get("status")  # ACTIVE | COMPLETED | None
    category = request.args.get("category")

    query = Quest.query.filter_by(user_id=user_id)
    if status:
        query = query.filter_by(status=status)
    if category and category != "All":
        query = query.filter_by(category=category)

    quests = query.order_by(Quest.created_at.desc()).all()
    return jsonify([q.to_dict() for q in quests])


@quests_bp.post("")
@jwt_required()
def create_quest():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    if not data.get("title"):
        return jsonify({"error": "missing title"}), 400

    difficulty_xp = {"EASY": 60, "MEDIUM": 130, "HARD": 220}
    difficulty_gold = {"EASY": 15, "MEDIUM": 30, "HARD": 50}
    difficulty = (data.get("difficulty") or "EASY").upper()
    if difficulty not in difficulty_xp:
        difficulty = "EASY"

    quest = Quest(
        user_id=user_id,
        title=data["title"],
        category=data.get("category", "Work"),
        difficulty=difficulty,
        attribute=data.get("attribute", "Discipline"),
        xp_reward=data.get("xpReward") or difficulty_xp.get(difficulty, 60),
        gold_reward=data.get("goldReward") or difficulty_gold.get(difficulty, 15),
        due_label=data.get("dueLabel", "Today"),
    )
    db.session.add(quest)
    db.session.commit()
    return jsonify(quest.to_dict()), 201


@quests_bp.patch("/<int:quest_id>/complete")
@jwt_required()
def complete_quest(quest_id):
    user_id = get_jwt_identity()
    quest = Quest.query.filter_by(id=quest_id, user_id=user_id).first_or_404()
    user = User.query.get_or_404(user_id)

    if quest.status == "COMPLETED":
        return jsonify({"error": "quest already completed"}), 400

    quest.status = "COMPLETED"
    quest.completed_at = datetime.utcnow()
    apply_quest_reward(user, quest)

    db.session.commit()
    quests_done = Quest.query.filter_by(user_id=user_id, status="COMPLETED").count()
    return jsonify({"quest": quest.to_dict(), "user": user.to_dict(quests_done)})


@quests_bp.delete("/<int:quest_id>")
@jwt_required()
def delete_quest(quest_id):
    user_id = get_jwt_identity()
    quest = Quest.query.filter_by(id=quest_id, user_id=user_id).first_or_404()
    db.session.delete(quest)
    db.session.commit()
    return jsonify({"deleted": quest_id})
