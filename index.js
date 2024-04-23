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
    res.locals.getSubtotal = utils.getSubtotal
    res.locals.getFulltotal = utils.getFulltotal


    res.locals.excepts = ['thumbnail', 'images']

    res.locals.translation = function (langAttr){
        if ( !lang[langAttr] ) {
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

        log('req.query.id:', req.query.id)
        log('id:', id);
        log('typeof id:', typeof(id));
        log('req.query_2:', req.query);
        log('requiredIndex:', requiredIndex);
        log('typeof requiredIndex:', typeof(requiredIndex));
        
        if (requiredIndex === -1 ){
            res.status(404).render( 'errors/404' )
            return
        }

        const item = result.products[requiredIndex]
        log('item OBJEKTUM ami = result.products[requiredIndex]: ' , item);
        log('---------------------------------------------------------------')
        res.render('product', {item: item, meta: {
     
            title: item.title,
            description: 'Tekintse meg a(z) ' + item.title + ' termékünket az xy webshop kínálatában' 
        }} )
    })
})

app.post('/add-to-cart', (req,res) => {

    log('POST /add-to-cart Kezdete: ---------------------------------------------------------------')
    log('req.body.id: ', req.body.id )
    log('req.session.products 11111: ', req.session.products )

    if( !req.session.products) {

        log('!req.session.products: ', !req.session.products )
        log('req.session.products 22222: ', req.session.products )

        req.session.products = []
        log('req.session.products 33333: ', req.session.products )

        /* 1111  2024 04 18  11:00
        objektumokat kell belepakolni tömbelemként
        vezércsel: az egész req.body-t fogjuk küldeni
        itt:
            if( !req.session.products) {
                req.session.products.push(req.body) }
        és itt is:
            else {
                req.session.products.push(req.body) }
        mert ebben akkor benne lesz az id és a quantity is
        utána a get-es /add-to-cart-hoz fogunk továbbítódni
        ott pedig meg kellene valahogy jeleníteni
        itt:
        req.session.products.push(req.body)
        az egész objektumot belepakoljuk a session-be
        scroll to 
        app.get('/add-to-cart', 
        return res.end( JSON.stringify(req.session.products))
        output a böngészőben:
        [{"quantity":"2","id":"2"}, {"quantity":"5","id":"3"}, {"quantity":"9","id":"4"}]
        ez egy tömb aminek objektumok alkotják az elemeit
        */
        req.session.products.push(req.body)
        log('req.session.products 44444: ', req.session.products )

    }

    const findId = req.body.id
    const requiredIndex = req.session.products.findIndex( obj => obj.id == findId)

    if (requiredIndex > -1) {
        req.session.products.splice( requiredIndex, 1)
    }

    req.session.products.push(req.body)
    log('req.session.products 55555: ', req.session.products )

    log('POST /add-to-cart VÉGE-----------------------------------------------------------------')
    return res.redirect('/add-to-cart');
})

app.get('/add-to-cart', (req,res) => {

    log('GET /add-to-cart Kezdete ---------------------------------------------------------------')
    // return res.end( JSON.stringify(req.session.products))

    utils.getProducts().then( productsList => {

        let foundList;
        if ( !req.session.products )
        log('!req.session.products: ', !req.session.products)

        log('foundList 111: ', foundList)
        foundList = []
        log('foundList 222: ', foundList)

        foundList = req.session.products
        log('foundList 333 = req.session.products:', foundList)
        log('foundList 444:', foundList)

        const filteredList = productsList.products.filter( filteredItem =>
            foundList.findIndex ( foundIndex => 
         // foundList 444: [ '1', '2', '3', '4' ]
         // foundList 444: [{"quantity":"3","id":"1"}, {"quantity":"6","id":"2"}]
                foundIndex.id == filteredItem.id ) > -1 )

        let finalList = []
        foundList.forEach( id_qtty => {
            let product222 = productsList.products.filter( p => p.id == id_qtty.id )[0]
            product222.quantity = id_qtty.quantity
            log('product222 tömb Kezdete:-----------------------------------------------------------------', product222)
            log('product222 tömb VÉGE:----------------------------------------------------------------------')

            finalList.push(product222)
            log('finalList tömb Kezdete:-----------------------------------------------------------------', finalList)
            log('finalList tömb VÉGE ----------------------------------------------------------------------------', finalList)
        })
        // res.end( JSON.stringify(filteredList))
        // return;

        log('filteredList tömb Kezdete ----------------------------------------------------------------------------', filteredList)
        log('filteredList tömb VÉGE ----------------------------------------------------------------------------')

        res.render('cart', { items: finalList, 
            total: req.getTotal(finalList), 
            subtotal: utils.getSubtotal(finalList),
            fulltotal: utils.getFulltotal(finalList),
            meta: {
            title: 'Kosár',
            description: ''
        } })
    })
})

app.listen(3000, () => {
    log("started at: 3000")
    log('--------------------------------------------------------------------------------')
})

