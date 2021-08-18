import React from 'react'
import ReactDOM from 'react-dom'
import { Dispatch } from './main'
import { UserClient } from '@kalos-core/kalos-rpc/User'
import { ENDPOINT } from '../../constants'

const u = new UserClient(ENDPOINT)

u.GetToken('test','test').then(() => {
  ReactDOM.render(<Dispatch userID={8418} />, document.getElementById('root'))
})
