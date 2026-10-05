/* =========================================================
   RENDER — SISTEMA FINANCEIRO
   Moedas dos usuários + Feijões das hosts + Saques
   ========================================================= */

// ===============================
// CONFIGURAÇÕES DA PLATAFORMA
// ===============================

const RENDER_CONFIG = {

    // Moedas compradas pelos usuários
    PACOTES_MOEDAS: [
        { moedas: 100,   preco: 4.90 },
        { moedas: 250,   preco: 9.90 },
        { moedas: 500,   preco: 17.90 },
        { moedas: 1000,  preco: 29.00 },
        { moedas: 2500,  preco: 69.90 },
        { moedas: 5000,  preco: 129.90 },
        { moedas: 10000, preco: 249.90 }
    ],

    // Conversão das hosts
    FEIJOES_POR_REAL: 200,

    // 1.000 feijões = R$ 5
    VALOR_1000_FEIJOES: 5.00,

    // Saques permitidos
    VALORES_SAQUE: [
        5,
        15,
        25,
        50,
        100,
        200,
        500,
        1000,
        2000,
        5000
    ],

    // Máximo por saque
    SAQUE_MAXIMO: 5000,

    // Um saque por dia
    LIMITE_SAQUES_DIA: 1,

    // Taxa configurável pelo administrador
    TAXA_SAQUE_PERCENTUAL: 5
};


// =========================================================
// UTILIDADES
// =========================================================

function arredondar(valor) {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
}

function dataAtual() {
    return new Date().toISOString().split("T")[0];
}


// =========================================================
// CARTEIRA DO USUÁRIO
// =========================================================

function criarCarteira() {

    return {
        moedas: 0,
        feijoes: 0,
        totalMoedasCompradas: 0,
        totalFeijoesRecebidos: 0,
        totalSacado: 0
    };
}


// =========================================================
// COMPRAR MOEDAS
// =========================================================

function comprarMoedas(pacote) {

    const encontrado = RENDER_CONFIG.PACOTES_MOEDAS.find(
        item => item.moedas === pacote
    );

    if (!encontrado) {
        throw new Error("Pacote de moedas inválido.");
    }

    return {
        moedas: encontrado.moedas,
        valor: encontrado.preco,
        status: "aguardando_pagamento"
    };
}


// =========================================================
//
