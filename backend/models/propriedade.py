from models.database import db


class Propriedade(db.Model):

    __tablename__ = "propriedades"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    nome = db.Column(
        db.String(100),
        nullable=False
    )

    cidade = db.Column(
        db.String(100),
        nullable=False
    )

    estado = db.Column(
        db.String(100),
        nullable=False
    )

    observacao = db.Column(
        db.Text,
        nullable=True
    )

    area = db.Column(
        db.Float,
        nullable=False
    )

    perimetro = db.Column(
        db.Float,
        nullable=False
    )

    latitude = db.Column(
        db.Float,
        nullable=True
    )

    longitude = db.Column(
        db.Float,
        nullable=True
    )

    geojson = db.Column(
        db.Text,
        nullable=True
    )

    def salvar(self):

        db.session.add(self)

        db.session.commit()

    def atualizar(
        self,
        nome=None,
        cidade=None,
        estado=None,
        observacao=None,
        area=None,
        perimetro=None,
        latitude=None,
        longitude=None,
        geojson=None
    ):

        if nome is not None:
            self.nome = nome

        if cidade is not None:
            self.cidade = cidade

        if estado is not None:
            self.estado = estado

        if observacao is not None:
            self.observacao = observacao

        if area is not None:
            self.area = area

        if perimetro is not None:
            self.perimetro = perimetro

        if latitude is not None:
            self.latitude = latitude

        if longitude is not None:
            self.longitude = longitude

        if geojson is not None:
            self.geojson = geojson

        db.session.commit()

    def deletar(self):

        db.session.delete(self)

        db.session.commit()

    @staticmethod
    def listar_todos():

        return Propriedade.query.all()

    @staticmethod
    def buscar_por_id(id):

        return Propriedade.query.get(id)

    def to_dict(self):

        return {
            "id": self.id,
            "nome": self.nome,
            "cidade": self.cidade,
            "estado": self.estado,
            "observacao": self.observacao,
            "area": self.area,
            "perimetro": self.perimetro,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "geojson": self.geojson
        }