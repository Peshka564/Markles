export const getUsers = async (transport, {userDispatch, auth}) => {
    try {
        const res = await transport.post('http://localhost:5000/api/users/get', auth)
        userDispatch({
            type: 'USERS_GET',
            payload: res.data
        })
    } catch (error) {
        return error.response;
    }
};

export const addUser = async (transport, {user, auth}) => {
    const body = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        role: user.role,
        company: auth.user.company
    }

    try {
        await transport.post('http://localhost:5000/api/users/add', body)
    } catch (error) {
        return error.response;
    }
};

export const deleteUser = async (transport, {id}) => {
    try {
        await transport.delete(`http://localhost:5000/api/users/delete/${id}`);
    } catch (error) {
        return error.response;
    }
};

export const sortUsers = async (transport, {way, data, userDispatch, auth}) => {
    try {
        const users = data;
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
            if (letter === 'r')
            {
                if(a.role.toUpperCase() > b.role.toUpperCase()) return 1 * dir
                else if(a.role.toUpperCase() < b.role.toUpperCase()) return -1 * dir
                return 0            
            }
        }
        switch(way) {
            case 11: 
            users.sort((a, b) => compareAttributes(a, b, 1, 'n'));
            break;
            case 12:
            users.sort((a, b) => compareAttributes(a, b, -1, 'n'));
            break;
            case 13: 
            users.sort((a, b) => compareAttributes(a, b, 1, 'e'));
            break;
            case 14:
            users.sort((a, b) => compareAttributes(a, b, -1, 'e'));
            break;
            case 15: 
            users.sort((a, b) => compareAttributes(a, b, 1, 'r'));
            break;
            case 16:
            users.sort((a, b) => compareAttributes(a, b, -1, 'r'));
            break;
            default:
            break;
        }
        userDispatch({
            type: 'USERS_GET',
            payload: users
        })
    } catch (error) {
        return error.response;
    }
};