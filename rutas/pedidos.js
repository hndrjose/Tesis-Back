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


//////////////////////PROCEDIMIENTOS PEDIDOS ////////////////////////////

//Agregar data de pedido
app.post('/adpedido', (req, res) => {

    //Conexion
    const valor = req.body.valor
    const fecha = req.body.fecha
    const status = req.body.status
    const user = req.body.user
    const descripcion = req.body.descripcion
    const Iduser = req.body.Iduser


    //  VALUES  (? , ? , (SELECT IdEmpleado FROM Empleado WHERE Nombre = ?) ,(SELECT IdProteccion FROM Proteccion WHERE Tipo = ?), (SELECT IdMolestias FROM Molestias WHERE Molestia = ?),(SELECT IdHistoriaCl FROM HistoriaCl WHERE IdEmpleado = ?), (SELECT IdEmpresa FROM Empresa WHERE  Nombre = ?), (SELECT IdAudiometro FROM Audiometro WHERE Modelo = ?))"
    const queryString = "INSERT INTO pedidos (Iduser , valor, fecha, status, user, descripcion)   VALUES  (?, ?, ?, ?, ?, ?)"
    connection.query(queryString, [Iduser, valor, fecha, status, user, descripcion], (err, results, fields) => {
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

//Editar Data del PEDIDOS
app.put('/editarpedido/:Iduser', (req, res) => {

    //Conexion
    console.log("Tratando de editar una registro..")
    console.log("Cedula: " + req.params.Iduser)

    const status = req.body.status
    const Iduser = req.body.Iduser

    const queryString = "UPDATE pedidos SET status = ? WHERE Iduser = ?"
    connection.query(queryString, [status, Iduser], (err, results, fields) => {
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

//Editar Data del PEDIDOSPROFECIONALES
app.put('/editarpedidopro/:Idcomperfil', (req, res) => {

    //Conexion
    console.log("Tratando de editar una registro..")
    console.log("ID: " + req.params.Iduser)

    const status = req.body.status
    const Idcomperfil = req.body.Idcomperfil

    const queryString = "UPDATE pedidos SET status = ? WHERE Idcomperfil = ?"
    connection.query(queryString, [status, Idcomperfil], (err, results, fields) => {
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

//Eliminar
app.delete('/borrarpedido/:Id', (req, res) => {
    console.log("Eliminar registros con id: " + req.params.Id)
        //Conexion

    const Id = req.params.Id
    const queryString = "DELETE FROM pedidos WHERE Iduser = ?"
    connection.query(queryString, [Id], (err, rows, fields) => {
        if (err) {
            console.log("No existe el registro " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log("registross Eliminado")
        res.json(rows)
    })
});

//Seleccionar data por usuario
app.get('/Selecpedidos/:user', (req, res) => {
    //Conexion
    const user = req.params.user;
    const queryString = "SELECT usuario.img, usuario.user, pedidos.fecha, pedidos.status, pedidos.valor, pedidos.descripcion FROM pedidos INNER JOIN usuario ON pedidos.Iduser = usuario.Iduser WHERE pedidos.user = ? AND status = 'pendiente'"
    connection.query(queryString, [user], (error, rows) => {
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

//Seleccionar data por proveedor
app.get('/Selecpedidospro/:Iduser', (req, res) => {
    //Conexion
    const Iduser = req.params.Iduser;
    const queryString = "SELECT pedidos.user, pedidos.fecha, pedidos.status, pedidos.valor, pedidos.descripcion FROM pedidos INNER JOIN usuario ON pedidos.Iduser = usuario.Iduser WHERE pedidos.Iduser = ? AND status = 'pendiente'"
    connection.query(queryString, [Iduser], (error, rows) => {
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

//Contabilizar registros
app.get('/ContaReg/:Id', (req, res) => {
    console.log("contar registros con id: " + req.params.Id)
    var result
    var anterior
    const Id = req.params.Id
    const queryString = "SELECT * FROM pedidos WHERE Iduser = ?"
    connection.query(queryString, [Id], (err, rows, fields) => {
        if (err) {
            console.log("No existe el registro " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        const resultado = rows.slice()
        result = resultado.length

        const queryString1 = "SELECT userconteo FROM Conteos WHERE Iduser = ?"
        connection.query(queryString1, [Id], (err, rows, fields) => {
            if (err) {
                console.log("No se puede seleccionar " + err)
                res.sendStatus(500)
                res.end()
                return
            }
            anterior = rows[0].userconteo;
            var resultot = result - anterior
            if (resultot === 0) {
                console.log("no se puede actualizar data")

                const queryString3 = "SELECT userconteo FROM Conteos WHERE Iduser = ?"
                connection.query(queryString3, [Id], (err, results, fields) => {
                    if (err) {
                        res.sendStatus(500)
                        res.end()
                        return
                    }
                    res.status(200).json({
                        ok: false,
                        respuesta: 0
                    });
                    res.end()
                })
            } else {
                const queryString2 = "UPDATE Conteos SET userconteo = ? WHERE Iduser = ?"
                connection.query(queryString2, [resultot, Id], (err, results, fields) => {
                    if (err) {
                        console.log("No se puede Modificar el " + err)
                        res.sendStatus(500)
                        res.end()
                        return
                    }
                    res.status(200).json({
                        ok: true,
                        respuesta: results.affectedRows
                    });
                    res.end()
                })
            }
        })
    })
});

//Mostrar Contabilizacion
app.get('/ConteoMostrar/:Id', (req, res) => {
    console.log("contar registros con id: " + req.params.Id)
        //Conexion
    var result
    var anterior
    const Id = req.params.Id
    const queryString = "SELECT * FROM pedidos WHERE Iduser = ?"
    connection.query(queryString, [Id], (err, rows, fields) => {
        if (err) {
            console.log("No existe el registro " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        const resultado = rows.slice()
        result = resultado.length

        const queryString1 = "SELECT userconteo FROM Conteos WHERE Iduser = ?"
        connection.query(queryString1, [Id], (err, rows, fields) => {
            if (err) {
                console.log("No se puede seleccionar " + err)
                res.sendStatus(500)
                res.end()
                return
            }
            anterior = rows[0].userconteo;

            var resultot = result - anterior
            console.log("el resultado es " + resultot)
            res.status(200).json({
                ok: true,
                respuesta: resultot
            });
        })
    })
});

module.exports = app;