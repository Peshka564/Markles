import React, {useContext} from 'react';
import {useMediaQuery} from 'react-responsive';
import {
  Nav,
  Button,
  Dropdown
} from 'react-bootstrap'
import {
  FaUserCircle,
  FaBuilding,
  FaBars
} from 'react-icons/fa';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AppMainbar = ({setRetract}) => {
    const {auth} = useContext(AuthContext);
    const check = auth.isAuthenticated;
    const nav = useNavigate();

    const isSmall = useMediaQuery({query: '(min-width: 576px)'})
    const isMedium = useMediaQuery({ query: '(min-width: 768px)' })
    const isLarge = useMediaQuery({ query: '(min-width: 992px)' })

    return (
      <>
        <div className='bg-accent main text-dark p-0 py-2 me-3 d-flex flex-row justify-content-end align-items-center'>
              <Nav className="w-100">
                {!isMedium && 
                <Nav.Item variant="dark" className='bg-accent me-auto text-dark justify-content-center align-items-center' as={Button}>
                    <FaBars className="avatar" onClick={() => setRetract(false)} />
                </Nav.Item>}
                <Nav.Item className='company ms-auto text-dark d-flex flex-row justify-content-center align-items-center'>
                      <FaBuilding className="avatar"/>
                      <h3 className='fs-6 text-dark mt-3'>{check && auth.user.company.name}</h3>
                </Nav.Item>
                <Dropdown className='ms-2'>
                      <Dropdown.Toggle variant="dark" className='bg-accent nav-item text-dark d-flex flex-row justify-content-center align-items-center border-0'>
                        <FaUserCircle className='avatar'/>
                        <div className='mt-3 d-flex flex-column justify-content-center align-item-center'>
                          <h3 className='fs-6 m-0 p-0'>
                            {(check && (isLarge)) && auth.user.firstName + " " + auth.user.lastName}
                            {(check && (isMedium && !isLarge)) && auth.user.lastName}
                            {(check && (!isMedium && isSmall)) && ''}
                          </h3>
                          <h4 className='role'>
                            {(check && (isLarge)) && auth.user.role}
                          </h4>
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => nav('/')}>Log out</Dropdown.Item>
                      </Dropdown.Menu>
                </Dropdown>
              </Nav>
          </div>
      </>
          
    )
}

export default AppMainbar
