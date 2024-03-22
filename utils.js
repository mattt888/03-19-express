const fs = require('node:fs')

module.exports = {

    formattedPrice : function (price) {
        return price + ' Ft'
    },

    getOriginalPrice : function  (product) {
        return this.formattedPrice( Math.round( originalPrice = product.price / ( 1 - ( product.discountPercentage / 100 ))))
    },

    getProducts : async function () {
        const data = await fetch('https://dummyjson.com/products')
        return data.json();
    }
}