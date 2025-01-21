import express from "express";
import { v4 as uuidv4 } from "uuid";
const router=express.Router();
import bcrypt from 'bcrypt';

import User from "../models/User.js"; 

router.get("/", async (req,res)=>{
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error retrieving users: " + error.message });
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
  
    try {
        const foundUser = await User.findById(id);
        res.status(200).json(foundUser);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving user: " + error.message });
    }
});  

router.post("/", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
              message: "Name, email, and password details are required.",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(200).json({ message: "User created successfully!" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error saving user: " + error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required",
            });
        }

        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        // Note: In a real application, you should hash passwords and use
        // proper password comparison. This is just for demonstration.
        const passwordMatches = await bcrypt.compare(password, user.password);
        // if (user.password !== password) {
        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }
        res.status(200).json({
            message: "Login successful",
            userId: user._id
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error during login: " + error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if(!deletedUser){
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json({message: 'User deleted successfully'});
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error deleting user: " + error.message });
    }
});


router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const { username, email, password } = req.body

    const user = await User.findById(id);
        
    if(!user){
        res.status(404).json({ message: "User not found!" });
    }
    try {
        if(username) user.username = username;
        if(email) user.email = email;
        if(password) user.password = password;
    
        const updatedUser = await user.save();
    
        res.status(200).json({ 
            message: "User changed successfully!", 
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating user: " + error.message });
    }
});

export default router;