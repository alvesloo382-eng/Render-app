/* =========================================================
   RENDER — SISTEMA PRINCIPAL
   Moedas + Feijões + Mensagens + Chamadas + Níveis + Saques
   ========================================================= */


/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */

const RENDER_CONFIG = {

    // =========================
    // PACOTES DE MOEDAS
    // =========================

    PACOTES_MOEDAS: [
        { moedas: 100,   preco: 4.90 },
        { moedas: 250,   preco: 9.90 },
        { moedas: 500,   preco: 17.90 },
        { moedas: 1000,  preco: 29.00 },
        { moedas: 2500,  preco: 69.90 },
        { moedas: 5000,  preco: 129.90 },
        { moedas: 10000, preco: 249.90 }
    ],


    // =========================
    // CUSTO DAS INTERAÇÕES
    // =========================

    CUSTO_MENSAGEM: 100,

    // Custo da chamada por minuto
    CUSTO_CHAMADA_MINUTO: 200,


    // =========================
    // FEIJÕES
    // =========================

    // 1.000 feijões = R$ 5,00
    FEIJOES_POR_REAL: 200,

    VALOR_1000_FEIJOES: 5.00,


    // =========================
    // NÍVEIS DAS HOSTS
    // =========================

    NIVEIS_HOST: [
        {
            nivel: 1,
            nome: "Iniciante",
            multiplicador: 1.00
        },
        {
            nivel: 2,
            nome: "Bronze",
            multiplicador: 1.10
        },
        {
            nivel: 3,
            nome: "Prata",
            multiplicador: 1.20
        },
        {
            nivel: 4,
            nome: "Ouro",
            multiplicador: 1.35
        },
        {
            nivel: 5,
            nome: "Diamante",
            multiplicador: 1.50
        }
    ],


    // =========================
    // NÍVEIS DO CHAME
    // =========================

    NIVEIS_CHAME: [
        {
            nivel: 1,
            nome: "Novo",
            multiplicador: 1.00
        },
        {
            nivel: 2,
            nome: "Ativo",
            multiplicador: 1.05
        },
        {
            nivel: 3,
            nome: "Frequente",
            multiplicador: 1.10
        },
        {
            nivel: 4,
            nome: "VIP",
            multiplicador: 1.20
        },
        {
            nivel: 5,
            nome: "VIP Plus",
            multiplicador: 1.30
        }
    ],


    // =========================
    // SAQUES
    // =========================

    VALORES_SAQUE: [
        5,
        15,
        25,
        50,
        100,
        200,
        500
    ],

    SAQUE_MAXIMO: 500,

    LIMITE_SAQUES_DIA: 1,

    TAXA_SAQUE_PERCENTUAL: 5
};


/* =========================================================
   UTILIDADES
   ========================================================= */

function arredondar(valor) {

    return Math.round(
        (Number(valor) + Number.EPSILON) * 100
    ) / 100;

}


