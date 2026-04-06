import jwt from "jsonwebtoken";
import { getSession, setSession, removeSession } from "../store/sessionStore.js";

const SECRET = process.env.JWT_SECRET || "secreto_desarrollo";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mockUser = { id: "1", email: "admin@revida.com", nombre: "Admin", rol: "admin" };

    if (email !== mockUser.email || password !== "123456") {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const sessionActiva = getSession(mockUser.id);
    if (sessionActiva && new Date(sessionActiva.expiresAt) > new Date()) {
      return res.status(409).json({
        success: false,
        message: "Ya hay una sesión activa en otro dispositivo. Por favor, cierra la anterior."
      });
    }

    const token = jwt.sign(
      { id: mockUser.id, rol: mockUser.rol }, 
      SECRET, 
      { expiresIn: "24h" }
    );

    setSession(mockUser.id, {
      token: token,
      deviceIp: req.ip,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

    res.cookie("revida_token", token, {
      httpOnly: true,
      secure: true, // Debe ser true siempre cuando sameSite es 'none'
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      datos: { nombre: mockUser.nombre, rol: mockUser.rol }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.revida_token;

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET);
      removeSession(decoded.id);
    } catch (error) {
      // Ignorar errores de verificación al hacer logout
    }
  }

  res.clearCookie("revida_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });

  return res.status(200).json({ success: true, message: "Sesión cerrada correctamente" });
};