// =======================================
// SAFRAS
// =======================================


// =======================================
// INICIAR
// =======================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await carregarSafras();

    }
);


// =======================================
// CARREGAR SAFRAS
// =======================================

async function carregarSafras() {

    try {

        let safras = [];


        // =======================================
        // BUSCAR DA API
        // =======================================

        if (
            typeof listarSafras === "function"
        ) {

            try {

                const resultado =
                    await listarSafras();


                if (Array.isArray(resultado)) {

                    safras =
                        resultado;

                }
                else if (
                    resultado &&
                    Array.isArray(resultado.data)
                ) {

                    safras =
                        resultado.data;

                }

            }

            catch (erroApi) {

                console.warn(
                    "Não foi possível carregar as safras pela API.",
                    erroApi
                );

            }

        }


        // =======================================
        // CARREGAR SAFRAS DO LOCALSTORAGE
        // =======================================

        const safrasLocais =
            JSON.parse(
                localStorage.getItem("safras")
            ) || [];


        const todasSafras = [
            ...safras
        ];


        safrasLocais.forEach(
            function (safraLocal) {

                const existe =
                    todasSafras.some(
                        function (safra) {

                            return String(safra.id) ===
                                String(safraLocal.id);

                        }
                    );


                if (!existe) {

                    todasSafras.push(
                        safraLocal
                    );

                }

            }
        );


        // =======================================
        // RENDERIZAR
        // =======================================

        renderizarSafras(
            todasSafras
        );


        atualizarResumo(
            todasSafras
        );


        carregarNomePropriedade(
            todasSafras
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar safras:",
            erro
        );


        renderizarSafras([]);

        atualizarResumo([]);

    }

}


// =======================================
// RENDERIZAR SAFRAS
// =======================================

function renderizarSafras(safras) {

    const lista =
        document.getElementById(
            "listaSafras"
        );


    if (!lista) {

        return;

    }


    lista.innerHTML = "";


    // =======================================
    // NENHUMA SAFRA
    // =======================================

    if (
        !safras ||
        safras.length === 0
    ) {

        lista.innerHTML = `

            <div class="safra-card">

                <div class="safra-top">

                    <div>

                        <span class="badge-status andamento">

                            <i class="fa-solid fa-circle"></i>

                            Nenhuma safra

                        </span>

                        <h3>

                            Nenhuma safra cadastrada

                        </h3>

                        <small>

                            Cadastre sua primeira safra
                            para começar o monitoramento.

                        </small>

                    </div>

                    <div class="safra-icon">

                        <i class="fa-solid fa-seedling"></i>

                    </div>

                </div>

                <div class="safra-buttons">

                    <a
                        href="cadastro_safras.html"
                        class="btn-monitorar">

                        <i class="fa-solid fa-plus"></i>

                        Cadastrar Safra

                    </a>

                </div>

            </div>

        `;


        return;

    }


    // =======================================
    // ORDENAR
    // MAIS RECENTE PRIMEIRO
    // =======================================

    safras.sort(
        function (a, b) {

            const dataA =
                new Date(
                    a.data_plantio || 0
                );


            const dataB =
                new Date(
                    b.data_plantio || 0
                );


            return dataB - dataA;

        }
    );


    // =======================================
    // CRIAR CARDS
    // =======================================

    safras.forEach(
        function (safra) {

            lista.innerHTML +=
                criarCardSafra(safra);

        }
    );

}


// =======================================
// CRIAR CARD
// =======================================

