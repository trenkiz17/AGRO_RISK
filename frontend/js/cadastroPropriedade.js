// =======================================
// VARIÁVEIS GLOBAIS
// =======================================

let map;
let drawnItems;

let area = 0;
let perimetro = 0;

let geojson = null;

let latitude = null;
let longitude = null;

// =======================================
// INICIAR
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    iniciarMapa();

    iniciarEventos();

});

// =======================================
// MAPA
// =======================================

function iniciarMapa() {

    map = L.map("map").setView([-19.9167, -43.9345], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

        attribution: "&copy; OpenStreetMap"

    }).addTo(map);

    drawnItems = new L.FeatureGroup();

    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({

        edit: {

            featureGroup: drawnItems

        },

        draw: {

            polygon: true,

            rectangle: true,

            marker: false,

            polyline: false,

            circle: false,

            circlemarker: false

        }

    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, desenharArea);

}

// =======================================
// DESENHAR
// =======================================

function desenharArea(e) {

    drawnItems.clearLayers();

    const layer = e.layer;

    drawnItems.addLayer(layer);

    geojson = JSON.stringify(layer.toGeoJSON());

    const latlngs = layer.getLatLngs()[0];

    area = (
        L.GeometryUtil.geodesicArea(latlngs) / 10000
    ).toFixed(2);

    perimetro = calcularPerimetro(latlngs);

    const centro = layer.getBounds().getCenter();

    latitude = centro.lat;

    longitude = centro.lng;

    atualizarResumo();

}

// =======================================
// RESUMO
// =======================================

function atualizarResumo() {

    document.getElementById("area").textContent =
        area + " ha";

    document.getElementById("perimetro").textContent =
        perimetro + " m";

}

// =======================================
// PERÍMETRO
// =======================================

function calcularPerimetro(latlngs) {

    let distancia = 0;

    for (let i = 0; i < latlngs.length; i++) {

        const atual = latlngs[i];

        const proximo = latlngs[(i + 1) % latlngs.length];

        distancia += atual.distanceTo(proximo);

    }

    return distancia.toFixed(2);

}

// =======================================
// EVENTOS
// =======================================

function iniciarEventos() {

    document
        .getElementById("salvar")
        .addEventListener("click", salvarPropriedade);

    document
        .getElementById("limparMapa")
        .addEventListener("click", limparMapa);

}

// =======================================
// LIMPAR
// =======================================

function limparMapa() {

    drawnItems.clearLayers();

    area = 0;

    perimetro = 0;

    latitude = null;

    longitude = null;

    geojson = null;

    atualizarResumo();

}

// =======================================
// SALVAR
// =======================================

async function salvarPropriedade() {

    try {

        if (!document.getElementById("nome").value.trim()) {

            alert("Informe o nome da propriedade.");

            return;

        }

        if (!document.getElementById("cidade").value.trim()) {

            alert("Informe a cidade.");

            return;

        }

        if (!document.getElementById("estado").value.trim()) {

            alert("Informe o estado.");

            return;

        }

        if (!geojson) {

            alert("Desenhe a propriedade no mapa.");

            return;

        }

        const propriedade = {

            nome: document.getElementById("nome").value.trim(),

            cidade: document.getElementById("cidade").value.trim(),

            estado: document.getElementById("estado").value.trim(),

            observacao: document.getElementById("observacao").value.trim(),

            area: area,

            perimetro: perimetro,

            latitude: latitude,

            longitude: longitude,

            geojson: geojson

        };

        console.log("Enviando:", propriedade);

        const resposta = await cadastrarPropriedade(propriedade);

        console.log("Resposta:", resposta);

        if (!resposta) {

            alert("A API não respondeu.");

            return;

        }

        if (resposta.sucesso === false) {

            alert(resposta.mensagem);

            return;

        }

        alert("Propriedade cadastrada com sucesso!");

        if (resposta.id) {

            window.location.href =
                "monitoramento.html?id=" + resposta.id;

        } else {

            window.location.href =
                "monitoramento.html";

        }

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao cadastrar a propriedade.");

    }

}

