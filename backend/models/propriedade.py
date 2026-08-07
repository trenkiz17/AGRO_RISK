from models.database import db


class Propriedade(db.Model):

    __tablename__ = "propriedades"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    usuario_id = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id"),
        nullable=False
    )

    nome = db.Column(
        db.String(100),
        nullable=False
    )

    localizacao = db.Column(
        db.String(150),
        nullable=False
    )

    hectares = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    tipo_solo = db.Column(
        db.String(100),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False
    )

    # ==========================================
    # CREATE
    # ==========================================

    def salvar(self):

        db.session.add(self)

        db.session.commit()

    # ==========================================
    # UPDATE
    # ==========================================

    def atualizar(
        self,
        nome=None,
        localizacao=None,
        hectares=None,
        tipo_solo=None
    ):

        if nome is not None:
            self.nome = nome

        if localizacao is not None:
            self.localizacao = localizacao

        if hectares is not None:
            self.hectares = hectares

        if tipo_solo is not None:
            self.tipo_solo = tipo_solo

        db.session.commit()

    # ==========================================
    # DELETE
    # ==========================================

    def deletar(self):

        db.session.delete(self)

        db.session.commit()

    # ==========================================
    # READ
    # ==========================================

    @staticmethod
    def listar_todos():

        return (
            Propriedade.query
            .order_by(Propriedade.id.asc())
            .all()
        )

    @staticmethod
    def buscar_por_id(id):

        return Propriedade.query.get(id)

    # ==========================================
    # JSON
    # ==========================================

    def to_dict(self):

        return {

            "id": self.id,

            "usuario_id": self.usuario_id,

            "nome": self.nome,

            "localizacao": self.localizacao,

            "hectares": float(self.hectares),

            "tipo_solo": self.tipo_solo,

            "created_at":
                self.created_at.isoformat()
                if self.created_at else None

        }