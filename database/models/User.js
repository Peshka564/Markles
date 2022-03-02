import mongoose from 'mongoose';
import io from '../../server.js';

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    register_date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: true
    },
    company: {
        id: mongoose.Types.ObjectId,
        name: {
            type: String,
            required: true
        }
    }
});

userSchema.post('save', (doc, next) => {
    io.to(String(doc.company.id)).emit('newUser', {
        _id: doc._id,
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        company: doc.company,
        role: doc.role,
        register_date: doc.register_data
    });
    next();
});

userSchema.post('findOneAndDelete', (doc, next) => {
    io.to(String(doc.company.id)).emit('deletedUser', {
        id: doc._id
    });
    next();
});

const model = mongoose.model('Users', userSchema);

export default model;