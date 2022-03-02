import express from 'express';
import User from '../database/models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { auth } from '../middleware/auth.js'
import mongoose from 'mongoose';

const router = express.Router();

// Get access token - public
router.get('/token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(401).json({error: 'Missing token'})
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, rt) => {
        if(err) return res.status(403).json({error: "Invalid token"});
        const newAccessToken = generateAccessToken(rt.id);
        res.status(200).json({token: newAccessToken});
    })
})

const generateAccessToken = (id) => {
    return jwt.sign({id}, process.env.JWT_ACCESS_SECRET, {expiresIn: '5m'});
}

const generateRefreshToken = (id) => {
    return jwt.sign({id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '3d'});
}

// Register user - public
router.post('/register', async (req, res) => {
    const {firstName, lastName, email, password, role, companyName} = req.body;

    //Validation
    if((!firstName || !lastName || !email || !password || !role) || !companyName){
        return res.status(400).json({error: 'Please enter all fields'});
    }
    
    const check = await User.findOne({email: email});
    if(check){
        return res.status(400).json({error: 'Email is already in use'})
    }

    if(firstName.length > 15 || lastName.length > 15) {
        return res.status(400).json({error: 'Names must not exceed 15 characters'})
    }

    if(companyName.length > 30) {
        return res.status(400).json({error: 'Company name must not exceed 30 characters'})
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
        company: {
            id: id,
            name: companyName
        }
    });
    //Generate salt
    bcrypt.genSalt(10, (error, salt) => {
        // Generate hash
        bcrypt.hash(newUser.password, salt, async (error, hash) => {
            if(error) return res.status(500).json({error: 'Registration failed'});

            //Assign hash and save to database
            newUser.password = hash;
            const user = await newUser.save();
            
            //Generate JWT tokens
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            res.cookie("refreshToken", refreshToken, {expire : new Date() + '3d'},  {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"
            }).status(200).json({token: accessToken, user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                company: user.company
            }});
        })
    })
    
});

// Login user - public
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    //Validation
    if(!email || !password){
        return res.status(400).json({error: 'Please enter all fields'});
    }

    const user = await User.findOne({email: email});
    if(!user){
        return res.status(400).json({error: 'User does not exist'})
    }

    const checkHash = await bcrypt.compare(password, user.password)
    if(!checkHash) return res.status(400).json({error: 'Invalid password'});

    //Generate JWT tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.cookie("refreshToken", refreshToken, {expire : new Date() + '3d'},  {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }).status(200).json({token: accessToken, user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        company: user.company
    }});
});

router.get('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.sendStatus(200);  
}) 

// Get user data - private
router.get('/user', auth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json({user});
}) 


export default router;