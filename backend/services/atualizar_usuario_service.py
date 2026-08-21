from models.usuario import Usuario


class AtualizarUsuarioService:

    def executar(self, usuario_id, dados):

        usuario = Usuario.buscar_por_id(usuario_id)

        if usuario is None:
            return None

        # ==========================================
        # VERIFICAR E-MAIL
        # ==========================================

        novo_email = dados.get("email")

        if novo_email:

            usuario_com_email = Usuario.buscar_por_email(
                novo_email
            )

            if (
                usuario_com_email
                and usuario_com_email.id != usuario.id
            ):

                raise ValueError(
                    "Já existe outro usuário cadastrado com este e-mail."
                )

        # ==========================================
        # ATUALIZAR USUÁRIO
        # ==========================================

        usuario.atualizar(

            nome=dados.get("nome"),

            email=dados.get("email"),

            senha=dados.get("senha"),

            telefone=dados.get("telefone"),

            cpf=dados.get("cpf"),

            data_nascimento=dados.get(
                "data_nascimento"
            ),

            estado=dados.get("estado"),

            cidade=dados.get("cidade"),

            idioma=dados.get("idioma")

        )

        # ==========================================
        # RETORNAR USUÁRIO ATUALIZADO
        # ==========================================

        return usuario.to_dict()