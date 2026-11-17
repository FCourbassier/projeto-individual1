var pesquisaModel = require("../models/pesquisaModel");

async function buscarPerguntas(req, res) {
    try {
        var perguntas = await pesquisaModel.buscarPerguntas();

        return res.status(200).json(perguntas);

    } catch (erro) {
        console.log("Erro ao buscar perguntas:", erro);
        return res.status(500).send("Erro ao buscar perguntas da pesquisa.");
    }
}

async function enviarPesquisa(req, res) {
    var token = req.body.token;
    var respostasRecebidas = req.body.respostas;

    // Confere o token anônimo
    var formatoToken = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!formatoToken.test(token || "")) {
        return res.status(400).send("Token de envio inválido.");
    }

    if (!Array.isArray(respostasRecebidas)) {
        return res.status(400).send("Formato de respostas inválido.");
    }
    if (
    respostasRecebidas.some(function (resposta) {
        return (
            !resposta ||
            typeof resposta !== "object" ||
            Array.isArray(resposta)
        );
    })
) {
    return res.status(400).send("Uma das respostas possui formato inválido.");
}

    try {
        // Busca as perguntas e alternativas válidas no banco
        var perguntas = await pesquisaModel.buscarPerguntas();

        var respostasParaSalvar = [];

        for (var pergunta of perguntas) {
            var respostasDaPergunta = respostasRecebidas.filter(
                function (resposta) {
                    return Number(resposta.pergunta_id) === pergunta.id_pergunta;
                }
            );

            if (pergunta.tipo === "texto") {
                var texto = "";

                if (respostasDaPergunta.length > 1) {
                    return res.status(400).send("Resposta de texto duplicada.");
                }

                if (respostasDaPergunta.length === 1) {
                    texto = respostasDaPergunta[0].resposta_texto;

                    if (typeof texto !== "string") {
                        return res.status(400).send("Resposta de texto inválida.");
                    }

                    texto = texto.trim();

                    if (texto.length > 300) {
                        return res.status(400).send("A resposta aberta deve ter até 300 caracteres.");
                    }
                }

                if (pergunta.obrigatoria && !texto) {
                    return res.status(400).send("Preencha todas as perguntas obrigatórias.");
                }

                if (texto) {
                    respostasParaSalvar.push({
                        pergunta_id: pergunta.id_pergunta,
                        alternativa_id: null,
                        resposta_texto: texto
                    });
                }

            } else {
                var alternativasEscolhidas = respostasDaPergunta.map(
                    function (resposta) {
                        return Number(resposta.alternativa_id);
                    }
                );

                if (pergunta.obrigatoria && alternativasEscolhidas.length === 0) {
                    return res.status(400).send("Preencha todas as perguntas obrigatórias.");
                }

                // Pergunta de resposta única
                if (pergunta.tipo === "unica" && alternativasEscolhidas.length !== 1) {
                    return res.status(400).send("Selecione apenas uma alternativa.");
                }

                // Não permite alternativas repetidas
                if (new Set(alternativasEscolhidas).size !== alternativasEscolhidas.length) {
                    return res.status(400).send("Existem alternativas repetidas.");
                }

                // Confere se todas as alternativas pertencem à pergunta
                var idsPermitidos = pergunta.alternativas.map(
                    function (alternativa) {
                        return alternativa.id_alternativa;
                    }
                );

                var alternativasInvalidas = alternativasEscolhidas.some(
                    function (id) {
                        return !idsPermitidos.includes(id);
                    }
                );

                if (alternativasInvalidas) {
                    return res.status(400).send("Uma ou mais alternativas são inválidas.");
                }

                // A opção "Não conheço nenhum" é exclusiva
                if (pergunta.tipo === "multipla") {
                    var opcaoNenhum = pergunta.alternativas.find(
                        function (alternativa) {
                            return alternativa.texto === "Não conheço nenhum desses lugares";
                        }
                    );

                    if (
                        opcaoNenhum &&
                        alternativasEscolhidas.includes(opcaoNenhum.id_alternativa) &&
                        alternativasEscolhidas.length > 1
                    ) {
                        return res.status(400).send("A opção 'Não conheço nenhum' não pode ser combinada com outras.");
                    }
                }

                alternativasEscolhidas.forEach(function (id) {
                    respostasParaSalvar.push({
                        pergunta_id: pergunta.id_pergunta,
                        alternativa_id: id,
                        resposta_texto: null
                    });
                });
            }
        }

        // Impede respostas referentes a perguntas inexistentes
        var idsPerguntasValidos = perguntas.map(
            function (pergunta) {
                return pergunta.id_pergunta;
            }
        );

        var possuiPerguntaInvalida = respostasRecebidas.some(
            function (resposta) {
                return !idsPerguntasValidos.includes(Number(resposta.pergunta_id));
            }
        );

        if (possuiPerguntaInvalida) {
            return res.status(400).send("Foi enviada uma pergunta inválida.");
        }

        // Salva o envio e todas as respostas em uma transação
        await pesquisaModel.salvarPesquisa(token, respostasParaSalvar);

        return res.status(201).json({
            mensagem: "Pesquisa enviada com sucesso!"
        });

    } catch (erro) {
        console.log("Erro ao enviar pesquisa:", erro);

        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).send("Este envio já foi registrado.");
        }

        return res.status(500).send("Erro ao salvar a pesquisa.");
    }
}

module.exports = {
    buscarPerguntas,
    enviarPesquisa
};