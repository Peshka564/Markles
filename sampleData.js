import User from './database/models/User.js';
import Deal from './database/models/Deal.js';
import Contact from './database/models/Contact.js';
import mongoose from 'mongoose';

let i = 0;
export const sampleData = async () => {
    
    /*const company = {
        id: mongoose.Types.ObjectId('620d139bc4c763924731af58'),
        name: 'Test'
    }*/
    const company = {
        id: mongoose.Types.ObjectId('621e2a005a940e7e1c00d5e1'),
        name: 'TestCompany'
    }
    /*const users = await User.find({'company.id': company.id});
    const contacts = await Contact.find({'company.id': company.id});
    const items = 
    ['Computers', 
    'Ballon', 
    'Bow', 
    'Calculator', 
    'Toy car', 
    'Crayon', 
    'Cup', 
    'Dice',
    'Mirror',
    'Envelope',
    'Shovel',
    'Zipper',
    'Whistle',
    'Tennis ball',
    'Crayon',
    'Sock'
    ];

    for(let i = 0; i < 1500; i++) {
        const contactId = Math.floor(Math.random() * contacts.length);
        const userId = Math.floor(Math.random() * users.length);
        const date = new Date(new Date(2021, 1, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2021, 1, 1).getTime()));
        const deal = new Deal({
            item: items[Math.floor(Math.random() * items.length)],
            amount: Math.floor(Math.random() * 50000),
            partner: contacts[contactId].firstName + ' ' + contacts[contactId].lastName,
            company,
            owner: {
                id: users[userId]._id,
                name: users[userId].firstName + ' ' + users[userId].lastName
            },
            createdAt: date
        })
        await deal.save();      
    }
    console.log('done')*/

    /*const interval = Math.floor(Math.random() * 10 * 1000);
    const contactId = Math.floor(Math.random() * contacts.length);
    const userId = Math.floor(Math.random() * (users.length - 2) + 2);
    const deal = new Deal({
        item: items[Math.floor(Math.random() * items.length)],
        amount: Math.floor(Math.random() * 100000),
        partner: contacts[contactId].firstName + ' ' + contacts[contactId].lastName,
        company,
        owner: {
            id: users[userId]._id,
            name: users[userId].firstName + ' ' + users[userId].lastName
        }
    })
    setTimeout(async () => {
        if(i < 10) {
            i++;
            console.log('inserted')
            await deal.save();
            sampleData();
        }
    }, interval)*/

    //await Deal.deleteMany({company: company});
}