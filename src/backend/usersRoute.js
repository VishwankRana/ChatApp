import express from "express";
import User from "./models/userDB.js";
import authMiddleware from "./middleware/authMiddleware.js";

const router = express.Router();

router.get("/contacts", authMiddleware, async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .populate("contacts", "username");

    res.json(user.contacts);

  } catch (err) {
    res.status(500).json({ message: "Server error" }, err);
  }
});


router.post("/add-contact", authMiddleware, async (req, res) => {
  try {

    const { contactId } = req.body;

    if (!contactId) {
      return res.status(400).json({ message: "Contact ID required" });
    }

    if (contactId === req.user.id) {
      return res.status(400).json({ message: "Cannot add yourself" });
    }

    const contactUser = await User.findById(contactId);

    if (!contactUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(req.user.id);

    if (!user.contacts.includes(contactId)) {
      user.contacts.push(contactId);
      await user.save();
    }

    res.json({ message: "Contact added successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" }, err);
  }
});

router.get("/search", authMiddleware, async (req, res) => {
  try {

    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username query required" });
    }

    const users = await User.find({
      username: { $regex: username, $options: "i" },
      _id: { $ne: req.user.id }
    }).select("username");

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: "Server error" }, err);
  }
});

export default router;