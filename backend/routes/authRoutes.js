const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../validators/authValidator");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/me", authMiddleware, getMe);

module.exports = router;
