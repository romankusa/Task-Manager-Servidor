const mongoose = require('mongoose');


const TareaSchema = mongoose.Schema({

    nombreseccion: {
        type: String,
        required: true,
        trim: true
    },
    tareas: [{
        nombretarea: {
            type: String,
            required: true,
            trim: true
        },
        estado: {
            type: Boolean,
            default: false
        }
    }],
    lista: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lista'
    }

})

module.exports = mongoose.model('Tarea', TareaSchema)