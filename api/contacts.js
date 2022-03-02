import express from 'express';
import Contact from '../database/models/Contact.js';
import { auth } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get contacts - private
router.post('/get', auth, async (req, res) => {
    const contacts = await Contact.find({'company.id': req.body.user.company.id}, 'firstName lastName email owner companyFrom phone');
    res.json(contacts);
}) 

// Add contact - private
router.post('/add', auth, async (req, res) => {
    const {firstName, lastName, email, company, companyFrom, owner, phone} = req.body;

    //Validation
    if(!firstName || !lastName || !email){
        return res.status(400).json({error: 'Please enter the fields for name and email'});
    }
    
    //Add email validation
    const check = await Contact.findOne({email: email});
    if(check){
        return res.status(400).json({error: 'Another contact is using this email'})
    }

    if(firstName.length > 15 || lastName.length > 15) {
        return res.status(400).json({error: 'Names must not exceed 15 characters'})
    }

    const id = new mongoose.Types.ObjectId();

    const newContact = new Contact({
        firstName,
        lastName,
        email,
        ...(companyFrom !== '' && {companyFrom}),
        ...(phone !== '' && {phone}),
        company,
        owner
    });
    
    await newContact.save();
    res.status(200).json(newContact);
})

// Delete contact - private
router.delete('/delete/:id', auth, async (req, res) => {
    await Contact.findOneAndDelete({_id: req.params.id});
    res.sendStatus(200);
})

// Import contacts - private
router.post('/import', auth, async (req, res) => {
    const contact = req.body
    for(let i = 0 ; i < contact.length; i++) {

        if(!contact[i].firstName || !contact[i].lastName || !contact[i].email) {
            return res.status(400).json({error: 'Mandatory fields missing'})
        }
        const check = await Contact.findOne({email: contact[i].email});
        if(check){
            return res.status(400).json({error: 'Duplicate emails found'})
        }
        if(contact[i].firstName.length > 15 || contact[i].lastName.length > 15) {
            return res.status(400).json({error: 'Names must not exceed 15 characters'})
        }

        const newContact = new Contact({
            firstName: contact[i].firstName,
            lastName: contact[i].lastName,
            email: contact[i].email,
            ...(contact[i].companyFrom !== '' && contact[i].companyFrom !== '\r' && {companyFrom: contact[i].companyFrom}),
            ...(contact[i].phone !== '' && {phone: contact[i].phone}),
            company: contact[i].company,
            owner: contact[i].owner
        });
        await newContact.save();
    }
    res.sendStatus(200);
})

export default router;