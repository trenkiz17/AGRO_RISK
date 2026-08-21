from models.usuario import Usuario


class LoginUsuarioService:

    def executar(self, dados):

        email = dados.get("email")
        senha = dados.get("senha")

        if not email or not senha:
            raise ValueError("E-mail e senha são obrigatórios.")

        usuario = Usuario.buscar_por_email(email)

        if usuario is None:
            raise ValueError("E-mail ou senha inválidos.")

        if usuario.senha != senha:
            raise ValueError("E-mail ou senha inválidos.")

        return {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email
        }