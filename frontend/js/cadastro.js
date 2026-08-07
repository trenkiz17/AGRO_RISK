document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("cadastroForm")
        .addEventListener("submit", cadastrarUsuario);

});

async function cadastrarUsuario(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();

    const email = document.getElementById("email").value.trim();

    const senha = document.getElementById("senha").value;

    if (nome === "" || email === "" || senha === "") {

        alert("Preencha todos os campos.");

        return;

    }

    try {

        const resposta = await cadastrar(nome, email, senha);

        if (resposta.sucesso) {

            alert("Conta criada com sucesso!");

            window.location.href = "login.html";

        }

        else {

            alert(resposta.mensagem);

        }

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao conectar com a API.");

    }

}