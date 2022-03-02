import React, {useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {
  Navbar,
  Nav,
  Image,
  Button
} from 'react-bootstrap'
import {
  FaUsers,
  FaRegChartBar,
  FaAngleRight,
  FaAngleLeft,
  FaUserTie,
  FaMoneyBillWave
} from 'react-icons/fa';
import Logo from '../../images/Logo.svg';
import RoundLogo from '../../images/RoundLogo.svg';
import { useNavigate } from 'react-router-dom';

const AppSidebar = ({retract, setRetract}) => { 

    const nav = useNavigate();
    const isLarge = useMediaQuery({ query: '(min-width: 992px)' })
    const isMedium = useMediaQuery({ query: '(min-width: 768px)' })
    const [open, setOpen] = useState(isLarge ? true : false);

    return (
        <>
        {isMedium ?
            <Navbar className="bg-semi-dark sidebar p-0" style={{width: !open ? "70px" : "192px"}}>
                {isLarge && 
                <Button className="toggle-side shadow-none" onClick={() => setOpen(!open)}>
                    {open ?
                    <FaAngleLeft className='text-white toggle-icon'/>
                    :
                    <FaAngleRight className='text-white toggle-icon'/>
                    }
                </Button>
                }
                <Nav className="d-flex flex-column w-100 mt-2 mb-auto">
                    {open ?
                    <Image src={Logo} className='logo'/>
                    :
                    <Image src={RoundLogo} className='round-logo'/> 
                    }
                    <Nav.Item variant='secondary' as={Button} onClick={() => nav('/app/contacts')}>
                        <FaUsers className='side-icon'/>
                        <h5 className='m-0 ms-3 fw-bold'>Contacts</h5>
                    </Nav.Item>
                    <Nav.Item variant='secondary' as={Button} onClick={() => nav('/app/deals')}>
                        <FaMoneyBillWave className='side-icon'/>
                        <h5 className='m-0 ms-3 fw-bold'>Deals</h5>
                    </Nav.Item>
                    <Nav.Item variant='secondary' as={Button} onClick={() => nav('/app/analytics')}>
                        <FaRegChartBar className='side-icon'/>
                        <h5 className='m-0 ms-3 fw-bold'>Analytics</h5>
                    </Nav.Item>
                    <Nav.Item variant='secondary' as={Button} onClick={() => nav('/app/company')}>
                        <FaUserTie className='side-icon'/>
                        <h5 className='m-0 ms-3 fw-bold'>My Company</h5>
                    </Nav.Item>
                </Nav>
            </Navbar> :
            <Navbar className={!retract ? "bg-semi-dark sidebar-sm p-0 retract" : "bg-semi-dark sidebar-sm p-0"}>
                <Nav className="d-flex flex-column w-100 mt-2 mb-auto">
                    <div className='d-flex flex-row justify-content-between'>
                        <Image src={Logo} className='logo'/>
                        <Button className="toggle-side-sm shadow-none" onClick={() => setRetract(true)}>
                            <FaAngleLeft className='text-white toggle-icon'/>
                        </Button>                       
                    </div>
                    <Nav.Item variant='secondary' as={Button} onClick={() => {
                        setRetract(true);
                        nav('/app/contacts');
                    }
                    }>
                        <FaUsers className='side-icon'/>
                        <h5 className='m-0 ms-3 fw-bold'>Contacts</h5>
                    </Nav.Item>
                    <Nav.Item variant='secondary' as={Button} onClick={() => {
                        setRetract(true);
                        nav('/app/deals');
                    }
                    }>
                        <FaMoneyBillWave className='side-icon'/>
                        <h5 className='m-0 ms-3 fw-bold'>Deals</h5>
                    </Nav.Item>
                    <Nav.Item variant='secondary' as={Button} onClick={() => {
                        setRetract(true);
                        nav('/app/analytics');
                    }
                    }>
                        <FaRegChartBar className='side-icon'/>
                        <h5 className='m-0 ms-3 fw-bold'>Analytics</h5>
                    </Nav.Item>
                    <Nav.Item variant='secondary' as={Button} onClick={() => {
                        setRetract(true);
                        nav('/app/company');
                    }
                    }>
                        <FaUserTie className='side-icon'/>
                        <h5 className='m-0 ms-3 fw-bold'>My Company</h5>
                    </Nav.Item>
                </Nav>
            </Navbar>
        }
        </>
        
    );
};

export default AppSidebar;
