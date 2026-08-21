// =======================================
// CADASTRO DE SAFRA
// =======================================


// =======================================
// INICIAR
// =======================================

document.addEventListener("DOMContentLoaded", async () => {

    await carregarPropriedades();

    iniciarEventos();

    iniciarResumo();

});


// =======================================
// EVENTOS
// =======================================

function iniciarEventos() {

    const form = document.getElementById("formSafra");

    if (!form) {

        console.error("Formulário de safra não encontrado.");

        return;

    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        await salvarSafra();

    });


    // Atualiza o resumo enquanto o usuário preenche

    const propriedade =
        document.getElementById("propriedade");

    const cultura =
        document.getElementById("cultura");

    const hectares =
        document.getElementById("hectares");

    const plantio =
        document.getElementById("plantio");

    const colheita =
        document.getElementById("colheita");

    const custo =
        document.getElementById("custo");


    if (propriedade) {

        propriedade.addEventListener(
            "change",
            atualizarResumo
        );

    }


    if (cultura) {

        cultura.addEventListener(
            "change",
            atualizarResumo
        );

    }


    if (hectares) {

        hectares.addEventListener(
            "input",
            atualizarResumo
        );

    }


    if (plantio) {

        plantio.addEventListener(
            "change",
            atualizarResumo
        );

    }


    if (colheita) {

        colheita.addEventListener(
            "change",
            atualizarResumo
        );

    }


    if (custo) {

        custo.addEventListener(
            "input",
            atualizarResumo
        );

    }

}


// =======================================
// CARREGAR PROPRIEDADES
// =======================================

async function carregarPropriedades() {

    try {

        const select =
            document.getElementById("propriedade");


        if (!select) {

            return;

        }


        /*
            Primeiro tenta carregar pela API.
        */

        if (typeof listarPropriedades === "function") {

            const propriedades =
                await listarPropriedades();


            select.innerHTML =
                '<option value="">Selecione...</option>';


            if (propriedades &&
                propriedades.length > 0) {


                propriedades.forEach(prop => {

                    const option =
                        document.createElement("option");


                    option.value = prop.id;

                    option.textContent =
                        prop.nome;


                    select.appendChild(option);

                });


            }

        }


        /*
            Se não existir propriedade pela API,
            verifica se existe alguma salva localmente.
        */

        if (select.options.length <= 1) {

            const propriedadesLocais =
                JSON.parse(
                    localStorage.getItem("propriedades")
                ) || [];


            propriedadesLocais.forEach(prop => {

                const option =
                    document.createElement("option");


                option.value = prop.id;

                option.textContent =
                    prop.nome;


                select.appendChild(option);

            });

        }

    }

    catch (erro) {

        console.error(
            "Erro ao carregar propriedades:",
            erro
        );

    }

}


// =======================================
// INICIAR RESUMO
// =======================================

function iniciarResumo() {

    atualizarResumo();

}


// =======================================
// ATUALIZAR RESUMO
// =======================================

function atualizarResumo() {

    const propriedade =
        document.getElementById("propriedade");

    const cultura =
        document.getElementById("cultura");

    const hectares =
        document.getElementById("hectares");

    const plantio =
        document.getElementById("plantio");

    const colheita =
        document.getElementById("colheita");

    const custo =
        document.getElementById("custo");


    const rPropriedade =
        document.getElementById("rPropriedade");

    const rCultura =
        document.getElementById("rCultura");

    const rArea =
        document.getElementById("rArea");

    const rPlantio =
        document.getElementById("rPlantio");

    const rColheita =
        document.getElementById("rColheita");

    const rCusto =
        document.getElementById("rCusto");


    if (rPropriedade && propriedade) {

        const option =
            propriedade.options[
                propriedade.selectedIndex
            ];


        if (option &&
            option.value !== "") {

            rPropriedade.textContent =
                option.textContent;

        }
        else {

            rPropriedade.textContent =
                "--";

        }

    }


    if (rCultura && cultura) {

        rCultura.textContent =
            cultura.value || "--";

    }


    if (rArea && hectares) {

        rArea.textContent =
            hectares.value
                ? hectares.value + " ha"
                : "--";

    }


    if (rPlantio && plantio) {

        rPlantio.textContent =
            formatarData(plantio.value);

    }


    if (rColheita && colheita) {

        rColheita.textContent =
            formatarData(colheita.value);

    }


    if (rCusto && custo) {

        const valor =
            Number(custo.value);


        if (valor > 0) {

            rCusto.textContent =
                formatarMoeda(valor);

        }
        else {

            rCusto.textContent =
                "R$ 0,00";

        }

    }

}


// =======================================
// SALVAR SAFRA
// =======================================

