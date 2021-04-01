const IQOption = require("./lib")
const {log, sleep} = require("./utils")

const martinGales = [
	2.22,
	4.88,
	11.90,
	29.05,
	70.89,
	172.97,
	422.05,
	1029.81
]
const candleSize = 60 // MH1 = 60, MH5 = 300
const type = "BINARY" // BINARY OR DIGITAL
const balance = "PRACTICE" // REAL OR PRACTICE
const active = "EURUSD"

let opering = false

async function operate(API) {
	try {
		opering = true
		log("===============================")

		const candles = await API.getCandles(active, candleSize, 3, Date.now())
		const binaryCandles = candles.map(({open, close}) => open >= close ? 0 : 1)
		const direction = binaryCandles.filter(Boolean).length >= 2 ? "PUT" : "CALL"

		log(`ULTIMAS VELAS: ${binaryCandles}`)
		log(`DIREÇAO: ${direction}`)

		for (let martinGale of martinGales) {
			const martinGaleNumber = martinGales.indexOf(martinGale)
			const isMartinGale = martinGale == martinGales[0]
			martinGale = martinGale.toFixed(2)

			log(isMartinGale ? `ENTRADA: R$ ${martinGale}` : `MG${martinGaleNumber}: R$ ${martinGale}`, false)
			const order = await API.buy({
				active,
				action: direction,
				amount: martinGale,
				type,
				duration: candleSize / 60
			})
			await order.close()
			const result = order.quote.win ? "WIN" : "LOSS"
			console.log("", result)

			// resultado = await API.getProfit(balance);
			// console.log(resultado);

			if (result == "WIN") break
		}

		opering = false
	} catch (error) {
		console.log(error)
	}
}


IQOption({
	email: "",
	password: "",
}).then(async API => {
	console.log("Logado com sucesso");
	API.setBalance(balance); // REAL OR PRACTICE

	conta = await API.getBalance(balance);
	// console.log(conta);	

	console.log(conta['currency'], conta['amount']);

	/////////////////////// INFORMAÇÕES COM A VARIÁVEL "CONTA"

	// id: 333772308,
	// user_id: 68125942,
	// type: 1,
	// amount: 295.86,
	// enrolled_amount: 52.18,
	// enrolled_sum_amount: 52.18,
	// hold_amount: 0,
	// orders_amount: 0,
	// currency: 'BRL',
	// tournament_id: null,
	// tournament_name: null,
	// is_fiat: true,
	// is_marginal: false,
	// has_deposits: true,
	// auth_amount: 0,
	// equivalent: 0

	/////////////////////// INFORMAÇÕES COM A VARIÁVEL "CONTA"
		
	const initInterval = setInterval(() => {
		const date = new Date(API.serverTimestamp)
		const nowMinutes = date.getMinutes()
		const nowSeconds = date.getSeconds()

		if (nowMinutes % 5 == 0) { // delay prevent (nowMinutes % 5 == 4 && nowMinutes % 3 == 2) && nowSeconds == 59
			operate(API)
			setInterval(() => {
				if (!opering) operate(API)
			}, (candleSize * 5) * 1000)
			return clearInterval(initInterval)
		}

		// console.clear()
		// log("Aguardando entrada...")
	}, 20)
}).catch(error => {
	log(error.message)
})