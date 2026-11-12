// Formulário de cadastro
const formularioCadastro = document.getElementById("formCadastro");

if (formularioCadastro) {
    formularioCadastro.addEventListener("submit", function(event) {
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        if (nome.length < 3) {
            event.preventDefault();
            alert("O nome deve ter pelo menos 3 caracteres.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            event.preventDefault();
            alert("Digite um e-mail válido.");
            return;
        }

        if (senha.length < 8) {
            event.preventDefault();
            alert("A senha deve ter no mínimo 8 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            event.preventDefault();
            alert("As senhas não são iguais.");
            return;
        }
    });
}

// Formulário de login
const formularioLogin = document.getElementById("formLogin");

if (formularioLogin) {
    formularioLogin.addEventListener("submit", function(event) {
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        if (!email.includes("@") || !email.includes(".")) {
            event.preventDefault();
            alert("Digite um e-mail válido.");
            return;
        }

        if (senha.length < 8) {
            event.preventDefault();
            alert("A senha deve ter no mínimo 8 caracteres.");
        }
    });
}