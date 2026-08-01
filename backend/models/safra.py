from models.database import db


class Safra(db.Model):
    __tablename__ = "safras"

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(db.String(100), nullable=False)

    cultura = db.Column(db.String(100), nullable=False)

    ano = db.Column(db.Integer, nullable=False)

    area_plantada = db.Column(db.Float, nullable=False)

    produtividade = db.Column(db.Float, nullable=False)

    def salvar(self):
        """CREATE: salva uma nova safra no banco."""

        db.session.add(self)

        db.session.commit()

    def atualizar(
        self,
        nome=None,
        cultura=None,
        ano=None,
        area_plantada=None,
        produtividade=None
    ):
        """UPDATE: altera apenas os campos informados."""

        if nome is not None:
            self.nome = nome

        if cultura is not None:
            self.cultura = cultura

        if ano is not None:
            self.ano = ano

        if area_plantada is not None:
            self.area_plantada = area_plantada

        if produtividade is not None:
            self.produtividade = produtividade

        db.session.commit()

    def deletar(self):
        """DELETE: remove a safra do banco."""

        db.session.delete(self)

        db.session.commit()

    @staticmethod
    def listar_todos():
        """READ: retorna todas as safras."""

        return Safra.query.order_by(Safra.id.asc()).all()

    @staticmethod
    def buscar_por_id(id):
        """READ: busca uma safra pelo id."""

        return Safra.query.get(id)

    def to_dict(self):
        """Converte o objeto Safra para dicionário."""

        return {
            "id": self.id,
            "nome": self.nome,
            "cultura": self.cultura,
            "ano": self.ano,
            "area_plantada": self.area_plantada,
            "produtividade": self.produtividade
        }