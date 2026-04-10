import express from 'express';
const router = express.Router();
// Importamos ambas funciones del controlador
import { registrarUsuario, login } from '../controllers/userController.js';

// Ruta para registrar: POST http://localhost:PORT/api/usuarios/registrar
router.post('/registrar', registrarUsuario);

// Ruta para login: POST http://localhost:PORT/api/usuarios/login
router.post('/login', login);

export default router;