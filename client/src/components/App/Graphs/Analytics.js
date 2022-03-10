import React, {useEffect, useContext} from 'react';
import { Container } from 'react-bootstrap';
import { TableContext } from '../../../context/TableContext';
import { AuthContext } from '../../../context/AuthContext';
import { getDeals, predictDeals } from '../../../context/actions/dealActions';
import { getUsers } from '../../../context/actions/userActions';
import { usePrivateRoute } from '../../../hooks/authMiddleware';
import { Chart, registerables } from 'chart.js';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';

Chart.register(...registerables);

const Analytics = () => {
  const {users, deals, dealDispatch, userDispatch} = useContext(TableContext);
  const {auth, authDispatch} = useContext(AuthContext);
  const getDealsAction = usePrivateRoute(getDeals, auth, authDispatch, {dealDispatch, auth});
  const getUsersAction = usePrivateRoute(getUsers, auth, authDispatch, {userDispatch, auth});
  const predictDealsAction = usePrivateRoute(predictDeals, auth, authDispatch, {dealDispatch})

  useEffect(() => {
    if(auth.isAuthenticated) {
      getDealsAction();
      getUsersAction();
    }
  }, [auth.isAuthenticated]);
  
  return (
    <Container>
      <LineChart chartData={deals.deals} predictAction={predictDealsAction} predicted={deals.predicted}/>
      <BarChart chartData={deals.deals} userData={users.users}/>
      <PieChart chartData={deals.deals} />
    </Container>
  )
}

export default Analytics