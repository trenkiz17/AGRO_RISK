from models.safra import Safra


class AtualizarSafraService:

    def executar(self, safra_id, dados):

        safra = Safra.buscar_por_id(safra_id)

        if safra is None:
            return None

        safra.atualizar(

            cultura=dados.get("cultura"),

            ano_safra=dados.get(
                "ano_safra",
                dados.get("ano")
            ),

            area_plantada=dados.get(
                "area_plantada"
            ),

            data_plantio=dados.get(
                "data_plantio"
            ),

            data_colheita=dados.get(
                "data_colheita"
            ),

            produtividade=dados.get(
                "produtividade"
            ),

            custo_total=dados.get(
                "custo_total"
            ),

            status=dados.get(
                "status"
            )

        )

        return safra.to_dict()