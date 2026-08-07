from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from services.criar_safra_service import CriarSafraService
from services.listar_safra_service import ListarSafrasService
from services.buscar_safra_por_id_service import BuscarSafraPorIdService
from services.atualizar_safra_service import AtualizarSafraService
from services.deletar_safra_service import DeletarSafraService
from services.buscar_safra_por_cultura_service import  BuscarSafraPorCulturaService

from models.database import db

safra_controller = Blueprint("safra_controller", __name__)


@safra_controller.post("/safras")
def criar_safra():
    try:

        dados = request.get_json() or {}

        service = CriarSafraService()

        safra = service.executar(dados)

        return jsonify(safra), 201

    except ValueError as erro:

        return jsonify({"erro": str(erro)}), 400

    except SQLAlchemyError:

        db.session.rollback()

        return jsonify({"erro": "Erro ao salvar safra no banco de dados."}), 500


@safra_controller.get("/safras")
def listar_safras():

    service = ListarSafrasService()

    safras = service.executar()

    return jsonify(safras), 200


@safra_controller.get("/safras/<int:safra_id>")
def buscar_safra_por_id(safra_id):

    service = BuscarSafraPorIdService()

    safra = service.executar(safra_id)

    if safra is None:

        return jsonify({"erro": "Safra não encontrada."}), 404

    return jsonify(safra), 200


@safra_controller.put("/safras/<int:safra_id>")
def atualizar_safra(safra_id):

    try:

        dados = request.get_json() or {}

        service = AtualizarSafraService()

        safra = service.executar(safra_id, dados)

        if safra is None:

            return jsonify({"erro": "Safra não encontrada."}), 404

        return jsonify(safra), 200

    except ValueError as erro:

        return jsonify({"erro": str(erro)}), 400

    except SQLAlchemyError:

        db.session.rollback()

        return jsonify({"erro": "Erro ao atualizar safra no banco de dados."}), 500


@safra_controller.delete("/safras/<int:safra_id>")
def deletar_safra(safra_id):

    try:

        service = DeletarSafraService()

        safra_deletada = service.executar(safra_id)

        if safra_deletada is False:

            return jsonify({"erro": "Safra não encontrada."}), 404

        return "", 204

    except SQLAlchemyError:

        db.session.rollback()

        return jsonify({"erro": "Erro ao deletar safra no banco de dados."}), 500


@safra_controller.get("/safras/buscar")
def buscar_safra_por_cultura():

    cultura = request.args.get("cultura")

    try:

        service = BuscarSafraPorCulturaService()

        safras = service.executar(cultura)

        return jsonify(safras), 200

    except ValueError as erro:

        return jsonify({
            "erro": str(erro)
        }), 400