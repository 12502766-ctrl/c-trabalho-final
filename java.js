"use strict";

/*
  java.js
  O HTML de cada página já está pronto. Este arquivo só faz as coisas FUNCIONAREM:
  tema claro/escuro, menu do celular, carrinho, busca, máscaras dos campos,
  formulários (cadastro, login, perfil, contato) e a lista de pedidos.
*/

const ENTREGA = 500; // centavos


/* ---------- guardar e ler dados do navegador ---------- */

function ler(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);

    return valor === null ? padrao : JSON.parse(valor);
  } catch {
    return padrao;
  }
}

function salvar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    avisar("Não foi possível salvar os dados neste navegador.");
  }
}

let carrinho = ler("eb-carrinho", []).filter(
  item => item && typeof item.centavos === "number"
);
let pedidos = ler("eb-pedidos", []);
let usuario = ler("eb-usuario", null);

let temporizador;


/* ---------- sessão demonstrativa (vale enquanto a aba estiver aberta) ---------- */

function estaConectado() {
  try {
    return usuario !== null && sessionStorage.getItem("eb-conectado") === "1";
  } catch {
    return false;
  }
}

function definirConectado(valor) {
  try {
    if (valor) {
      sessionStorage.setItem("eb-conectado", "1");
    } else {
      sessionStorage.removeItem("eb-conectado");
    }
  } catch {
    /* sem sessionStorage, o site continua abrindo */
  }
}


/* ---------- funções de apoio ---------- */

function dinheiro(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function criar(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) elemento.className = classe;
  if (texto) elemento.textContent = texto;

  return elemento;
}

function avisar(texto) {
  const caixa = document.querySelector("#mensagem");

  if (!caixa) return;

  caixa.textContent = texto;
  clearTimeout(temporizador);

  temporizador = setTimeout(() => {
    caixa.textContent = "";
  }, 4000);
}

// guarda um aviso para aparecer na PRÓXIMA página (depois de um redirecionamento)
function avisarDepois(texto) {
  try {
    sessionStorage.setItem("eb-aviso", texto);
  } catch {
    /* ignora */
  }
}

function mostrarAvisoPendente() {
  try {
    const texto = sessionStorage.getItem("eb-aviso");

    if (texto) {
      sessionStorage.removeItem("eb-aviso");
      avisar(texto);
    }
  } catch {
    /* ignora */
  }
}

function subtotal() {
  return carrinho.reduce(
    (total, item) => total + item.centavos * item.quantidade,
    0
  );
}

function atualizarContador() {
  const contador = document.querySelector("#contador");

  if (!contador) return;

  contador.textContent = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );
}

function registrarCarrinho() {
  salvar("eb-carrinho", carrinho);
  atualizarContador();
}

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}


/* ---------- tema claro/escuro ---------- */

function aplicarTema(claro) {
  document.body.classList.toggle("claro", claro);

  const botao = document.querySelector("#tema");

  botao.textContent = claro ? "🌙" : "☀️";

  botao.setAttribute(
    "aria-label",
    claro ? "Ativar modo escuro" : "Ativar modo claro"
  );
}

aplicarTema(ler("eb-tema", "escuro") === "claro");

document.querySelector("#tema").addEventListener("click", () => {
  const claro = !document.body.classList.contains("claro");

  aplicarTema(claro);
  salvar("eb-tema", claro ? "claro" : "escuro");
});


/* ---------- menu do celular ---------- */

const botaoMenu = document.querySelector("#menu-botao");
const menu = document.querySelector("#menu");

if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");

    botaoMenu.setAttribute("aria-expanded", aberto);
    botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });
}


/* ---------- página do carrinho ---------- */

const areaItens = document.querySelector("#itens-carrinho");

