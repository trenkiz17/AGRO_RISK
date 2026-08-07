document.addEventListener("DOMContentLoaded", async () => {

    carregarUsuario();

    await carregarResumo();

    await carregarClima();

    carregarAtividades();

});

//=====================================
// CARREGAR USUÁRIO
//=====================================

function carregarUsuario() {

    // Tenta pegar o usuário salvo no login
    let usuario = JSON.parse(localStorage.getItem("usuario"));

    // Enquanto o login não estiver funcionando,
    // usa um usuário temporário.
    if (!usuario) {

        usuario = {

            id: 1,
            nome: "Leonardo",
            email: "leo@email.com"

        };

    }

    document.getElementById("usuario").textContent = usuario.nome;

    document.getElementById("usuario2").textContent = usuario.nome;

}

//=====================================
// RESUMO
//=====================================

async function carregarResumo() {

    try {

        /*
            Depois será:

            const dados = await buscarDashboard();
        */

        const dados = {

            propriedades: 0,

            safras: 0,

            produtividade: "--"

        };

        document.getElementById("totalPropriedades").textContent =
            dados.propriedades;

        document.getElementById("totalSafras").textContent =
            dados.safras;

        document.getElementById("produtividade").textContent =
            dados.produtividade;

    }

    catch (erro) {

        console.error("Erro ao carregar resumo:", erro);

    }

}

//=====================================
// CLIMA
//=====================================

async function carregarClima() {

    try {

        /*
            Depois iremos pegar a latitude e longitude
            da propriedade principal cadastrada.
        */

        const clima = await get("/api/clima");

        document.getElementById("temperatura").textContent =
            clima.temperatura + "°";

        document.getElementById("tempGrande").textContent =
            clima.temperatura + "°";

        document.getElementById("descricao").textContent =
            clima.descricao;

        document.getElementById("umidade").textContent =
            clima.umidade + "%";

        document.getElementById("vento").textContent =
            clima.vento + " km/h";

    }

    catch (erro) {

        console.error("Erro ao carregar clima:", erro);

        document.getElementById("temperatura").textContent = "--°";

        document.getElementById("tempGrande").textContent = "--°";

        document.getElementById("descricao").textContent =
            "Indisponível";

        document.getElementById("umidade").textContent = "--%";

        document.getElementById("vento").textContent = "-- km/h";

    }

}

//=====================================
// ATIVIDADES
//=====================================

function carregarAtividades() {

    /*
        Depois vamos buscar da API.

        Exemplo:

        const atividades = await buscarAtividades();
    */

}

//=====================================
// LOGOUT
//=====================================

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {

    btnLogout.addEventListener("click", () => {

        localStorage.removeItem("usuario");

        window.location.href = "login.html";

    });

}