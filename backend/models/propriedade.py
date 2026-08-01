from models.database import db


class Propriedade(db.Model):
    __tablename__ = "propriedades"

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(db.String(100), nullable=False)

    cidade = db.Column(db.String(100), nullable=False)

    estado = db.Column(db.String(2), nullable=False)

    area = db.Column(db.Float, nullable=False)

    cultura = db.Column(db.String(100), nullable=False)

    def salvar(self):
        """CREATE: salva uma nova propriedade no banco."""
        db.session.add(self)
        db.session.commit()

    def atualizar(self, nome=None, cidade=None, estado=None, area=None, cultura=None):
        """UPDATE: altera apenas os campos informados."""

        if nome is not None:
            self.nome = nome

        if cidade is not None:
            self.cidade = cidade

        if estado is not None:
            self.estado = estado

        if area is not None:
            self.area = area

        if cultura is not None:
            self.cultura = cultura

        db.session.commit()

    def deletar(self):
        """DELETE: remove a propriedade do banco."""

        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def listar_todos():
        """READ: retorna todas as propriedades."""

        return Propriedade.query.order_by(Propriedade.id.asc()).all()

    @staticmethod
    def buscar_por_id(id):
        """READ: busca uma propriedade pelo id."""

        return Propriedade.query.get(id)

    def to_dict(self):
        """Converte o objeto Propriedade para dicionário/JSON."""

        return {
            "id": self.id,
            "nome": self.nome,
            "cidade": self.cidade,
            "estado": self.estado,
            "area": self.area,
            "cultura": self.cultura
        }