function desenharCarrinho() {
  const temItens = carrinho.length > 0;

  document.querySelector("#carrinho-vazio").hidden = temItens;
  document.querySelector("#carrinho-conteudo").hidden = !temItens;

  areaItens.textContent = "";

  carrinho.forEach(item => {
    const linha = criar("article", "linha");

    const info = criar("div");
    info.append(
      criar("h3", "", item.nome),
      criar("p", "", dinheiro(item.centavos) + " por unidade")
    );

    const acoes = criar("div", "acoes");

    const menos = criar("button", "botao secundario", "−");
    menos.type = "button";
    menos.dataset.quantidade = item.id;
    menos.dataset.delta = "-1";
    menos.setAttribute("aria-label", "Diminuir quantidade de " + item.nome);

    const mais = criar("button", "botao secundario", "+");
    mais.type = "button";
    mais.dataset.quantidade = item.id;
    mais.dataset.delta = "1";
    mais.setAttribute("aria-label", "Aumentar quantidade de " + item.nome);

    const remover = criar("button", "botao secundario", "Remover");
    remover.type = "button";
    remover.dataset.remover = item.id;

    acoes.append(
      menos,
      criar("strong", "quantidade", String(item.quantidade)),
      mais,
      criar("strong", "", dinheiro(item.centavos * item.quantidade)),
      remover
    );

    linha.append(info, acoes);
    areaItens.appendChild(linha);
  });

  document.querySelector("#subtotal").textContent = dinheiro(subtotal());
  document.querySelector("#entrega").textContent = dinheiro(ENTREGA);
  document.querySelector("#total").textContent = dinheiro(subtotal() + ENTREGA);
}

if (areaItens) desenharCarrinho();


/* ---------- página de pedidos ---------- */

const listaPedidos = document.querySelector("#lista-pedidos");

function cartaoPedido(pedido) {
  const cartao = criar("article", "card conteudo pedido");
  const itens = criar("ul");

  pedido.itens.forEach(item => {
    itens.appendChild(criar(
      "li",
      "",
      item.quantidade + " × " + item.nome + " — " +
        dinheiro(item.centavos * item.quantidade)
    ));
  });

  cartao.append(
    criar("h3", "", "Pedido #" + pedido.id),
    criar("p", "", new Date(pedido.data).toLocaleString("pt-BR")),
    criar("strong", "", pedido.status),
    itens,
    criar("p", "", "Entrega: " + dinheiro(pedido.entrega)),
    criar("strong", "", "Total: " + dinheiro(pedido.total))
  );

  return cartao;
}

if (listaPedidos) {
  const logado = estaConectado();

  document.querySelector("#pedidos-bloqueado").hidden = logado;
  document.querySelector("#pedidos-conteudo").hidden = !logado;

  if (logado) {
    document.querySelector("#sem-pedidos").hidden = pedidos.length > 0;
    pedidos.forEach(pedido => listaPedidos.appendChild(cartaoPedido(pedido)));
  }
}


/* ---------- página de perfil: mostrar os dados salvos ---------- */

const blocoPerfil = document.querySelector("#perfil-conteudo");

if (blocoPerfil) {
  const logado = estaConectado();

  document.querySelector("#perfil-bloqueado").hidden = logado;
  blocoPerfil.hidden = !logado;

  if (logado) {
    Array.from(document.querySelector("#form-perfil").elements).forEach(campo => {
      if (campo.name && usuario[campo.name] !== undefined) {
        campo.value = usuario[campo.name];
      }
    });
  }
}


/* ---------- busca no cardápio e máscaras dos campos ---------- */

