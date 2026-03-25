/**
 * Role-based access control middleware.
 *
 * Usage: roleMiddleware('admin', 'teacher')
 *
 * Requires authMiddleware to run first so that req.user is populated.
 *
 * @param {...string} roles - Allowed roles.
 * @returns {Function} Express middleware.
 */
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado: rol no permitido' });
    }
    next();
  };
};

module.exports = roleMiddleware;
