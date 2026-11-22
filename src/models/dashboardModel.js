var database = require("../database/config");

// Busca as épocas preferidas - pergunta 1
function buscarEpocas() {
    var instrucaoSql = `
        SELECT a.texto AS nome, COUNT(r.id_resposta) AS total
        FROM respostas r
        JOIN alternativas a ON r.alternativa_id = a.id_alternativa
        WHERE r.pergunta_id = 1
        GROUP BY a.id_alternativa, a.texto
        ORDER BY total DESC;
    `;
    return database.executar(instrucaoSql);
}

// Busca o nível de conhecimento - pergunta 2
function buscarConhecimento() {
    var instrucaoSql = `
        SELECT a.texto AS nome, COUNT(r.id_resposta) AS total
        FROM respostas r
        JOIN alternativas a ON r.alternativa_id = a.id_alternativa
        WHERE r.pergunta_id = 2
        GROUP BY a.id_alternativa, a.texto
        ORDER BY total DESC;
    `;
    return database.executar(instrucaoSql);
}

// Busca os pontos turísticos conhecidos - pergunta 3
function buscarPontos() {
    var instrucaoSql = `
        SELECT a.texto AS nome, COUNT(r.id_resposta) AS total
        FROM respostas r
        JOIN alternativas a ON r.alternativa_id = a.id_alternativa
        WHERE r.pergunta_id = 3
        GROUP BY a.id_alternativa, a.texto
        ORDER BY total DESC;
    `;
    return database.executar(instrucaoSql);
}

// Busca as cidades que os participantes desejam visitar - pergunta 4
function buscarCidades() {
    var instrucaoSql = `
        SELECT a.texto AS nome, COUNT(r.id_resposta) AS total
        FROM respostas r
        JOIN alternativas a ON r.alternativa_id = a.id_alternativa
        WHERE r.pergunta_id = 4
        GROUP BY a.id_alternativa, a.texto
        ORDER BY total DESC;
    `;
    return database.executar(instrucaoSql);
}

// Busca os interesses relacionados à natureza - pergunta 5
function buscarNatureza() {
    var instrucaoSql = `
        SELECT a.texto AS nome, COUNT(r.id_resposta) AS total
        FROM respostas r
        JOIN alternativas a ON r.alternativa_id = a.id_alternativa
        WHERE r.pergunta_id = 5
        GROUP BY a.id_alternativa, a.texto
        ORDER BY total DESC;
    `;
    return database.executar(instrucaoSql);
}

// Busca os interesses culturais - pergunta 6
function buscarCultura() {
    var instrucaoSql = `
        SELECT a.texto AS nome, COUNT(r.id_resposta) AS total
        FROM respostas r
        JOIN alternativas a ON r.alternativa_id = a.id_alternativa
        WHERE r.pergunta_id = 6
        GROUP BY a.id_alternativa, a.texto
        ORDER BY total DESC;
    `;
    return database.executar(instrucaoSql);
}

// Busca os principais motivos para visitar a Austrália - pergunta 7
function buscarMotivos() {
    var instrucaoSql = `
        SELECT a.texto AS nome, COUNT(r.id_resposta) AS total
        FROM respostas r
        JOIN alternativas a ON r.alternativa_id = a.id_alternativa
        WHERE r.pergunta_id = 7
        GROUP BY a.id_alternativa, a.texto
        ORDER BY total DESC;
    `;
    return database.executar(instrucaoSql);
}

// Busca as respostas abertas - pergunta 8
function buscarRespostasAbertas() {
    var instrucaoSql = `
        SELECT resposta_texto
        FROM respostas
        WHERE pergunta_id = 8
          AND resposta_texto IS NOT NULL
          AND resposta_texto <> ''
        ORDER BY id_resposta DESC;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarEpocas,
    buscarConhecimento,
    buscarPontos,
    buscarCidades,
    buscarNatureza,
    buscarCultura,
    buscarMotivos,
    buscarRespostasAbertas
};