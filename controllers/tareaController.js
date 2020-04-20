const Tarea = require('../models/Tarea');
const Lista = require('../models/Lista');
const { validationResult } = require('express-validator')

// Crea una nueva tarea
exports.crearSeccion = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        // extraer el id de la lista
        const { lista } = req.body;

        // buscar lista por id a ver si existe
        const existeLista = await Lista.findById(lista)
        if (!existeLista) {
            return res.status(404).json({ msg: 'lista no encontrada' })
        }

        // id de lista tiene que coincidir con id de usuario
        if (existeLista.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        // se crea la seccion
        const tarea = new Tarea(req.body);

        await tarea.save();

        res.json({ tarea })

    } catch (e) {
        console.log(e)
        res.status(500).send('Error creando la tarea')
    }
}

// agregar tareas
exports.agregarTareas = async (req, res) => {

    try {
        // extraer el proyecto y comprobar si existe
        const { lista, tareas, _id } = req.body;

        // Buscar seccion si existe
        let tareaExiste = await Tarea.findById(req.params.id);
        if (!tareaExiste) {
            return res.status(404).json({ msg: 'No existe la seccion' })
        }

        //extraer lista de tareas 
        const existeLista = await Lista.findById(lista)
        // revisar si la seccion pertenece a la lista
        if (existeLista.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }


        // si tiene id, modificar estado sino crear tarea
        if (_id) {
            const seccion = await Tarea.findOneAndUpdate(
                { "_id": req.params.id, "tareas._id": _id },
                { "$set": { "tareas.$.estado": tareas[0].estado } }, { new: true });

            const index = await seccion.tareas.findIndex(el => el._id + '' === _id)

            res.json(seccion.tareas[index])

        } else {
            const seccion = await Tarea.findOneAndUpdate({ _id: req.params.id }, { $push: { tareas } }, { new: true });

            res.status(201).json({ seccion: seccion })
        }




    } catch (e) {
        console.log(e)
        res.status(500).send('hubo un error')
    }

}

// obtener tareas x listas
exports.obtenerTareas = async (req, res) => {

    try {
        // extraer id de la lista
        const { _id } = req.query;

        // si existe la lista o no
        const existeLista = await Lista.findById(_id)
        if (!existeLista) {
            return res.status(404).json({ msg: 'lista no encontrado' })
        }

        // revisar si lista actual pertenece al usuario autenticado
        if (existeLista.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        // obtener las tareas por lista
        const secciones = await Tarea.find({ lista: _id });

        res.json({ secciones })


    } catch (e) {
        console.log(e.message)
        res.status(500).send('hubo un error')
    }
}


// eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {
        // extraer id de la tarea y lista a la q pertence
        const { lista, tareaid } = JSON.parse(req.query.tarea);

        // buscar lista para ver si existe
        const existeLista = await Lista.findById(lista)

        if (!existeLista) {
            return res.status(404).json({ msg: 'lista no encontrado' })
        }

        // revisar si el proyecto actual pertenece al usuario autenticado
        if (existeLista.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        // revisar si existe la tarea 
        let tareaExiste = await Tarea.findById(req.params.id);

        if (!tareaExiste) {
            return res.status(404).json({ msg: 'No existe' })
        }


        // eliminar tarea
        if (tareaid) {
            // eliminar
            await Tarea.findOneAndUpdate(
                { _id: req.params.id },
                { $pull: { "tareas": { _id: tareaid } } }, { new: true },
                function (err, data) {
                    if (err) {
                        return res.status(500).json(err.message)
                    }
                    res.status(201).json({ seccion: data, tareaid })
                }
            );

        } else {
            // si no paso el id de la tarea, eliminar seccion
            await tareaExiste.remove();

            res.status(201).json({ tipo: 'seccion', _id: req.params.id })
        }


    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
}

