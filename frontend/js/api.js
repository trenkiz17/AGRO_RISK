// =============================================
// CONFIGURAÇÃO DA API
// =============================================

const API_URL = "http://localhost:5000";

// =============================================
// MÉTODOS GENÉRICOS
// =============================================

async function request(endpoint, method = "GET", dados = null) {

    const config = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (dados) {
        config.body = JSON.stringify(dados);
    }

    try {

        const resposta = await fetch(API_URL + endpoint, config);

        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status}`);
        }

        return await resposta.json();

    }

    catch (erro) {

        console.error("Erro API:", erro);

        return null;

    }

}

const get = (endpoint) => request(endpoint);

const post = (endpoint, dados) => request(endpoint, "POST", dados);

const put = (endpoint, "PUT", dados);

const del = (endpoint) => request(endpoint, "DELETE");

// =============================================
// LOGIN
// =============================================

async function login(email, senha){

    return await post("/login",{
        email,
        senha
    });

}

async function cadastrarUsuario(usuario){

    return await post("/usuarios",usuario);

}

// =============================================
// PROPRIEDADES
// =============================================

async function listarPropriedades(){

    return await get("/propriedades");

}

async function buscarPropriedade(id){

    return await get(`/propriedades/${id}`);

}

async function cadastrarPropriedade(dados){

    return await post("/propriedades",dados);

}

async function atualizarPropriedade(id,dados){

    return await put(`/propriedades/${id}`,dados);

}

async function excluirPropriedade(id){

    return await del(`/propriedades/${id}`);

}

// =============================================
// SAFRAS
// =============================================

async function listarSafras(){

    return await get("/safras");

}

async function listarSafrasDaPropriedade(id){

    return await get(`/propriedades/${id}/safras`);

}

async function cadastrarSafra(dados){

    return await post("/safras",dados);

}

// =============================================
// DASHBOARD
// =============================================

async function buscarDashboard(){

    return await get("/dashboard");

}

// =============================================
// RELATÓRIOS
// =============================================

async function buscarRelatorios(){

    return await get("/relatorios");

}

// =============================================
// PERFIL
// =============================================

async function buscarPerfil(id){

    return await get(`/usuarios/${id}`);

}

// =============================================
// CLIMA
// =============================================

async function buscarClima(lat,lon){

    return await get(`/clima?lat=${lat}&lon=${lon}`);

}