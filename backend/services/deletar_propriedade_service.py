from models.propriedade import Propriedade


class DeletarPropriedadeService:
    def executar(self, propriedade_id):

        propriedade = Propriedade.buscar_por_id(propriedade_id)

        if propriedade is None:
            return False

        propriedade.deletar()

        return True