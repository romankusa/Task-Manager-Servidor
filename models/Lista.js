const mongoose = require('mongoose')

const ListaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    tags: [{
        color: {
            type: String,
            required: true,
            trim: true
        },
        tagnombre: {
            type: String,
            trim: true
        },
    }],
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

module.exports = mongoose.model('Lista', ListaSchema)