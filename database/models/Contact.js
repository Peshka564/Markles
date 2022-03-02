import mongoose from 'mongoose';
import io from '../../server.js';

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
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
    companyFrom: {
        type: String,
        default: 'none'
    },
    phone: {
        type: String,
        default: 'none'
    },
    company: {
        id: mongoose.Types.ObjectId,
        name: {
            type: String,
            required: true
        }
    },
    custom_fields: {}
});

contactSchema.post('save', (doc, next) => {
    io.to(String(doc.company.id)).emit('newContact', {
        _id: doc._id,
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        owner: doc.owner,
        companyFrom: doc.companyFrom,
        company: doc.company,
        phone: doc.phone,
        createdAt: doc.createdAt
    });
    next();
});

contactSchema.post('findOneAndDelete', (doc, next) => {
    io.to(String(doc.company.id)).emit('deletedContact', {
        id: doc._id
    });
    next();
});

const model = mongoose.model('Contacts', contactSchema);

export default model;