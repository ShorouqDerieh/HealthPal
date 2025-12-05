const jwt = require("jsonwebtoken");
function authRequired(req, res, next) {
  const h = req.headers.authorization || "";          
  const token = h.startsWith("Bearer ") ? h.slice(7) : null; 
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); 
    console.log("auth> req.user =", req.user);
    next();                                              
  } catch(err) {
    res.status(401).json({ message: "Invalid token" }); 
  console.log(err);
  }
}

function requireRole(...roles) {//..roles--> rest parameter syntax اجمع كل القيم الممرة لهاي الدالة بمصفوفة اسمهارولز
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = { authRequired, requireRole };
