import React, {useContext} from 'react';
import CustomTable from './CustomTable';
import { getDeals, deleteDeal, sortDeals } from '../../../context/actions/dealActions.js';
import { TableContext } from '../../../context/TableContext';
import { AuthContext } from '../../../context/AuthContext';
import AddDeal from '../AddComponents/AddDeal.js';
import { usePrivateRoute } from '../../../hooks/authMiddleware.js';

const Deals = () => {
  const {deals, dealDispatch} = useContext(TableContext);
  const {auth, authDispatch} = useContext(AuthContext);
  const getDealsAction = usePrivateRoute(getDeals, auth, authDispatch, {dealDispatch, auth})
  const sortDealsAction = usePrivateRoute(sortDeals, auth, authDispatch, {dealDispatch, auth});
  const deleteDealAction = usePrivateRoute(deleteDeal, auth, authDispatch, {});
  const fieldArray = ['Item', 'Amount', 'Partner', 'Owner'];

  return(
      <>
        <h2>Deals</h2>
        {auth.isAuthenticated &&
          <div className='d-flex flex-row justify-content-end'>
            <AddDeal />
          </div>
        }
        <CustomTable data={deals.deals} getAction={getDealsAction} sortAction={sortDealsAction} deleteAction={deleteDealAction} fields={fieldArray}/>
      </>
  );
};

export default Deals;
