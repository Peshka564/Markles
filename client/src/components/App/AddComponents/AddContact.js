import React, {useContext, useState, useEffect} from 'react';
import {
    Button,
    Modal,
    Alert,
    Form,
    Row,
    Col
} from 'react-bootstrap';
import { addContact } from '../../../context/actions/contactActions.js';
import { AuthContext } from '../../../context/AuthContext';
import { usePrivateRoute } from '../../../hooks/authMiddleware';

const AddContact = () => {
    const {auth, authDispatch} = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [companyFrom, setCompanyFrom] = useState('');
    const [phone, setPhone] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const addContactAction = usePrivateRoute(addContact, auth, authDispatch, {auth});

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await addContactAction({contact: {firstName, lastName, email, companyFrom, phone}});
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
        setCompanyFrom('');
        setPhone('');
        setErrorMsg('');
    }, [open]);

    return (
        <>
            <Button onClick={() => setOpen(true)} className="add-button fw-bold fs-6 text-white mb-3 py-3 px-4">Add contact</Button>
            <Modal show = {open} onHide={() => setOpen(!open)}>
                <Modal.Header>Add a contact</Modal.Header>
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
                                <Form.Control type="text" id="cf" placeholder=" " value={companyFrom} onChange={(e) => setCompanyFrom(e.target.value)} autoComplete='off'/>
                                <Form.Label htmlFor="cf" className="ms-2">Company</Form.Label>
                            </Col>
                            <Col sm={12} className="form-floating mb-4">
                                <Form.Control type="text" id="ph" placeholder=" " value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete='off'/>
                                <Form.Label htmlFor="ph" className="ms-2">Phone</Form.Label>
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

export default AddContact;
