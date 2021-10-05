import React from 'react';
import ReactDOM from 'react-dom';
import { EditContractInfo } from './main';
import { UserClientService } from '../../helpers';

UserClientService.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <EditContractInfo
      userID={8418}
      onClose={() => {
        alert('Would close');
      }}
      onSave={saved => console.log('saving: ', saved)}
    />,
    document.getElementById('root'),
  );
});
