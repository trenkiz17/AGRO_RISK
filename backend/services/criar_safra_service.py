from models.safra import Safra
from datetime import datetime


class CriarSafraService:

    def executar(self, dados):

        campos_obrigatorios = [
            "propriedade_id",
            "cultura",
            "ano_safra",
            "area_plantada"
        ]

        for campo in campos_obrigatorios:

            if dados.get(campo) is None or dados.get(campo) == "":

                raise ValueError(
                    f"O campo '{campo}' é obrigatório."
                )

        # ==============================
        # CONVERTER DATAS
        # ==============================

        data_plantio = None

        if dados.get("data_plantio"):

            data_plantio = datetime.strptime(
                dados["data_plantio"],
                "%Y-%m-%d"
            ).date()

        data_colheita = None

        if dados.get("data_colheita"):

            data_colheita = datetime.strptime(
                dados["data_colheita"],
                "%Y-%m-%d"
            ).date()

        # ==============================
        # CRIAR SAFRA
        # ==============================

        safra = Safra(

            propriedade_id=dados["propriedade_id"],

            cultura=dados["cultura"],

            ano_safra=dados["ano_safra"],

            area_plantada=dados["area_plantada"],

            data_plantio=data_plantio,

            data_colheita=data_colheita,

            produtividade=dados.get("produtividade"),

            custo_total=dados.get("custo_total"),

            status=dados.get(
                "status",
                "Planejamento"
            ),

            created_at=datetime.now()

        )

        safra.salvar()

        return safra.to_dict()