const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");

router.get("/welcome", authMiddleware, (req, res) => {
  const { username, role, userId } = req.userInfo;
  res.json({
    message: "welcome to the home page",
    user: {
      _id: userId,
      username,
      role,
    },
  });
});

module.exports = router;
