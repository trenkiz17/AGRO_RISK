from models.safra import Safra


class ListarSafrasService:
    def executar(self):

        safras = Safra.listar_todos()

        return [safra.to_dict() for safra in safras]