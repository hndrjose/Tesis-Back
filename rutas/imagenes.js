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


//////////////////////PROCEDIMIENTOS ARCHIVOS ////////////////////////////
app.put('/imagenes/:Id', (req, res, next) => {

    // var tipo = req.params.tipo;
    var Id = req.params.Id;

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
            mensaje: 'No a selecciono nada',
            errors: { message: "Debe de seleccionar una Imagen" }

        });
    }

    //obtener nombre del archivo
    var archivo = req.files.imge;
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
    var nombbreArchivo = `${ Id }-${ new Date().getMilliseconds() }.${ extencion }`;

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
        subirarchivo(Id, nombbreArchivo, res);
    });

});

function subirarchivo(Id, nombbreArchivo, res) {

    const queryString = "SELECT Cedula, img FROM empleado WHERE Cedula = ?"
    connection.query(queryString, [Id], (err, rows, fields) => {
        if (err) {
            console.log("No existe el Empleado " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        var pathviejo = './imagen/' + rows[0].img;
        console.log(pathviejo);
        //Si exite elimina la imagen anterior
        if (fs.existsSync(pathviejo)) {
            fs.unlinkSync(pathviejo);
        }
    });

    const img = nombbreArchivo;
    const queryString1 = "UPDATE usuario SET img = ? WHERE Iduser = ?"
    connection.query(queryString1, [img, Id], (err, results, fields) => {
        if (err) {
            console.log("Error al Modificar Imagen" + err)
            res.sendStatus(500)
            res.end()
            return
        }

        res.end()
        console.log("Empleadp Modificado", results.affectedRows)
    });

    //   npm i serve-index --save   es una libreria que sirve para llegar a mostrar imagenes guardadas por peticiones html
}
app.get('/imagenaudiometria/:img', (req, res, next) => {

    var img = req.params.img;

    const pathImagen = path.resolve(__dirname, `./src/imagen/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pahtnoimagen = path.resolve(__dirname, `./nomimg/noimage.png`);
        res.sendFile(pahtnoimagen);
    }
});

module.exports = app;