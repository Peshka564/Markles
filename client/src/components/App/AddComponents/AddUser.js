import React, {useContext, useState, useEffect} from 'react';
import {
    Button,
    Modal,
    Alert,
    Form,
    Row,
    Col
} from 'react-bootstrap';
import { addUser } from '../../../context/actions/userActions';
import { AuthContext } from '../../../context/AuthContext';
import { usePrivateRoute } from '../../../hooks/authMiddleware';

const AddUser = () => {

    const {auth, authDispatch} = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const addUserAction = usePrivateRoute(addUser, auth, authDispatch, {auth});

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await addUserAction({user: {firstName, lastName, email, password, role}});
        if(res != null) setErrorMsg(res)
        else {
            setErrorMsg(null);
            setOpen(false);
        }
    }

    useEffect(() => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setRole('');
        setErrorMsg('');
    }, [open]);

    return (
        <>
            <Button onClick={() => setOpen(true)} className="add-button-solo fw-bold fs-6 text-white mb-3 py-3 px-4">Add employee</Button>
            <Modal show = {open} onHide={() => setOpen(!open)}>
                <Modal.Header>Add an employee</Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmit}>
                        <Row>
                            <Col sm={6} className="form-floating mb-4">
                                <Form.Control type="text" id="fn" placeholder=" " value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete='off'/>
                                <Form.Label htmlFor="fn" className="ms-2">First Name</Form.Label>
                            </Col>
                            <Col sm={6} className="form-floating mb-4">
                                <Form.Control type="text" id="ln" placeholder=" " value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete='off'/>
                                <Form.Label htmlFor="ln" className="ms-2">Last Name</Form.Label>
                            </Col>
                            <Col sm={12} className="form-floating mb-4">
                                <Form.Control type="email" id="em" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} autoComplete='off'/>
                                <Form.Label htmlFor="em" className="ms-2">Email</Form.Label>
                            </Col>
                            <Col sm={12} className="form-floating mb-4">
                                <Form.Control type="password" id="ps" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} autoComplete='off'/>
                                <Form.Label htmlFor="ps" className="ms-2">Password</Form.Label>
                            </Col>
                            <Col sm={12} className="form-floating mb-4">
                                <Form.Select className='p-0 px-3' onChange={(e) => setRole(e.target.options[e.target.selectedIndex].text)}>
                                    <option selected disabled>Role</option>
                                    <option value="1">Admin</option>
                                    <option value="2">Salesperson</option>
                                </Form.Select>
                            </Col>
                            {errorMsg && <Col sm={12} className="mb-4">
                                <Alert variant='danger'>{errorMsg}</Alert>
                            </Col>}
                            <Col sm={12} className="line position-relative mt-5">
                                <Button as={Form.Control} variant="primary" className="text-white border-0 py-3 fw-bold fs-5 shadow-none" type="submit" value="Submit" />
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddUser;
