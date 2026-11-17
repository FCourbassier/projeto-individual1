var usuarioModel = require("../models/usuarioModel");
var bcrypt = require("bcryptjs");

async function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!nome || !email || !senha) {
        return res.status(400).send("Preencha todos os campos!");
    }

    try {
        var usuarios = await usuarioModel.buscarPorEmail(email);

        if (usuarios.length > 0) {
            return res.status(409).send("Este e-mail já está cadastrado!");
        }

        var senhaHash = await bcrypt.hash(senha, 10);

        await usuarioModel.cadastrar(nome, email, senhaHash);

        return res.status(201).send("Cadastro realizado com sucesso!");

    } catch (erro) {
        console.log("Erro ao cadastrar:", erro);
        return res.status(500).send("Erro ao realizar cadastro.");
    }
}

async function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email || !senha) {
        return res.status(400).send("Preencha e-mail e senha!");
    }

    try {
        var usuarios = await usuarioModel.buscarPorEmail(email);

        if (usuarios.length !== 1) {
            return res.status(401).send("E-mail ou senha inválidos.");
        }

        var usuario = usuarios[0];

        var senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).send("E-mail ou senha inválidos.");
        }

        return res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        });

    } catch (erro) {
        console.log("Erro ao autenticar:", erro);
        return res.status(500).send("Erro ao realizar login.");
    }
}

module.exports = {
    cadastrar,
    autenticar
};