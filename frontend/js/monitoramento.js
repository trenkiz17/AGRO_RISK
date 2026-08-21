// ===================================================
// MONITORAMENTO
// ===================================================

let map;

// ======================================
// INICIAR
// ======================================

document.addEventListener("DOMContentLoaded", async () => {

    carregarPropriedade();

    carregarSafra();

    iniciarMapa();

    carregarClima();

    carregarGrafico();

});

// ======================================
// PROPRIEDADE
// ======================================

async function carregarPropriedade() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id = params.get("id");

    if (!id) {

        alert("Propriedade não encontrada.");

        return;

    }

    const propriedade =
        await buscarPropriedade(id);

    if (!propriedade) {

        alert("Erro ao carregar propriedade.");

        return;

    }

    // ======================================
    // PREENCHER INFORMAÇÕES
    // ======================================

    document.getElementById(
        "nomePropriedade"
    ).textContent =
        propriedade.nome || "-";

    document.getElementById(
        "cidade"
    ).textContent =
        propriedade.cidade || "-";

    document.getElementById(
        "estado"
    ).textContent =
        propriedade.estado || "-";

    document.getElementById(
        "area"
    ).textContent =
        propriedade.area || "-";

    document.getElementById(
        "cultura"
    ).textContent =
        propriedade.cultura || "-";

    // ======================================
    // DESENHAR PROPRIEDADE NO MAPA
    // ======================================

    desenharPropriedade(
        propriedade.geojson
    );

    // ======================================
    // BOTÃO EDITAR
    // ======================================

    const btnEditar =
        document.getElementById("btnEditar");

    if (btnEditar) {

        btnEditar.onclick = function () {

            window.location.href =
                "cadastro_Propriedade.html?id=" +
                propriedade.id;

        };

    }

}

// ======================================
// DESENHAR PROPRIEDADE
// ======================================

function desenharPropriedade(geojson) {

    if (!geojson) return;

    try {

        const camada =
            L.geoJSON(
                JSON.parse(geojson)
            ).addTo(map);

        map.fitBounds(
            camada.getBounds()
        );

    }

    catch (erro) {

        console.error(
            "Erro ao desenhar propriedade:",
            erro
        );

    }

}

// ======================================
// SAFRA
// ======================================

function carregarSafra() {

    document.getElementById(
        "safra"
    ).textContent = "--";

    document.getElementById(
        "produtividade"
    ).textContent = "--";

    document.getElementById(
        "plantio"
    ).textContent = "--";

    document.getElementById(
        "colheita"
    ).textContent = "--";

}

// ======================================
// MAPA
// ======================================

function iniciarMapa() {

    map = L.map("map").setView(
        [-19.9167, -43.9345],
        12
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap"
        }
    ).addTo(map);

}

// ======================================
// CLIMA
// ======================================

async function carregarClima() {

    try {

        document.getElementById(
            "temperatura"
        ).textContent = "--";

        document.getElementById(
            "umidade"
        ).textContent = "--";

        document.getElementById(
            "vento"
        ).textContent = "--";

        document.getElementById(
            "chuva"
        ).textContent = "--";

        document.getElementById(
            "hojeTemp"
        ).textContent = "--";

        document.getElementById(
            "amanhaTemp"
        ).textContent = "--";

        document.getElementById(
            "dia2Temp"
        ).textContent = "--";

        document.getElementById(
            "dia3Temp"
        ).textContent = "--";

    }

    catch (erro) {

        console.error(erro);

    }

}

// ======================================
// GRÁFICO
// ======================================

function carregarGrafico() {

    const canvas =
        document.getElementById(
            "graficoSafra"
        );

    if (!canvas) return;

    new Chart(canvas, {

        type: "line",

        data: {

            labels: [
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun"
            ],

            datasets: [

                {

                    label: "Produtividade",

                    data: [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ],

                    borderColor: "#2E7D32",

                    backgroundColor:
                        "rgba(46,125,50,.15)",

                    fill: true,

                    tension: .4

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}