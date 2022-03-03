import React, {useContext, useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { TableContext } from '../../../context/TableContext';
import { io } from 'socket.io-client';

const AppMain = () => {
  const {contactDispatch, userDispatch, dealDispatch} = useContext(TableContext);
  const {auth} = useContext(AuthContext);

  useEffect(() => {
    if(auth.isAuthenticated) {
      //connect socket
      console.log(window.location)
      const socket = io('https:.arkles.herokuapp.com:8000/');
      socket.emit('joinRoom', auth.user.company.id);
      //
      socket.on('newContact', (contact) => {
        contactDispatch({
          type: 'CONTACTS_ADD',
          payload: contact
        })
      });
      socket.on('deletedContact', (contact) => {
        contactDispatch({
          type: 'CONTACTS_DELETE',
          payload: contact.id
        })
      });
      //
      socket.on('newDeal', (deal) => {
        dealDispatch({
          type: 'DEALS_ADD',
          payload: deal
        })
      });
      socket.on('deletedDeal', (deal) => {
        dealDispatch({
          type: 'DEALS_DELETE',
          payload: deal.id
        })
      });
      //
      socket.on('newUser', (user) => {
        userDispatch({
          type: 'USERS_ADD',
          payload: user
        })
      })
      socket.on('deletedUser', (user) => {
        userDispatch({
          type: 'USERS_DELETE',
          payload: user.id
        })
      });
      //
      socket.on('disconnect', () => {
        window.location.reload();
      })
      //close socket
      return () => {
        socket.emit('disconnected', socket.id);
        socket.disconnect()
      }
    }
  }, [auth.isAuthenticated])

  return (
    <Outlet />
  )
};

export default AppMain;