async function salvarSafra() {

    try {

        const propriedadeElement =
            document.getElementById("propriedade");

        const nomeElement =
            document.getElementById("nomeSafra");

        const culturaElement =
            document.getElementById("cultura");

        const plantioElement =
            document.getElementById("plantio");

        const colheitaElement =
            document.getElementById("colheita");

        const hectaresElement =
            document.getElementById("hectares");

        const custoElement =
            document.getElementById("custo");

        const observacoesElement =
            document.getElementById("observacoes");


        const propriedadeId =
            Number(
                propriedadeElement
                    ? propriedadeElement.value
                    : 0
            );


        const nome =
            nomeElement
                ? nomeElement.value.trim()
                : "";


        const cultura =
            culturaElement
                ? culturaElement.value
                : "";


        const dataPlantio =
            plantioElement
                ? plantioElement.value
                : "";


        const dataColheita =
            colheitaElement
                ? colheitaElement.value
                : "";


        const areaPlantada =
            hectaresElement
                ? Number(hectaresElement.value)
                : 0;


        const custo =
            custoElement
                ? Number(custoElement.value)
                : 0;


        const observacoes =
            observacoesElement
                ? observacoesElement.value.trim()
                : "";


        const safra = {

            propriedade_id:
                propriedadeId,

            nome:
                nome,

            cultura:
                cultura,

            data_plantio:
                dataPlantio,

            data_colheita:
                dataColheita,

            area_plantada:
                areaPlantada,

            custo_estimado:
                custo,

            observacoes:
                observacoes

        };


        // =======================================
        // VALIDAR
        // =======================================

        if (!validarSafra(safra)) {

            return;

        }


        // =======================================
        // CADASTRAR NA API
        // =======================================

        let resposta = null;


        if (typeof cadastrarSafra === "function") {

            resposta =
                await cadastrarSafra(safra);

        }


        /*
            Guardamos também no localStorage.

            Isso garante que a safra recém-cadastrada
            apareça imediatamente na tela de Safras.
        */

        const safrasLocais =
            JSON.parse(
                localStorage.getItem("safras")
            ) || [];


        const safraLocal = {

            id:
                resposta?.id ||
                resposta?.data?.id ||
                Date.now(),

            propriedade_id:
                safra.propriedade_id,

            propriedade_nome:
                obterNomePropriedade(),

            nome:
                safra.nome,

            cultura:
                safra.cultura,

            data_plantio:
                safra.data_plantio,

            data_colheita:
                safra.data_colheita,

            area_plantada:
                safra.area_plantada,

            custo_estimado:
                safra.custo_estimado,

            observacoes:
                safra.observacoes,

            status:
                "Em andamento"

        };


        /*
            Evita duplicar caso a API tenha retornado
            a mesma safra.
        */

        const indiceExistente =
            safrasLocais.findIndex(
                item =>
                    String(item.id) ===
                    String(safraLocal.id)
            );


        if (indiceExistente >= 0) {

            safrasLocais[indiceExistente] =
                safraLocal;

        }
        else {

            safrasLocais.push(
                safraLocal
            );

        }


        localStorage.setItem(
            "safras",
            JSON.stringify(safrasLocais)
        );


        // =======================================
        // SUCESSO
        // =======================================

        alert(
            "Safra cadastrada com sucesso!"
        );


        /*
            AGORA VAI PARA A TELA DE SAFRAS.

            NÃO vai mais para monitoramento.html.
        */

        window.location.href =
            "safras.html";

    }

    catch (erro) {

        console.error(
            "Erro ao salvar safra:",
            erro
        );


        alert(
            "Erro ao salvar a safra. Verifique os dados e tente novamente."
        );

    }

}


// =======================================
// PEGAR NOME DA PROPRIEDADE
// =======================================

function obterNomePropriedade() {

    const select =
        document.getElementById("propriedade");


    if (!select) {

        return "Propriedade";

    }


    const option =
        select.options[
            select.selectedIndex
        ];


    if (!option) {

        return "Propriedade";

    }


    return option.textContent.trim();

}


// =======================================
// VALIDAÇÃO
// =======================================

function validarSafra(safra) {

    if (!safra.propriedade_id) {

        alert(
            "Selecione uma propriedade."
        );

        return false;

    }


    if (safra.nome === "") {

        alert(
            "Informe o nome da safra."
        );

        return false;

    }


    if (safra.cultura === "") {

        alert(
            "Informe a cultura."
        );

        return false;

    }


    if (safra.data_plantio === "") {

        alert(
            "Informe a data do plantio."
        );

        return false;

    }


    if (safra.data_colheita === "") {

        alert(
            "Informe a data da colheita."
        );

        return false;

    }


    if (safra.area_plantada <= 0) {

        alert(
            "Informe uma área plantada válida."
        );

        return false;

    }


    return true;

}


// =======================================
// FORMATAR DATA
// =======================================

function formatarData(data) {

    if (!data) {

        return "--";

    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {

        return data;

    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


// =======================================
// FORMATAR MOEDA
// =======================================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}