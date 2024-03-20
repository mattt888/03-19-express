const express = require('express')
const { log } = require('node:console')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {

fetch('https://dummyjson.com/products')
    .then(response => response.json() ) 
    .then(response => {
        log('Válaszadat:', response.products)

        res.render('index', {list: response.products, meta: {
            title: 'Terméklista EXPRESS',
            description: 'Ez a webshopunk termékeinek a promó szövege, placeholder szöveg'
        } })

    })
})

app.listen(3000, () => {
    console.log("started at: 3000");
})