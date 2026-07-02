document.addEventListener("DOMContentLoaded", async () => {

    // Nome do usuário (temporário)
    document.getElementById("usuario").innerText = "Felipe";

    try {

        const resposta = await fetch("http://localhost:5000/api/clima");

        const clima = await resposta.json();

        document.getElementById("temp").innerText =
            clima.temperatura + "°C";

        document.getElementById("desc").innerText =
            clima.descricao;

    }

    catch {

        document.getElementById("desc").innerText =
            "Não foi possível carregar o clima.";

    }

});