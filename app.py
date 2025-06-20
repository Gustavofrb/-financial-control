from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
    db.init_app(app)

    # Importar e registrar blueprints
    from routes.auth import auth_bp
    from routes.contas import contas_bp
    from routes.usuarios import usuarios_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(contas_bp)
    app.register_blueprint(usuarios_bp)

    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
