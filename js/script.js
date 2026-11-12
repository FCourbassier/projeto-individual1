// Atualiza o ano do rodapé, caso o elemento exista.
const ano = document.getElementById("ano");
if (ano) {
  ano.textContent = new Date().getFullYear();
}
