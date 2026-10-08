from flask import Blueprint, jsonify, request

from services.clima_service import ClimaService


class ClimaController:

    def __init__(self):
        self.blueprint = Blueprint(
            "clima_controller",
            __name__
        )

        self.service = ClimaService()

        self.registrar_rotas()

    def registrar_rotas(self):

        @self.blueprint.get("/api/clima")
        def consultar_clima():

            latitude = request.args.get("lat")
            longitude = request.args.get("lon")

            if latitude is None or longitude is None:
                return jsonify({
                    "erro": "Latitude e longitude são obrigatórias."
                }), 400

            try:
                latitude = float(latitude)
                longitude = float(longitude)

            except ValueError:
                return jsonify({
                    "erro": "Latitude e longitude devem ser números."
                }), 400

            try:
                clima = self.service.executar(
                    latitude,
                    longitude
                )

                return jsonify(clima), 200

            except ValueError as erro:
                return jsonify({
                    "erro": str(erro)
                }), 400

            except Exception as erro:
                print("Erro ao consultar clima:", erro)

                return jsonify({
                    "erro": "Não foi possível consultar os dados climáticos."
                }), 502


clima_controller = ClimaController()