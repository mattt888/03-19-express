const { log } = require('node:console')
const fs = require('node:fs')

module.exports = {

    formattedPrice : function (price) {
        return price + ' Ft'
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

    getFulltotal : function (finalList) {

    }
}

// const total = finalList.reduce((acc, product) => {
//     return acc + (product.price * product.quantity);
//   }, 0);
  