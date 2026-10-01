// Controle do tema claro e escuro.
const CHAVE_TEMA = "patasTransformam_tema";

export function configurarTema() {
    const botaoTema = document.getElementById("alternarTema");

    if (!botaoTema) return;

    // Recupera a preferência salva ou utiliza o tema claro.
    const temaSalvo = localStorage.getItem(CHAVE_TEMA) || "claro";
    document.documentElement.setAttribute("data-tema", temaSalvo);

    atualizarBotao();

    botaoTema.addEventListener("click", () => {
        const temaAtual = document.documentElement.getAttribute("data-tema");
        const novoTema = temaAtual === "escuro" ? "claro" : "escuro";

        document.documentElement.setAttribute("data-tema", novoTema);
        localStorage.setItem(CHAVE_TEMA, novoTema);

        atualizarBotao();
    });

    function atualizarBotao() {
        const temaAtual = document.documentElement.getAttribute("data-tema");
        const temaEscuroAtivo = temaAtual === "escuro";

        botaoTema.textContent = temaEscuroAtivo
            ? "☀️ Tema claro"
            : "🌙 Tema escuro";

        botaoTema.setAttribute("aria-pressed", String(temaEscuroAtivo));
        botaoTema.setAttribute(
            "aria-label",
            temaEscuroAtivo
                ? "Ativar tema claro"
                : "Ativar tema escuro"
        );
    }
}