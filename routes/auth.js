// rutas para crear usuarios
const express = require('express');
const router = express.Router();

// controlador
const authController = require('../controllers/authController');

// validacion
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// iniciar sesion
// api/auth
router.post('/',
    authController.autenticarUsuario
);

// obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
)

module.exports = router;