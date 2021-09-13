import React from 'react';
import  Login  from './main';
import {ComponentsLibrary}  from '../ComponentsLibrary';
import { StyledPage } from '../PageWrapper/styled';
import { Provider,useSelector } from 'react-redux';
// import store from './App/store';
import { selectLoggedUser } from './loginSlice';

export const LoginForm = ()=>{
  const loggedUserData = useSelector(selectLoggedUser);
  const loggedUser = loggedUserData.loggedUser;
  const loggedUserId = loggedUser.id;

  if(loggedUserId != null)
  {
    return (<ComponentsLibrary />);
  }
  else{
    const Component = (
      <>
        <StyledPage>
          <Login />
        </StyledPage>
      </>
    );
    return Component;
  }
}