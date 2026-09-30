// Funcionalidades e eventos do formulário de cadastro.
import { carregarEstados } from "./api.js";
import { salvarRascunho, restaurarRascunho, removerRascunho } from "./storage.js";

export async function inicializarPaginaForm() {
    // Campo estado
    const campoEstado = document.getElementById("estado");
    if (campoEstado && campoEstado.options.length <= 1) {
        await carregarEstados(campoEstado);
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

    // Exibe disponibilidade apenas para voluntariado e lar temporário.
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

    // Simulação de envio do formulário.
    const formulario = document.getElementById("formCadastro");
    const mensagemSucesso = document.getElementById("mensagemSucesso");
    if (formulario) {
        restaurarRascunho(formulario);
        atualizarDisponibilidade();
        formulario.addEventListener("input", () => salvarRascunho(formulario));
        formulario.addEventListener("change", () => salvarRascunho(formulario));
        formulario.addEventListener("submit", evento => {
            evento.preventDefault();
            if (mensagemSucesso) {
                mensagemSucesso.textContent =
                    "Cadastro realizado com sucesso! Agradecemos seu interesse em participar.";
            }
            formulario.reset();
            removerRascunho();
            atualizarDisponibilidade();
        });
    }
}
