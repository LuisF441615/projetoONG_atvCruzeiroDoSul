// Navegação SPA e atualização do layout específico de cada página.
import { inicializarPaginaForm } from "./formulario.js";

async function atualizarLayoutDaPagina(caminho) {
    const arquivo = caminho.split("/").pop() || "index.html";
    const paginas = {
        "index.html": { titulo: "Patas que Transformam | Início", css: "index.css", menu: "Início" },
        "projetos.html": { titulo: "Patas que Transformam | Projetos", css: "projetos.css", menu: "Projetos" },
        "cadastro.html": { titulo: "Patas que Transformam | Participe", css: "cadastro.css", menu: "Participe" }
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

async function navegarPara(url, adicionarHistorico = true) {
    const resposta = await fetch(url.href);
    if (!resposta.ok) throw new Error(`Não foi possível carregar ${url.href}`);
    const html = await resposta.text();
    const documento = new DOMParser().parseFromString(html, "text/html");
    const novoMain = documento.querySelector("main");
    const mainAtual = document.querySelector("main");
    if (!novoMain || !mainAtual) throw new Error("A página não contém uma área main.");
    await atualizarLayoutDaPagina(url.pathname);
    mainAtual.innerHTML = novoMain.innerHTML;
    if (adicionarHistorico) {
        history.pushState({}, "", url.pathname + url.search + url.hash);
    }
    await inicializarPaginaForm();
    window.scrollTo({ top: 0, behavior: "auto" });
}

export function configurarNavegacao() {
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
    window.addEventListener("popstate", () => {
        navegarPara(new URL(window.location.href), false).catch(() => window.location.reload());
    });
}
