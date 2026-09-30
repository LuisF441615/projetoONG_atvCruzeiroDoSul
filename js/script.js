// Lista de estados brasileiros
const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF",
    "ES", "GO", "MA", "MT", "MS", "MG", "PA",
    "PB", "PR", "PE", "PI", "RJ", "RN", "RS",
    "RO", "RR", "SC", "SP", "SE", "TO"
];

// Inicializa os recursos da página que estiver carregada no elemento main.
function inicializarPagina() {
    const campoEstado = document.getElementById("estado");

    if (campoEstado && campoEstado.options.length <= 1) {
        estados.forEach(estado => {
            const opcao = document.createElement("option");
            opcao.value = estado;
            opcao.textContent = estado;
            campoEstado.appendChild(opcao);
        });
    }

    // Máscara de CPF
    const campoCPF = document.getElementById("cpf");
    if (campoCPF) {
        campoCPF.addEventListener("input", () => {
            let valor = campoCPF.value.replace(/\D/g, "").substring(0, 11);
            valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
            valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
            valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            campoCPF.value = valor;
        });
    }

    // Máscara de telefone
    const campoTelefone = document.getElementById("telefone");
    if (campoTelefone) {
        campoTelefone.addEventListener("input", () => {
            let valor = campoTelefone.value.replace(/\D/g, "").substring(0, 11);
            valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
            valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
            campoTelefone.value = valor;
        });
    }

    // Máscara de CEP
    const campoCEP = document.getElementById("cep");
    if (campoCEP) {
        campoCEP.addEventListener("input", () => {
            let valor = campoCEP.value.replace(/\D/g, "").substring(0, 8);
            valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
            campoCEP.value = valor;
        });
    }

    // Exibe disponibilidade apenas para voluntariado e lar temporário
    const campoParticipacao = document.getElementById("participacao");
    const campoDisponibilidade = document.getElementById("campoDisponibilidade");
    const disponibilidade = document.getElementById("disponibilidade");

    function atualizarDisponibilidade() {
        if (!campoParticipacao || !campoDisponibilidade || !disponibilidade) return;

        const precisaDisponibilidade = ["voluntariado", "lar-temporario"]
            .includes(campoParticipacao.value);

        campoDisponibilidade.hidden = !precisaDisponibilidade;
        disponibilidade.required = precisaDisponibilidade;

        if (!precisaDisponibilidade) disponibilidade.value = "";
    }

    if (campoParticipacao && campoDisponibilidade && disponibilidade) {
        campoParticipacao.addEventListener("change", atualizarDisponibilidade);
        atualizarDisponibilidade();
    }

    // Simulação de envio do formulário
    const formulario = document.getElementById("formCadastro");
    const mensagemSucesso = document.getElementById("mensagemSucesso");

    if (formulario) {
        formulario.addEventListener("submit", evento => {
            evento.preventDefault();
            if (mensagemSucesso) {
                mensagemSucesso.textContent =
                    "Cadastro realizado com sucesso! Agradecemos seu interesse em participar.";
            }
            formulario.reset();
            atualizarDisponibilidade();
        });
    }
}

// Identifica a página e atualiza o CSS específico e o link ativo do menu.
async function atualizarLayoutDaPagina(caminho) {
    const arquivo = caminho.split("/").pop() || "index.html";

    const paginas = {
        "index.html": {
            titulo: "Patas que Transformam | Início",
            css: "index.css",
            menu: "Início"
        },
        "projetos.html": {
            titulo: "Patas que Transformam | Projetos",
            css: "projetos.css",
            menu: "Projetos"
        },
        "cadastro.html": {
            titulo: "Patas que Transformam | Participe",
            css: "cadastro.css",
            menu: "Participe"
        }
    };

    const pagina = paginas[arquivo] || paginas["index.html"];

    document.title = pagina.titulo;

    let folha = document.getElementById("pagina-css");

    if (!folha) {
        folha = document.createElement("link");
        folha.id = "pagina-css";
        folha.rel = "stylesheet";
        document.head.appendChild(folha);
    }

    const novoCSS = `css/${pagina.css}`;

    // Aguarda o carregamento do CSS antes de continuar.
    if (folha.getAttribute("href") !== novoCSS) {
        await new Promise((resolve, reject) => {
            folha.onload = resolve;
            folha.onerror = reject;
            folha.href = novoCSS;
        });
    }

    document.querySelectorAll("header nav a").forEach(link => {
        const nomeLink = link.textContent.trim();

        if (nomeLink === pagina.menu) {
            link.classList.add("ativo");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("ativo");
            link.removeAttribute("aria-current");
        }
    });
}

// Carrega apenas o conteúdo principal, preservando cabeçalho e rodapé.
async function navegarPara(url, adicionarHistorico = true) {
    const resposta = await fetch(url.href);

    if (!resposta.ok) {
        throw new Error(`Não foi possível carregar ${url.href}`);
    }

    const html = await resposta.text();

    const documento = new DOMParser().parseFromString(
        html,
        "text/html"
    );

    const novoMain = documento.querySelector("main");
    const mainAtual = document.querySelector("main");

    if (!novoMain || !mainAtual) {
        throw new Error("A página não contém uma área main.");
    }

    // Aguarda o CSS específico da página antes de alterar o conteúdo.
    await atualizarLayoutDaPagina(url.pathname);

    mainAtual.innerHTML = novoMain.innerHTML;

    if (adicionarHistorico) {
        history.pushState(
            {},
            "",
            url.pathname + url.search + url.hash
        );
    }

    inicializarPagina();

    window.scrollTo({ top: 0, behavior: "auto" });
}

// Intercepta os links internos do site e mantém a navegação tradicional como fallback.
document.addEventListener("click", evento => {
    const link = evento.target.closest("a[href]");
    if (!link || evento.defaultPrevented || evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    if (link.target || link.hasAttribute("download")) return;

    const url = new URL(link.href, window.location.href);
    const paginasInternas = ["index.html", "projetos.html", "cadastro.html"];
    const arquivo = url.pathname.split("/").pop();

    if (url.origin !== window.location.origin || !paginasInternas.includes(arquivo)) return;

    evento.preventDefault();
    navegarPara(url).catch(erro => {
        console.error("Falha na navegação SPA:", erro);
        window.location.href = url.href;
    });
});

// Trata os botões voltar e avançar do navegador.
window.addEventListener("popstate", () => {
    navegarPara(new URL(window.location.href), false).catch(() => {
        window.location.reload();
    });
});

// Prepara a página inicial ao abrir o site.
inicializarPagina();
