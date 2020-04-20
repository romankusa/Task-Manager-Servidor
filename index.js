const express = require('express');
const conectarDB = require('./config/db')
const cors = require('cors')

// crear el servidor
const app = express();

// conectar a la base de datos
conectarDB();

// habilitar cors
app.use(cors())

// habilitar express.json
app.use(express.json({ extended: true }));


// Puerto de la app
const port = process.env.PORT || 4000;


// importar rutas  
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/lista', require('./routes/lista'));
app.use('/api/tarea', require('./routes/tarea'));
app.use('/api/auth', require('./routes/auth'));

// pagina principal
app.get('/', function (req, res) {
    res.send(JSON.stringify({ Hello: 'World' }));
});

// arrancar el servidor
app.listen(port, '0.0.0.0', () => { console.log(`Servidor en puerto ${port}`) })
