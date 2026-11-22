var dashboardModel = require("../models/dashboardModel");

function buscarDados(req, res) {
    Promise.all([
        dashboardModel.buscarEpocas(),
        dashboardModel.buscarConhecimento(),
        dashboardModel.buscarPontos(),
        dashboardModel.buscarCidades(),
        dashboardModel.buscarNatureza(),
        dashboardModel.buscarCultura(),
        dashboardModel.buscarMotivos(),
        dashboardModel.buscarRespostasAbertas()
    ])
    .then(function (resultados) {
        res.json({
            epocas: resultados[0],
            conhecimento: resultados[1],
            pontos: resultados[2],
            cidades: resultados[3],
            natureza: resultados[4],
            cultura: resultados[5],
            motivos: resultados[6],
            respostasAbertas: resultados[7]
        });
    })
    .catch(function (erro) {
        console.error("Erro ao buscar dados do dashboard:", erro);
        res.status(500).json(erro);
    });
}

module.exports = {
    buscarDados
};