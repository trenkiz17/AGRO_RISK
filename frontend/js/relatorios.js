// =============================================
// RELATÓRIO INDIVIDUAL DA SAFRA - AGRO RISK
// =============================================


// =============================================
// INICIAR
// =============================================

document.addEventListener(
    "DOMContentLoaded",
    carregarRelatorioSafra
);


// =============================================
// CARREGAR RELATÓRIO DA SAFRA
// =============================================

async function carregarRelatorioSafra() {

    try {

        // =============================================
        // PEGAR ID DA URL
        // =============================================

        const parametros =
            new URLSearchParams(
                window.location.search
            );

        const idSafra =
            parametros.get("id");


        if (!idSafra) {

            mostrarErro(
                "Nenhuma safra foi selecionada."
            );

            return;

        }


        // =============================================
        // BUSCAR SAFRAS
        // =============================================

        let safras = [];


        if (
            typeof listarSafras === "function"
        ) {

            try {

                const resultado =
                    await listarSafras();


                if (
                    Array.isArray(resultado)
                ) {

                    safras = resultado;

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
                    "Não foi possível buscar as safras pela API.",
                    erroApi
                );

            }

        }


        // =============================================
        // LOCAL STORAGE
        // =============================================

        const safrasLocais =
            JSON.parse(
                localStorage.getItem("safras")
            ) || [];


        safrasLocais.forEach(
            function (safraLocal) {

                const existe =
                    safras.some(
                        function (safra) {

                            return String(
                                safra.id
                            ) === String(
                                safraLocal.id
                            );

                        }
                    );


                if (!existe) {

                    safras.push(
                        safraLocal
                    );

                }

            }
        );


        // =============================================
        // PROCURAR SOMENTE A SAFRA SELECIONADA
        // =============================================

        const safra =
            safras.find(
                function (item) {

                    return String(
                        item.id
                    ) === String(
                        idSafra
                    );

                }
            );


        if (!safra) {

            mostrarErro(
                "A safra selecionada não foi encontrada."
            );

            return;

        }


        // =============================================
        // MOSTRAR RELATÓRIO
        // =============================================

        renderizarRelatorio(
            safra
        );


        // =============================================
        // BOTÃO PDF
        // =============================================

        configurarBotaoPDF(
            safra
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar relatório:",
            erro
        );


        mostrarErro(
            "Não foi possível carregar o relatório."
        );

    }

}



// =============================================
// RENDERIZAR RELATÓRIO
// =============================================

function renderizarRelatorio(safra) {

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


    const status =
        obterStatusSafra(
            safra
        );


    const produtividade =
        obterProdutividade(
            safra
        );


    const propriedade =
        obterNomePropriedade(
            safra
        );


    const plantio =
        formatarData(
            safra.data_plantio
        );


    const colheita =
        formatarData(
            safra.data_colheita
        );


    // =============================================
    // TÍTULO
    // =============================================

    alterarTexto(
        "nomeSafra",
        nome
    );


    alterarTexto(
        "culturaSafra",
        cultura
    );


    alterarTexto(
        "propriedadeSafra",
        propriedade
    );


    alterarTexto(
        "statusSafra",
        status
    );


    alterarTexto(
        "dataPlantio",
        plantio
    );


    alterarTexto(
        "dataColheita",
        colheita
    );


    alterarTexto(
        "areaSafra",
        formatarArea(area)
    );


    alterarTexto(
        "produtividadeSafra",
        produtividade
    );


    // =============================================
    // DADOS QUE DEPENDERÃO DA API
    // =============================================

    alterarTexto(
        "producaoEstimada",
        "Aguardando dados"
    );


    alterarTexto(
        "custoEstimado",
        "Aguardando dados"
    );


    alterarTexto(
        "receitaEstimada",
        "Aguardando dados"
    );


    alterarTexto(
        "lucroEstimado",
        "Aguardando dados"
    );


    alterarTexto(
        "previsaoClima",
        "Aguardando integração com API de clima"
    );


    alterarTexto(
        "chuvaClima",
        "--"
    );


    alterarTexto(
        "temperaturaClima",
        "--"
    );


    alterarTexto(
        "riscoClima",
        "Aguardando dados"
    );


    // =============================================
    // ANÁLISE
    // =============================================

    const analise =
        document.getElementById(
            "analiseSafra"
        );


    if (analise) {

        if (
            status === "Finalizada"
        ) {

            analise.textContent =
                "A safra foi finalizada. O relatório apresenta os dados registrados durante o ciclo da produção.";

        }

        else {

            analise.textContent =
                "A safra está em andamento. Os indicadores de clima, produtividade e rentabilidade serão complementados conforme a integração com a API de clima e os dados da produção.";

        }

    }


    // =============================================
    // ESCONDER LOADING
    // =============================================

    const loading =
        document.getElementById(
            "carregandoRelatorio"
        );


    if (loading) {

        loading.style.display =
            "none";

    }


    const conteudo =
        document.getElementById(
            "conteudoRelatorio"
        );


    if (conteudo) {

        conteudo.style.display =
            "block";

    }

}



