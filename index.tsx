import React, { useState, useCallback } from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ReactDOM from 'react-dom';
import { Provider,useSelector } from 'react-redux';
import { StyledPage } from './modules/PageWrapper/styled';
import LoginForm  from './App';
import store from './App/store';
import { selectLoggedUser } from './modules/login/loginSlice';

import './modules/ComponentsLibrary/styles.less';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from './constants';

const DEFAULT_COMPONENT_IDX = 0;

const COMPONENTS = {
  LoginForm,
};

const u = new UserClient(ENDPOINT);

export const App = () => {

  // const loggedUserData = useSelector(selectLoggedUser );
  // const loggedUser = loggedUserData.loggedUser;
  // const loggedUserId = loggedUser.id;
  // const loggedUserUserName = loggedUser.userName;
  // if(loggedUserId)
  // {
  // }
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const [component, setComponent] = useState<keyof typeof COMPONENTS>(
    Object.keys(COMPONENTS)[DEFAULT_COMPONENT_IDX] as keyof typeof COMPONENTS,
  );
  const Component = COMPONENTS[component];
  return (
    <StyledPage>
      <div className="App">
        <div className="AppContent">
          <Component />
        </div>
      </div>
    </StyledPage>
  );
};
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
});
