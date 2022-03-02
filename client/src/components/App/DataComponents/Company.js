import React, {useContext} from 'react';
import CustomTable from './CustomTable';
import { getUsers, sortUsers, deleteUser } from '../../../context/actions/userActions';
import { TableContext } from '../../../context/TableContext';
import { AuthContext } from '../../../context/AuthContext';
import AddUser from '../AddComponents/AddUser.js';
import { usePrivateRoute } from '../../../hooks/authMiddleware.js';

const Company = () => {
  const {users, userDispatch} = useContext(TableContext);
  const {auth, authDispatch} = useContext(AuthContext);
  const getUsersAction = usePrivateRoute(getUsers, auth, authDispatch, {userDispatch, auth})
  const sortUsersAction = usePrivateRoute(sortUsers, auth, authDispatch, {userDispatch, auth});
  const deleteUserAction = usePrivateRoute(deleteUser, auth, authDispatch, {userDispatch});
  const fieldArray = ['Name', 'Email', 'Role'];

  return(
      <>
        {auth.isAuthenticated && auth.user.role === 'Admin' && <AddUser />}
        <CustomTable data={users.users} getAction={getUsersAction} sortAction={sortUsersAction} deleteAction={deleteUserAction} fields={fieldArray}/>
      </>
  );
};

export default Company;
