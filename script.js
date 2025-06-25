// Produtos padrão (caso o usuário nunca tenha adicionado nada ainda)
const produtosPadrao = [
  { nome: "Pão", preco: 3.00 },
  { nome: "Leite", preco: 4.50 },
  { nome: "Maçã", preco: 2.00 },
];

// Carrega a lista de produtos do localStorage ou usa padrão
function obterProdutos() {
  return JSON.parse(localStorage.getItem("produtos")) || produtosPadrao;
}

function salvarProdutos(lista) {
  localStorage.setItem("produtos", JSON.stringify(lista));
}

// Retorna o carrinho salvo
function obterCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(lista) {
  localStorage.setItem("carrinho", JSON.stringify(lista));
}

// Atualiza a lista de produtos visíveis na "prateleira"
function atualizarProdutos() {
  const produtos = obterProdutos();
  const container = document.querySelector(".produtos");
  container.innerHTML = "";

  produtos.forEach(produto => {
    const div = document.createElement("div");
    div.classList.add("produto");
    div.innerHTML = `
      <span>${produto.nome} - R$${produto.preco.toFixed(2)}</span>
      <button data-produto="${produto.nome}" data-preco="${produto.preco}">Adicionar</button>
    `;
    container.appendChild(div);
  });

  // Adiciona eventos aos novos botões
  document.querySelectorAll("button[data-produto]").forEach(botao => {
    botao.addEventListener("click", () => {
      const nome = botao.getAttribute("data-produto");
      const preco = parseFloat(botao.getAttribute("data-preco"));
      adicionarAoCarrinho(nome, preco);
    });
  });
}

// Atualiza o carrinho na tela
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

// Adiciona ao carrinho
function adicionarAoCarrinho(nome, preco) {
  const carrinho = obterCarrinho();
  carrinho.push({ nome, preco });
  salvarCarrinho(carrinho);
  atualizarCarrinho();
}

// Adiciona um novo produto à lista fixa
document.getElementById("adicionarManual").addEventListener("click", () => {
  const nome = document.getElementById("nomeProduto").value.trim();
  const preco = parseFloat(document.getElementById("precoProduto").value);

  if (nome && !isNaN(preco) && preco > 0) {
    const produtos = obterProdutos();
    produtos.push({ nome, preco });
    salvarProdutos(produtos);
    atualizarProdutos();

    document.getElementById("nomeProduto").value = "";
    document.getElementById("precoProduto").value = "";
  } else {
    alert("Preencha o nome e o preço corretamente.");
  }
});

// Limpar carrinho
document.getElementById("limpar").addEventListener("click", () => {
  localStorage.removeItem("carrinho");
  atualizarCarrinho();
});

// Carrega produtos e carrinho ao iniciar
window.addEventListener("load", () => {
  atualizarProdutos();
  atualizarCarrinho();
});
