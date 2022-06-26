import React, { createContext, useReducer } from 'react';

export const TableContext = createContext();

const initialUserState = {
    users: []
};

const initialContactState = {
    contacts: []
};

const initialDealState = {
    deals: [],
    predicted: [],
    isPredicting: false,
    isTraining: false,
    hasTrained: false
};

const userReducer = (state, action) => {
    switch(action.type) {
        
        case 'USERS_GET':
            return {...state, users: [...action.payload]}
        
        case 'USERS_ADD':
            return {...state, users: [...state.users, action.payload]}

        case 'USERS_DELETE':
            return {...state, users: state.users.filter(user => user._id !== action.payload)}

        default: 
            return state;
    }
}

const contactReducer = (state, action) => {
    switch(action.type) {
        
        case 'CONTACTS_GET':
            return {...state, contacts: [...action.payload]}
        
        case 'CONTACTS_ADD':
            return {...state, contacts: [...state.contacts, action.payload]}

        case 'CONTACTS_DELETE':
            return {...state, contacts: state.contacts.filter(contact => contact._id !== action.payload)}

        default: 
            return state;
    }
}

const dealReducer = (state, action) => {
    switch(action.type) {
        
        case 'DEALS_GET':
            return {...state, deals: [...action.payload]}
        
        case 'DEALS_ADD':
            return {...state, deals: [action.payload, ...state.deals]}

        case 'DEALS_DELETE':
            return {...state, deals: state.deals.filter(deal => deal._id !== action.payload)}

        case 'DEALS_PREDICT':
            return {...state, isPredicting: true}
            
        case 'DEALS_PREDICTION':
            return {...state, predicted: [...action.payload], isPredicting: false}

        case 'DEALS_TRAIN':
            return {...state, isTraining: true}

        case 'DEALS_TRAINED':
            return {...state, isTraining: false, hasTrained: true}

        default: 
            return state;
    }
}

export const TableProvider = ({ children }) => {
    const [userstate, userDispatch] = useReducer(userReducer, initialUserState);
    const [contactstate, contactDispatch] = useReducer(contactReducer, initialContactState);
    const [dealstate, dealDispatch] = useReducer(dealReducer, initialDealState);

    return (
    <TableContext.Provider value = {{
        users: userstate,
        userDispatch,
        contacts: contactstate,
        contactDispatch,
        deals: dealstate,
        dealDispatch
    }}>
        {children}
    </TableContext.Provider>);
};
