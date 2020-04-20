const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')


exports.autenticarUsuario = async (req, res) => {

    // extraer el email y password
    const { email, password } = req.body;

    try {
        // revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' })
        }

        // revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password)
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'contraseña incorrecta' })
        }

        // si todo es correcto creo jwt
        // Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 6200 // 2 horas
        }, (e, token) => {
            if (e) throw e;

            // mensaje de confirmacion
            res.json({ token: token })
        })


    } catch (e) {
        console.log(e)
    }


}

// obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password')
        res.json({ usuario })
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: 'hubo un  error' })
    }
}