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


//////////////////////PROCEDIMIENTOS USUARIOS ////////////////////////////

//Agregar data del Perfil
app.post('/addDataPerfil', (req, res) => {

    //Conexion


    const competencias = req.body.competencias
    const expLaboral = req.body.expLaboral
    const conocimientos = req.body.conocimientos
    const Iduser = req.body.Iduser


    //  VALUES  (? , ? , (SELECT IdEmpleado FROM Empleado WHERE Nombre = ?) ,(SELECT IdProteccion FROM Proteccion WHERE Tipo = ?), (SELECT IdMolestias FROM Molestias WHERE Molestia = ?),(SELECT IdHistoriaCl FROM HistoriaCl WHERE IdEmpleado = ?), (SELECT IdEmpresa FROM Empresa WHERE  Nombre = ?), (SELECT IdAudiometro FROM Audiometro WHERE Modelo = ?))"
    const queryString = "INSERT INTO dataperfil (competencias, expLaboral, conocimientos, Iduser )   VALUES  (?, ?, ?, ?)"
    connection.query(queryString, [competencias, expLaboral, conocimientos, Iduser], (err, results, fields) => {
        if (err) {
            console.log("Error al agregar nuevo Registro: " + err)
            res.sendStatus(500)
            return
        }
        res.status(200).json({
            ok: true,
            respuesta: results.InsertId
        });
        res.end()

    })
})

//Editar Data del Perfil
app.put('/editarDataPerfil/:Iduser', (req, res) => {

    //Conexion
    console.log("Tratando de editar una empleado..")
    console.log("Cedula: " + req.params.Iduser)

    const competencias = req.body.competencias
    const expLaboral = req.body.expLaboral
    const conocimientos = req.body.conocimientos
    const Iduser = req.body.Iduser

    const queryString = "UPDATE dataperfil SET competencias = ?, expLaboral = ?, conocimientos= ? WHERE Iduser = ?"
    connection.query(queryString, [competencias, expLaboral, conocimientos, Iduser], (err, results, fields) => {
        if (err) {
            console.log("Error al editar un Registro: " + err)
            res.sendStatus(400)
            return
        }
        res.status(200).json({
            ok: true,
            respuesta: results.affectedRows
        });
        res.end()
    })
})

//Seleccionar data por id
app.get('/SelecDataPerfil/:Id', (req, res) => {
    console.log("Seleccionar Registro con id: " + req.params.Id);
    //Conexion
    const Id = req.params.Id;


    const queryString = "SELECT * FROM dataperfil WHERE Iduser = ?"
    connection.query(queryString, [Id], (error, rows) => {
        if (error) {
            return res.status(500).json({
                mensaje: "A ocurrido un Error",
                errors: error
            });
        }
        res.status(200).json({
            ok: true,
            usuarios: (rows)
        });

    });
});

//Seleccionar general
app.get('/SelecDataLike/:termino', (req, res) => { // 
    //Conexion
    const page = req.query.page;
    const limit = req.query.limit;

    const startindex = (page - 1) * limit //  ?page=1&limit=3
    const endindex = page * limit

    const queryString = "SELECT usuario.Iduser, usuario.nombre, usuario.img, usuario.vocacion, dataperfil.competencias, dataperfil.expLaboral FROM usuario INNER JOIN dataperfil ON usuario.Iduser = dataperfil.Iduser WHERE dataperfil.expLaboral LIKE '%" + req.params.termino + "%' " //  WHERE usuario.vocacion LIKE '%" + req.params.termino + "%'
    connection.query(queryString, (error, rows) => {
        if (error) {
            return res.status(500).json({
                mensaje: "A ocurrido un Error",
                errors: error
            });
        }
        // const resultado = rows.slice(startindex, endindex)
        res.status(200).json({
            ok: true,
            perfiles: rows.slice(startindex, endindex)
        });

    });
});



module.exports = app;