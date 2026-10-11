// Middleware to check if user is authenticated
const checkAuth = (req, res, next) => {
  if (!req.session.staffID) {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
  next();
};

module.exports = { checkAuth };
