import express from "express";
import User from "./models/userDB.js";
import authMiddleware from "./middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.id } },
      "username"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" }, console.log(err));
  }
});

export default router;