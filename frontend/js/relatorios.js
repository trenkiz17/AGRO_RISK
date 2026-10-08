// =============================================
// RELATÓRIO INDIVIDUAL DA SAFRA - AGRO RISK
// =============================================


// =============================================
// INICIAR
// =============================================



// Nome das propriedades carregadas do MySQL
let mapaPropriedadesRelatorios = new Map();


document.addEventListener(
    "DOMContentLoaded",
    carregarRelatorioSafra
);


// =============================================
// CARREGAR RELATÓRIO DA SAFRA
// =============================================


async function carregarRelatorioSafra() {

    const selecionarPropriedade = document.getElementById(
        "filtroPropriedadeRelatorio"
    );

    const selecionarSafra = document.getElementById(
        "filtroSafraRelatorio"
    );

    const botaoVisualizar = document.getElementById(
        "btnVisualizarRelatorio"
    );

    const aviso = document.getElementById(
        "avisoSelecaoRelatorio"
    );

    const carregando = document.getElementById(
        "carregandoRelatorio"
    );

    const conteudo = document.getElementById(
        "conteudoRelatorio"
    );

    const erroTela = document.getElementById(
        "erroRelatorio"
    );

    const parametros = new URLSearchParams(
        window.location.search
    );

    const idSafraUrl = parametros.get("id");

    const propriedadeIdUrl = parametros.get(
        "propriedade_id"
    );

    try {

        // ======================================
        // 1. CONSULTAR MYSQL POR MEIO DO FLASK
        // ======================================

        const respostaPropriedades =
            await listarPropriedades();

        const respostaSafras =
            await listarSafras();

        const propriedades = Array.isArray(
            respostaPropriedades
        )
            ? respostaPropriedades
            : respostaPropriedades?.data;

        const todasSafras = Array.isArray(
            respostaSafras
        )
            ? respostaSafras
            : respostaSafras?.data;

        if (
            !Array.isArray(propriedades) ||
            !Array.isArray(todasSafras)
        ) {
            throw new Error(
                "Não foi possível carregar as propriedades e safras."
            );
        }

        // ======================================
        // 2. ASSOCIAR ID AO NOME DA PROPRIEDADE
        // ======================================

        mapaPropriedadesRelatorios = new Map(
            propriedades.map(propriedade => [
                String(propriedade.id),
                propriedade
            ])
        );

        // Somente safras associadas às
        // propriedades retornadas para o usuário.

        const safras = todasSafras.filter(
            safra => mapaPropriedadesRelatorios.has(
                String(safra.propriedade_id)
            )
        );

        // ======================================
        // 3. PREENCHER PROPRIEDADES
        // ======================================

        selecionarPropriedade.replaceChildren(
            new Option(
                "Selecione uma propriedade",
                ""
            )
        );

        propriedades.forEach(propriedade => {

            selecionarPropriedade.add(
                new Option(
                    propriedade.nome,
                    String(propriedade.id)
                )
            );

        });

        // ======================================
        // 4. PREENCHER SAFRAS DA PROPRIEDADE
        // ======================================

        function preencherSafras(
            propriedadeId,
            safraIdSelecionada = ""
        ) {

            selecionarSafra.replaceChildren(
                new Option(
                    "Selecione uma safra",
                    ""
                )
            );

            const safrasDaPropriedade = safras.filter(
                safra =>
                    String(safra.propriedade_id) ===
                    String(propriedadeId)
            );

            safrasDaPropriedade.forEach(safra => {

                const descricao =
                    `${safra.nome || "Safra sem nome"} - ` +
                    `${safra.cultura || "Cultura não informada"}`;

                selecionarSafra.add(
                    new Option(
                        descricao,
                        String(safra.id)
                    )
                );

            });

            selecionarSafra.disabled =
                safrasDaPropriedade.length === 0;

            selecionarSafra.value = safraIdSelecionada;

            botaoVisualizar.disabled =
                !selecionarSafra.value;

            if (!propriedadeId) {

                aviso.textContent =
                    "Escolha uma propriedade para ver suas safras.";

            } else if (safrasDaPropriedade.length === 0) {

                aviso.textContent =
                    "Esta propriedade ainda não possui safras cadastradas.";

            } else {

                aviso.textContent =
                    `${safrasDaPropriedade.length} safra(s) disponível(is) nesta propriedade.`;
            }
        }

        // ======================================
        // 5. AÇÕES DOS CAMPOS
        // ======================================

        selecionarPropriedade.onchange = function () {

            preencherSafras(
                selecionarPropriedade.value
            );

            // Esconder relatório anterior quando
            // outra propriedade for escolhida.

            if (conteudo) {
                conteudo.style.display = "none";
            }

            if (erroTela) {
                erroTela.style.display = "none";
            }
        };

        selecionarSafra.onchange = function () {

            botaoVisualizar.disabled =
                !selecionarSafra.value;
        };

        botaoVisualizar.onclick = function () {

            const id = selecionarSafra.value;

            if (!id) return;

            // Abre a análise da safra escolhida.

            window.location.href =
                "relatorios.html?id=" +
                encodeURIComponent(id);
        };

        // ======================================
        // 6. SE VEIO PELO BOTÃO ANALISAR SAFRA
        // ======================================

        let safraSelecionada = null;

        if (idSafraUrl) {

            safraSelecionada = safras.find(
                safra =>
                    String(safra.id) === String(idSafraUrl)
            );

            if (!safraSelecionada) {

                mostrarErro(
                    "A safra selecionada não foi encontrada entre as propriedades disponíveis."
                );

                return;
            }
        }

        // ======================================
        // 7. SELEÇÃO INICIAL
        // ======================================

        const propriedadeInicial = safraSelecionada
            ? String(safraSelecionada.propriedade_id)
            : propriedadeIdUrl ||
              (propriedades.length === 1
                  ? String(propriedades[0].id)
                  : "");

        if (
            propriedadeInicial &&
            !mapaPropriedadesRelatorios.has(
                String(propriedadeInicial)
            )
        ) {
            mostrarErro(
                "A propriedade selecionada não foi encontrada."
            );
            return;
        }

        selecionarPropriedade.value =
            propriedadeInicial;

        preencherSafras(
            propriedadeInicial,
            safraSelecionada
                ? String(safraSelecionada.id)
                : ""
        );

        // ======================================
        // 8. EXIBIR RELATÓRIO OU SELETOR
        // ======================================

        if (safraSelecionada) {

            // Relatório individual existente
            renderizarRelatorio(safraSelecionada);

            // Manter geração do PDF
            configurarBotaoPDF(safraSelecionada);

        } else {

            // Entrou pelo menu lateral:
            // mostrar seleção, não mostrar erro.

            if (carregando) {
                carregando.style.display = "none";
            }

            if (conteudo) {
                conteudo.style.display = "none";
            }

            if (erroTela) {
                erroTela.style.display = "none";
            }

            if (propriedades.length === 0) {

                aviso.textContent =
                    "Nenhuma propriedade cadastrada. Cadastre uma propriedade para começar.";
            }
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar relatórios:",
            erro
        );

        if (aviso) {
            aviso.textContent =
                "Erro ao consultar propriedades e safras. Verifique a API Flask.";
        }

        mostrarErro(
            erro.message ||
            "Não foi possível carregar os relatórios."
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


// =============================================
// STATUS REAL DA SAFRA
// =============================================

function obterStatusSafra(safra) {

    const status = String(
        safra.status || "Planejamento"
    ).trim().toLowerCase();

    if (
        status.includes("final") ||
        status.includes("conclu") ||
        status.includes("colhid")
    ) {
        return "Finalizada";
    }

    if (status.includes("andamento")) {
        return "Em andamento";
    }

    if (status.includes("planej")) {
        return "Planejamento";
    }

    return safra.status || "Planejamento";
}




// =============================================
// NOME DA PROPRIEDADE
// =============================================


// =============================================
// NOME REAL DA PROPRIEDADE - MYSQL
// =============================================

function obterNomePropriedade(safra) {

    const propriedade = mapaPropriedadesRelatorios.get(
        String(safra.propriedade_id)
    );

    if (propriedade?.nome) {
        return propriedade.nome;
    }

    if (safra.propriedade_nome) {
        return safra.propriedade_nome;
    }

    if (safra.propriedade?.nome) {
        return safra.propriedade.nome;
    }

    return "Propriedade não identificada";
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