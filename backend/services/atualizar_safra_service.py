from models.safra import Safra


class AtualizarSafraService:
    def executar(self, safra_id, dados):

        safra = Safra.buscar_por_id(safra_id)

        if safra is None:
            return None

        safra.atualizar(

            nome=dados.get("nome"),
            cultura=dados.get("cultura"),
            ano=dados.get("ano"),
            area_plantada=dados.get("area_plantada"),
            produtividade=dados.get("produtividade")

        )

        return safra.to_dict()