document.addEventListener("input", evento => {
  const campo = evento.target;

  if (campo.id === "busca") {
    const termo = normalizar(campo.value.trim());
    let encontrados = 0;

    document.querySelectorAll("#lista-produtos .card").forEach(card => {
      const texto = card.querySelector("h3").textContent + " " +
        card.querySelector("p").textContent;
      const combina = normalizar(texto).includes(termo);

      card.hidden = !combina;
      if (combina) encontrados++;
    });

    document.querySelector("#resultado-busca").textContent =
      encontrados
        ? encontrados + " produto(s) encontrado(s)."
        : "Nenhum produto encontrado. Tente outra busca.";
  }

  if (campo.hasAttribute("data-numerico")) {
    campo.value = campo.value.replace(/\D/g, "");
  }

  const tipo = campo.dataset.mascara;

  if (!tipo) return;

  let numeros = campo.value.replace(/\D/g, "");

  if (tipo === "cpf") {
    campo.value = numeros
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  if (tipo === "cep") {
    campo.value = numeros
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  if (tipo === "telefone") {
    numeros = numeros.slice(0, 11);

    campo.value = numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  }
});


/* ---------- botões ---------- */

document.addEventListener("click", evento => {
  const botao = evento.target.closest("button");

  if (!botao) return;

  // "Adicionar ao carrinho" (os dados do produto estão no próprio botão, no HTML)
  if (botao.hasAttribute("data-adicionar")) {
    const id = Number(botao.dataset.id);
    const item = carrinho.find(item => item.id === id);

    if (item && item.quantidade >= 99) {
      avisar("Limite de 99 unidades por produto.");
      return;
    }

    if (item) {
      item.quantidade++;
    } else {
      carrinho.push({
        id,
        nome: botao.dataset.nome,
        centavos: Number(botao.dataset.centavos),
        imagem: botao.dataset.imagem,
        quantidade: 1
      });
    }

    registrarCarrinho();
    avisar("Produto adicionado ao carrinho!");
  }

  // + e − do carrinho
  if (botao.dataset.quantidade) {
    const id = Number(botao.dataset.quantidade);
    const item = carrinho.find(item => item.id === id);

    if (!item) return;

    item.quantidade = Math.min(
      99,
      item.quantidade + Number(botao.dataset.delta)
    );

    carrinho = carrinho.filter(item => item.quantidade > 0);

    registrarCarrinho();
    desenharCarrinho();
  }

  // remover item
  if (botao.dataset.remover) {
    carrinho = carrinho.filter(
      item => item.id !== Number(botao.dataset.remover)
    );

    registrarCarrinho();
    desenharCarrinho();
  }

  // finalizar pedido de teste
  if (botao.id === "finalizar") {
    if (!carrinho.length) return;

    if (!usuario || !estaConectado()) {
      avisarDepois("Entre ou cadastre-se antes de finalizar.");
      location.href = "login.html";
      return;
    }

    pedidos.unshift({
      id: Date.now().toString().slice(-8),
      data: new Date().toISOString(),
      status: "Pedido de teste registrado",
      entrega: ENTREGA,
      total: subtotal() + ENTREGA,

      itens: carrinho.map(item => ({
        nome: item.nome,
        centavos: item.centavos,
        quantidade: item.quantidade
      }))
    });

    salvar("eb-pedidos", pedidos);

    carrinho = [];
    registrarCarrinho();

    avisarDepois("Pedido de teste registrado. Não haverá cobrança.");
    location.href = "pedidos.html";
  }

  // sair da sessão
  if (botao.id === "sair") {
    definirConectado(false);

    avisarDepois("Você saiu da sessão demonstrativa.");
    location.href = "login.html";
  }

  // excluir dados locais
  if (botao.id === "excluir-conta") {
    const confirmou = confirm(
      "Excluir seu perfil e todos os pedidos deste navegador?"
    );

    if (!confirmou) return;

    localStorage.removeItem("eb-usuario");
    localStorage.removeItem("eb-pedidos");
    localStorage.removeItem("eb-carrinho");

    definirConectado(false);

    avisarDepois("Dados locais excluídos.");
    location.href = "index.html";
  }
});


/* ---------- formulários ---------- */

document.addEventListener("submit", evento => {
  const form = evento.target;

  evento.preventDefault();

  if (!form.reportValidity()) return;

  const dados = Object.fromEntries(new FormData(form));

  // cadastro e edição do perfil
  if (form.id === "form-cadastro" || form.id === "form-perfil") {
    const edicao = form.id === "form-perfil";

    if (!edicao && usuario) {
      avisarDepois("Já existe um perfil local. Entre para editá-lo.");
      location.href = "login.html";
      return;
    }

    if (!edicao && dados.senha !== dados.confirmacao) {
      avisar("As senhas precisam ser iguais.");
      form.elements.confirmacao.focus();
      return;
    }

    // a senha nunca é salva
    delete dados.senha;
    delete dados.confirmacao;

    dados.nome = dados.nome.trim();
    dados.email = dados.email.trim().toLowerCase();
    dados.uf = dados.uf.toUpperCase();

    if (dados.nome.length < 3) {
      avisar("Informe um nome com pelo menos 3 caracteres.");
      return;
    }

    usuario = dados;
    salvar("eb-usuario", usuario);
    definirConectado(true);

    if (edicao) {
      avisar("Perfil atualizado!");
    } else {
      avisarDepois("Cadastro de teste salvo!");
      location.href = "perfil.html";
    }
  }

  // login
  if (form.id === "form-login") {
    const email = dados.email.trim().toLowerCase();

    if (!usuario || usuario.email !== email) {
      avisar("Nenhum cadastro local encontrado com esse e-mail.");
      return;
    }

    definirConectado(true);

    avisarDepois("Sessão demonstrativa iniciada.");
    location.href = "perfil.html";
  }

  // contato
  if (form.id === "form-contato") {
    avisar("Formulário validado. Nenhuma mensagem foi enviada.");
    form.reset();
  }
});


/* ---------- ao abrir qualquer página ---------- */

atualizarContador();
mostrarAvisoPendente();
