var tokenPesquisa = crypto.randomUUID();

document.addEventListener("DOMContentLoaded", function () {
    carregarPerguntas();

    document.getElementById("formPesquisa").addEventListener(
        "submit",
        enviarPesquisa
    );
});

async function carregarPerguntas() {
    var areaPerguntas = document.getElementById("perguntas");

    try {
        var resposta = await fetch("/pesquisa/perguntas");

        if (!resposta.ok) {
            throw new Error("Não foi possível buscar as perguntas.");
        }

        var perguntas = await resposta.json();

        areaPerguntas.innerHTML = "";

        perguntas.forEach(function (pergunta) {
            var bloco = document.createElement("div");
            bloco.classList.add("pergunta");

            var titulo = document.createElement("h2");
            titulo.textContent = pergunta.ordem + ". " + pergunta.pergunta;

            bloco.appendChild(titulo);

            if (pergunta.tipo === "texto") {
                var campoTexto = document.createElement("textarea");

                campoTexto.name = "pergunta_" + pergunta.id_pergunta;
                campoTexto.maxLength = 300;
                campoTexto.placeholder = "Digite sua resposta aqui...";

                bloco.appendChild(campoTexto);

            } else {
                pergunta.alternativas.forEach(function (alternativa) {
                    var label = document.createElement("label");
                    label.classList.add("alternativa");

                    var input = document.createElement("input");

                    input.type = pergunta.tipo === "multipla"
                        ? "checkbox"
                        : "radio";

                    input.name = "pergunta_" + pergunta.id_pergunta;
                    input.value = alternativa.id_alternativa;

                    label.appendChild(input);
                    label.appendChild(
                        document.createTextNode(alternativa.texto)
                    );

                    bloco.appendChild(label);

                    if (
                        pergunta.tipo === "multipla" &&
                        alternativa.texto === "Não conheço nenhum desses lugares"
                    ) {
                        input.addEventListener("change", function () {
                            if (input.checked) {
                                bloco.querySelectorAll(
                                    'input[type="checkbox"]'
                                ).forEach(function (outroInput) {
                                    if (outroInput !== input) {
                                        outroInput.checked = false;
                                    }
                                });
                            }
                        });

                        bloco.querySelectorAll(
                            'input[type="checkbox"]'
                        ).forEach(function (outroInput) {
                            if (outroInput !== input) {
                                outroInput.addEventListener("change", function () {
                                    if (outroInput.checked) {
                                        input.checked = false;
                                    }
                                });
                            }
                        });
                    }
                });
            }

            areaPerguntas.appendChild(bloco);
        });

    } catch (erro) {
        console.log("Erro ao carregar pesquisa:", erro);
        areaPerguntas.textContent =
            "Não foi possível carregar as perguntas. Tente novamente.";
    }
}

// Envia as respostas para o servidor
async function enviarPesquisa(event) {
    event.preventDefault();

    var botao = document.getElementById("botaoEnviar");
    var mensagem = document.getElementById("mensagem");

    var respostas = [];

    var perguntas = document.querySelectorAll(".pergunta");

    perguntas.forEach(function (bloco) {
        var campos = bloco.querySelectorAll("input, textarea");

        campos.forEach(function (campo) {
            var perguntaId = Number(
                campo.name.replace("pergunta_", "")
            );

            if (
                (campo.type === "radio" || campo.type === "checkbox") &&
                campo.checked
            ) {
                respostas.push({
                    pergunta_id: perguntaId,
                    alternativa_id: Number(campo.value),
                    resposta_texto: null
                });
            }

            if (
                campo.tagName === "TEXTAREA" &&
                campo.value.trim() !== ""
            ) {
                respostas.push({
                    pergunta_id: perguntaId,
                    alternativa_id: null,
                    resposta_texto: campo.value.trim()
                });
            }
        });
    });

    botao.disabled = true;
    mensagem.textContent = "Enviando suas respostas...";

    try {
        var resposta = await fetch("/pesquisa/enviar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: tokenPesquisa,
                respostas: respostas
            })
        });

        var resultado = await resposta.text();

        if (!resposta.ok) {
            throw new Error(resultado);
        }

        mensagem.textContent =
            "Pesquisa enviada com sucesso! Obrigado por participar. 🇦🇺";

        document.getElementById("formPesquisa").reset();

        botao.textContent = "Pesquisa enviada";

    } catch (erro) {
        console.log("Erro ao enviar pesquisa:", erro);
        mensagem.textContent = erro.message;
        botao.disabled = false;
    }
}