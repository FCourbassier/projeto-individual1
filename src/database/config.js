var mysql = require("mysql2");

// Configurações de conexão com o banco MySQL
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

// Executa uma consulta comum
function executar(instrucao, valores = []) {
    if (
        process.env.AMBIENTE_PROCESSO !== "producao" &&
        process.env.AMBIENTE_PROCESSO !== "desenvolvimento"
    ) {
        console.log("AMBIENTE NÃO CONFIGURADO!");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO");
    }

    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);

        conexao.connect(function (erro) {
            if (erro) {
                conexao.end();
                reject(erro);
                return;
            }

            conexao.query(instrucao, valores, function (erro, resultados) {
                conexao.end();

                if (erro) {
                    reject(erro);
                } else {
                    resolve(resultados);
                }
            });
        });
    });
}

// Executa várias consultas dentro de uma transação
function executarTransacao(consultas) {
    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);

        conexao.connect(function (erro) {
            if (erro) {
                conexao.end();
                reject(erro);
                return;
            }

            conexao.beginTransaction(function (erro) {
                if (erro) {
                    conexao.end();
                    reject(erro);
                    return;
                }

                var indice = 0;
                var resultados = [];

                function executarProximaConsulta() {
                    if (indice >= consultas.length) {
                        conexao.commit(function (erro) {
                            if (erro) {
                                conexao.rollback(function () {
                                    conexao.end();
                                    reject(erro);
                                });
                                return;
                            }

                            conexao.end();
                            resolve(resultados);
                        });

                        return;
                    }

                    var consulta = consultas[indice];
                    indice++;

                    conexao.query(
                        consulta.instrucao,
                        consulta.valores,
                        function (erro, resultado) {
                            if (erro) {
                                conexao.rollback(function () {
                                    conexao.end();
                                    reject(erro);
                                });
                                return;
                            }

                            resultados.push(resultado);
                            executarProximaConsulta();
                        }
                    );
                }

                executarProximaConsulta();
            });
        });
    });
}

module.exports = {
    executar,
    executarTransacao
};