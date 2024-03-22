const express = require('express')
const { log } = require('node:console')
const utils = require('./utils')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(function(req, res, next){

    res.locals.formattedPrice = utils.formattedPrice
    res.locals.getOriginalPrice = utils.getOriginalPrice
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

        res.write( JSON.stringify( result.products[requiredIndex] ))
        res.end()

/////////////////////////////////////////////////////////////////////////////////////////////////
        // 2. alternatív megoldás: 
        // try {
        //     const product = result.products.filter( product => product.id == req.params.id )[0]
        //     res.write( JSON.stringify( product ))
        //     res.end()
        // } catch {
        //     res.sendStatus(404);
        //     res.end()
        // }
/////////////////////////////////////////////////////////////////////////////////////////////////

    })
})

app.listen(3000, () => {
    console.log("started at: 3000");
})