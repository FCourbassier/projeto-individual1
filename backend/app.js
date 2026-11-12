const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("usuarios.db");
const PORTA = 3000;

app.use(cors());
app.use(express.json());

// Cria a tabela de usuários se ela ainda não existir.
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL
  )
`);

// Rota para cadastrar um usuário.
app.post("/api/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "Preencha todos os campos." });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    db.prepare(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)"
    ).run(nome, email.toLowerCase(), senhaHash);

    res.status(201).json({ mensagem: "Cadastro realizado com sucesso." });
  } catch (erro) {
    if (erro.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ mensagem: "Este e-mail já está cadastrado." });
    }
    res.status(500).json({ mensagem: "Erro ao cadastrar usuário." });
  }
});

// Rota para consultar o cadastro e verificar a senha no login.
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Informe e-mail e senha." });
  }

  const usuario = db.prepare(
    "SELECT * FROM usuarios WHERE email = ?"
  ).get(email.toLowerCase());

  if (!usuario) {
    return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
  }

  res.json({ mensagem: "Login realizado com sucesso." });
});

app.listen(PORTA, () => {
  console.log("Servidor rodando em http://localhost:" + PORTA);
});
