var dashboardModel = require("../models/dashboardModel");
async function buscarDados(req, res) {
    try {
        var cidades = await dashboardModel.buscarCidades();
        var epocas = await dashboardModel.buscarEpocas();
        var pontos = await dashboardModel.buscarPontos();
        var motivos = await dashboardModel.buscarMotivos();
        var respostasAbertas = await dashboardModel.buscarRespostasAbertas();
        return res.status(200).json({
            cidades: cidades,
            epocas: epocas,
            pontos: pontos,
            motivos: motivos,
            respostasAbertas: respostasAbertas
        });
    } catch (erro) {
        console.log("Erro ao buscar dados da dashboard:", erro);
        return res.status(500).send("Erro ao carregar os dados da dashboard.");
    }
}
module.exports = {
    buscarDados
};