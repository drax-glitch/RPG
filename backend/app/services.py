from datetime import date, timedelta
from app.extensions import db
from app.models import User, Quest, Achievement, UserAchievement, XPLog


def apply_quest_reward(user: User, quest: Quest):
    """Apply XP/gold/attribute/streak/level effects of completing a quest."""
    user.xp += quest.xp_reward
    user.gold += quest.gold_reward

    if user.attributes:
        user.attributes.bump(quest.attribute, amount=max(1, quest.xp_reward // 20))

    # level up loop (handles multiple level-ups from one big quest)
    while user.xp >= user.xp_to_next:
        user.xp -= user.xp_to_next
        user.level += 1
        user.xp_to_next = int(user.xp_to_next * 1.15)

    _update_streak(user)
    _log_daily_xp(user, quest.xp_reward, quest.gold_reward)
    check_achievements(user)


def _update_streak(user: User):
    today = date.today()
    if user.last_active_date == today:
        pass  # already counted today
    elif user.last_active_date == today - timedelta(days=1):
        user.streak += 1
        user.last_active_date = today
    else:
        user.streak = 1
        user.last_active_date = today


def _log_daily_xp(user: User, xp_earned: int, gold_earned: int):
    today = date.today()
    row = XPLog.query.filter_by(user_id=user.id, log_date=today).first()
    if not row:
        row = XPLog(user_id=user.id, log_date=today, xp_earned=0, quests_done=0, gold_earned=0)
        db.session.add(row)
    row.xp_earned += xp_earned
    row.quests_done += 1
    row.gold_earned += gold_earned


def check_achievements(user: User):
    """Unlock any achievements the user newly qualifies for."""
    unlocked_codes = {
        ua.achievement_id
        for ua in UserAchievement.query.filter_by(user_id=user.id).all()
    }
    completed_count = Quest.query.filter_by(user_id=user.id, status="COMPLETED").count()

    conditions = {
        "FIRST_QUEST": completed_count >= 1,
        "SEVEN_DAY_STREAK": user.streak >= 7,
        "THIRTY_DAY_STREAK": user.streak >= 30,
        "SCHOLAR": user.attributes and user.attributes.intelligence >= 50,
        "IRONCLAD": user.attributes and user.attributes.strength >= 80,
        "CENTURY_WARRIOR": completed_count >= 100,
        "HIGH_KING": user.level >= 25,
        "HOARDER": user.gold >= 5000,
    }

    for code, met in conditions.items():
        if not met:
            continue
        achievement = Achievement.query.filter_by(code=code).first()
        if achievement and achievement.id not in unlocked_codes:
            db.session.add(UserAchievement(user_id=user.id, achievement_id=achievement.id))
            user.xp += achievement.xp_reward
