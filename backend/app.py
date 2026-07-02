import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

from models.database import db
from controllers.usuario_controller import usuario_controller


def create_app():
    load_dotenv()

    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:@localhost/agrorisk"
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    app.register_blueprint(usuario_controller)

    @app.get("/")
    def home():
        return jsonify({
            "mensagem": "API AgroRisk funcionando.",
            "rotas": {
                "listar_usuarios": "GET /usuarios",
                "buscar_usuario": "GET /usuarios/<id>",
                "criar_usuario": "POST /usuarios",
                "atualizar_usuario": "PUT /usuarios/<id>",
                "deletar_usuario": "DELETE /usuarios/<id>"
            }
        })

    with app.app_context():
        db.create_all()

    return app


app = create_app()


if __name__ == "__main__":
    debug = os.getenv("FLASK_DEBUG", "True") == "True"

    app.run(
        debug=debug,
        host="0.0.0.0",
        port=5000
    )