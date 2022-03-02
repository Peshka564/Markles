import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { checkUser } from '../../../context/actions/authActions';
import { usePrivateRoute } from '../../../hooks/authMiddleware.js';
import AppSidebar from './AppSidebar.js';
import './AppMainbar.css';
import './AppSidebar.css';
import AppRightSide from './AppRightSide';

const App = () => {
  const [retract, setRetract] = useState(true);
  const {auth, authDispatch} = useContext(AuthContext);
  const checkUserAction = usePrivateRoute(checkUser, auth, authDispatch, {authDispatch});

  useEffect(() =>{
    checkUserAction();
  }, [])

  return (
    <div className="d-flex flex-row">
        <AppSidebar retract={retract} setRetract={setRetract}/>
        <AppRightSide setRetract={setRetract}/>
    </div>
  )
}

export default App
