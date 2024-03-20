const express = require('express')
const { log } = require('node:console')

const app = express()

/* 222
be kell állítani hogy milyen megjelenítést használ:
app.set('')
view engine, és ez az ejs template keezelő lesz amit használni fogunk
*/
app.set('view engine', 'ejs')

/*
az app.use segítségével 
bizonyos beállításokat fogunk tudni eszközölni az alkalmazáson
de olyan beállításokat, amik nem egyszerű kulcs-érték párokat
mint a get-tel vagy set-tel állítottunk be
a use-zal middleware-ek vagyis ilyen köztes funkciók/folyamatok lefuttatása segítségével tudunk 
különböző beállításokat eszközölni
az express keretrendszer biztosít számunkra néhány ilyen kész function-t 
ami ezeket a folyamatokat beálítja
pl. a statikus mappák meghatározása az alkalmazáson belül
vagyis az abban található tartalom az majd ilyen statikusként lesz értelmezve
és nem lesz ráengedve az index.js-re hogy értelmezze mint URL-t, mint root-ot
*/
app.use(express.static('public'))

/* 111
útvonaldefinició:
a megszólítás metódusát megadva: get
így jön ki hogy: 
app.get
megadva azt az útvonalat amire hallgattatni szeretném: ('/')
*/
app.get('/', (req, res) => {


fetch('https://dummyjson.com/products')
    .then(response => response.json() ) 
    .then(response => {
        log('Válaszadat:', response.products)
        /* 
        itt jön most egy vezércsel:
        megjelenítés: a megjelenítésnek itt ebben a callback-ben kell megtörténnie:
        ezért 2. pméternek elhelyezek itt egy objektumot: {list}, és erre ráhelyezem
        a response.products attributumán található tömböt
        most nézzük meg hogy az ejs-ben hogy tudom elérni ezt a list változót
        go to index.ejs fájl
        ----------------------------------
        2024 03 19  30:00 elkezdünk pluszinfókat átadni az ejs-nek
        meta > go to index.EJS
        */
        res.render('index', {list: response.products, meta: {
            title: 'Terméklista EXPRESS',
            description: 'Ez a webshopunk termékeinek a promó szövege, placeholder szöveg'
        } })

    })
})

app.listen(3000, () => {
    console.log("started at: 3000");
})