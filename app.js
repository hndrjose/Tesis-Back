const express = require('express');
// const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');


// default options
// app.use(fileUpload());

// enable-cors.org, expressjs  mideware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//server index config
//sirve para mostrar las imagenes de todas las carpetas dendro del directorio ouploads
//localhost:3000/uploads
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '.'));
app.use('/imagen', serveIndex(__dirname + '/imagen'));



//Configuracion
//Buscar purto etablecido, si no hay selleccionar 3000
app.set('port', process.env.PORT || 3000);
//Plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Importar rutas
var appRoutes = require('./rutas/app');
var usuarioRoutes = require('./rutas/usuario');
var loginRoutes = require('./rutas/login');
var imgRoutes = require('./rutas/upload');
var dataPerfil = require('./rutas/dataPerfil');
var pedidos = require('./rutas/pedidos');


//  rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/img', imgRoutes);
app.use('/dataperfil', dataPerfil);
app.use('/pedido', pedidos);

app.use('/', appRoutes);


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });
// app.use(express.static(path.join(__dirname, 'dist')));

app.listen(3000, () => {
    console.log('Server on port 3000');
});