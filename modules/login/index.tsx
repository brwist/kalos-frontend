import React from 'react';
import { Login } from './main';
import { StyledPage } from '../PageWrapper/styled';
export const LoginForm = ()=>{
  const Component = (
  <>
  <StyledPage>
    <Login />
  </StyledPage>
  </>
  );
  return Component;
}