from datetime import datetime, date
from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(80), nullable=False)
    title = db.Column(db.String(80), default="Adventurer")
    avatar = db.Column(db.String(10), default="🧙")
    level = db.Column(db.Integer, default=1)
    xp = db.Column(db.Integer, default=0)
    xp_to_next = db.Column(db.Integer, default=500)
    gold = db.Column(db.Integer, default=0)
    streak = db.Column(db.Integer, default=0)
    last_active_date = db.Column(db.Date, nullable=True)
    daily_goal = db.Column(db.Integer, default=5)
    quest_reminders = db.Column(db.Boolean, default=True)
    streak_alerts = db.Column(db.Boolean, default=True)
    levelup_celebrations = db.Column(db.Boolean, default=True)
    achievement_unlocks = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    attributes = db.relationship("Attributes", backref="user", uselist=False,
                                  cascade="all, delete-orphan")
    quests = db.relationship("Quest", backref="user", cascade="all, delete-orphan")
    inventory = db.relationship("UserInventory", backref="user", cascade="all, delete-orphan")

    def to_dict(self, quests_done=None):
        return {
            "id": self.id,
            "username": self.username,
            "displayName": self.display_name,
            "title": self.title,
            "avatar": self.avatar,
            "level": self.level,
            "xp": self.xp,
            "xpToNext": self.xp_to_next,
            "gold": self.gold,
            "streak": self.streak,
            "dailyGoal": self.daily_goal,
            "questsDone": quests_done if quests_done is not None else 0,
            "settings": {
                "questReminders": self.quest_reminders,
                "streakAlerts": self.streak_alerts,
                "levelUpCelebrations": self.levelup_celebrations,
                "achievementUnlocks": self.achievement_unlocks,
            },
        }


class Attributes(db.Model):
    __tablename__ = "attributes"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    strength = db.Column(db.Integer, default=0)
    intelligence = db.Column(db.Integer, default=0)
    discipline = db.Column(db.Integer, default=0)
    creativity = db.Column(db.Integer, default=0)
    vitality = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "strength": self.strength,
            "intelligence": self.intelligence,
            "discipline": self.discipline,
            "creativity": self.creativity,
            "vitality": self.vitality,
        }

    def bump(self, attribute_name, amount=1):
        key = attribute_name.lower()
        if hasattr(self, key):
            setattr(self, key, min(100, getattr(self, key) + amount))


class Quest(db.Model):
    __tablename__ = "quests"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(30), nullable=False)
    difficulty = db.Column(db.Enum("EASY", "MEDIUM", "HARD", name="difficulty_enum"),
                            default="EASY")
    attribute = db.Column(db.String(30), nullable=False)
    xp_reward = db.Column(db.Integer, default=50)
    gold_reward = db.Column(db.Integer, default=10)
    due_label = db.Column(db.String(30), default="Today")
    status = db.Column(db.Enum("ACTIVE", "COMPLETED", name="status_enum"), default="ACTIVE")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "difficulty": self.difficulty,
            "attribute": self.attribute,
            "xpReward": self.xp_reward,
            "goldReward": self.gold_reward,
            "dueLabel": self.due_label,
            "status": self.status,
        }


class Achievement(db.Model):
    __tablename__ = "achievements"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    xp_reward = db.Column(db.Integer, default=100)
    icon = db.Column(db.String(10), default="🏆")


class UserAchievement(db.Model):
    __tablename__ = "user_achievements"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    achievement_id = db.Column(db.Integer, db.ForeignKey("achievements.id"), nullable=False)
    unlocked_at = db.Column(db.DateTime, default=datetime.utcnow)


class ShopItem(db.Model):
    __tablename__ = "shop_items"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    category = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(200))
    price = db.Column(db.Integer, nullable=False)
    icon = db.Column(db.String(10), default="✨")

    def to_dict(self, owned=False):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "price": self.price,
            "icon": self.icon,
            "owned": owned,
        }


class UserInventory(db.Model):
    __tablename__ = "user_inventory"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey("shop_items.id"), nullable=False)
    equipped = db.Column(db.Boolean, default=False)
    owned_at = db.Column(db.DateTime, default=datetime.utcnow)


class XPLog(db.Model):
    __tablename__ = "xp_log"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    log_date = db.Column(db.Date, default=date.today)
    xp_earned = db.Column(db.Integer, default=0)
    quests_done = db.Column(db.Integer, default=0)
    gold_earned = db.Column(db.Integer, default=0)
