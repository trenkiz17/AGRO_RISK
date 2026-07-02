document.addEventListener("DOMContentLoaded", carregarRelatorio);

async function carregarRelatorio() {

    try {

        // Depois será:
        // const relatorio = await buscarRelatorio();

        const relatorio = {

            produtividade: "92%",

            custo: "R$ 1.200",

            safras: 5

        };

        document.getElementById("produtividade").innerText = relatorio.produtividade;

        document.getElementById("custo").innerText = relatorio.custo;

        document.getElementById("safras").innerText = relatorio.safras;

        document.getElementById("tabelaRelatorio").innerHTML = `

            <tr>

                <td>Produtividade Média</td>

                <td>${relatorio.produtividade}</td>

            </tr>

            <tr>

                <td>Custo por Hectare</td>

                <td>${relatorio.custo}</td>

            </tr>

            <tr>

                <td>Safras Ativas</td>

                <td>${relatorio.safras}</td>

            </tr>

        `;

    } catch (erro) {

        console.error(erro);

    }

}

document.getElementById("btnGerar").addEventListener("click", () => {

    alert("Depois vamos gerar um PDF consumindo a API.");

});