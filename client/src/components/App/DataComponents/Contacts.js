import React, {useContext} from 'react';
import CustomTable from './CustomTable';
import { getContacts, deleteContact, sortContacts } from '../../../context/actions/contactActions';
import { TableContext } from '../../../context/TableContext';
import { AuthContext } from '../../../context/AuthContext';
import AddContact from '../AddComponents/AddContact.js';
import { usePrivateRoute } from '../../../hooks/authMiddleware.js';
import ImportContacts from '../AddComponents/ImportContacts';

const Contacts = () => {
  const {contacts, contactDispatch} = useContext(TableContext);
  const {auth, authDispatch} = useContext(AuthContext);
  const getContactsAction = usePrivateRoute(getContacts, auth, authDispatch, {contactDispatch, auth})
  const sortContactsAction = usePrivateRoute(sortContacts, auth, authDispatch, {contactDispatch, auth});
  const deleteContactAction = usePrivateRoute(deleteContact, auth, authDispatch, {});
  const fieldArray = ['Name', 'Email', 'Company', 'Phone', 'Owner'];

  return(
      <>
        {auth.isAuthenticated && 
          <div className='d-flex flex-row justify-content-end'>
            <ImportContacts />
            <AddContact />
          </div>
        }
        <CustomTable data={contacts.contacts} getAction={getContactsAction} sortAction={sortContactsAction} deleteAction={deleteContactAction} fields={fieldArray}/>
      </>
  );
};

export default Contacts;
