// Valida os formulários e envia os dados para a API Node.js.
const API_URL = "http://localhost:3000";

function mostrarMensagem(texto, tipo) {
  const mensagem = document.getElementById("mensagem");
  mensagem.textContent = texto;
  mensagem.className = "mensagem visivel " + tipo;
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const formCadastro = document.getElementById("formCadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (nome === "" || email === "" || senha === "" || confirmarSenha === "") {
      mostrarMensagem("Preencha todos os campos.", "erro");
      return;
    }
    if (!emailValido(email)) {
      mostrarMensagem("Digite um e-mail válido.", "erro");
      return;
    }
    if (senha.length < 8) {
      mostrarMensagem("A senha precisa ter pelo menos 8 caracteres.", "erro");
      return;
    }
    if (senha !== confirmarSenha) {
      mostrarMensagem("As senhas não são iguais.", "erro");
      return;
    }

    try {
      const resposta = await fetch(API_URL + "/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome, email: email, senha: senha })
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.mensagem);
      mostrarMensagem("Cadastro realizado! Agora você pode fazer login.", "sucesso");
      formCadastro.reset();
    } catch (erro) {
      mostrarMensagem("Não foi possível conectar ao servidor. Confira se o backend está ligado.", "erro");
    }
  });
}

const formLogin = document.getElementById("formLogin");
if (formLogin) {
  formLogin.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (email === "" || senha === "") {
      mostrarMensagem("Preencha o e-mail e a senha.", "erro");
      return;
    }
    if (!emailValido(email)) {
      mostrarMensagem("Digite um e-mail válido.", "erro");
      return;
    }

    try {
      const resposta = await fetch(API_URL + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, senha: senha })
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.mensagem);
      mostrarMensagem("Login realizado com sucesso!", "sucesso");
    } catch (erro) {
      mostrarMensagem("Não foi possível entrar. Verifique os dados e se o servidor está ligado.", "erro");
    }
  });
}
