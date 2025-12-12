const router = require("express").Router();

router.use("/donor", require("./donorRoutes"));
router.use("/ngo", require("./ngoRoutes"));
router.use("/patient", require("./patientRoutes"));
router.use("/admin", require("./adminRoutes"));

module.exports = router;
