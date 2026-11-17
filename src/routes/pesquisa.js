var express = require("express");
var router = express.Router();

var pesquisaController = require("../controllers/pesquisaController");

router.get("/perguntas", function (req, res) {
    pesquisaController.buscarPerguntas(req, res);
});

router.post("/enviar", function (req, res) {
    pesquisaController.enviarPesquisa(req, res);
});

module.exports = router;