// =============================================
// BOTÃO GERAR PDF
// =============================================

function configurarBotaoPDF(safra) {

    const botao =
        document.getElementById(
            "btnGerarPDF"
        );


    if (!botao) {

        return;

    }


    botao.addEventListener(
        "click",
        function () {

            gerarPDF(
                safra
            );

        }
    );

}



// =============================================
// GERAR PDF
// =============================================

function gerarPDF(safra) {

    if (
        typeof window.jspdf === "undefined"
    ) {

        alert(
            "Não foi possível carregar o gerador de PDF."
        );

        return;

    }


    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF();


    const nome =
        safra.nome ||
        "Safra sem nome";


    const cultura =
        safra.cultura ||
        "Não informada";


    const propriedade =
        obterNomePropriedade(
            safra
        );


    const area =
        Number(
            safra.area_plantada || 0
        );


    const status =
        obterStatusSafra(
            safra
        );


    const produtividade =
        obterProdutividade(
            safra
        );


    const plantio =
        formatarData(
            safra.data_plantio
        );


    const colheita =
        formatarData(
            safra.data_colheita
        );


    // =============================================
    // CABEÇALHO
    // =============================================

    pdf.setFontSize(
        24
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.text(
        "AgroRisk",
        20,
        25
    );


    pdf.setFontSize(
        16
    );

    pdf.text(
        "Relatório da Safra",
        20,
        36
    );


    pdf.setDrawColor(
        180,
        180,
        180
    );


    pdf.line(
        20,
        42,
        190,
        42
    );


    // =============================================
    // IDENTIFICAÇÃO
    // =============================================

    pdf.setFontSize(
        13
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.text(
        "Identificação da Safra",
        20,
        55
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(
        11
    );


    pdf.text(
        "Safra: " + nome,
        20,
        65
    );


    pdf.text(
        "Propriedade: " + propriedade,
        20,
        73
    );


    pdf.text(
        "Cultura: " + cultura,
        20,
        81
    );


    pdf.text(
        "Área plantada: " +
        formatarArea(area),
        20,
        89
    );


    pdf.text(
        "Status: " + status,
        20,
        97
    );


    // =============================================
    // PERÍODO
    // =============================================

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.text(
        "Período da Safra",
        20,
        113
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.text(
        "Data de plantio: " + plantio,
        20,
        123
    );


    pdf.text(
        "Data de colheita: " + colheita,
        20,
        131
    );


    // =============================================
    // DESEMPENHO
    // =============================================

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.text(
        "Desempenho",
        20,
        147
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.text(
        "Produtividade: " +
        produtividade,
        20,
        157
    );


    pdf.text(
        "Produção estimada: Aguardando dados",
        20,
        165
    );


    pdf.text(
        "Custo estimado: Aguardando dados",
        20,
        173
    );


    pdf.text(
        "Receita estimada: Aguardando dados",
        20,
        181
    );


    pdf.text(
        "Lucro estimado: Aguardando dados",
        20,
        189
    );


    // =============================================
    // CLIMA
    // =============================================

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.text(
        "Condições Climáticas",
        20,
        205
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.text(
        "Previsão: Aguardando integração com API de clima",
        20,
        215
    );


    pdf.text(
        "Chuva: --",
        20,
        223
    );


    pdf.text(
        "Temperatura: --",
        20,
        231
    );


    pdf.text(
        "Risco climático: Aguardando dados",
        20,
        239
    );


    // =============================================
    // ANÁLISE
    // =============================================

    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.text(
        "Análise da Safra",
        20,
        255
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );


    const textoAnalise =
        status === "Finalizada"
            ? "A safra foi finalizada. Este relatório reúne os dados registrados durante o ciclo da produção."
            : "A safra está em andamento. Os indicadores de clima, produtividade e rentabilidade serão complementados conforme novas integrações e registros."


    const linhas =
        pdf.splitTextToSize(
            textoAnalise,
            170
        );


    pdf.text(
        linhas,
        20,
        265
    );


    // =============================================
    // RODAPÉ
    // =============================================

    pdf.setFontSize(
        9
    );


    pdf.setTextColor(
        100,
        100,
        100
    );


    pdf.text(
        "AgroRisk • Sistema Inteligente de Monitoramento Agrícola",
        20,
        285
    );


    // =============================================
    // NOME DO ARQUIVO
    // =============================================

    const nomeArquivo =
        nome
            .replace(
                /[^a-zA-Z0-9À-ÿ ]/g,
                ""
            )
            .replace(
                /\s+/g,
                "_"
            );


    pdf.save(
        "AgroRisk_Relatorio_" +
        nomeArquivo +
        ".pdf"
    );

}



// =============================================
// FUNÇÕES AUXILIARES
// =============================================

function alterarTexto(id, valor) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.textContent =
            valor;

    }

}



// =============================================
// PRODUTIVIDADE
// =============================================

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



// =============================================
// STATUS
// =============================================

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
            status.includes("andamento") ||
            status.includes("planejamento")
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


    if (
        colheita < hoje
    ) {

        return "Finalizada";

    }


    return "Em andamento";

}



// =============================================
// NOME DA PROPRIEDADE
// =============================================

function obterNomePropriedade(safra) {

    if (
        safra.propriedade_nome
    ) {

        return safra.propriedade_nome;

    }


    if (
        safra.propriedade &&
        typeof safra.propriedade === "object" &&
        safra.propriedade.nome
    ) {

        return safra.propriedade.nome;

    }


    const propriedades =
        JSON.parse(
            localStorage.getItem(
                "propriedades"
            )
        ) || [];


    if (
        safra.propriedade_id
    ) {

        const propriedade =
            propriedades.find(
                function (prop) {

                    return String(
                        prop.id
                    ) === String(
                        safra.propriedade_id
                    );

                }
            );


        if (propriedade) {

            return propriedade.nome;

        }

    }


    return "Não informada";

}



// =============================================
// FORMATAR DATA
// =============================================

function formatarData(data) {

    if (!data) {

        return "--";

    }


    if (
        typeof data === "string" &&
        data.includes("-")
    ) {

        const partes =
            data
                .substring(
                    0,
                    10
                )
                .split("-");


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



// =============================================
// FORMATAR ÁREA
// =============================================

function formatarArea(area) {

    const numero =
        Number(
            area || 0
        );


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



// =============================================
// ERRO
// =============================================

function mostrarErro(mensagem) {

    const loading =
        document.getElementById(
            "carregandoRelatorio"
        );


    if (loading) {

        loading.style.display =
            "none";

    }


    const conteudo =
        document.getElementById(
            "conteudoRelatorio"
        );


    if (conteudo) {

        conteudo.style.display =
            "none";

    }


    const erro =
        document.getElementById(
            "erroRelatorio"
        );


    if (erro) {

        erro.style.display =
            "block";


        erro.textContent =
            mensagem;

    }

}