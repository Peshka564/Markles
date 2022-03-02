import React, {useState, useContext, useEffect} from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Alert,
    Image,
    Button
} from 'react-bootstrap';
import Logo from '../images/Logo.svg';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext.js';
import {registerUser, loginUser, logOutUser} from '../../context/actions/authActions.js';

const CombinedAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {authDispatch} = useContext(AuthContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        let res;
        if(location.pathname === '/signup') res = await registerUser({firstName, lastName, email, password, role: 'Admin', companyName}, authDispatch);
        if(location.pathname === '/login') res = await loginUser({email, password}, authDispatch);
        if(res != null) setErrorMsg(res)
        else {
            setErrorMsg(null);
            navigate('/app');
        }
    }

    useEffect(() => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setCompanyName('');
        setErrorMsg('');
        logOutUser(authDispatch);
    }, [location.pathname]);

    return (
        <>
        <Container className="mt-3 mt-sm-5">
            <Row>
                <Col sm={10} lg={6} className="offset-sm-1 offset-lg-3">
                    <Col className="offset-sm-3" sm={6}>
                        <Image src={Logo} className="w-100"/>
                    </Col>
                    {location.pathname === '/signup' &&
                    <h3 className="text-black text-center fw-bold mt-4 mb-4 fs-5">
                        Have an account? <Link to="/login" style={{textDecoration: "none"}} className="fw-bold">Log in</Link>
                    </h3>}
                    {location.pathname === '/login' &&
                    <h3 className="text-black text-center fw-bold mt-4 mb-4 fs-5">
                        Don't have an account? <Link to="/signup" style={{textDecoration: "none"}} className="fw-bold">Sign up</Link>
                    </h3>
                    }
                    <Form onSubmit={onSubmit} className="p-3">
                        <Row>
                            {location.pathname === '/signup' &&
                            <>
                                <Col sm={6} className="form-floating mb-4">
                                    <Form.Control type="text" id="fn" placeholder=" " value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete='off'/>
                                    <Form.Label htmlFor="fn" className="ms-2">First Name</Form.Label>
                                </Col>
                                <Col sm={6} className="form-floating mb-4">
                                    <Form.Control type="text" id="ln" placeholder=" " value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete='off'/>
                                    <Form.Label htmlFor="ln" className="ms-2">Last Name</Form.Label>
                                </Col>
                            </>
                            }
                            <Col sm={12} className="form-floating mb-4">
                                <Form.Control type="email" id="em" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} autoComplete='off'/>
                                <Form.Label htmlFor="em" className="ms-2">Email</Form.Label>
                            </Col>
                            <Col sm={12} className="form-floating mb-4">
                                <Form.Control type="password" id="ps" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} autoComplete='off'/>
                                <Form.Label htmlFor="ps" className="ms-2">Password</Form.Label>
                            </Col>
                            {location.pathname === '/signup' &&
                                <Col sm={12} className="form-floating mb-4">
                                    <Form.Control type="text" id="cm" placeholder=" " value={companyName} onChange={(e) => setCompanyName(e.target.value)} autoComplete='off'/>
                                    <Form.Label htmlFor="cm" className="ms-2">Company Name</Form.Label>
                                </Col>
                            }                      
                            {errorMsg && <Col sm={12} className="mb-4">
                                <Alert variant='danger'>{errorMsg}</Alert>
                            </Col>}
                            <Col sm={12} className="line position-relative mt-5">
                                <Button as={Form.Control} variant="complement" className="text-white border-0 py-3 fw-bold fs-5 shadow-none" type="submit" value="Submit" />
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default CombinedAuth