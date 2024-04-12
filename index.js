const express = require('express')
const { log } = require('node:console')
const utils = require('./utils')
const lang = require('./languages/hu')
const session = require('express-session')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(express.urlencoded( {extended: true} ))

app.use(session ({
    secret: 'titkos-kulcs',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },

}))

app.use(function(req, res, next){
    
    res.locals.formattedPrice = utils.formattedPrice
    res.locals.getOriginalPrice = utils.getOriginalPrice

    res.locals.excepts = ['thumbnail', 'images']

    res.locals.translation = function (langAttr){
        if ( (!lang[langAttr]) ) {
            log('NEM talált lang[langAttr]:', lang[langAttr])
            // log('langAttr:', langAttr)
            return langAttr
        } else {
            log('TALÁLT lang[langAttr]:', lang[langAttr])
            return lang[langAttr]
        }
    }
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

app.get('/product/', (req,res) => {
  
    utils.getProducts().then(result => {

        log('req.query_1:', req.query);
        const {id} = req.query 

        const requiredIndex = result.products.findIndex( product => product.id == id)

        log('id:', id);
        log('req.query_2:', req.query);
        log('requiredIndex:', requiredIndex);

        if (requiredIndex === -1 ){
            res.status(404).render( 'errors/404' )
            return
        }

        const item = result.products[requiredIndex]
        log('item OBJEKTUM: ' , item);
        log('---------------------------------------------------------------')
        res.render('product', {item: item, meta: {
     
            title: item.title,
            description: 'Tekintse meg a(z) ' + item.title + ' termékünket az xy webshop kínálatában' 
        }} )
    })
})

app.post('/add-to-cart', (req,res) => {

    req.session.productId = req.body.id
    return res.redirect('/add-to-cart');
})

app.get('/add-to-cart', (req,res) => {
    utils.getProducts().then( productsList => {

        const found = productsList.products.filter( product => product.id == req.session.productId)[0]
        log('found:', found)

        res.render('cart', { item: found, meta: {
            title: 'Kosár',
            description: ''
        } })
    })
})

app.listen(3000, () => {
    log("started at: 3000")
    log('---------------------------------------------------------------')
})