function criarCardSafra(safra) {

    const id =
        safra.id ||
        "";


    const nome =
        safra.nome ||
        "Safra sem nome";


    const cultura =
        safra.cultura ||
        "Não informada";


    const area =
        Number(
            safra.area_plantada || 0
        );


    const plantio =
        safra.data_plantio ||
        "";


    const colheita =
        safra.data_colheita ||
        "";


    const status =
        obterStatusSafra(
            safra
        );


    const statusClasse =
        status === "Finalizada"
            ? "finalizada"
            : "andamento";


    const statusIcon =
        status === "Finalizada"
            ? "fa-circle-check"
            : "fa-circle";


    const icone =
        obterIconeCultura(
            cultura
        );


    const plantioFormatado =
        formatarData(
            plantio
        );


    const colheitaFormatada =
        formatarData(
            colheita
        );


    const produtividade =
        obterProdutividade(
            safra
        );


    return `

        <div
            class="safra-card"
            data-id="${id}">

            <!-- ================= TOP ================= -->

            <div class="safra-top">

                <div>

                    <span
                        class="badge-status ${statusClasse}">

                        <i
                            class="fa-solid ${statusIcon}">
                        </i>

                        ${status}

                    </span>

                    <h3>

                        ${escaparHTML(nome)}

                    </h3>

                    <small>

                        Cultura:

                        <strong>

                            ${escaparHTML(cultura)}

                        </strong>

                    </small>

                </div>

                <div class="safra-icon">

                    <i
                        class="fa-solid ${icone}">
                    </i>

                </div>

            </div>


            <!-- ================= INFORMAÇÕES ================= -->

            <div class="safra-info">

                <div>

                    <span>
                        Plantio
                    </span>

                    <strong>
                        ${plantioFormatado}
                    </strong>

                </div>


                <div>

                    <span>
                        Colheita
                    </span>

                    <strong>
                        ${colheitaFormatada}
                    </strong>

                </div>


                <div>

                    <span>
                        Área
                    </span>

                    <strong>
                        ${formatarArea(area)}
                    </strong>

                </div>


                <div>

                    <span>
                        Produtividade
                    </span>

                    <strong>
                        ${produtividade}
                    </strong>

                </div>

            </div>


            <!-- ================= BOTÕES ================= -->

            <div class="safra-buttons">

                <a
                    href="monitoramento.html?id=${id}"
                    class="btn-monitorar">

                    <i class="fa-solid fa-chart-line"></i>

                    ${
                        status === "Finalizada"
                            ? "Visualizar"
                            : "Monitorar"
                    }

                </a>


                <a
                    href="cadastro_safras.html?id=${id}"
                    class="btn-editar">

                    <i class="fa-solid fa-pen"></i>

                    Editar

                </a>


                <a
                    href="relatorios.html?id=${id}"
                    class="btn-relatorio">

                    <i class="fa-solid fa-chart-column"></i>

                    Relatório

                </a>


                <button
                    type="button"
                    class="btn-excluir"
                    onclick="excluirSafraTela(${id})">

                    <i class="fa-solid fa-trash"></i>

                    Excluir

                </button>

            </div>

        </div>

    `;

}


// =======================================
// EXCLUIR SAFRA
// =======================================

async function excluirSafraTela(id) {

    if (!id) {

        alert(
            "Não foi possível identificar a safra."
        );

        return;

    }


    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta safra?"
        );


    if (!confirmar) {

        return;

    }


    try {

        // =======================================
        // EXCLUIR NA API
        // =======================================

        if (
            typeof excluirSafra !== "function"
        ) {

            alert(
                "A função de exclusão da API não foi encontrada."
            );

            return;

        }


        const resposta =
            await excluirSafra(id);


        if (!resposta) {

            alert(
                "Não foi possível excluir a safra."
            );

            return;

        }


        // =======================================
        // REMOVER DO LOCALSTORAGE
        // =======================================

        let safrasLocais =
            JSON.parse(
                localStorage.getItem("safras")
            ) || [];


        safrasLocais =
            safrasLocais.filter(
                function (safra) {

                    return String(safra.id) !==
                        String(id);

                }
            );


        localStorage.setItem(
            "safras",
            JSON.stringify(
                safrasLocais
            )
        );


        // =======================================
        // ATUALIZAR TELA
        // =======================================

        alert(
            "Safra excluída com sucesso!"
        );


        await carregarSafras();

    }

    catch (erro) {

        console.error(
            "Erro ao excluir safra:",
            erro
        );


        alert(
            "Não foi possível excluir a safra."
        );

    }

}


// =======================================
// STATUS DA SAFRA
// =======================================

function obterStatusSafra(safra) {

    if (safra.status) {

        const status =
            String(
                safra.status
            ).toLowerCase();


        if (
            status.includes("final")
        ) {

            return "Finalizada";

        }


        if (
            status.includes("andamento")
        ) {

            return "Em andamento";

        }

    }


    if (!safra.data_colheita) {

        return "Em andamento";

    }


    const hoje =
        new Date();


    const colheita =
        new Date(
            safra.data_colheita
        );


    if (colheita < hoje) {

        return "Finalizada";

    }


    return "Em andamento";

}


// =======================================
// PRODUTIVIDADE
// =======================================

