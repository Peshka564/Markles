import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const usePrivateRoute = (action, auth, authDispatch, params) => {

    const nav = useNavigate();

    const getAccessToken = async (authDispatch) => {
        try {
            const transport = axios.create({
                withCredentials: true        
            })
            const res = await transport.get('http://localhost:5000/api/auth/token');
            return res.data.token;
        } catch (error) {
            if(error.response.status === 401) {
                authDispatch({
                    type: 'AUTH_FAIL'
                })
            }
        }
    }

    const refreshAccessToken = async () => {
        const token = await getAccessToken(authDispatch); 
        return token;
    }

    const dispatchToken = (token) => {
        authDispatch({
            type: 'AUTH_SUCCESS',
            payload: {token}
        })
    }

    const executeAction = async (additionalParams, newToken) => {
        const transport = axios.create({
            withCredentials: true,
            headers: {
                'Content-type': 'application/json'
            }
        });
        if(newToken != null) transport.defaults.headers.common['authorization'] = 'Bearer ' + newToken;
        else transport.defaults.headers.common['authorization'] = 'Bearer ' + auth.token;
        const catchError = await action(transport, {...additionalParams, ...params});
        if(newToken != null) dispatchToken(newToken)
        if(catchError != null) {
            if(catchError.status === 403) {
                const res = await refreshAccessToken();
                if(res != null) {
                    const err = executeAction(additionalParams, res);
                    return err;
                }
                else nav('/login');
            } else if(catchError.status === 413) {
                return 'Input too large';
            } else {
                return catchError.data.error;
            }
        }
    }

    return executeAction;
};