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

export default router;