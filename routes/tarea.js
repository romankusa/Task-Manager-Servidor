// rutas 
const express = require('express');
const router = express.Router();

// controlador
const tareaController = require('../controllers/tareaController');

// validacion
const { check } = require('express-validator');
const auth = require('../middleware/auth');


// crear tarea
// api/tarea
router.post('/',
    auth,
    [
        check('nombreseccion', 'El nombre de la seccion es obligatorio').not().isEmpty(),
    ],
    tareaController.crearSeccion
);

// Agregar Tareas
router.put('/:id',
    auth,
    tareaController.agregarTareas
)

// obtener las tareas por lista
router.get('/',
    auth,
    tareaController.obtenerTareas
)

// Eliminar tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;