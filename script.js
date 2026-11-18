let carrinho = [];

function mudarQuantidade(campo) {
  let nome = campo.dataset.nome;
  let preco = Number(campo.dataset.preco);
  let quantidade = Math.floor(Number(campo.value));

  if (isNaN(quantidade) || quantidade < 0) {
    quantidade = 0;
  }

  // procura o produto no carrinho
  let posicao = -1;
  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome === nome) {
      posicao = i;
    }
  }

  if (posicao !== -1 && quantidade === 0) {
    carrinho.splice(posicao, 1);
  } else if (posicao !== -1) {
    carrinho[posicao].quantidade = quantidade;
  } else if (quantidade > 0) {
    carrinho.push({ nome: nome, preco: preco, quantidade: quantidade });
  }

  mostrarCarrinho();
}

function atualizarCampos() {
  let campos = document.querySelectorAll(".produto input");

  for (let i = 0; i < campos.length; i++) {
    let quantidade = 0;
    for (let j = 0; j < carrinho.length; j++) {
      if (carrinho[j].nome === campos[i].dataset.nome) {
        quantidade = carrinho[j].quantidade;
      }
    }
    campos[i].value = quantidade;
  }
}

function remover(posicao) {
  carrinho.splice(posicao, 1);
  mostrarCarrinho();
}

function limpar() {
  carrinho = [];
  mostrarCarrinho();
}

function verValor() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  document.getElementById("area-pagamento").style.display = "block";
}

function finalizar() {
  alert("Compra realizada com sucesso!");
  limpar();
  document.getElementById("forma").value = "";
  mudarForma();
}

function calcularTotal() {
  let total = 0;
  for (let i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].preco * carrinho[i].quantidade;
  }
  return total;
}

function contarItens() {
  let itens = 0;
  for (let i = 0; i < carrinho.length; i++) {
    itens = itens + carrinho[i].quantidade;
  }
  return itens;
}

function formatar(valor) {
  return valor.toFixed(2).replace(".", ",");
}

function mostrarCarrinho() {
  let lista = document.getElementById("lista-carrinho");

  lista.innerHTML = "";

  if (carrinho.length === 0) {
    lista.innerHTML = "<li>Seu carrinho está vazio.</li>";
    document.getElementById("area-pagamento").style.display = "none";
  }

  for (let i = 0; i < carrinho.length; i++) {
    let subtotal = carrinho[i].preco * carrinho[i].quantidade;
    lista.innerHTML += `
      <li>
        ${carrinho[i].nome} (x${carrinho[i].quantidade}) - R$ ${formatar(subtotal)}
        <button onclick="remover(${i})">Remover</button>
      </li>`;
  }

  document.getElementById("total").textContent = formatar(calcularTotal());
  document.getElementById("contador").textContent = contarItens();

  atualizarCampos();
  mostrarPagamento();
}

function mudarForma() {
  let forma = document.getElementById("forma").value;
  let areaParcelas = document.getElementById("area-parcelas");
  let botao = document.getElementById("btn-finalizar");

  if (forma === "") {
    botao.style.display = "none";
  } else {
    botao.style.display = "inline-block";
  }

  if (forma === "cartao") {
    areaParcelas.style.display = "block";
  } else {
    areaParcelas.style.display = "none";
  }

  mostrarPagamento();
}

function mostrarPagamento() {
  let total = calcularTotal();
  let forma = document.getElementById("forma").value;
  let resultado = document.getElementById("resultado");

  if (total === 0 || forma === "") {
    resultado.textContent = "";
  } else if (forma === "pix") {
    let comDesconto = total * 0.95;
    resultado.textContent = "Valor com 5% de desconto: R$ " + formatar(comDesconto);
  } else if (forma === "cartao") {
    let parcelas = Number(document.getElementById("parcelas").value);
    let valorParcela = total / parcelas;
    resultado.textContent = parcelas + "x de R$ " + formatar(valorParcela);
  } else if (forma === "pituca") {
    resultado.textContent = "Débito à vista: R$ " + formatar(total);
  }
}

mostrarCarrinho();