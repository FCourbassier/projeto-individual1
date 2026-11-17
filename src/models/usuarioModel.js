var database = require("../database/config");

function buscarPorEmail(email) {
    var instrucaoSql = `
        SELECT id, nome, email, senha
        FROM usuarios
        WHERE email = ?;
    `;

    return database.executar(instrucaoSql, [email]);
}

function cadastrar(nome, email, senha) {
    var instrucaoSql = `
        INSERT INTO usuarios (nome, email, senha)
        VALUES (?, ?, ?);
    `;

    return database.executar(instrucaoSql, [nome, email, senha]);
}

module.exports = {
    buscarPorEmail,
    cadastrar
};