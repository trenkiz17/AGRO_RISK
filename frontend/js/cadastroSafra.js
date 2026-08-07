// =======================================
// INICIAR
// =======================================

document.addEventListener("DOMContentLoaded", async () => {

    await carregarPropriedades();

    iniciarEventos();

});

// =======================================
// EVENTOS
// =======================================

function iniciarEventos() {

    document
        .getElementById("btnSalvar")
        .addEventListener("click", salvarSafra);

}

// =======================================
// CARREGAR PROPRIEDADES
// =======================================

async function carregarPropriedades() {

    try {

        const propriedades = await listarPropriedades();

        const select = document.getElementById("propriedade");

        select.innerHTML = "";

        propriedades.forEach(prop => {

            select.innerHTML += `
                <option value="${prop.id}">
                    ${prop.nome}
                </option>
            `;

        });

    }

    catch (erro) {

        console.error(erro);

    }

}

// =======================================
// SALVAR SAFRA
// =======================================

async function salvarSafra() {

    try {

        const safra = {

            propriedade_id: Number(
                document.getElementById("propriedade").value
            ),

            nome: document.getElementById("nomeSafra").value,

            cultura: document.getElementById("cultura").value,

            data_plantio: document.getElementById("plantio").value,

            data_colheita: document.getElementById("colheita").value,

            area_plantada: Number(
                document.getElementById("area").value
            ),

            produtividade_esperada: Number(
                document.getElementById("produtividade").value
            ),

            observacoes: document.getElementById("observacoes").value

        };

        if (!validarSafra(safra)) {

            return;

        }

        const resposta = await cadastrarSafra(safra);

        if (!resposta) {

            alert("Erro ao cadastrar.");

            return;

        }

        alert("Safra cadastrada com sucesso!");

        /*
            Depois:

            monitoramento.html?id=ID_DA_PROPRIEDADE
        */

        window.location =
            "monitoramento.html?id=" +
            safra.propriedade_id;

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao salvar.");

    }

}

// =======================================
// VALIDAÇÃO
// =======================================

function validarSafra(safra) {

    if (safra.nome === "") {

        alert("Informe o nome da safra.");

        return false;

    }

    if (safra.data_plantio === "") {

        alert("Informe a data do plantio.");

        return false;

    }

    if (safra.data_colheita === "") {

        alert("Informe a data da colheita.");

        return false;

    }

    if (safra.area_plantada <= 0) {

        alert("Área inválida.");

        return false;

    }

    return true;

}