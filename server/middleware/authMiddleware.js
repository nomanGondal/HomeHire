// JWT/auth protection logic will go here (empty for now)const jwt = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    
    const token = authHeader.split(" ")[1]; // "Bearer <token>"

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role } — from what we signed at login

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};

// Restricts route to specific roles, e.g. restrictTo("provider")
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed to perform this action" });
    }
    next();
  };
};

module.exports = { protect, restrictTo };