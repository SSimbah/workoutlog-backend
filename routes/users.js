import express from "express";
import { v4 as uuidv4 } from "uuid";
const router=express.Router();

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

router.post("/create", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
              message: "Name, email, and password details are required.",
            });
        }
        const newUser = new User({
            username: username,
            email: email,
            password: password
        });
        await newUser.save();
        res.status(200).json({ message: "User created successfully!" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error saving user: " + error.message });
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