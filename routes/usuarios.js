// rutas para crear usuarios
const express = require('express');
const router = express.Router();

// controlador
const usuarioController = require('../controllers/usuarioController');

// validacion
const { check } = require('express-validator');


// crea un usuario
// api/usuarios
router.post('/',
    usuarioController.crearUsuario
);

module.exports = router;