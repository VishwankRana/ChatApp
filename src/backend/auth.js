import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "./models/userDB.js";
import process from "process";

dotenv.config();

const router = express.Router();

router.post("/register", async(req, res) =>{
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
        username,
        password: hashedPassword,
    });

    res.json({ message: "User registered successfully" });
});


router.post("/login", async (req,res) =>{
    
    const { username, password } = req.body;

    const user =  await User.findOne( {username});
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
    )
    res.json({ token });
})

export default router;

