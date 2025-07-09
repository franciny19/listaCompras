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

// Recupera o contador por produto
function obterContadorProdutos() {
  // LocalStorage 6: Recupera o contador individual de produtos do localStorage, ou inicia como objeto vazio.
  return JSON.parse(localStorage.getItem("contadorProdutos")) || {};
}

function salvarContadorProdutos(obj) {
  // LocalStorage 7: Salva o contador individual de produtos no localStorage.
  localStorage.setItem("contadorProdutos", JSON.stringify(obj));
}

// Variável global do contador
let contadorProdutos = obterContadorProdutos();
const botaoContador = document.getElementById("contadorCliques");

// Atualiza o botão de contador
function atualizarContador() {
  const nomes = Object.keys(contadorProdutos);
  if (nomes.length === 0) {
    botaoContador.textContent = "🧮 Nenhum item adicionado ainda";
    return;
  }

  const partes = nomes.map(nome => `${nome}: ${contadorProdutos[nome]}`);
  botaoContador.textContent = `🧮 ${partes.join(" | ")}`;
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

  // Atualiza o contador por produto
  if (contadorProdutos[nome]) {
    contadorProdutos[nome]++;
  } else {
    contadorProdutos[nome] = 1;
  }
  salvarContadorProdutos(contadorProdutos); // LocalStorage 7
  atualizarContador();
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

// eventListener 4: Ao carregar a página
window.addEventListener("load", () => {
  atualizarProdutos();
  atualizarCarrinho();
  atualizarContador(); // Atualiza contador por produto na tela

  // Verifica o tema salvo no localStorage
  const temaSalvo = localStorage.getItem("tema");
  if (temaSalvo === "escuro") {
    document.body.classList.add("escuro");
    document.getElementById("alternarTema").textContent = "☀️ Modo Claro";
  }
});

// eventListener 5: Botão para limpar o contador de cliques
document.getElementById("limparContador").addEventListener("click", () => {
  // LocalStorage 8: Remove o contador do localStorage e reseta o objeto
  localStorage.removeItem("contadorProdutos");
  contadorProdutos = {};
  atualizarContador();
});

// eventListener 6: Alterna o modo claro e escuro ao clicar no botão
document.getElementById("alternarTema").addEventListener("click", () => {
  document.body.classList.toggle("escuro");

  // Salva no localStorage o tema atual
  if (document.body.classList.contains("escuro")) {
    localStorage.setItem("tema", "escuro");
    document.getElementById("alternarTema").textContent = "☀️ Modo Claro";
  } else {
    localStorage.setItem("tema", "claro");
    document.getElementById("alternarTema").textContent = "🌙 Modo Escuro";
  }
});


