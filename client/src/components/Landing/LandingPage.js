import React, {useContext, useEffect} from 'react';
import { logOutUser } from '../../context/actions/authActions';
import { AuthContext } from '../../context/AuthContext';
import {
    Image,
    Button,
    Card
} from 'react-bootstrap';
import {FaChartPie, FaDatabase, FaRobot} from 'react-icons/fa';
import Logo from '../images/Logo.svg';
import Hero from '../images/hero.png';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import { useMediaQuery } from 'react-responsive';

const LandingPage = () => {
    const {authDispatch} = useContext(AuthContext);
    const nav = useNavigate();
    const isMedium = useMediaQuery({ query: '(min-width: 768px)' });
    const isLarge = useMediaQuery({ query: '(min-width: 992px)' });

    useEffect(() => {
        logOutUser(authDispatch);
    }, [])

    return (
        <>
            <div className='hero-navbar'>
                <Image src={Logo} className='logo-landing'/>
                <div className='d-flex flex-row justify-content-center position-relative'>
                    {isLarge && <Image src={Hero} className='hero-img'/>}
                    <div className='d-flex flex-column' style={{textAlign: isLarge ? 'left' : 'center'}}>
                        <h2 className='text-white fw-bold mb-3'>The ultimate business tool</h2>
                        <h4 className={`text-white fw-light ${isLarge ? 'mb-5' : 'mb-3'}`}>Manage, analyze and decide what is best for your Github Action</h4>
                        <Button variant='complement' className={`hero-login p-3 mb-3 text-white fs-5 fw-bold ${!isLarge && 'mx-auto'}`} onClick={() => nav('/signup')}>Start for free</Button>
                    </div>
                </div>
            </div>
            <div className={`main-landing d-flex ${isMedium ? 'flex-row' : 'flex-column'} justify-content-center align-items-center`}>
                <Card style={{ width: '18rem' }} className='mx-auto my-5 py-5 px-2'>
                    <Card.Body className='text-center'>
                        <FaChartPie style={{width: '50px', height: '50px'}} className='my-2'/>
                        <Card.Title className='text-center'>Real-time Analysis</Card.Title>
                        <Card.Text>
                            Inspect the state of your sales at any moment by looking at visually
                            attractive charts. 
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }} className='mx-auto my-5 py-5 px-2'>
                    <Card.Body className='text-center'>
                        <FaDatabase style={{width: '50px', height: '50px'}} className='my-2'/>
                        <Card.Title className='text-center'>Manage your data</Card.Title>
                        <Card.Text>
                        Organize and keep track of your contacts, prioritize your leads and deliver the 
                        best customer experience.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }} className='mx-auto my-5 py-5 px-2'>
                    <Card.Body className='text-center'>
                        <FaRobot style={{width: '50px', height: '50px'}} className='my-2'/>
                        <Card.Title className='text-center'>AI predictions</Card.Title>
                        <Card.Text>
                        Know exactly where your revenue growth stands and start making the most optimal business decisions.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            <div className='bg-dark text-white py-2'>Copyright &copy; 2022</div>
        </>
    )
}

export default LandingPage
