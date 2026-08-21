// ==========================================
// USUÁRIO LOGADO
// ==========================================

const usuarioSalvo = localStorage.getItem("usuario");

if (!usuarioSalvo) {

    alert("Nenhum usuário está logado.");

    window.location.href = "login.html";

}

const usuario = JSON.parse(usuarioSalvo);


// ==========================================
// CAMPOS DO PERFIL
// ==========================================

const campos =
    document.querySelectorAll(
        ".profile-right .form-control"
    );

const nome = campos[0];
const email = campos[1];
const telefone = campos[2];
const cpf = campos[3];
const dataNascimento = campos[4];
const estado = campos[5];
const cidade = campos[6];
const idioma = campos[7];


// ==========================================
// PREENCHER PERFIL
// ==========================================

async function carregarPerfil() {

    try {

        const perfil =
            await buscarPerfil(usuario.id);

        if (!perfil) {

            alert(
                "Não foi possível carregar o perfil."
            );

            return;

        }

        nome.value =
            perfil.nome || "";

        email.value =
            perfil.email || "";

        telefone.value =
            perfil.telefone || "";

        cpf.value =
            perfil.cpf || "";

        dataNascimento.value =
            perfil.data_nascimento || "";

        estado.value =
            perfil.estado || "Minas Gerais";

        cidade.value =
            perfil.cidade || "";

        idioma.value =
            perfil.idioma || "Português";


        // ======================================
        // NOME NO TOPO
        // ======================================

        const nomeTopo =
            document.querySelector(
                ".perfil-topo strong"
            );

        if (nomeTopo) {

            nomeTopo.textContent =
                perfil.nome || "";

        }

    }

    catch (erro) {

        console.error(
            "Erro ao carregar perfil:",
            erro
        );

        alert(
            "Erro ao carregar os dados do perfil."
        );

    }

}


// ==========================================
// FOTO DE PERFIL
// ==========================================

const inputFoto =
    document.getElementById("fotoPerfil");

const previewFoto =
    document.getElementById("previewFoto");

const previewFotoTopo =
    document.getElementById(
        "previewFotoTopo"
    );

const fotoSalva =
    localStorage.getItem("fotoPerfil");

if (fotoSalva) {

    previewFoto.src =
        fotoSalva;

    previewFotoTopo.src =
        fotoSalva;

}


if (inputFoto) {

    inputFoto.addEventListener(
        "change",
        function () {

            const arquivo =
                this.files[0];

            if (!arquivo) return;

            const leitor =
                new FileReader();

            leitor.onload =
                function (e) {

                    previewFoto.src =
                        e.target.result;

                    previewFotoTopo.src =
                        e.target.result;

                    localStorage.setItem(
                        "fotoPerfil",
                        e.target.result
                    );

                };

            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


// ==========================================
// MÁSCARA CPF
// ==========================================

if (cpf) {

    cpf.addEventListener(
        "input",
        function () {

            let valor =
                this.value.replace(
                    /\D/g,
                    ""
                );

            valor =
                valor.replace(
                    /(\d{3})(\d)/,
                    "$1.$2"
                );

            valor =
                valor.replace(
                    /(\d{3})(\d)/,
                    "$1.$2"
                );

            valor =
                valor.replace(
                    /(\d{3})(\d{1,2})$/,
                    "$1-$2"
                );

            this.value =
                valor.substring(
                    0,
                    14
                );

        }
    );

}


// ==========================================
// MÁSCARA TELEFONE
// ==========================================

if (telefone) {

    telefone.addEventListener(
        "input",
        function () {

            let valor =
                this.value.replace(
                    /\D/g,
                    ""
                );

            valor =
                valor.replace(
                    /^(\d{2})(\d)/g,
                    "($1) $2"
                );

            valor =
                valor.replace(
                    /(\d)(\d{4})$/,
                    "$1-$2"
                );

            this.value =
                valor.substring(
                    0,
                    15
                );

        }
    );

}


// ==========================================
// SALVAR PERFIL
// ==========================================

const botaoSalvar =
    document.querySelector(
        ".btn-profile-save"
    );

if (botaoSalvar) {

    botaoSalvar.addEventListener(
        "click",
        async function (e) {

            e.preventDefault();

            // ==================================
            // VERIFICA USUÁRIO
            // ==================================

            const usuarioAtual =
                localStorage.getItem(
                    "usuario"
                );

            if (!usuarioAtual) {

                alert(
                    "Usuário não encontrado. Faça login novamente."
                );

                return;

            }

            const usuarioLogado =
                JSON.parse(
                    usuarioAtual
                );


            // ==================================
            // VALIDA NOME E E-MAIL
            // ==================================

            const novoNome =
                nome.value.trim();

            const novoEmail =
                email.value.trim();

            if (
                !novoNome ||
                !novoEmail
            ) {

                alert(
                    "Nome e e-mail são obrigatórios."
                );

                return;

            }


            // ==================================
            // ENVIA PARA A API
            // ==================================

            try {

                const resposta =
                    await atualizarUsuario(
                        usuarioLogado.id,
                        {
                            nome: novoNome,
                            email: novoEmail
                        }
                    );


                // ==================================
                // ERRO
                // ==================================

                if (!resposta) {

                    alert(
                        "Erro ao atualizar o perfil."
                    );

                    return;

                }


                // ==================================
                // ATUALIZA LOCALSTORAGE
                // ==================================

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(
                        resposta
                    )
                );


                // ==================================
                // ATUALIZA NOME NO TOPO
                // ==================================

                const nomeTopo =
                    document.querySelector(
                        ".perfil-topo strong"
                    );

                if (nomeTopo) {

                    nomeTopo.textContent =
                        resposta.nome;

                }


                // ==================================
                // SUCESSO
                // ==================================

                alert(
                    "Perfil atualizado com sucesso!"
                );

            }

            catch (erro) {

                console.error(
                    "Erro ao atualizar perfil:",
                    erro
                );

                alert(
                    "Erro ao atualizar o perfil."
                );

            }

        }
    );

}


// ==========================================
// BOTÃO CANCELAR
// ==========================================

const cancelar =
    document.querySelector(
        ".btn-profile-cancel"
    );

if (cancelar) {

    cancelar.addEventListener(
        "click",
        function () {

            if (
                confirm(
                    "Deseja cancelar as alterações?"
                )
            ) {

                carregarPerfil();

            }

        }
    );

}


// ==========================================
// INICIAR
// ==========================================

carregarPerfil();