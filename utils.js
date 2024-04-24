const { log } = require('node:console')
const fs = require('node:fs')

module.exports = {

    formattedPrice : function (price) {
        return price.toLocaleString('hu-HU') + ' Ft'
    },

    getOriginalPrice : function  (product) {
        // log('product price:', product.price)
        return this.formattedPrice( Math.round( originalPrice = product.price / ( 1 - ( product.discountPercentage / 100 ))))
    },

    getProducts : async function () {
        const data = await fetch('https://dummyjson.com/products')
        return data.json();
    },

    getTotal : function (productsArray) {
        if ( !productsArray || !productsArray instanceof Array )
        return 0;

        let total = 0;
        productsArray.forEach( demoProduct => {
            total += demoProduct.price
        })
        return total;
    },

    getSubtotal : function (price, quantity) {
        subtotal = price * quantity
        return this.formattedPrice(subtotal)
    },

    // getFulltotal: function (items) {
    //     // Kezdetben az összes subtotal érték 0 lesz
    //     const total = items.reduce((acc, product) => {
    //         // Az acc a felgyüjtött összeg, product a jelenlegi elem a tömbben
    //         const subtotal = product.price * product.quantity;
    //         // Adjuk hozzá a jelenlegi subtotal-t az acc-hez
    //         return acc + subtotal;
    //     }, 0); // A kezdeti érték 0, itt indul az összegzés
    //     // A reduce végén visszaadjuk az összes subtotal-t
    //     return this.formattedPrice(total);
    // }


    getFulltotal: function (items) {
        let total = 0;
        items.forEach( product => {
            total += product.price * product.quantity
        })
        return this.formattedPrice(total);
    }
}