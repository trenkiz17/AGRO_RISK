let propriedades = [];

const lista = document.getElementById("listaPropriedades");

async function carregarPropriedades() {

    try {

        propriedades = [
            {
                id: 1,
                nome: "Fazenda Boa Vista",
                cidade: "Franca",
                estado: "SP",
                area: 152,
                cultura: "Soja",
                imagem: "img/fazenda.jpg"
            },
            {
                id: 2,
                nome: "Fazenda Santa Maria",
                cidade: "Uberaba",
                estado: "MG",
                area: 200,
                cultura: "Milho",
                imagem: "img/fazenda2.jpg"
            }
        ];

        // Quando a API estiver pronta, troque a linha acima por:
        // propriedades = await listarPropriedades();

        mostrarPropriedades(propriedades);

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar propriedades.");

    }

}

function mostrarPropriedades(listaDados) {

    lista.innerHTML = "";

    listaDados.forEach(p => {

        lista.innerHTML += `

        <div class="col-lg-4 mb-4">

            <div class="card shadow border-0 rounded-4 h-100">

                <img src="${p.imagem}" class="card-img-top" style="height:220px;object-fit:cover;">

                <div class="card-body">

                    <h4>${p.nome}</h4>

                    <p>

                        <i class="fa-solid fa-location-dot text-success"></i>

                        ${p.cidade} - ${p.estado}

                    </p>

                    <p>

                        <i class="fa-solid fa-ruler-combined text-primary"></i>

                        Área: ${p.area} hectares

                    </p>

                    <p>

                        <i class="fa-solid fa-seedling text-success"></i>

                        Cultura: ${p.cultura}

                    </p>

                </div>

                <div class="card-footer bg-white border-0">

                    <div class="d-grid gap-2">

                        <a href="visualizar-propriedade.html?id=${p.id}" class="btn btn-outline-primary">

                            <i class="fa-solid fa-eye"></i>

                            Visualizar

                        </a>

                        <a href="editar-propriedade.html?id=${p.id}" class="btn btn-warning">

                            <i class="fa-solid fa-pen"></i>

                            Editar

                        </a>

                        <button class="btn btn-danger" onclick="excluir(${p.id})">

                            <i class="fa-solid fa-trash"></i>

                            Excluir

                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

}

const pesquisa = document.getElementById("pesquisa");

if (pesquisa) {

    pesquisa.addEventListener("keyup", function () {

        const valor = this.value.toLowerCase();

        const resultado = propriedades.filter(p =>
            p.nome.toLowerCase().includes(valor)
        );

        mostrarPropriedades(resultado);

    });

}

async function excluir(id) {

    if (!confirm("Deseja realmente excluir esta propriedade?")) {
        return;
    }

    alert("Aqui será chamado o DELETE da API.");

}

carregarPropriedades();