var express = require('express');
var app = express();
const path = require('path');
var fileUpload = require('express-fileupload');
const fs = require('fs');
const mysql = require('mysql');
const myConnection = require('express-myconnection');

// default options
app.use(fileUpload());

const connection = mysql.createConnection({
    host: '35.202.222.43', // Localhost,  35.202.222.43
    user: 'root', // root
    password: 'systemas', // Ceutec-19, systemas
    database: 'mypimesdb', //
    multipleStatements: true
});

//////////////////////PROCEDIMIENTOS ARCHIVOS ////////////////////////////
app.put('/imagenes/:Iduser', (req, res, next) => {
    // var tipo = req.params.tipo;
    var Iduser = req.params.Iduser;
    // // Tipos de Cpleccion
    // var tipovalidos = ['usuarios', 'servicios'];
    // if (tipovalidos.indexOf(tipo) < 0) {
    //     return res.status(400).json({
    //         ok: false,
    //         mensaje: 'Tipo de Coleccion no es valido',
    //         errors: { message: "Tipo de Coleccion no es valido" }
    //     });
    // }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: "Debe de seleccionar una Imagen" }

        });
    }

    //obtener nombre del archivo
    var archivo = req.files.img;
    var nombrecortado = archivo.name.split('.');
    var extencion = nombrecortado[nombrecortado.length - 1];

    //solo extenciones permitidas
    var extencionesvalidas = ['jpg', 'png', 'gif'];

    if (extencionesvalidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extencion no valida',
            errors: { message: 'Las Extenciones son:' + extencionesvalidas.join(', ') }

        });
    }

    //Nombre del archivo personalizado
    var nombbreArchivo = `${ Iduser }-${ new Date().getMilliseconds() }.${ extencion }`;

    // //mover el archivo del temporal a un path
    var path = `./imagen/${ nombbreArchivo }`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err

            });
        }
        subirarchivo(Iduser, nombbreArchivo, res);
        // res.status(300).json({
        //     ok: true,
        //     mensaje: 'Peticion Realizada Corretamente',
        //     extencion: extencion
        // });
    });

});

function subirarchivo(Iduser, nombbreArchivo, res) {

    const queryString = "SELECT Iduser, img FROM usuario WHERE Iduser = ?"
    connection.query(queryString, [Iduser], (err, rows, fields) => {
        if (err) {
            console.log("No existe el Empleado " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        // res.json(rows[0].img);
        // console.log(rows[0].img);
        var pathviejo = './imagen/' + rows[0].img;
        console.log(pathviejo);
        //Si exite elimina la imagen anterior
        if (fs.existsSync(pathviejo)) {
            fs.unlinkSync(pathviejo);
        }


    });

    const img = nombbreArchivo;
    const queryString1 = "UPDATE usuario SET img = ? WHERE Iduser = ?"
    connection.query(queryString1, [img, Iduser], (err, results, fields) => {
        if (err) {
            console.log("Error al Modificar Imagen" + err)
            res.sendStatus(500)
            res.end()
            return
        }
        res.status(200).json({
            okimg: true,
            usuarios: nombbreArchivo
        });
        console.log("Empleadp Modificado", results.affectedRows)
        console.log("La imagen es: ", nombbreArchivo)
        res.end()
    });
    //   npm i serve-index --save   es una libreria que sirve para llegar a mostrar imagenes guardadas por peticiones html
}
app.get('/verimagen/:img', (req, res, next) => {

    var img = req.params.img;

    //  const pathImagen = path.resolve(__dirname, `./imagen/${img}`);
    //  if (fs.existsSync(pathImagen)) 
    var pathImagen = path.join(__dirname, '../imagen', img);
    // fs.exists(pathImagen, existe => {
    //     if (!existe) {
    //         let pathnot = 'no-img.jpg';
    //         res.sendFile(path.join(__dirname, '../assets', pathnot)); // path = './assets/no-img.jpg';
    //     }
    //     res.sendFile(path.join(__dirname, '../imagen', pathImagen));
    //     //  res.sendfile(path);
    // });
    fs.exists(pathImagen, existe => {
        if (!existe) {
            console.log('No existe');
            pathImagen = path.join(__dirname, '../imagen', 'no-img.jpg');
        }
        console.log(pathImagen);
        res.sendFile(pathImagen);
    });
});

module.exports = app;