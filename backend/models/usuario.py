from models.database import db


class Usuario(db.Model):

    __tablename__ = "usuarios"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    nome = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    senha = db.Column(
        db.String(255),
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
        email=None,
        senha=None
    ):

        if nome is not None:
            self.nome = nome

        if email is not None:
            self.email = email

        if senha is not None:
            self.senha = senha

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
            Usuario.query
            .order_by(Usuario.id.asc())
            .all()
        )

    # ==========================================

    @staticmethod
    def buscar_por_id(id):

        return Usuario.query.get(id)

    # ==========================================

    @staticmethod
    def buscar_por_email(email):

        return Usuario.query.filter_by(
            email=email
        ).first()

    # ==========================================
    # JSON
    # ==========================================

    def to_dict(self):

        return {

            "id": self.id,

            "nome": self.nome,

            "email": self.email

        }