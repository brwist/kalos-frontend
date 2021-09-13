import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import { Provider } from 'react-redux';
import { LoginForm} from '../modules/login';
import './styles.less';
export default ()=>{
  ReactDOM.render(
    <Provider store={store}>
      <LoginForm />
    </Provider>,
    document.getElementById('root')
  )
  return null;
};  
