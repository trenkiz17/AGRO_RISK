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

        // DELETE 204 não possui JSON
        if (resposta.status === 204) {
            return true;
        }

        return await resposta.json();

    } catch (erro) {

        console.error("Erro API:", erro);

        return null;
    }
}

const get = (endpoint) => request(endpoint);

const post = (endpoint, dados) =>
    request(endpoint, "POST", dados);

const put = (endpoint, dados) =>
    request(endpoint, "PUT", dados);

const del = (endpoint) =>
    request(endpoint, "DELETE");

// =============================================
// LOGIN
// =============================================

async function login(email, senha) {

    return await post("/login", {
        email,
        senha
    });

}

async function cadastrarUsuarioAPI(usuario) {

    return await post(
        "/usuarios",
        usuario
    );

}

// =============================================
// USUÁRIO / PERFIL
// =============================================

async function buscarPerfil(id) {

    return await get(`/usuarios/${id}`);

}

async function atualizarUsuario(id, dados) {

    return await put(`/usuarios/${id}`, dados);

}



// =============================================
// PROPRIEDADES
// =============================================

async function listarPropriedades() {

    return await get("/propriedades");

}

async function buscarPropriedade(id) {

    return await get(`/propriedades/${id}`);

}

async function cadastrarPropriedade(dados) {

    return await post("/propriedades", dados);

}

async function atualizarPropriedade(id, dados) {

    return await put(`/propriedades/${id}`, dados);

}

async function excluirPropriedade(id) {

    return await del(`/propriedades/${id}`);

}

// =============================================
// SAFRAS
// =============================================

async function listarSafras() {

    return await get("/safras");

}

async function listarSafrasDaPropriedade(id) {

    return await get(`/propriedades/${id}/safras`);

}

async function buscarSafra(id) {

    return await get(`/safras/${id}`);

}

async function cadastrarSafra(dados) {

    return await post("/safras", dados);

}

async function atualizarSafra(id, dados) {

    return await put(`/safras/${id}`, dados);

}

async function excluirSafra(id) {

    return await del(`/safras/${id}`);

}




// =============================================
// DASHBOARD
// =============================================

async function buscarDashboard() {

    return await get("/dashboard");

}

// =============================================
// RELATÓRIOS
// =============================================

async function buscarRelatorios() {

    return await get("/relatorios");

}

// =============================================
// CLIMA
// =============================================

async function buscarClima(lat, lon) {

    return await get(`/clima?lat=${lat}&lon=${lon}`);

}