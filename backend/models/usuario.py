from models.database import db

class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    senha = db.Column(db.String(255), nullable=False)

    def salvar(self):
        """CREATE: salva um novo usuário no banco."""
        db.session.add(self)
        db.session.commit()

    def atualizar(self, nome=None, email=None, senha=None):
        """UPDATE: altera apenas os campos informados."""

        if nome is not None:
            self.nome = nome

        if email is not None:
            self.email = email

        if senha is not None:
            self.senha = senha

        db.session.commit()

    def deletar(self):
        """DELETE: remove o usuário do banco."""

        db.session.delete(self)

        db.session.commit()

    @staticmethod
    def listar_todos():
        """READ: retorna todos os usuários."""

        return Usuario.query.order_by(Usuario.id.asc()).all()

    @staticmethod
    def buscar_por_id(id):
        """READ: busca um usuário pelo id."""

        return Usuario.query.get(id)

    @staticmethod
    def buscar_por_email(email):
        """READ auxiliar: busca um usuário pelo e-mail."""

        return Usuario.query.filter_by(email=email).first()

    def to_dict(self):
        """Converte o objeto Usuario para dicionário/JSON."""

        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email
        }