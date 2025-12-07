
const jwt = require("jsonwebtoken");


function authRequired(req, res, next) {
  const h = req.headers.authorization || "";          
  const token = h.startsWith("Bearer ") ? h.slice(7) : null; 
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); 
    next();                                              
  } catch {
    res.status(401).json({ message: "Invalid token" }); 
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
function allowPatientOrRole(...roles) {
  const normalized = roles.map(r => r.toLowerCase());

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const userRole = (req.user.role || "");
    const patientId = Number(req.params.patientUserId);

    if (userId === patientId) return next();
    if (normalized.includes(userRole)) return next();
    return res.status(403).json({ message: "Forbidden" });
  };
}

module.exports = { authRequired, requireRole,allowPatientOrRole };