function obterProdutividade(safra) {

    if (
        safra.produtividade !== undefined &&
        safra.produtividade !== null &&
        safra.produtividade !== ""
    ) {

        return (
            safra.produtividade +
            "%"
        );

    }


    if (
        safra.produtividade_esperada !== undefined &&
        safra.produtividade_esperada !== null &&
        safra.produtividade_esperada !== ""
    ) {

        return (
            safra.produtividade_esperada +
            "%"
        );

    }


    return "--";

}


// =======================================
// ÍCONE DA CULTURA
// =======================================

function obterIconeCultura(cultura) {

    const nome =
        String(
            cultura || ""
        ).toLowerCase();


    if (
        nome.includes("café") ||
        nome.includes("cafe")
    ) {

        return "fa-mug-hot";

    }


    if (
        nome.includes("milho")
    ) {

        return "fa-wheat-awn";

    }


    if (
        nome.includes("soja")
    ) {

        return "fa-seedling";

    }


    if (
        nome.includes("algodão") ||
        nome.includes("algodao")
    ) {

        return "fa-cloud";

    }


    if (
        nome.includes("cana")
    ) {

        return "fa-leaf";

    }


    return "fa-seedling";

}


// =======================================
// ATUALIZAR RESUMO
// =======================================

function atualizarResumo(safras) {

    const total =
        safras.length;


    let andamento = 0;

    let finalizadas = 0;

    let areaTotal = 0;


    safras.forEach(
        function (safra) {

            const status =
                obterStatusSafra(
                    safra
                );


            if (
                status === "Finalizada"
            ) {

                finalizadas++;

            }
            else {

                andamento++;

            }


            areaTotal +=
                Number(
                    safra.area_plantada || 0
                );

        }
    );


    const totalElement =
        document.getElementById(
            "totalSafras"
        );


    const andamentoElement =
        document.getElementById(
            "totalAndamento"
        );


    const finalizadasElement =
        document.getElementById(
            "totalFinalizadas"
        );


    const areaElement =
        document.getElementById(
            "totalArea"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (andamentoElement) {

        andamentoElement.textContent =
            andamento;

    }


    if (finalizadasElement) {

        finalizadasElement.textContent =
            finalizadas;

    }


    if (areaElement) {

        areaElement.textContent =
            formatarArea(
                areaTotal
            );

    }

}


// =======================================
// NOME DA PROPRIEDADE
// =======================================

function carregarNomePropriedade(safras) {

    const elemento =
        document.getElementById(
            "nomePropriedade"
        );


    if (!elemento) {

        return;

    }


    const primeiraSafra =
        safras[0];


    if (
        primeiraSafra &&
        primeiraSafra.propriedade_nome
    ) {

        elemento.textContent =
            primeiraSafra.propriedade_nome;

        return;

    }


    if (
        primeiraSafra &&
        primeiraSafra.propriedade &&
        typeof primeiraSafra.propriedade === "object"
    ) {

        if (
            primeiraSafra.propriedade.nome
        ) {

            elemento.textContent =
                primeiraSafra.propriedade.nome;

            return;

        }

    }


    const propriedades =
        JSON.parse(
            localStorage.getItem(
                "propriedades"
            )
        ) || [];


    if (
        primeiraSafra &&
        primeiraSafra.propriedade_id
    ) {

        const propriedade =
            propriedades.find(
                function (prop) {

                    return String(prop.id) ===
                        String(
                            primeiraSafra.propriedade_id
                        );

                }
            );


        if (propriedade) {

            elemento.textContent =
                propriedade.nome;

            return;

        }

    }


    elemento.textContent =
        "Boa Vista";

}


// =======================================
// FORMATAR DATA
// =======================================

function formatarData(data) {

    if (!data) {

        return "--";

    }


    if (
        typeof data === "string" &&
        data.includes("-")
    ) {

        const partes =
            data.substring(
                0,
                10
            ).split("-");


        if (
            partes.length === 3
        ) {

            return (
                partes[2] +
                "/" +
                partes[1] +
                "/" +
                partes[0]
            );

        }

    }


    return data;

}


// =======================================
// FORMATAR ÁREA
// =======================================

function formatarArea(area) {

    const numero =
        Number(
            area || 0
        );


    if (!numero) {

        return "0 ha";

    }


    return (
        numero.toLocaleString(
            "pt-BR",
            {
                maximumFractionDigits: 2
            }
        ) +
        " ha"
    );

}


// =======================================
// PROTEÇÃO CONTRA HTML
// =======================================

function escaparHTML(valor) {

    return String(
        valor || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
