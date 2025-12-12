
module.exports = function requireOneOf(keys = []) {
  return (req, res, next) => {
    const ok = keys.some((k) => {
      const v = req.body?.[k];
      return v !== undefined && v !== null && v !== "";
    });
    if (!ok) {
      return res.status(400).json({
        message: `You should send at least one value from:  ${keys.join(", ")}`,
      });
    }
    next();
  };
};  