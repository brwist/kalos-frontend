import React, { useEffect, useReducer } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuSharp from '@material-ui/icons/MenuSharp';
import { loadUserById, forceHTTPS, customerCheck } from '../../helpers';
import {
  TimesheetDepartmentClient,
  TimesheetDepartment,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';
import customTheme from '../Theme/main';
import KalosMenuItem from './components/KalosMenuItem';
import ReportBugForm from './components/ReportBugForm';
import {
  employeeItems,
  adminItems,
  managerItems,
  commonItems,
} from './constants';

const userClient = new UserClient(ENDPOINT);
const deptClient = new TimesheetDepartmentClient(ENDPOINT);

type Props = {
  userId: number;
  imgURL: string;
};

type State = {
  isManager: boolean;
  isOpen: boolean;
  user: User.AsObject;
  reportBugFormShown: boolean;
};

type Action =
  | { type: 'toggleMenu' }
  | { type: 'fetchedUser'; user: User.AsObject; isManager: boolean }
  | { type: 'showReportBugForm' }
  | { type: 'hideReportBugForm' };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'toggleMenu':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case 'fetchedUser':
      return {
        ...state,
        user: action.user,
        isManager: action.isManager,
      };
    case 'showReportBugForm':
      return {
        ...state,
        reportBugFormShown: true,
      };
    case 'hideReportBugForm':
      return {
        ...state,
        reportBugFormShown: false,
      };
    default:
      return state;
  }
};
const SideMenu = ({ userId, imgURL }: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    user: new User().toObject(),
    isManager: false,
    isOpen: false,
    reportBugFormShown: false,
  });
  const { user, isManager, isOpen, reportBugFormShown } = state;

  const toggleMenu = () => {
    dispatch({ type: 'toggleMenu' });
  };

  const handleReportBugClicked = () => {
    dispatch({ type: 'showReportBugForm' });
  };

  const handleCloseReportBugForm = () => {
    dispatch({ type: 'hideReportBugForm' });
  };

  useEffect(() => {
    (async () => {
      //forceHTTPS(window.location.href);
      userClient.GetToken('test', 'test');
      const userResult = await loadUserById(userId);
      //customerCheck(userResult);
      if (userResult.isSu) {
        dispatch({ type: 'fetchedUser', user: userResult, isManager: true });
      } else {
        const dpt = new TimesheetDepartment();
        dpt.setManagerId(userId);
        const deptResult = await deptClient.Get(dpt);
        if (deptResult.id !== 0) {
          dispatch({ type: 'fetchedUser', user: userResult, isManager: true });
        } else {
          dispatch({ type: 'fetchedUser', user: userResult, isManager: false });
        }
      }
    })();
  }, []);

  if (!user?.id) {
    return null;
  }

  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <Hidden mdDown>
        <Button onClick={toggleMenu} style={{ margin: '10px' }}>
          <img
            src={imgURL}
            alt="no img"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Button>
      </Hidden>
      <Hidden lgUp>
        <IconButton
          onClick={toggleMenu}
          style={{ color: 'white', margin: '10px' }}
        >
          <MenuSharp />
        </IconButton>
      </Hidden>
      {user.isEmployee && (
        <Drawer
          open={isOpen}
          onClose={toggleMenu}
          style={{ width: 250, padding: 10 }}
        >
          <List style={{ width: 250 }}>
            {employeeItems.map((item) => (
              <KalosMenuItem item={item} userId={userId} />
            ))}
            {user.isAdmin && (
              <>
                {adminItems.map((item) => (
                  <KalosMenuItem item={item} userId={userId} />
                ))}
              </>
            )}
            {isManager && (
              <>
                {managerItems.map((item) => (
                  <KalosMenuItem item={item} userId={userId} />
                ))}
              </>
            )}
            {commonItems.map((item) => {
              if (item.title === 'Report a Bug') {
                return (
                  <KalosMenuItem
                    item={item}
                    userId={userId}
                    onClick={handleReportBugClicked}
                  />
                );
              } else {
                return <KalosMenuItem item={item} userId={userId} />;
              }
            })}
          </List>
        </Drawer>
      )}
      {reportBugFormShown && (
        <ReportBugForm onClose={handleCloseReportBugForm} />
      )}
    </ThemeProvider>
  );
};

export default SideMenu;
