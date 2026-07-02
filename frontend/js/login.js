document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("loginForm");

    formulario.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {

            const resposta = await login(email, senha);

            if (resposta.sucesso) {

                alert("Login realizado com sucesso!");

                window.location.href = "dashboard.html";

            } else {

                alert(resposta.mensagem);

            }

        } catch (erro) {

            console.error(erro);

            alert("Erro ao conectar com a API.");

        }

    });

});