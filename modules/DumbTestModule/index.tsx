import React from 'react'
import ReactDOM from 'react-dom' 
import { DumbTestModule } from './main' 
import { UserClientService } from '../../helpers'

UserClientService.GetToken('test','test').then(() => {
  ReactDOM.render(<DumbTestModule loggedUserId={8418} />, document.getElementById('root'))
})