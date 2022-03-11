import React, {useEffect, useState, useContext} from 'react';
import { Button, FormLabel, Modal, Table, Alert, Dropdown } from 'react-bootstrap';
import { read, utils } from 'xlsx';
import {AuthContext} from '../../../context/AuthContext.js';
import { usePrivateRoute } from '../../../hooks/authMiddleware.js';
import { importContacts } from '../../../context/actions/contactActions.js';

const ImportContacts = () => {
    const defaultFields = ['First Name', 'Last Name', 'Email', 'Company', 'Phone'];
    const {auth, authDispatch} = useContext(AuthContext);
    const importContactsAction = usePrivateRoute(importContacts, auth, authDispatch, {auth})
    const [file, setFile] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [shuffled, setShuffled] = useState({0: '', 1: '', 2: '', 3: '', 4: ''});
    const [errorMsg, setErrorMsg] = useState('');
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        setErrorMsg('');
        setShuffled({0: '', 1: '', 2: '', 3: '', 4: ''});
        setHeaders([])
        setData([]);
        if(file != null) {
            if(file.name.split('.')[1] === 'csv' || file.name.split('.')[1] === 'xlsx' || file.name.split('.')[1] === 'xls') {
                readFile();
            } else {
                setErrorMsg('Please select a CSV file or an Excel Workbook');
            }
        }
    }, [file, open]);

    const readFile = () => {
        //read CSV
        if(file.name.split('.')[1] === 'csv') {
            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const res = e.target.result;
                    const initialRecords = res.split('\n');
                    const records = [];
                    let length = 0;
                    for(let i = 0; i < initialRecords.length; i++) {                     
                        const separated = initialRecords[i].split(',');
                        if(separated.length === 1 && separated[0] === '') continue;
                        if(i == 0) length = separated.length;
                        else if(length !== separated.length) {
                            setErrorMsg('Some rows do not have the same number of columns');            
                            return;
                        }
                        records.push(separated);
                    }
                    // array of arrays to array of objects
                    let object = {};
                    let final = [];
                    for(let i = 1; i < records.length; i++) {
                        for(let j = 0; j < length; j++) {
                            object = {...object, [records[0][j]]: records[i][j]}
                        }
                        final.push(object);
                    }
                    setHeaders(records[0]);
                    setData(final);
                }
                reader.readAsText(file);            
            } catch (error) {
                setErrorMsg('CSV file is not formatted correctly');
            }
        } else {
            //read Excel
            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const res = e.target.result;
                    const workbook = read(res, {
                        type: 'binary'
                    });
    
                    let final;
                    workbook.SheetNames.forEach((sheetName, index) => {
                        if(index == 0) {
                            const row = utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                            let headers = [];
                            for(const prop in row[0]) {
                                headers.push(prop);
                            }
                            final = row;
                            setHeaders(headers);
                        }
                    })
                    setData(final);
                }
                reader.readAsBinaryString(file);                        
            } catch (error) {
                setErrorMsg('Excel file is not formatted correctly');
            }
        }
    }

    const updateFields = (i, f) => {
        setShuffled({...shuffled, [i]: f})
    }

    const handleSubmit = async () => {
        if(auth.isAuthenticated) {
            const res = await importContactsAction({contacts: data, shuffled});
            if(res != null) setErrorMsg(res)
            else {
                setErrorMsg('');
                setOpen(false);
            }
        }
    }
    return (
        <>  {/*Import Button*/}
            <Button className='add-button fw-bold fs-6 text-white mb-3 py-3 px-4' onClick={() => setOpen(true)}>Import contacts</Button>
            {/*Modal*/}
            <Modal show = {open} backdrop="static" onHide={() => {
                setOpen(!open);
                setFile(null);
            }}>
                <Modal.Header closeButton>Data import settings</Modal.Header>
                <Modal.Body>
                    {/*File Import Button*/}
                    <Button as={FormLabel} htmlFor="files" className='fw-bold fs-6 text-white mb-3 py-3 px-4 w-100'>Select a file
                    <input id="files" style={{display: 'none'}} type="file" accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' onChange={(e) => {
                        setFile(e.target.files[0]);
                    }}/>
                    </Button>
                    {file != null && 
                        <>
                            {/*Display file name + errors*/}
                            <h6>Selected file: {file.name}</h6>
                            {errorMsg != '' ? 
                            <Alert variant='danger'>{errorMsg}</Alert>
                            :
                            /*Mapping table*/
                            <>
                            <Table className='mt-3' striped bordered>
                                <thead>
                                    <tr>
                                        <th className="bg-dark text-white text-center p-2" colSpan={2}>Map fields</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/*Choose field option*/
                                        defaultFields.map((df, index) => {
                                            return <tr key={df} className="bg-primary">
                                                <th className="text-white">{df}</th>
                                                <th className="text-white">
                                                    <Dropdown>
                                                        <Dropdown.Toggle className="text-white shadow-none">
                                                            <h4 className="dropdown-toggle-text fw-bold fs-6">{shuffled[index] !== '' ? shuffled[index] : 'Select field'}</h4>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {headers.map((header, i) => {
                                                                 return <Dropdown.Item key={String(index) + header} onClick={() => updateFields(index, header)}>{header}</Dropdown.Item>
                                                            })}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </Table>
                            <Button className='bg-primary fw-bold fs-6 text-white py-3 px-4 w-100' onClick={() => handleSubmit()}>Submit</Button>
                            </>
                            }
                        </>
                    }
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ImportContacts