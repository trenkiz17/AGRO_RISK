from models.propriedade import Propriedade


class CriarPropriedadeService:
    def executar(self, dados):

        campos_obrigatorios = [
            "nome",
            "cidade",
            "estado",
            "area",
            "cultura"
        ]

        for campo in campos_obrigatorios:

            if not dados.get(campo):

                raise ValueError(f"O campo '{campo}' é obrigatório.")

        propriedade = Propriedade(

            nome=dados["nome"],
            cidade=dados["cidade"],
            estado=dados["estado"],
            area=dados["area"],
            cultura=dados["cultura"]

        )

        propriedade.salvar()

        return propriedade.to_dict()