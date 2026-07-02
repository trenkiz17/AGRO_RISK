// Criar mapa
const map = L.map('map').setView([-22.9, -43.2], 12);

// Camada do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

    attribution: '&copy; OpenStreetMap'

}).addTo(map);

// Camada onde ficam os desenhos
const drawnItems = new L.FeatureGroup();

map.addLayer(drawnItems);

// Ferramentas de desenho
const drawControl = new L.Control.Draw({

    edit: {

        featureGroup: drawnItems

    },

    draw: {

        polygon: true,

        rectangle: true,

        marker: true,

        circle: false,

        polyline: false,

        circlemarker: false

    }

});

map.addControl(drawControl);

// Quando desenhar
map.on(L.Draw.Event.CREATED, function(e){

    const layer = e.layer;

    drawnItems.addLayer(layer);

    const geojson = layer.toGeoJSON();

    coordenadas = JSON.stringify(geojson);

    const latlngs = layer.getLatLngs()[0];

    let area = L.GeometryUtil.geodesicArea(latlngs);

    area = (area / 10000).toFixed(2);

    document.getElementById("area").innerHTML =
        area + " hectares";

});

document.getElementById("salvar").onclick = async () => {

    const propriedade = {

        nome: document.getElementById("nome").value,

        cidade: document.getElementById("cidade").value,

        estado: document.getElementById("estado").value,

        cultura: document.getElementById("cultura").value,

        area: area,

        geojson: coordenadas

    };

    await api.post("/propriedades", propriedade);

    window.location = "propriedades.html";

}