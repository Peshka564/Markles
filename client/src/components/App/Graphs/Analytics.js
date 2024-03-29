import React, {useEffect, useContext} from 'react';
import { Container } from 'react-bootstrap';
import { TableContext } from '../../../context/TableContext';
import { AuthContext } from '../../../context/AuthContext';
import { getDeals, predictDeals, trainDeals} from '../../../context/actions/dealActions';
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
  const trainDealsAction = usePrivateRoute(trainDeals, auth, authDispatch, {dealDispatch})
  const predictDealsAction = usePrivateRoute(predictDeals, auth, authDispatch, {dealDispatch})

  useEffect(() => {
    if(auth.isAuthenticated) {
      getDealsAction();
      getUsersAction();
    }
  }, [auth.isAuthenticated]);
  
  return (
    <Container>
      <LineChart chartData={deals.deals} predictAction={predictDealsAction} trainAction={trainDealsAction} ai={{
          predicting: deals.isPredicting,
          predicted: deals.predicted,
          training: deals.isTraining,
          trained: deals.hasTrained
      }}/>
      <BarChart chartData={deals.deals} userData={users.users}/>
      <PieChart chartData={deals.deals} />
    </Container>
  )
}

export default Analytics