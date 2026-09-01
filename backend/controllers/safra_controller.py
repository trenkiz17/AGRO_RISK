from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from services.criar_safra_service import CriarSafraService
from services.listar_safra_service import ListarSafrasService
from services.buscar_safra_por_id_service import BuscarSafraPorIdService
from services.atualizar_safra_service import AtualizarSafraService
from services.deletar_safra_service import DeletarSafraService
from services.buscar_safra_por_cultura_service import (
    BuscarSafraPorCulturaService
)

from models.database import db


class SafraController:

    def __init__(self):

        self.blueprint = Blueprint(
            "safra_controller",
            __name__
        )

        self.registrar_rotas()

    # ==========================================
    # REGISTRAR ROTAS
    # ==========================================

    def registrar_rotas(self):

        self.blueprint.add_url_rule(
            "/safras",
            view_func=self.criar_safra,
            methods=["POST"]
        )

        self.blueprint.add_url_rule(
            "/safras",
            view_func=self.listar_safras,
            methods=["GET"]
        )

        self.blueprint.add_url_rule(
            "/safras/<int:safra_id>",
            view_func=self.buscar_safra_por_id,
            methods=["GET"]
        )

        self.blueprint.add_url_rule(
            "/safras/<int:safra_id>",
            view_func=self.atualizar_safra,
            methods=["PUT"]
        )

        self.blueprint.add_url_rule(
            "/safras/<int:safra_id>",
            view_func=self.deletar_safra,
            methods=["DELETE"]
        )

        self.blueprint.add_url_rule(
            "/safras/buscar",
            view_func=self.buscar_safra_por_cultura,
            methods=["GET"]
        )

    # ==========================================
    # CRIAR SAFRA
    # ==========================================

    def criar_safra(self):

        try:

            dados = request.get_json() or {}

            service = CriarSafraService()

            safra = service.executar(dados)

            return jsonify(safra), 201

        except ValueError as erro:

            return jsonify({
                "erro": str(erro)
            }), 400

        except SQLAlchemyError:

            db.session.rollback()

            return jsonify({
                "erro": "Erro ao salvar safra no banco de dados."
            }), 500

    # ==========================================
    # LISTAR SAFRAS
    # ==========================================

    def listar_safras(self):

        service = ListarSafrasService()

        safras = service.executar()

        return jsonify(safras), 200

    # ==========================================
    # BUSCAR SAFRA POR ID
    # ==========================================

    def buscar_safra_por_id(self, safra_id):

        service = BuscarSafraPorIdService()

        safra = service.executar(safra_id)

        if safra is None:

            return jsonify({
                "erro": "Safra não encontrada."
            }), 404

        return jsonify(safra), 200

    # ==========================================
    # ATUALIZAR SAFRA
    # ==========================================

    def atualizar_safra(self, safra_id):

        try:

            dados = request.get_json() or {}

            service = AtualizarSafraService()

            safra = service.executar(
                safra_id,
                dados
            )

            if safra is None:

                return jsonify({
                    "erro": "Safra não encontrada."
                }), 404

            return jsonify(safra), 200

        except ValueError as erro:

            return jsonify({
                "erro": str(erro)
            }), 400

        except SQLAlchemyError:

            db.session.rollback()

            return jsonify({
                "erro": "Erro ao atualizar safra no banco de dados."
            }), 500

    # ==========================================
    # DELETAR SAFRA
    # ==========================================

    def deletar_safra(self, safra_id):

        try:

            service = DeletarSafraService()

            safra_deletada = service.executar(
                safra_id
            )

            if safra_deletada is False:

                return jsonify({
                    "erro": "Safra não encontrada."
                }), 404

            return "", 204

        except SQLAlchemyError:

            db.session.rollback()

            return jsonify({
                "erro": "Erro ao deletar safra no banco de dados."
            }), 500

    # ==========================================
    # BUSCAR SAFRA POR CULTURA
    # ==========================================

    def buscar_safra_por_cultura(self):

        cultura = request.args.get(
            "cultura"
        )

        try:

            service = BuscarSafraPorCulturaService()

            safras = service.executar(
                cultura
            )

            return jsonify(safras), 200

        except ValueError as erro:

            return jsonify({
                "erro": str(erro)
            }), 400


# ==========================================
# INSTÂNCIA DO CONTROLLER
# ==========================================

safra_controller = SafraController()