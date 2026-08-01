from models.safra import Safra


class BuscarSafraPorIdService:
    def executar(self, safra_id):

        safra = Safra.buscar_por_id(safra_id)

        if safra is None:
            return None

        return safra.to_dict()