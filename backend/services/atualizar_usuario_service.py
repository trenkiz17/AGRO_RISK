from models.usuario import Usuario


class AtualizarUsuarioService:
    def executar(self, usuario_id, dados):

        usuario = Usuario.buscar_por_id(usuario_id)

        if usuario is None:
            return None

        novo_email = dados.get("email")

        if novo_email:

            usuario_com_email = Usuario.buscar_por_email(novo_email)

            if usuario_com_email and usuario_com_email.id != usuario.id:
                raise ValueError("Já existe outro usuário cadastrado com este e-mail.")

        usuario.atualizar(

            nome=dados.get("nome"),
            email=dados.get("email"),
            senha=dados.get("senha"),

        )

        return usuario.to_dict()