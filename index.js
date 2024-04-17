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
    cookie: { secure: false, maxAge: (60 * 60 * 24 * 30) * 1000 }, // 30 napig tárolódik a session-ben
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

app.use( (req, res, next) => {
    req.getTotal = utils.getTotal
    return next()
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

    const quantity = req.body.quantity;
    const id = req.body.id;

    if( !req.session.products) {
            req.session.products = []
            req.session.products.push(id)
    } else {
        req.session.products.push(id)
    }

    return res.redirect('/add-to-cart');
})

app.get('/add-to-cart', (req,res) => {

    utils.getProducts().then( productsList => {

        let foundList;
        if ( !req.session.products )
        foundList = []
        foundList = req.session.products

        // const filteredList = productsList.products.filter( filteredItem => {
        //     return foundList.findIndex( foundIndex => {
        //         return foundIndex == filteredItem.id }) > -1
        // })

        const filteredList = productsList.products.filter( filteredItem => 
            foundList.findIndex ( foundIndex => 
                foundIndex == filteredItem.id ) > -1 )
        
        log('foundList = req.session.products:', req.session.products)
        log('foundList:', foundList)
        
        // res.end( JSON.stringify(filteredList))
        // return;

        log('filteredList:', filteredList)

        // res.end(`Az össz ár ${req.getTotal(req.session.products)} ${utils.formattedPrice(price)}`)

        res.render('cart', { items: filteredList, total: req.getTotal(filteredList), meta: {
            title: 'Kosár',
            description: ''
        } })
    })
})

app.listen(3000, () => {
    log("started at: 3000")
    log('---------------------------------------------------------------')
})