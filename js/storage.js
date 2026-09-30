// Operações de armazenamento dos rascunhos do formulário.
const CHAVE_RASCUNHO = "patasTransformam_rascunhoCadastro";

export function salvarRascunho(formulario) {
    const dados = {};
    new FormData(formulario).forEach((valor, nome) => {
        // CPF e consentimento não são persistidos no navegador.
        if (nome !== "cpf" && nome !== "consentimento") dados[nome] = valor;
    });
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(dados));
}

export function restaurarRascunho(formulario) {
    const rascunho = localStorage.getItem(CHAVE_RASCUNHO);
    if (!rascunho) return;
    try {
        const dados = JSON.parse(rascunho);
        Object.entries(dados).forEach(([nome, valor]) => {
            const campo = formulario.elements.namedItem(nome);
            if (campo && campo.type !== "checkbox") campo.value = valor;
        });
    } catch (erro) {
        console.error("Não foi possível recuperar o rascunho:", erro);
        localStorage.removeItem(CHAVE_RASCUNHO);
    }
}

export function removerRascunho() {
    localStorage.removeItem(CHAVE_RASCUNHO);
}
