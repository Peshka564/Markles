import React, { createContext, useReducer } from 'react';

export const AuthContext = createContext();

const initialState = {
    token: localStorage.getItem('markles-token'),
    isAuthenticated: false,
    user: null
};

const authReducer = (state, action) => {
    switch(action.type) {

        case 'AUTH_SUCCESS':
            localStorage.setItem('markles-token', action.payload.token)
            return {...state, ...action.payload, isAuthenticated: true}
        
        case 'AUTH_CHECK':
            return {...state, ...action.payload, isAuthenticated: true}

        case 'AUTH_FAIL':
            localStorage.removeItem('markles-token');
            return {...state, token: null, isAuthenticated: false, user: null}

        default: 
            return state;
    }
}

export const AuthProvider = ({ children }) => {
    const [authstate, authDispatch] = useReducer(authReducer, initialState)

    return (
    <AuthContext.Provider value = {{
        auth: authstate,
        authDispatch
    }}>
        {children}
    </AuthContext.Provider>);
};
