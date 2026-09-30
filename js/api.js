// Comunicação com a API de Localidades do IBGE.
export async function carregarEstados(selectEstado) {
    try {
        const resposta = await fetch(
            "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );
        if (!resposta.ok) throw new Error("Erro ao carregar os estados.");
        const estados = await resposta.json();
        estados.forEach(estado => {
            const opcao = document.createElement("option");
            opcao.value = estado.sigla;
            opcao.textContent = estado.nome;
            selectEstado.appendChild(opcao);
        });
    } catch (erro) {
        console.error("Não foi possível carregar os estados:", erro);
    }
}
