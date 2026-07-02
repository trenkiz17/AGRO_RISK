document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("cadastroForm");

    formulario.addEventListener("submit", async (event) => {

        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {

            const resposta = await cadastrar(nome, email, senha);

            if (resposta.sucesso) {

                alert("Conta criada com sucesso!");

                window.location.href = "login.html";

            } else {

                alert(resposta.mensagem);

            }

        } catch (erro) {

            console.error(erro);

            alert("Erro ao conectar com a API.");

        }

    });

});