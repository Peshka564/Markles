import React, {useContext, useState, useEffect} from 'react';
import {
    Button,
    Modal,
    Alert,
    Form,
    Row,
    Col
} from 'react-bootstrap';
import { addDeal } from '../../../context/actions/dealActions.js';
import { AuthContext } from '../../../context/AuthContext';
import { usePrivateRoute } from '../../../hooks/authMiddleware';

const AddDeal = () => {
    const {auth, authDispatch} = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState('');
    const [amount, setAmount] = useState(0);
    const [partner, setPartner] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const addDealAction = usePrivateRoute(addDeal, auth, authDispatch, {auth});

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await addDealAction({deal: {item, amount, partner}});
        if(res != null) setErrorMsg(res)
        else {
            setErrorMsg(null);
            setOpen(false);
        }
    }

    useEffect(() => {
        setItem('');
        setAmount('');
        setPartner('');
        setErrorMsg('');
    }, [open]);

    return (
        <>
            <Button onClick={() => setOpen(true)} className="add-button fw-bold fs-6 text-white mb-3 py-3 px-4">Add deal</Button>
            <Modal show = {open} onHide={() => setOpen(!open)}>
                <Modal.Header>Add a deal</Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmit}>
                        <Row>
                            <Col sm={12} className="form-floating mb-4">
                                <Form.Control type="text" id="i" placeholder=" " value={item} onChange={(e) => setItem(e.target.value)} autoComplete='off'/>
                                <Form.Label htmlFor="i" className="ms-2">Item</Form.Label>
                            </Col>
                            <Col sm={10} className="form-floating mb-4">
                                <Form.Control type="text" id="a" placeholder=" " value={amount} onChange={(e) => setAmount(e.target.value)} autoComplete='off'/>
                                <Form.Label htmlFor="a" className="ms-2">Amount</Form.Label>
                            </Col>
                            <Col sm={2} className="form-floating mb-4"><h3 className='pt-3'>$</h3></Col>
                            <Col sm={12} className="form-floating mb-4">
                                <Form.Control type="text" id="p" placeholder=" " value={partner} onChange={(e) => setPartner(e.target.value)} autoComplete='off'/>
                                <Form.Label htmlFor="p" className="ms-2">Partner</Form.Label>
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

export default AddDeal;
