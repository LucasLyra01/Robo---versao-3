const IQOption = require('./lib');
const { log, sleep } = require('./utils');
const readlineSync = require('readline-sync');
const random = require('random');

let direcao = null;

real_practice = "PRACTICE"

// var email_digitado = readlineSync.questionEMail('Digite o email: ')
// var senha_digitada = readlineSync.question("Digite a senha: ")

let logado = false;

const email_digitado = ""
const senha_digitada = ""

// var paridades = readlineSync.question('Digite o par: ')
// var paridades = paridades.toUpperCase();
const paridades = [
    'AUDUSD', 'EURAUD', 'EURCAD', 
    'EURGBP', 'EURJPY', 'EURUSD', 
    'GBPAUD', 'GBPCAD', 'GBPCHF', 
    'GBPJPY', 'GBPUSD', 'AUDCAD',
    'AUDJPY', 'USDCHF', 'USDCAD',
]


// var dias = readlineSync.question('Quantos dias que deseja analisar: ')
// var timeframe = readlineSync.question('Digite o timeframe: ');
const dias = 10;
const porcentagem = 80;
const timeframe = 5;

porc_call = porcentagem
porc_put = (100 - porcentagem)


IQOption({
    email: email_digitado,
    password: senha_digitada

    }).then(async API => {

    

        logado = true;

        console.log("Logado com sucesso");

        API.setBalance(real_practice);

        dados_conta = await API.getBalance(real_practice);
        moeda = dados_conta['currency'];
        valor_banca = dados_conta['amount']
        console.log(moeda, valor_banca);

        if (logado === true){

            operando(API)

        }


        }).catch(error =>{
        console.error(error);
})

async function operando(API){

    try {

        async function cataloga(paridades, dias, porc_call, porc_put, timeframe){
            var data = [];
            var datas_testadas = [];
            var time_ = Date.now();
            var sair = false;
            
            do {
                velas = await API.getCandles(paridades, (timeframe * 60), 2, time_)
                velas.reverse();

                for (var x of velas) {

                    var data_completa = await new Date(x['from'] * 1000);
                    data_completa = data_completa.toLocaleDateString();

                    if (datas_testadas.includes(data_completa) == false){
                        await datas_testadas.push(data_completa);
                    }
                    if ((datas_testadas.length) <= dias){

                        if (x['open'] < x['close']){
                            x['cor'] = 'verde';
                        }else if (x['open'] > x['close']){
                            x['cor'] = 'vermelha';
                        }else{
                            x['cor'] = 'doji';
                        }

                        data.push(x);
                        // console.log(data);
                    }else{
                        sair = true;
                        break
                    }
                }

            }while (sair == true) {
                // console.log("saindo");
            }

            analise = [];

            for (var velas of data) {
                var new_date = await new Date(velas['from'] * 1000)
                var horas = new_date.getHours();
                var minutos = new_date.getMinutes();

                var horario = horas + ':' + minutos;

                if (analise.includes(horario) == false) {
                    analise[horario] = {'verde' : 0, 'vermelha': 0, 'doji': 0, '%': 0, 'dir': ''}
                }

                // console.log(analise);

                analise[horario][velas['cor']] += 1

                try {
                    // TENTAR COLOCAR O ROUND AQUI DEPOIS
                    analise[horario]['%'] = (100 * (analise[horario]['verde'] / (analise[horario]['verde'] + analise[horario]['vermelha'] + analise[horario]['doji'])))
                } catch (error) {
                    console.log(error);
                }
            }

            for (var horario of analise) {
                if (analise[horario]['%'] > 50){
                    analise[horario]['dir'] = 'CALL';
                }

                if (analise[horario]['%'] < 50) {
                    analise[horario]['%'], analise[horario]['dir'] = 100 - analise[horario]['%'], 'PUT'
                }
            }

            // console.log(analise);

            return analise

        };

        
        catalogacao = [];

        for (var par of paridades) {
            
            console.log('Catalogando', par);

            catalogacao['par'] = await cataloga(par, dias, porc_call, porc_put, timeframe)

            await console.log(catalogacao);
        }




        cataloga(paridades, 10, 80, 80, timeframe);

    } catch (error) {
        console.error(error);
    }
    
}