import React from 'react'
import ReactDOM from 'react-dom' 
import { DepartmentDashboard } from './main'
import { UserClient } from '@kalos-core/kalos-rpc/User'
import { ENDPOINT } from '../../constants'
import { UserClientService } from '../../helpers'

UserClientService.GetToken('test','test').then(() => {
  ReactDOM.render(<DepartmentDashboard userID={8418} />, document.getElementById('root'))
})