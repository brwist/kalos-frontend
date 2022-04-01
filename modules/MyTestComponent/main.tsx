import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { User } from '../../@kalos-core/kalos-rpc/User';
import { UserClientService } from '../../helpers';

// add any prop types here
interface props {
  userID: number;
}

export const MyTestComponent: React.FC<props> = () => {
  const [users, setUsers] = React.useState<User[]>([new User()]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const getUser = React.useCallback(
    async (id: number) => {
      setLoading(true);
      const req = new User();
      //req.setOverrideLimit(true);
      req.setWithProperties(true);
      try {
        setUsers((await UserClientService.BatchGet(req)).getResultsList());
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    },
    [users],
  );

  getUser(8418);
  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      {loading ? <h1>please wait...</h1> : <h1>done!</h1>}
    </ThemeProvider>
  );
};
