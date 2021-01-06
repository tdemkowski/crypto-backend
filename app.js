const express = require('express')
const rp = require('request-promise')

const app = express()

const ICON_LOCATION = "./node_modules/cryptocurrency-icons/svg/icon"

// headers: {
//   "X-CMC_PRO_API_KEY": "69759d9d-5d5a-4057-816b-5e94c12ca100"
//   },

const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
        'start': '1',
        'limit': '9',
        'convert': 'AUD'
    },
    headers: {
        "X-CMC_PRO_API_KEY": "69759d9d-5d5a-4057-816b-5e94c12ca100"
    },
    json: true,
    gzip: true
}

app.use((req, res, next) => {
    res.setHeader("X-CMC_PRO_API_KEY","69759d9d-5d5a-4057-816b-5e94c12ca100")
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})

app.get('/crypto', (req, res, next) => {
    rp(requestOptions).then(response => {
        const obj = response.data.map(crypto => {
            const id = crypto.id
            const name = crypto.name
            const symbol = crypto.symbol
            const price = crypto.quote.AUD.price
            const change = crypto.quote.AUD.percent_change_1h

            const max_supply = crypto.max_supply
            const market_cap = crypto.quote.AUD.market_cap
            return {id: id, name: name, price: price, change: change, symbol: symbol, max_supply: max_supply, market_cap: market_cap}
        })
        // res.send(response.data)
        res.send(obj)
    })
    .catch((err) => {
        console.log('API call error: ', err.message)
        res.send(err.message)
    })
})

app.listen(8080)