const Lista = require('../models/Lista');
const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator')


exports.crearLista = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {

        // poner los default values cuando crea la lista
        if (!req.body.tags) {
            req.body.tags = { tagnombre: '', color: '#A8DADC' }
        }
        // crear nueva lista 
        const lista = new Lista(req.body);

        // guardar el creador via JWT
        lista.creador = req.usuario.id;

        lista.save();
        res.json({ tarea: [], lista })

    } catch (e) {
        console.log(e)
        res.status(500).send('Error creando lista')
    }
}

// listas del usuario
exports.obtenerListas = async (req, res) => {
    try {
        const listas = await Lista.find({ creador: req.usuario.id });

        const nuevaLista = await Promise.all(listas.map(async (lista) => {
            const seccion = await Tarea.find({ lista: lista._id });

            let tareas = []
            seccion.forEach(el => {
                el.tareas.forEach(tare => {
                    tareas.push({ estado: tare.estado, nombretarea: tare.nombretarea, _id: tare._id, listaid: lista._id })
                })
            })
            return {
                lista,
                tareas
            }
        }))

        res.json(nuevaLista);

    } catch (e) {
        console.log(e)
        res.status(500).send('No pudimos encontrar sus listas')
    }
}


// elimina una lista por su id 
exports.eliminarLista = async (req, res) => {
    try {
        //revisar el id
        let lista = await Lista.findById(req.params.id);

        // si existe la lista o no
        if (!lista) {
            return res.status(404).json({ msg: 'Lista no encontrada' })
        }

        // verificar el creador de la lista
        if (lista.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        // eliminar tareas dentro de la lista
        await Tarea.deleteMany({ lista: req.params.id })

        // eliminar lista
        await lista.remove()
        res.json({ msg: 'Lista eliminada' })

    } catch (e) {
        console.log(e)
        res.status(500).send('Error eliminando lista')
    }
}

// cambiar tags
exports.cambiarTags = async (req, res) => {

    try {
        const { tags, creador } = req.body;

        // encontrar lista
        let lista = await Lista.findById(req.params.id);

        // si existe la lista o no
        if (!lista) {
            return res.status(404).json({ msg: 'Lista no encontrada' })
        }

        // verificar el creador de la lista
        if (creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' })
        }


        // cambiar tags
        lista = await Lista.findByIdAndUpdate({ _id: req.params.id }, { $set: { tags } }, { new: true });

        res.status(201).json(lista)


    } catch (e) {
        res.status(500).send(e.message)
    }
}