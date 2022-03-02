import express from 'express';
import User from '../database/models/User.js';
import { auth } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const router = express.Router();

// Get users - private
router.post('/get', auth, async (req, res) => {
    const users = await User.find({'company.id': req.body.user.company.id}, 'firstName lastName email role');
    res.json(users);
}) 

// Add user - private
router.post('/add', auth, async (req, res) => {
    const {firstName, lastName, email, password, role, company} = req.body;

    //Validation
    if(!firstName || !lastName || !email || !password || !role){
        return res.status(400).json({error: 'Please enter all fields'});
    }
    
    //Add email validation
    const check = await User.findOne({email: email});
    if(check){
        return res.status(400).json({error: 'Email is already in use'})
    }

    if(firstName.length > 15 || lastName.length > 15) {
        return res.status(400).json({error: 'Names must not exceed 15 characters'})
    }
    
    if(password.length <= 8 || password.length >= 15) {
        return res.status(400).json({error: 'Password must be between 8 and 15 characters long'})
    }

    const id = new mongoose.Types.ObjectId();

    const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        role,
        company
    });
    
    bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(newUser.password, salt, async (error, hash) => {
            if(error) return res.status(500).json({error: 'Registration failed'});

            newUser.password = hash;
            const user = await newUser.save();

            //sendEmail(user.firstName)
            res.status(200).json(newUser);
        })
    })
})

// Delete user - private
router.delete('/delete/:id', auth, async (req, res) => {
    await User.findOneAndDelete({_id: req.params.id});
    res.sendStatus(200);
})


export default router;