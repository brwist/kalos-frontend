import React from 'react';
import ReactDOM from 'react-dom';
import { Dashboard } from './main';
import './styles.less';
import { useSelector } from 'react-redux';
import { selectLoggedUser } from '../login/loginSlice';

export default ()=>{
  const loggedUserData = useSelector(selectLoggedUser);
  const loggedUser = loggedUserData.loggedUser;
  const loggedUserId = loggedUser.id;

  // userId=103285
  return (<Dashboard userId={loggedUserId} withHeader />);
}