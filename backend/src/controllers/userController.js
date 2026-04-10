import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "revida_super_secreto";

// --- REGISTRO ---
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ success: false, message: "El correo ya está registrado" });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({
      nombre,
      email,
      password_hash,
      rol: rol || 'Donador'
    });

    await nuevoUsuario.save();
    res.status(201).json({ success: true, message: "Usuario creado exitosamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al registrar", error: error.message });
  }
};

// --- LOGIN REAL ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario en la base de datos
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ success: false, message: "Correo o contraseña incorrectos" });
    }

    // Comparar contraseña encriptada
    const esValido = await bcrypt.compare(password, usuario.password_hash);
    if (!esValido) {
      return res.status(401).json({ success: false, message: "Correo o contraseña incorrectos" });
    }

    // Generar Token JWT
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Enviar respuesta con Cookie segura (como lo tenías antes)
    res.cookie('revida_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'none',
      maxAge: 3600000 // 1 hora
    });

    res.status(200).json({
      success: true,
      datos: { nombre: usuario.nombre, rol: usuario.rol }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error en el servidor", error: error.message });
  }
};