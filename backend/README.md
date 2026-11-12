# Backend — Conheça a Austrália

## Requisitos
- Node.js instalado (versão LTS recomendada)
- Terminal aberto nesta pasta `backend`

## Instalação e execução
```bash
npm install
npm start
```
A API ficará disponível em `http://localhost:3000`. Para testar, abra `http://localhost:3000/api/status`.

## Rotas
- `POST /api/usuarios` — recebe `{ "nome": "...", "email": "...", "senha": "..." }`
- `POST /api/login` — recebe `{ "email": "...", "senha": "..." }`
- `GET /api/usuario` — retorna os dados da sessão autenticada
- `POST /api/logout` — encerra a sessão

O banco SQLite (`usuarios.db`) e a tabela `usuarios` são criados automaticamente. As senhas são armazenadas com hash usando bcryptjs, nunca em texto puro.

## Observações importantes
Este backend é uma base didática para o projeto. Antes de publicar em produção, configure um `SESSION_SECRET` forte por variável de ambiente, use HTTPS, restrinja a origem do CORS, configure cookies `secure`, adicione proteção contra tentativas repetidas e revise a política de privacidade. Para testar o frontend servido por outra porta, a configuração de CORS permite origem de desenvolvimento; ajuste-a para o endereço exato do site quando necessário.
