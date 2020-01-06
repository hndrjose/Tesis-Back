var express = require('express');
var window = window

var app = express();


app.get('/randon', (req, res, next) => {

    var max = 99999
    var min = 1

    res.status(200).json({
        ok: true,
        randon: Math.round(Math.random() * (max - min) + min)
    });

});




app.get('/crypto', (req, res, next) => {

    var array = new Uint32Array(10);
    window.crypto.getRandomValues(array);

    console.log("Tus numeros de la suerte:");
    for (var i = 0; i < array.length; i++) {
        console.log(array[i]);
    }




    // res.status(200).json({
    //     ok: true,
    //     randon: Math.round(Math.random() * (max - min) + min)
    // });

});




module.exports = app;