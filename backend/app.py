import os

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template
from flask_cors import CORS

from models.database import db

from controllers.usuario_controller import usuario_controller
from controllers.propriedade_controller import propriedade_controller
from controllers.safra_controller import safra_controller


def create_app():

    load_dotenv()

    app = Flask(
        __name__,
        template_folder="templates",
        static_folder="static"
    )

    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:@localhost/agrorisk"
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    # ==========================================
    # CONTROLLERS
    # ==========================================

    app.register_blueprint(usuario_controller.blueprint)
    app.register_blueprint(propriedade_controller.blueprint)
    app.register_blueprint(safra_controller.blueprint)

    # ==========================================
    # FRONT-END
    # ==========================================

    @app.get("/")
    def home():
        return render_template("index.html")

    # ==========================================
    # INFORMAÇÕES DA API
    # ==========================================

    @app.get("/api")
    def api_info():

        return jsonify({
            "mensagem": "API AgroRisk funcionando.",
            "rotas": {
                "usuarios": {
                    "listar": "GET /usuarios",
                    "buscar": "GET /usuarios/<id>",
                    "criar": "POST /usuarios",
                    "atualizar": "PUT /usuarios/<id>",
                    "deletar": "DELETE /usuarios/<id>",
                    "login": "POST /login"
                },

                "propriedades": {
                    "listar": "GET /propriedades",
                    "buscar": "GET /propriedades/<id>",
                    "criar": "POST /propriedades",
                    "atualizar": "PUT /propriedades/<id>",
                    "deletar": "DELETE /propriedades/<id>",
                    "buscar_localizacao":
                        "GET /propriedades/buscar?localizacao=..."
                },

                "safras": {
                    "listar": "GET /safras",
                    "buscar": "GET /safras/<id>",
                    "criar": "POST /safras",
                    "atualizar": "PUT /safras/<id>",
                    "deletar": "DELETE /safras/<id>",
                    "buscar_cultura":
                        "GET /safras/buscar?cultura=..."
                }
            }
        })

    # ==========================================
    # BANCO
    # ==========================================

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