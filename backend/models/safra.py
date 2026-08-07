from models.database import db


class Safra(db.Model):

    __tablename__ = "safras"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    propriedade_id = db.Column(
        db.Integer,
        db.ForeignKey("propriedades.id"),
        nullable=False
    )

    cultura = db.Column(
        db.String(100),
        nullable=False
    )

    ano_safra = db.Column(
        db.String(20),
        nullable=False
    )

    area_plantada = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    data_plantio = db.Column(
        db.Date,
        nullable=True
    )

    data_colheita = db.Column(
        db.Date,
        nullable=True
    )

    produtividade = db.Column(
        db.Numeric(10, 2),
        nullable=True
    )

    custo_total = db.Column(
        db.Numeric(10, 2),
        nullable=True
    )

    status = db.Column(
        db.String(50),
        nullable=True,
        default="Planejamento"
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
        cultura=None,
        ano_safra=None,
        area_plantada=None,
        data_plantio=None,
        data_colheita=None,
        produtividade=None,
        custo_total=None,
        status=None
    ):

        if cultura is not None:
            self.cultura = cultura

        if ano_safra is not None:
            self.ano_safra = ano_safra

        if area_plantada is not None:
            self.area_plantada = area_plantada

        if data_plantio is not None:
            self.data_plantio = data_plantio

        if data_colheita is not None:
            self.data_colheita = data_colheita

        if produtividade is not None:
            self.produtividade = produtividade

        if custo_total is not None:
            self.custo_total = custo_total

        if status is not None:
            self.status = status

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
            Safra.query
            .order_by(Safra.id.asc())
            .all()
        )

    # ==========================================

    @staticmethod
    def buscar_por_id(id):

        return Safra.query.get(id)

    # ==========================================
    # JSON
    # ==========================================

    def to_dict(self):

        return {

            "id": self.id,

            "propriedade_id": self.propriedade_id,

            "cultura": self.cultura,

            "ano_safra": self.ano_safra,

            "area_plantada": float(self.area_plantada),

            "data_plantio":
                self.data_plantio.isoformat()
                if self.data_plantio else None,

            "data_colheita":
                self.data_colheita.isoformat()
                if self.data_colheita else None,

            "produtividade":
                float(self.produtividade)
                if self.produtividade is not None else None,

            "custo_total":
                float(self.custo_total)
                if self.custo_total is not None else None,

            "status": self.status,

            "created_at":
                self.created_at.isoformat()
                if self.created_at else None

        }