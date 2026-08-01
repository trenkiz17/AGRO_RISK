from models.safra import Safra


class CriarSafraService:
    def executar(self, dados):

        campos_obrigatorios = [
            "nome",
            "cultura",
            "ano",
            "area_plantada",
            "produtividade"
        ]

        for campo in campos_obrigatorios:

            if not dados.get(campo):

                raise ValueError(f"O campo '{campo}' é obrigatório.")

        safra = Safra(

            nome=dados["nome"],
            cultura=dados["cultura"],
            ano=dados["ano"],
            area_plantada=dados["area_plantada"],
            produtividade=dados["produtividade"]

        )

        safra.salvar()

        return safra.to_dict()