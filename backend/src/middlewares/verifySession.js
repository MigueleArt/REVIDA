import jwt from "jsonwebtoken";
import { getSession } from "../store/sessionStore.js";

const SECRET = process.env.JWT_SECRET || "secreto_desarrollo";

export const verifySession = (req, res, next) => {
  const token = req.cookies.revida_token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No hay sesión activa." });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    const sessionActiva = getSession(decoded.id);

    if (!sessionActiva || sessionActiva.token !== token) {
      res.clearCookie("revida_token");
      return res.status(401).json({ success: false, message: "Sesión invalidada." });
    }

    if (new Date(sessionActiva.expiresAt) < new Date()) {
      res.clearCookie("revida_token");
      return res.status(401).json({ success: false, message: "La sesión ha expirado." });
    }

    req.user = decoded;
    next();

  } catch (error) {
    res.clearCookie("revida_token");
    return res.status(401).json({ success: false, message: "Token inválido." });
  }
};