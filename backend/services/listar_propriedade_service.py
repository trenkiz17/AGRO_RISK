from models.propriedade import Propriedade


class ListarPropriedadesService:
    def executar(self):

        propriedades = Propriedade.listar_todos()

        return [propriedade.to_dict() for propriedade in propriedades]