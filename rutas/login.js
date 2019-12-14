var express = require('express');
var app = express();
const mysql = require('mysql');
const myConnection = require('express-myconnection');


const connection = mysql.createConnection({
    host: '35.202.222.43', // Localhost,  35.202.222.43
    user: 'root', // root
    password: 'systemas', // Ceutec-19, systemas
    database: 'mypimesdb', //
    multipleStatements: true
});


app.post('/logUser', (req, res) => {
    var user = req.body.user
    var password = req.body.password;

    const queryString = "SELECT * FROM usuario WHERE user = ? AND password = ?"
    connection.query(queryString, [user, password], (err, rows, fields) => {
        if (err) {
            return res.status(500).json({
                mensaje: "A ocurrido un Error",
                errors: err
            });
        }
        if (rows.length > 0) {
            //   res.json(rows);
            res.status(200).json({
                ok: true,
                usuarios: rows
            });
        } else {
            return res.status(400).json({
                ok: false
            });
        }
    });
});



module.exports = app;