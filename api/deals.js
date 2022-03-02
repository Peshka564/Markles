import express from 'express';
import Deal from '../database/models/Deal.js';
import { auth } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get deals - private
router.post('/get', auth, async (req, res) => {
    const deals = await Deal.find({'company.id': req.body.user.company.id}, 'item amount partner owner createdAt');
    deals.sort((a, b) => a.createdAt.getTime() > b.createdAt.getTime() ? -1 : 1);
    res.json(deals);
}) 

// Add deal - private
router.post('/add', auth, async (req, res) => {
    const {item, amount, partner, owner, company} = req.body;

    if(!item || !amount || !partner) {
        return res.status(400).json({error: 'Please enter all fields'})
    }

    for(let i = 0; i < amount.length; i++) {
        if(Number.isNaN(parseInt(amount[i])) || parseInt(amount[0]) === 0) {
            return res.status(400).json({error: 'Amount field must be a valid number'})
        }
    }

    if(item.length > 30 || amount.length > 8 || partner.length > 20) {
        return res.status(400).json({error: 'Some fields are too long'})
    }

    const newDeal = new Deal({
        item,
        amount,
        partner,
        company,
        owner
    });
    
    await newDeal.save();
    res.status(200).json(newDeal);
})

// Delete deal - private
router.delete('/delete/:id', auth, async (req, res) => {
    await Deal.findOneAndDelete({_id: req.params.id});
    res.sendStatus(200);
})

export default router;