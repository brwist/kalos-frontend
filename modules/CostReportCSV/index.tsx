import React from 'react';
import ReactDOM from 'react-dom';
import { CostReportCSV } from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';
import { UserClientService } from '../../helpers';

UserClientService.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <CostReportCSV userID={8418} jobNumber={121027} />,
    document.getElementById('root'),
  );
});
