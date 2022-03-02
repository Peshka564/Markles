export const getContacts = async (transport, {contactDispatch, auth}) => {
    try {
        const res = await transport.post('/api/contacts/get', auth)
        contactDispatch({
            type: 'CONTACTS_GET',
            payload: res.data
        })
    } catch (error) {
        return error.response;
    }
};

export const addContact = async (transport, {contact, auth}) => {
    const body = {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        companyFrom: contact.companyFrom,
        owner: {
            id: auth.user._id,
            name: auth.user.firstName + ' ' + auth.user.lastName
        },
        company: auth.user.company,
        phone: contact.phone
    }

    try {
        await transport.post('/api/contacts/add', body)
    } catch (error) {
        return error.response;
    }
};

export const importContacts = async (transport, {contacts, shuffled, auth}) => {
    let body = [];
    contacts.map((contact) => {
        let temp = {
            firstName: contact[shuffled[0]],
            lastName: contact[shuffled[1]],
            email: contact[shuffled[2]],
            companyFrom: contact[shuffled[3]],
            owner: {
                id: auth.user._id,
                name: auth.user.firstName + ' ' + auth.user.lastName,
            },
            company: auth.user.company,
            phone: contact[shuffled[4]]
        }
        body.push(temp);
    })
    console.log(body)
    try {
        await transport.post('/api/contacts/import', body)
    } catch (error) {
        return error.response;
    }
};

export const deleteContact = async (transport, {id}) => {
    try {
        await transport.delete(`/api/contacts/delete/${id}`);
    } catch (error) {
        return error.response;
    }
};

export const sortContacts = async (transport, {way, data, contactDispatch, auth}) => {
    try {
        const contacts = data;
        const compareAttributes = (a, b, dir, letter) => {
            if (letter === 'n')
            {
                if(a.firstName.toUpperCase() > b.firstName.toUpperCase()) return 1 * dir
                else if(a.firstName.toUpperCase() < b.firstName.toUpperCase()) return -1 * dir
                else if(a.lastName.toUpperCase() > b.lastName.toUpperCase()) return 1 * dir
                else if(a.lastName.toUpperCase() < b.lastName.toUpperCase()) return -1 * dir
                return 0            
            }
            if (letter === 'e')
            {
                if(a.email.toUpperCase() > b.email.toUpperCase()) return 1 * dir
                else if(a.email.toUpperCase() < b.email.toUpperCase()) return -1 * dir
                return 0            
            }
            if (letter === 'c')
            {
                if(a.companyFrom.toUpperCase() > b.companyFrom.toUpperCase()) return 1 * dir
                else if(a.companyFrom.toUpperCase() < b.companyFrom.toUpperCase()) return -1 * dir
                return 0            
            }
            if (letter === 'o')
            {
                if(a.owner.name.toUpperCase() > b.owner.name.toUpperCase()) return 1 * dir
                else if(a.owner.name.toUpperCase() < b.owner.name.toUpperCase()) return -1 * dir
                return 0            
            }
        }
        switch(way) {
            case 11: 
                contacts.sort((a, b) => compareAttributes(a, b, 1, 'n'));
                break;
            case 12:
                contacts.sort((a, b) => compareAttributes(a, b, -1, 'n'));
                break;
            case 13: 
                contacts.sort((a, b) => compareAttributes(a, b, 1, 'e'));
                break;
            case 14:
                contacts.sort((a, b) => compareAttributes(a, b, -1, 'e'));
                break;
            case 15: 
                contacts.sort((a, b) => compareAttributes(a, b, 1, 'c'));
                break;
            case 16:
                contacts.sort((a, b) => compareAttributes(a, b, -1, 'c'));
                break;
            case 19: 
                contacts.sort((a, b) => compareAttributes(a, b, 1, 'o'));
                break;
            case 20:
                contacts.sort((a, b) => compareAttributes(a, b, -1, 'o'));
                break;
            default:
                break;
        }
        contactDispatch({
            type: 'CONTACTS_GET',
            payload: contacts
        })
    } catch (error) {
        return error.response;
    }
};