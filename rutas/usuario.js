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

//  Obtener Usuarios
app.get('/users', (req, res, next) => {

    const queryString = "SELECT * FROM usuario"
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            return res.status(500).json({
                mensaje: "A ocurrido un Error",
                errors: err
            });
        }
        //  res.json(rows)
        if (rows.length > 0) {
            //   res.json(rows);
            res.status(200).json({
                ok: true,
                usuarios: rows
            });
        } else {
            return res.status(400).json({
                ok: false
                    // mensaje: "No existe el Empleado ",
                    //  errors: error
            });
        }
    });
});


//////////////////////PROCEDIMIENTOS USUARIOS ////////////////////////////

//Agregar Usuario
app.post('/crearUsuario', (req, res) => {

    //Conexion
    console.log("Tratando de crear un examen nuevo..")

    const user = req.body.user
    const password = req.body.password
    const email = req.body.email
    const nombre = req.body.nombre
    const direccion = req.body.direccion
    const telefono = req.body.telefono
    const vocacion = req.body.vocacion
    const role = req.body.role


    //  VALUES  (? , ? , (SELECT IdEmpleado FROM Empleado WHERE Nombre = ?) ,(SELECT IdProteccion FROM Proteccion WHERE Tipo = ?), (SELECT IdMolestias FROM Molestias WHERE Molestia = ?),(SELECT IdHistoriaCl FROM HistoriaCl WHERE IdEmpleado = ?), (SELECT IdEmpresa FROM Empresa WHERE  Nombre = ?), (SELECT IdAudiometro FROM Audiometro WHERE Modelo = ?))"
    const queryString = "INSERT INTO usuario (user, password, email, nombre, direccion, telefono, vocacion, role)   VALUES  (?, ?, ?, ?, ?, ?, ?, ?)"
    connection.query(queryString, [user, password, email, nombre, direccion, telefono, vocacion, role], (err, results, fields) => {
        if (err) {
            console.log("Error al agregar nuevo Usuario: " + err)
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


//Editar Empleado
app.put('/editarUsuario/:Iduser', (req, res) => {

    //Conexion
    console.log("Tratando de editar una empleado..")
    console.log("Cedula: " + req.params.Iduser)

    const Iduser = req.params.Iduser
    const password = req.body.password
    const email = req.body.email
    const nombre = req.body.nombre
    const direccion = req.body.direccion
    const telefono = req.body.telefono
    const vocacion = req.body.vocacion

    const queryString = "UPDATE usuario SET password = ?, email = ?, nombre = ?, direccion = ?, telefono = ?, vocacion = ? WHERE Iduser = ?"
    connection.query(queryString, [password, email, nombre, direccion, telefono, vocacion, Iduser], (err, results, fields) => {
        if (err) {
            console.log("Error al editar un Usuario: " + err)
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

//Eliminar Usuario
app.delete('/borrarUsuario/:Id', (req, res) => {
    console.log("Eliminar Usuario con id: " + req.params.Id)
        //Conexion

    const Id = req.params.Id
    const queryString = "DELETE FROM usuario WHERE Iduser = ?"
    connection.query(queryString, [Id], (err, rows, fields) => {
        if (err) {
            console.log("No existe el Usuario " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("Usiario Eliminado")
        res.json(rows)
    })
});

//Seleccionar Usuario
app.get('/SelecionUsuario/:Id', (req, res) => {
    console.log("Seleccionar empleado con id: " + req.params.Id);
    //Conexion
    const Id = req.params.Id;
    const queryString = "SELECT * FROM usuario WHERE Iduser = ?"
    connection.query(queryString, [Id], (error, rows) => {
        if (error) {
            return res.status(500).json({
                mensaje: "A ocurrido un Error",
                errors: error
            });
        }
        //  if (rows.length > 0) {
        //  res.json(rows);
        res.status(200).json({
            ok: true,
            usuarios: (rows)
        });
        // } else {
        //     return res.status(305).json({
        //         ok: false,
        //         usuarios: rows
        //     });
        // }
    });
});


//Seleccionar Usuario LIKE
app.get('/likeusuario/:termino', (req, res) => {

    //Conexion
    const page = req.query.page;
    const limit = req.query.limit;

    const startindex = (page - 1) * limit
    const endindex = page * limit


    const queryString = "SELECT * FROM usuario WHERE user LIKE '%" + req.params.termino + "%'"
    connection.query(queryString, (error, rows) => {
        if (error) {
            return res.status(500).json({
                mensaje: "A ocurrido un Error",
                errors: error
            });
        }

        const resultado = rows.slice(startindex, endindex)
        res.status(200).json({
            ok: true,
            usuarios: (resultado)
        });

    });
});





module.exports = app;