function dinheiro(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function dataAtual() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


function horaAtual() {

    return new Date()
        .toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/* =========================================================
   CARTEIRA
   ========================================================= */

function criarCarteira() {

    return {

        moedas: 0,

        feijoes: 0,

        totalMoedasCompradas: 0,

        totalFeijoesRecebidos: 0,

        totalSacado: 0,

        historico: [],

        saques: []

    };

}


/* =========================================================
   USUÁRIO LOCAL
   ========================================================= */

function carregarCarteira() {

    const salva = localStorage.getItem(
        "render_carteira"
    );

    if (!salva) {

        const nova = criarCarteira();

        salvarCarteira(nova);

        return nova;

    }

    try {

        return {
            ...criarCarteira(),
            ...JSON.parse(salva)
        };

    } catch (erro) {

        const nova = criarCarteira();

        salvarCarteira(nova);

        return nova;

    }

}


function salvarCarteira(carteira) {

    localStorage.setItem(
        "render_carteira",
        JSON.stringify(carteira)
    );

}


/* =========================================================
   CARTEIRA ATUAL
   ========================================================= */

let carteira = carregarCarteira();


/* =========================================================
   ATUALIZAR INTERFACE
   ========================================================= */

function atualizarCarteira() {

    carteira = carregarCarteira();

    const elementosMoedas = document.querySelectorAll(
        "[data-render-moedas]"
    );

    elementosMoedas.forEach(elemento => {

        elemento.textContent = carteira.moedas;

    });


    const elementosFeijoes = document.querySelectorAll(
        "[data-render-feijoes]"
    );

    elementosFeijoes.forEach(elemento => {

        elemento.textContent = carteira.feijoes;

    });


    const saldoMoedas = document.getElementById(
        "saldoMoedas"
    );

    if (saldoMoedas) {

        saldoMoedas.textContent = carteira.moedas;

    }


    const saldoFeijoes = document.getElementById(
        "saldoFeijoes"
    );

    if (saldoFeijoes) {

        saldoFeijoes.textContent = carteira.feijoes;

    }

}


/* =========================================================
   COMPRAR MOEDAS
   ========================================================= */

function comprarMoedas(pacote) {

    const encontrado =
        RENDER_CONFIG.PACOTES_MOEDAS.find(
            item => item.moedas === Number(pacote)
        );

    if (!encontrado) {

        alert("Pacote de moedas inválido.");

        return null;

    }


    const compra = {

        id: "COMPRA-" + Date.now(),

        moedas: encontrado.moedas,

        valor: encontrado.preco,

        status: "aguardando_pagamento",

        data: dataAtual(),

        hora: horaAtual()

    };


    return compra;

}


/* =========================================================
   CONFIRMAR COMPRA
   =========================================================
   IMPORTANTE:
   No sistema real essa confirmação deverá vir do servidor
   após confirmação do pagamento.
   ========================================================= */

function confirmarCompra(moedas, valor) {

    moedas = Number(moedas);
    valor = Number(valor);

    if (moedas <= 0) {

        return false;

    }


    carteira = carregarCarteira();


    carteira.moedas += moedas;

    carteira.totalMoedasCompradas += moedas;


    carteira.historico.push({

        tipo: "compra_moedas",

        moedas: moedas,

        valor: valor,

        data: dataAtual(),

        hora: horaAtual()

    });


    salvarCarteira(carteira);

    atualizarCarteira();

    return true;

}


/* =========================================================
   ADICIONAR MOEDAS
   ========================================================= */

function adicionarMoedas(quantidade) {

    quantidade = Number(quantidade);

    if (quantidade <= 0) {

        return false;

    }


    carteira = carregarCarteira();

    carteira.moedas += quantidade;

    salvarCarteira(carteira);

    atualizarCarteira();

    return true;

}


/* =========================================================
   GASTAR MOEDAS
   ========================================================= */

function gastarMoedas(quantidade) {

    quantidade = Number(quantidade);

    carteira = carregarCarteira();


    if (quantidade <= 0) {

        return false;

    }


    if (carteira.moedas < quantidade) {

        alert(
            "Você não possui moedas suficientes."
        );

        return false;

    }


    carteira.moedas -= quantidade;

    salvarCarteira(carteira);

    atualizarCarteira();

    return true;

}


/* =========================================================
   NÍVEL DA HOST
   ========================================================= */

function obterNivelHost(nivel) {

    nivel = Number(nivel) || 1;

    const encontrado =
        RENDER_CONFIG.NIVEIS_HOST.find(
            item => item.nivel === nivel
        );

    return encontrado ||
        RENDER_CONFIG.NIVEIS_HOST[0];

}


/* =========================================================
   NÍVEL DO CHAME
   ========================================================= */

function obterNivelChame(nivel) {

    nivel = Number(nivel) || 1;

    const encontrado =
        RENDER_CONFIG.NIVEIS_CHAME.find(
            item => item.nivel === nivel
        );

    return encontrado ||
        RENDER_CONFIG.NIVEIS_CHAME[0];

}


/* =========================================================
   CALCULAR FEIJÕES DA MENSAGEM
   ========================================================= */

function calcularFeijoesMensagem(
    nivelHost = 1,
    nivelChame = 1
) {

    const host =
        obterNivelHost(nivelHost);

    const chame =
        obterNivelChame(nivelChame);


    /*
       Aqui usamos uma parte do valor da mensagem
       para gerar os feijões da host.

       100 moedas = R$ 2,90 no pacote de 1.000 moedas.

       O valor base convertido em feijões é calculado
       pela configuração da plataforma.
    */

    const valorBase =
        RENDER_CONFIG.CUSTO_MENSAGEM *
        (29 / 1000);


    const multiplicador =
        host.multiplicador *
        chame.multiplicador;


    const valorHost =
        valorBase * 0.40 * multiplicador;


    const feijoes =
        Math.floor(
            valorHost *
            RENDER_CONFIG.FEIJOES_POR_REAL
        );


    return Math.max(
        1,
        feijoes
    );

}


/* =========================================================
   RECEBER FEIJÕES
   ========================================================= */

function adicionarFeijoes(
    quantidade,
    motivo = "atividade"
) {

    quantidade = Number(quantidade);

    if (quantidade <= 0) {

        return false;

    }


    carteira = carregarCarteira();


    carteira.feijoes += quantidade;

    carteira.totalFeijoesRecebidos += quantidade;


    carteira.historico.push({

        tipo: "feijoes_recebidos",

        quantidade: quantidade,

        motivo: motivo,

        data: dataAtual(),

        hora: horaAtual()

    });


    salvarCarteira(carteira);

    atualizarCarteira();

    return true;

}


/* =========================================================
   ENVIAR MENSAGEM
   ========================================================= */

function sendMessage() {

    const campo =
        document.getElementById(
            "messageInput"
        );


    if (!campo) {

        alert(
            "Campo de mensagem não encontrado."
        );

        return;

    }


    const texto =
        campo.value.trim();


    if (!texto) {

        alert(
            "Digite uma mensagem."
        );

        return;

    }


    const custo =
        RENDER_CONFIG.CUSTO_MENSAGEM;


    if (!gastarMoedas(custo)) {

        return;

    }


    /*
       Nível padrão neste protótipo.
       Depois vamos ligar isso ao perfil real
       da host e do usuário.
    */

    const nivelHost = 1;

    const nivelChame = 1;


    const feijoes =
        calcularFeijoesMensagem(
            nivelHost,
            nivelChame
        );


    adicionarFeijoes(
        feijoes,
        "mensagem"
    );


    criarMensagemNaTela(
        "Você",
        texto
    );


    campo.value = "";


    alert(
        "Mensagem enviada!"
    );

}


/* =========================================================
   CRIAR MENSAGEM NA TELA
   ========================================================= */

function criarMensagemNaTela(
    autor,
    texto
) {

    const area =
        document.getElementById(
            "messages"
        );


    if (!area) {

        return;

    }


    const mensagem =
        document.createElement(
            "div"
        );


    mensagem.className =
        "message user-message";


    mensagem.textContent =
        autor + ": " + texto;


    area.appendChild(
        mensagem
    );


    area.scrollTop =
        area.scrollHeight;

}


/* =========================================================
   CHAMADAS
   ========================================================= */

let chamadaAtiva = false;

let intervaloChamada = null;

let minutosChamada = 0;


/* =========================================================
   INICIAR CHAMADA
   ========================================================= */

function startCall() {

    if (chamadaAtiva) {

        alert(
            "A chamada já está ativa."
        );

        return;

    }


    const custoInicial =
        RENDER_CONFIG.CUSTO_CHAMADA_MINUTO;


    if (!gastarMoedas(custoInicial)) {

        return;

    }


    chamadaAtiva = true;

    minutosChamada = 1;


    const nivelHost = 1;

    const nivelChame = 1;


    const feijoesBase =
        Math.floor(
            RENDER_CONFIG.CUSTO_CHAMADA_MINUTO *
            (29 / 1000) *
            0.40 *
            RENDER_CONFIG.FEIJOES_POR_REAL
        );


    const host =
        obterNivelHost(
            nivelHost
        );


    const chame =
        obterNivelChame(
            nivelChame
        );


    const feijoes =
        Math.max(
            1,
            Math.floor(
                feijoesBase *
                host.multiplicador *
                chame.multiplicador
            )
        );


    adicionarFeijoes(
        feijoes,
        "chamada"
    );


    alert(
        "Chamada iniciada."
    );


    intervaloChamada =
        setInterval(
            cobrarMinutoChamada,
            60000
        );

}


/* =========================================================
   COBRAR MINUTO
   ========================================================= */

function cobrarMinutoChamada() {

    if (!chamadaAtiva) {

        return;

    }


    const custo =
        RENDER_CONFIG.CUSTO_CHAMADA_MINUTO;


    if (!gastarMoedas(custo)) {

        encerrarChamada();

        alert(
            "Suas moedas acabaram. A chamada foi encerrada."
        );

        return;

    }


    minutosChamada++;


    const nivelHost = 1;

    const nivelChame = 1;


    const host =
        obterNivelHost(
            nivelHost
        );


    const chame =
        obterNivelChame(
            nivelChame
        );


    const base =
        custo *
        (29 / 1000) *
        0.40 *
        RENDER_CONFIG.FEIJOES_POR_REAL;


    const feijoes =
        Math.max(
            1,
            Math.floor(
                base *
                host.multiplicador *
                chame.multiplicador
            )
        );


    adicionarFeijoes(
        feijoes,
        "chamada"
    );

}


/* =========================================================
   ENCERRAR CHAMADA
   ========================================================= */

function endCall() {

    encerrarChamada();

}


/* =========================================================
   ENCERRAR CHAMADA INTERNO
   ========================================================= */

function encerrarChamada() {

    chamadaAtiva = false;

    minutosChamada = 0;


    if (intervaloChamada) {

        clearInterval(
            intervaloChamada
        );

        intervaloChamada = null;

    }

}


/* =========================================================
   SAQUES
   ========================================================= */

function calcularFeijoesNecessarios(
    valor
) {

    valor = Number(valor);


    return Math.ceil(
        valor *
        RENDER_CONFIG.FEIJOES_POR_REAL
    );

}


/* =========================================================
   CALCULAR TAXA
   ========================================================= */

function calcularTaxaSaque(
    valor
) {

    valor = Number(valor);


    return arredondar(
        valor *
        (
            RENDER_CONFIG.TAXA_SAQUE_PERCENTUAL /
            100
        )
    );

}


/* =========================================================
   CALCULAR VALOR LÍQUIDO
   ========================================================= */

function calcularValorLiquidoSaque(
    valor
) {

    const taxa =
        calcularTaxaSaque(
            valor
        );


    return arredondar(
        valor - taxa
    );

}


/* =========================================================
   SOLICITAR SAQUE
   ========================================================= */

function solicitarSaque(
    valor,
    pix
) {

    valor = Number(valor);

    pix = String(pix || "").trim();


    if (
        !RENDER_CONFIG.VALORES_SAQUE.includes(
            valor
        )
    ) {

        alert(
            "Valor de saque inválido."
        );

        return false;

    }


    if (!pix) {

        alert(
            "Informe sua chave Pix."
        );

        return false;

    }


    if (
        valor >
        RENDER_CONFIG.SAQUE_MAXIMO
    ) {

        alert(
            "Valor acima do limite permitido."
        );

        return false;

    }


    carteira =
        carregarCarteira();


    const hoje =
        dataAtual();


    const saquesHoje =
        carteira.saques.filter(
            saque =>
                saque.data === hoje
        );


    if (
        saquesHoje.length >=
        RENDER_CONFIG.LIMITE_SAQUES_DIA
    ) {

        alert(
            "Você já realizou um saque hoje."
        );

        return false;

    }


    const feijoesNecessarios =
        calcularFeijoesNecessarios(
            valor
        );


    if (
        carteira.feijoes <
        feijoesNecessarios
    ) {

        alert(
            "Você não possui feijões suficientes."
        );

        return false;

    }


    const taxa =
        calcularTaxaSaque(
            valor
        );


    const liquido =
        calcularValorLiquidoSaque(
            valor
        );


    carteira.feijoes -=
        feijoesNecessarios;


    carteira.totalSacado +=
        liquido;


    const saque = {

        id:
            "SAQUE-" +
            Date.now(),

        valorSolicitado:
            valor,

        taxa:
            taxa,

        valorLiquido:
            liquido,

        feijoesUtilizados:
            feijoesNecessarios,

        pix:
            pix,

        status:
            "aguardando_pagamento",

        data:
            hoje,

        hora:
            horaAtual()

    };


    carteira.saques.push(
        saque
    );


    carteira.historico.push({

        tipo:
            "solicitacao_saque",

        valor:
            valor,

        taxa:
            taxa,

        liquido:
            liquido,

        feijoes:
            feijoesNecessarios,

        data:
            hoje,

        hora:
            horaAtual()

    });


    salvarCarteira(
        carteira
    );


    atualizarCarteira();


    alert(
        "Saque solicitado com sucesso!"
    );


    return saque;

}


/* =========================================================
   HISTÓRICO DE SAQUES
   ========================================================= */

function obterHistoricoSaques() {

    carteira =
        carregarCarteira();


    return carteira.saques || [];

}


/* =========================================================
   CONSULTAR SALDOS
   ========================================================= */

function obterSaldoMoedas() {

    carteira =
        carregarCarteira();

    return carteira.moedas;

}


function obterSaldoFeijoes() {

    carteira =
        carregarCarteira();

    return carteira.feijoes;

}


/* =========================================================
  
