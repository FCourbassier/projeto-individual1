# Conheça a Austrália — versão simples para o 1º semestre

## Arquivos principais
- `index.html`: página inicial.
- `login.html`: formulário de login.
- `cadastro.html`: formulário de cadastro.
- `css/style.css`: aparência da página inicial.
- `css/auth.css`: aparência do login e cadastro.
- `js/script.js`: JavaScript da página inicial.
- `js/auth.js`: validação dos formulários e envio para o backend.
- `backend/app.js`: API Node.js e acesso ao banco SQLite.

## Abrir o site
Abra a pasta no VS Code e use Live Server para abrir `index.html`.

## Ativar cadastro e login
É necessário ter Node.js instalado.
1. Abra o terminal dentro da pasta `backend`.
2. Execute `npm install`.
3. Execute `npm start`.
4. Deixe o terminal aberto enquanto testa o site.

O banco `usuarios.db` e a tabela são criados automaticamente. As senhas são protegidas com bcrypt.

## Conteúdos usados
HTML: estrutura e formulários.
CSS: cores, tamanhos, organização e responsividade.
JavaScript: validações e envio dos formulários.
Node.js/Express: rotas de cadastro e login.
SQL/SQLite: criação e consulta dos usuários.

Felipe Courbassier — RA: 04262024 — SPTech School.
