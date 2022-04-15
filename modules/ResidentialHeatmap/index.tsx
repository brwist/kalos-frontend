import React from 'react';
import ReactDOM from 'react-dom';
import { ResidentialHeatmap } from './main';
import { UserClientService } from '../../helpers';

UserClientService.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <ResidentialHeatmap
      loggedUserId={8418}
      apiKey={'AIzaSyAYrAeGFmyE-POkh5Gl8S9fWGpSEsOclB0'}
    />,
    document.getElementById('root'),
  );
});
