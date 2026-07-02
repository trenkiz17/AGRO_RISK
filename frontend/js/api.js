// ================= URL DA API =================

const API_URL = "http://localhost:5000";

// ================= MÉTODOS GENÉRICOS =================

// GET
async function get(endpoint) {

    const resposta = await fetch(API_URL + endpoint);

    return await resposta.json();

}

// POST
async function post(endpoint, dados) {

    const resposta = await fetch(API_URL + endpoint, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(dados)

    });

    return await resposta.json();

}

// PUT
async function put(endpoint, dados) {

    const resposta = await fetch(API_URL + endpoint, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(dados)

    });

    return await resposta.json();

}

// DELETE
async function del(endpoint) {

    const resposta = await fetch(API_URL + endpoint, {

        method: "DELETE"

    });

    return await resposta.json();

}

// ================= USUÁRIOS =================

// Login
async function login(email, senha) {

    return await post("/login", {

        email,
        senha

    });

}

// Cadastro
async function cadastrar(nome, email, senha) {

    return await post("/usuarios", {

        nome,
        email,
        senha

    });

}

// ================= PROPRIEDADES =================

// Listar todas
async function listarPropriedades() {

    return await get("/propriedades");

}

// Buscar por ID
async function buscarPropriedade(id) {

    return await get(`/propriedades/${id}`);

}

// Cadastrar
async function cadastrarPropriedade(propriedade) {

    return await post("/propriedades", propriedade);

}

// Atualizar
async function atualizarPropriedade(id, propriedade) {

    return await put(`/propriedades/${id}`, propriedade);

}

// Excluir
async function excluirPropriedade(id) {

    return await del(`/propriedades/${id}`);

}