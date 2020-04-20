// modelo de usuario
const Usuario = require('../models/Usuario');

// encriptar contraseña
const bcryptjs = require('bcryptjs');

// validar usuario
const jwt = require('jsonwebtoken')



exports.crearUsuario = async (req, res) => {

    // extrar email y password
    const { email, password } = req.body;

    try {
        // revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({ msg: 'el usuario ya existe' })
        }

        // crea el nuevo usuario
        usuario = new Usuario(req.body);

        // hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        // guardar usuario
        await usuario.save();

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
        console.log(e);
        res.status(400).send('hubo un error')
    }
} 