from datetime import date, timedelta
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models import User, Quest, XPLog

progress_bp = Blueprint("progress", __name__, url_prefix="/api/progress")

DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


@progress_bp.get("")
@jwt_required()
def get_progress():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    quests_done = Quest.query.filter_by(user_id=user_id, status="COMPLETED").count()

    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())  # Monday
    logs = {
        log.log_date: log
        for log in XPLog.query.filter(
            XPLog.user_id == user_id,
            XPLog.log_date >= start_of_week,
            XPLog.log_date <= start_of_week + timedelta(days=6),
        ).all()
    }

    weekly_xp = []
    daily_quests = []
    total_gold_earned = 0
    for i, label in enumerate(DAY_LABELS):
        day = start_of_week + timedelta(days=i)
        log = logs.get(day)
        weekly_xp.append({"day": label, "xp": log.xp_earned if log else 0})
        daily_quests.append({"day": label, "quests": log.quests_done if log else 0})
        total_gold_earned += log.gold_earned if log else 0

    level_journey = [
        {"level": lvl, "completed": lvl < user.level, "current": lvl == user.level}
        for lvl in range(1, 21)
    ]

    return jsonify({
        "totalXp": _lifetime_xp(user),
        "questsDone": quests_done,
        "bestStreak": user.streak,
        "goldEarned": total_gold_earned,
        "weeklyXp": weekly_xp,
        "dailyQuests": daily_quests,
        "levelJourney": level_journey,
    })


def _lifetime_xp(user: User) -> int:
    """Approximate lifetime XP: xp banked in past levels + current xp."""
    # xp_to_next grows by 1.15x each level starting at 500
    total = user.xp
    xp_needed = 500
    for _ in range(1, user.level):
        total += xp_needed
        xp_needed = int(xp_needed * 1.15)
    return total
