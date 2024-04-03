const express = require('express')
const { log } = require('node:console')
const utils = require('./utils')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(function(req, res, next){

    res.locals.formattedPrice = utils.formattedPrice
    res.locals.getOriginalPrice = utils.getOriginalPrice

    res.locals.excepts = ['thumbnail', 'images']

    next()
})

app.get('/', (req, res) => {

utils.getProducts()
    .then(response => {
        // log('Válaszadat:', response.products)
        res.render('index', {list: response.products, meta: {
            title: 'Terméklista EXPRESS',
            description: 'Ez a webshopunk termékeinek a promó szövege, placeholder szöveg'
        } })

    })
})

app.get('/product/:id', (req,res) => {
  
    utils.getProducts().then(result => {

        const requiredIndex = result.products.findIndex( product => product.id == req.params.id)

        if (requiredIndex === -1 ){
            res.status(404).render( 'errors/404' )
            return
        }

        const item = result.products[requiredIndex]
        console.log('item OBJEKTUM: ' , item);

        res.render('product', {item: item, meta: {
     
            title: item.title,
            description: 'Tekintse meg a(z) ' + item.title + ' termékünket az xy webshop kínálatában' 
        }} )
    })
})

app.listen(3000, () => {
    console.log("started at: 3000");
})