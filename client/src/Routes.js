import React from 'react';
import {Route, Routes } from 'react-router-dom';
import App from './components/App/Basis/App';
import LandingPage from './components/Landing/LandingPage';
import CombinedAuth from './components/Landing/CombinedAuth.js';
import Company from './components/App/DataComponents/Company';
import Contacts from './components/App/DataComponents/Contacts';
import Deals from './components/App/DataComponents/Deals.js';
import Analytics from './components/App/Graphs/Analytics';

const MainRoutes = () => {
    return ( 
        <Routes>
            <Route path="/app" element={<App />}>
                <Route path="company" element={<Company />}/>
                <Route path="contacts" element={<Contacts />}/>
                <Route path="deals" element={<Deals />}/>
                <Route path="analytics" element={<Analytics />}/>
            </Route>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<CombinedAuth />} />
            <Route path="/signup" element={<CombinedAuth />} />
        </Routes>
    )
};

export default MainRoutes;