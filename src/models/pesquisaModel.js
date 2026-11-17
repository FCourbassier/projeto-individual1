var database = require("../database/config");

// Busca as perguntas e suas alternativas no banco
async function buscarPerguntas() {
    var instrucaoSql = `
        SELECT
            p.id_pergunta,
            p.texto AS pergunta,
            p.tipo,
            p.obrigatoria,
            p.ordem,
            a.id_alternativa,
            a.texto AS alternativa,
            a.ordem AS ordem_alternativa
        FROM perguntas p
        LEFT JOIN alternativas a
            ON p.id_pergunta = a.pergunta_id
        ORDER BY p.ordem, a.ordem;
    `;

    var resultados = await database.executar(instrucaoSql);

    var perguntas = [];

    resultados.forEach(function (registro) {
        var pergunta = perguntas.find(function (item) {
            return item.id_pergunta === registro.id_pergunta;
        });

        if (!pergunta) {
            pergunta = {
                id_pergunta: registro.id_pergunta,
                pergunta: registro.pergunta,
                tipo: registro.tipo,
                obrigatoria: registro.obrigatoria,
                ordem: registro.ordem,
                alternativas: []
            };

            perguntas.push(pergunta);
        }

        if (registro.id_alternativa !== null) {
            pergunta.alternativas.push({
                id_alternativa: registro.id_alternativa,
                texto: registro.alternativa,
                ordem: registro.ordem_alternativa
            });
        }
    });

    return perguntas;
}

// Salva o envio anônimo e suas respostas
async function salvarPesquisa(token, respostas) {
    var consultas = [];

    // Registra o envio da pesquisa
    consultas.push({
        instrucao: `
            INSERT INTO envios_pesquisa (token_envio)
            VALUES (?);
        `,
        valores: [token]
    });

    // Registra cada resposta
    respostas.forEach(function (resposta) {
        consultas.push({
            instrucao: `
                INSERT INTO respostas
                    (envio_id, pergunta_id, alternativa_id, resposta_texto)
                VALUES (
                    (SELECT id_envio
                     FROM envios_pesquisa
                     WHERE token_envio = ?),
                    ?, ?, ?
                );
            `,
            valores: [
                token,
                resposta.pergunta_id,
                resposta.alternativa_id,
                resposta.resposta_texto
            ]
        });
    });

    return database.executarTransacao(consultas);
}

// Disponibiliza as funções para o controller
module.exports = {
    buscarPerguntas,
    salvarPesquisa
};