from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from services.criar_usuario_service import CriarUsuarioService
from services.listar_usuario_service import ListarUsuariosService
from services.buscar_usuario_por_id_service import BuscarUsuarioPorIdService
from services.atualizar_usuario_service import AtualizarUsuarioService
from services.deletar_usuario_service import DeletarUsuarioService
from models.database import db

usuario_controller = Blueprint("usuario_controller", __name__)


@usuario_controller.post("/usuarios")
def criar_usuario():
    try:
        dados = request.get_json() or {}

        service = CriarUsuarioService()

        usuario = service.executar(dados)

        return jsonify(usuario), 201

    except ValueError as erro:

        return jsonify({"erro": str(erro)}), 400

    except SQLAlchemyError:

        db.session.rollback()

        return jsonify({"erro": "Erro ao salvar usuário no banco de dados."}), 500


@usuario_controller.get("/usuarios")
def listar_usuarios():

    service = ListarUsuariosService()

    usuarios = service.executar()

    return jsonify(usuarios), 200


@usuario_controller.get("/usuarios/<int:usuario_id>")
def buscar_usuario_por_id(usuario_id):

    service = BuscarUsuarioPorIdService()

    usuario = service.executar(usuario_id)

    if usuario is None:

        return jsonify({"erro": "Usuário não encontrado."}), 404

    return jsonify(usuario), 200


@usuario_controller.put("/usuarios/<int:usuario_id>")
def atualizar_usuario(usuario_id):

    try:

        dados = request.get_json() or {}

        service = AtualizarUsuarioService()

        usuario = service.executar(usuario_id, dados)

        if usuario is None:

            return jsonify({"erro": "Usuário não encontrado."}), 404

        return jsonify(usuario), 200

    except ValueError as erro:

        return jsonify({"erro": str(erro)}), 400

    except SQLAlchemyError:

        db.session.rollback()

        return jsonify({"erro": "Erro ao atualizar usuário no banco de dados."}), 500


@usuario_controller.delete("/usuarios/<int:usuario_id>")
def deletar_usuario(usuario_id):

    try:

        service = DeletarUsuarioService()

        usuario_deletado = service.executar(usuario_id)

        if usuario_deletado is False:

            return jsonify({"erro": "Usuário não encontrado."}), 404

        return "", 204

    except SQLAlchemyError:

        db.session.rollback()

        return jsonify({"erro": "Erro ao deletar usuário no banco de dados."}), 500