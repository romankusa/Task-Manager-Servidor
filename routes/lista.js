// rutas para crear usuarios
const express = require('express');
const router = express.Router();

// controlador
const listaController = require('../controllers/listaController');

// validacion
const { check } = require('express-validator');
const auth = require('../middleware/auth');


// crear lista
// api/lista
router.post('/',
    auth,
    [
        check('nombre', 'El nombre de la lista es obligatorio').not().isEmpty(),
    ],
    listaController.crearLista
);

// obtener lista
router.get('/',
    auth,
    listaController.obtenerListas
)

// eliminar lista 
router.delete('/:id',
    auth,
    listaController.eliminarLista
)

// Cambiar tags
router.put('/:id',
    auth,
    listaController.cambiarTags
)

module.exports = router;