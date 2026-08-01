from models.propriedade import Propriedade


class AtualizarPropriedadeService:
    def executar(self, propriedade_id, dados):

        propriedade = Propriedade.buscar_por_id(propriedade_id)

        if propriedade is None:
            return None

        propriedade.atualizar(

            nome=dados.get("nome"),
            cidade=dados.get("cidade"),
            estado=dados.get("estado"),
            area=dados.get("area"),
            cultura=dados.get("cultura"),

        )

        return propriedade.to_dict()