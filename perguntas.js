// const IQOption = require('./lib');
// const { log, sleep } = require('./utils');



var readline = require('readline');
var resposta_vazio = "";

// var leitor = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// leitor.question("Qual módulo pra ler dados no node.js?\n", function(answer) {
//     var resp = answer;
//     console.log("\nSua resposta '" + resp + "' foi grava com sucesso numa variável inútil");
//     leitor.close();
// });


var teste = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

teste.question("Digite aqui o timeframe: \n", function(resposta) {
    var resposta_vazio = resposta;
    console.log("Sua resposta", resposta_vazio);
    teste.close();
})