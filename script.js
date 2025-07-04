// Produtos padrão (caso o usuário nunca tenha adicionado nada ainda)
const produtosPadrao = [
  { nome: "Pão", preco: 3.00 },
  { nome: "Leite", preco: 4.50 },
  { nome: "Maçã", preco: 2.00 },
];

// Carrega a lista de produtos do localStorage ou usa padrão
function obterProdutos() {
  // LocalStorage 1: Recupera a lista de produtos armazenada no localStorage, ou usa os produtos padrão se não houver nada salvo.
  return JSON.parse(localStorage.getItem("produtos")) || produtosPadrao;
}

function salvarProdutos(lista) {
  // LocalStorage 2: Salva a lista de produtos no localStorage, convertendo o array para string JSON.
  localStorage.setItem("produtos", JSON.stringify(lista));
}

// Retorna o carrinho salvo
function obterCarrinho() {
  // LocalStorage 3: Recupera a lista de itens do carrinho armazenada no localStorage, ou retorna array vazio se não houver nada salvo.
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(lista) {
  // LocalStorage 4: Salva a lista do carrinho no localStorage, convertendo o array para string JSON.
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

  // eventListener 1: É disparado quando um botão "Adicionar" é clicado, e chama a função que adiciona o item ao carrinho
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

// eventListener 2: É disparado quando o usuário clica no botão de adicionar produto manualmente
document.getElementById("adicionarManual").addEventListener("click", () => {
  const nome = document.getElementById("nomeProduto").value.trim();
  const preco = parseFloat(document.getElementById("precoProduto").value);

  if (nome && !isNaN(preco) && preco > 0) {
    const produtos = obterProdutos();
    produtos.push({ nome, preco });
    salvarProdutos(produtos); // LocalStorage 2 (reutilizado): salva os produtos atualizados
    atualizarProdutos();

    document.getElementById("nomeProduto").value = "";
    document.getElementById("precoProduto").value = "";
  } else {
    alert("Preencha o nome e o preço corretamente.");
  }
});

// eventListener 3: É disparado quando o usuário clica no botão de limpar carrinho
document.getElementById("limpar").addEventListener("click", () => {
  // LocalStorage 5: Remove a chave "carrinho" do localStorage, limpando o carrinho.
  localStorage.removeItem("carrinho");
  atualizarCarrinho();
});

// eventListener 4: É disparado quando o documento é totalmente carregado no navegador
window.addEventListener("load", () => {
  atualizarProdutos();
  atualizarCarrinho();
});

