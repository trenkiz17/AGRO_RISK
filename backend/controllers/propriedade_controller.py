from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from services.criar_propriedade_service import CriarPropriedadeService
from services.listar_propriedade_service import ListarPropriedadesService
from services.buscar_propriedade_por_id_service import BuscarPropriedadePorIdService
from services.atualizar_propriedade_service import AtualizarPropriedadeService
from services.deletar_propriedade_service import DeletarPropriedadeService
from models.database import db

propriedade_controller = Blueprint("propriedade_controller", __name__)


@propriedade_controller.post("/propriedades")
def criar_propriedade():
    try:
        dados = request.get_json() or {}

        service = CriarPropriedadeService()

        propriedade = service.executar(dados)

        return jsonify(propriedade), 201

    except ValueError as erro:

        return jsonify({"erro": str(erro)}), 400

    except SQLAlchemyError:

        db.session.rollback()

        return jsonify({"erro": "Erro ao salvar propriedade no banco de dados."}), 500


@propriedade_controller.get("/propriedades")
def listar_propriedades():

    service = ListarPropriedadesService()

    propriedades = service.executar()

    return jsonify(propriedades), 200


@propriedade_controller.get("/propriedades/<int:propriedade_id>")
def buscar_propriedade_por_id(propriedade_id):

    service = BuscarPropriedadePorIdService()

    propriedade = service.executar(propriedade_id)

    if propriedade is None:

        return jsonify({"erro": "Propriedade não encontrada."}), 404

    return jsonify(propriedade), 200


@propriedade_controller.put("/propriedades/<int:propriedade_id>")
def atualizar_propriedade(propriedade_id):

    try:

        dados = request.get_json() or {}

        service = AtualizarPropriedadeService()

        propriedade = service.executar(propriedade_id, dados)

        if propriedade is None:

            return jsonify({"erro": "Propriedade não encontrada."}), 404

        return jsonify(propriedade), 200

    except ValueError as erro:

        return jsonify({"erro": str(erro)}), 400

    except SQLAlchemyError:

        db.session.rollback()

        return jsonify({"erro": "Erro ao atualizar propriedade no banco de dados."}), 500


@propriedade_controller.delete("/propriedades/<int:propriedade_id>")
def deletar_propriedade(propriedade_id):

    try:

        service = DeletarPropriedadeService()

        propriedade_deletada = service.executar(propriedade_id)

        if propriedade_deletada is False:

            return jsonify({"erro": "Propriedade não encontrada."}), 404

        return "", 204

    except SQLAlchemyError:

        db.session.rollback()

        return jsonify({"erro": "Erro ao deletar propriedade no banco de dados."}), 500