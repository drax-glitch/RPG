from app.routes.auth import auth_bp
from app.routes.quests import quests_bp
from app.routes.character import character_bp
from app.routes.achievements import achievements_bp
from app.routes.shop import shop_bp
from app.routes.progress import progress_bp
from app.routes.settings import settings_bp


def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(quests_bp)
    app.register_blueprint(character_bp)
    app.register_blueprint(achievements_bp)
    app.register_blueprint(shop_bp)
    app.register_blueprint(progress_bp)
    app.register_blueprint(settings_bp)
