import axios from 'axios';

export const loginUser = async ({email, password}, authDispatch) => {
    const reqBody = JSON.stringify({email, password});
    try {
        const transport = axios.create({
            withCredentials: true,
            headers: {
                'Content-type': 'application/json'
            }           
        })
        const res = await transport.post('/api/auth/login', reqBody)
        authDispatch({
            type: 'AUTH_SUCCESS',
            payload: res.data
        })
        return null;
    } catch (error) {
        authDispatch({
            type: 'AUTH_FAIL'
        });
        return error.response.data.error;
    }
};

export const registerUser = async ({firstName, lastName, email, password, role, companyName}, authDispatch) => {
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }
    const reqBody = JSON.stringify({firstName, lastName, email, password, role, companyName});

    try {
        const res = await axios.post('/api/auth/register', reqBody, config)
        authDispatch({
            type: 'AUTH_SUCCESS',
            payload: res.data
        })
        return null;
    } catch (error) {
        authDispatch({
            type: 'AUTH_FAIL'
        });
        return error.response.data.error;
    }
};

export const logOutUser = async (authDispatch) => {
    const transport = axios.create({
        withCredentials: true
    });
    await transport.get('/api/auth/logout');

    authDispatch({
        type: 'AUTH_FAIL'
    });
};

export const checkUser = async (transport, {authDispatch}) => {
    try {
        const res = await transport.get('/api/auth/user')
        authDispatch({
            type: 'AUTH_CHECK',
            payload: res.data
        })
    } catch (error) {
        return error.response;
    }
};