const formularioCadastro = document.getElementById("formCadastro");

if (formularioCadastro) {
    formularioCadastro.addEventListener("submit", async function(event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        if (nome.length < 3) {
            alert("O nome deve ter pelo menos 3 caracteres.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            alert("Digite um e-mail válido.");
            return;
        }

        if (senha.length < 8) {
            alert("A senha deve ter no mínimo 8 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não são iguais.");
            return;
        }

        try {
            const resposta = await fetch("/usuarios/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nomeServer: nome,
                    emailServer: email,
                    senhaServer: senha
                })
            });

            const mensagem = await resposta.text();

            if (resposta.ok) {
                alert("Cadastro realizado com sucesso!");
                formularioCadastro.reset();
            } else {
                alert(mensagem);
            }

        } catch (erro) {
            console.log("Erro ao cadastrar:", erro);
            alert("Não foi possível conectar ao servidor.");
        }
    });
}


const formularioLogin = document.getElementById("formLogin");

if (formularioLogin) {
    formularioLogin.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        if (!email.includes("@") || !email.includes(".")) {
            alert("Digite um e-mail válido.");
            return;
        }

        if (senha.length < 8) {
            alert("A senha deve ter no mínimo 8 caracteres.");
            return;
        }

        try {
            const resposta = await fetch("/usuarios/autenticar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailServer: email,
                    senhaServer: senha
                })
            });

            const resultado = await resposta.text();

            if (resposta.ok) {
                const usuario = JSON.parse(resultado);

                alert("Login realizado com sucesso! Bem-vindo(a), " + usuario.nome + "!");

                // Futuramente podemos redirecionar para a página principal.
            } else {
                alert(resultado);
            }

        } catch (erro) {
            console.log("Erro ao fazer login:", erro);
            alert("Não foi possível conectar ao servidor.");
        }
    });
}