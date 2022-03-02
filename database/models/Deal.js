import mongoose from 'mongoose';
import io from '../../server.js';

const Schema = mongoose.Schema;

const dealSchema = new Schema({
    item: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    partner: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        id: mongoose.Types.ObjectId,
        name: {
            type: String
        }
    },
    company: {
        id: mongoose.Types.ObjectId,
        name: {
            type: String,
            required: true
        }
    }
});

dealSchema.post('save', (doc, next) => {
    io.to(String(doc.company.id)).emit('newDeal', {
        _id: doc._id,
        item: doc.item,
        amount: doc.amount,
        partner: doc.partner,
        owner: doc.owner,
        company: doc.company,
        createdAt: doc.createdAt
    });
    next();
});

dealSchema.post('findOneAndDelete', (doc, next) => {
    io.to(String(doc.company.id)).emit('deletedDeal', {
        id: doc._id
    });
    next()
});

const model = mongoose.model('Deals', dealSchema);

export default model;