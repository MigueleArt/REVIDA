const ONE_HOUR_MS = 60 * 60 * 1000;

const mockUsers = {
  'admin@revida.com': { id: '1', email: 'admin@revida.com', password: '123456', nombre: 'Admin', rol: 'Administrador' },
  'donador@revida.com': { id: '2', email: 'donador@revida.com', password: '123456', nombre: 'Donador', rol: 'Donador' }
};

export const registerTestOnlyRoutes = (app, activeSessions) => {
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = mockUsers[email];

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
    }

    if (activeSessions.has(user.id)) {
      return res.status(409).json({
        success: false,
        message: 'Ya hay una sesión activa en otro dispositivo. Por favor, cierra la anterior.'
      });
    }

    const token = `${user.id}-${Date.now()}`;
    activeSessions.set(user.id, { token, rol: user.rol });

    res.cookie('revida_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: ONE_HOUR_MS
    });

    return res.status(200).json({
      success: true,
      datos: { nombre: user.nombre, rol: user.rol }
    });
  });

  const requireAuth = (req, res, next) => {
    const token = req.cookies.revida_token;
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Se requiere iniciar sesión.' });
    }

    const activeEntry = Array.from(activeSessions.entries()).find(([, session]) => session.token === token);
    if (!activeEntry) {
      return res.status(401).json({ message: 'Acceso denegado. Se requiere iniciar sesión.' });
    }

    const [userId, session] = activeEntry;
    req.user = { id: userId, rol: session.rol };
    return next();
  };

  const requireRole = (allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permisos para esta acción.' });
    }
    return next();
  };

  app.get('/api/usuarios', requireAuth, requireRole(['Administrador']), (req, res) => {
    return res.status(200).json({
      success: true,
      data: Object.values(mockUsers).map(({ id, nombre, email, rol }) => ({ id, nombre, email, rol }))
    });
  });
};
