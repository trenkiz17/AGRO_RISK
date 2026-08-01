import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

from models.database import db

from controllers.usuario_controller import usuario_controller
from controllers.propriedade_controller import propriedade_controller
from controllers.safra_controller import safra_controller


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

    # Controllers
    app.register_blueprint(usuario_controller)
    app.register_blueprint(propriedade_controller)
    app.register_blueprint(safra_controller)

    @app.get("/")
    def home():
        return jsonify({
            "mensagem": "API AgroRisk funcionando.",
            "rotas": {

                "USUÁRIOS": {
                    "listar": "GET /usuarios",
                    "buscar": "GET /usuarios/<id>",
                    "criar": "POST /usuarios",
                    "atualizar": "PUT /usuarios/<id>",
                    "deletar": "DELETE /usuarios/<id>"
                },

                "PROPRIEDADES": {
                    "listar": "GET /propriedades",
                    "buscar": "GET /propriedades/<id>",
                    "criar": "POST /propriedades",
                    "atualizar": "PUT /propriedades/<id>",
                    "deletar": "DELETE /propriedades/<id>"
                },

                "SAFRAS": {
                    "listar": "GET /safras",
                    "buscar": "GET /safras/<id>",
                    "criar": "POST /safras",
                    "atualizar": "PUT /safras/<id>",
                    "deletar": "DELETE /safras/<id>"
                }

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