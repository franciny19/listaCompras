// Obtém o carrinho salvo no localStorage (ou cria vazio se não existir)
function obterCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

// Salva o carrinho atualizado no localStorage
function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Atualiza a lista do carrinho na tela e o total
function atualizarCarrinho() {
  const carrinho = obterCarrinho();
  const lista = document.getElementById("carrinho");
  const total = document.getElementById("total");

  lista.innerHTML = "";
  let soma = 0;

  carrinho.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nome} - R$${item.preco.toFixed(2)}`;
    lista.appendChild(li);
    soma += item.preco;
  });

  total.textContent = soma.toFixed(2);
}

// Adiciona um produto ao carrinho
function adicionarAoCarrinho(nome, preco) {
  const carrinho = obterCarrinho();
  carrinho.push({ nome, preco });
  salvarCarrinho(carrinho);
  atualizarCarrinho();
}

// 🔹 EVENTO PARA BOTÕES PRÉ-DEFINIDOS
document.querySelectorAll("button[data-produto]").forEach(botao => {
  botao.addEventListener("click", () => {
    const nome = botao.getAttribute("data-produto");
    const preco = parseFloat(botao.getAttribute("data-preco"));
    adicionarAoCarrinho(nome, preco);
  });
});

// 🔹 EVENTO PARA ADICIONAR PRODUTO MANUALMENTE
document.getElementById("adicionarManual").addEventListener("click", () => {
  const nomeInput = document.getElementById("nomeProduto");
  const precoInput = document.getElementById("precoProduto");

  const nome = nomeInput.value.trim();
  const preco = parseFloat(precoInput.value);

  // Verifica se os dados são válidos
  if (nome && !isNaN(preco)) {
    adicionarAoCarrinho(nome, preco);

    // Limpa os campos após adicionar
    nomeInput.value = "";
    precoInput.value = "";
  } else {
    alert("Por favor, insira um nome e preço válidos.");
  }
});

// 🔹 EVENTO PARA LIMPAR O CARRINHO
document.getElementById("limpar").addEventListener("click", () => {
  localStorage.removeItem("carrinho");
  atualizarCarrinho();
});

// 🔹 Atualiza a lista ao carregar a página
window.addEventListener("load", atualizarCarrinho);
