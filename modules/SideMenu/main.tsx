import React, { useEffect, useReducer, useState, useCallback } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuSharp from '@material-ui/icons/MenuSharp';
import { forceHTTPS, UserClientService } from '../../helpers';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';
import customTheme from '../Theme/main';
import KalosMenuItem from './components/KalosMenuItem';
import ReportBugForm from './components/ReportBugForm';
import { Modal } from '../ComponentsLibrary/Modal';
import { UploadPhoto } from '../ComponentsLibrary/UploadPhoto';
import {
  employeeItems,
  adminItems,
  managerItems,
  dispatchItems,
  commonItems,
  customerItems,
} from './constants';

const userClient = new UserClient(ENDPOINT);

export type Props = {
  userID: number;
  imgURL?: string;
};

type State = {
  isManager: boolean;
  isOpen: boolean;
  user: User;
  reportBugFormShown: boolean;
};

type Action =
  | { type: 'toggleMenu' }
  | { type: 'closeMenu' }
  | { type: 'fetchedUser'; user: User; isManager: boolean }
  | { type: 'showReportBugForm' }
  | { type: 'hideReportBugForm' };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'toggleMenu':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case 'closeMenu':
      return {
        ...state,
        isOpen: false,
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
const SideMenu = ({
  userID,
  imgURL = 'https://app.kalosflorida.com/app/assets/images/kalos-logo-new.png',
}: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    user: new User(),
    isManager: false,
    isOpen: false,
    reportBugFormShown: false,
  });
  const { user, isManager, isOpen, reportBugFormShown } = state;
  const [openUploadReceipt, setOpenUploadReceipt] = useState<boolean>(false);
  const toggleMenu = () => {
    dispatch({ type: 'toggleMenu' });
  };
  const handleReportBugClicked = () => {
    dispatch({ type: 'showReportBugForm' });
  };
  const handleCloseReportBugForm = () => {
    dispatch({ type: 'hideReportBugForm' });
  };
  const toggleOpenUploadReceipt = useCallback(() => {
    dispatch({ type: 'closeMenu' });
    setOpenUploadReceipt(!openUploadReceipt);
  }, [setOpenUploadReceipt, openUploadReceipt, dispatch]);
  useEffect(() => {
    (async () => {
      forceHTTPS();
      await userClient.GetToken('test', 'test');
      const userResult = await UserClientService.loadUserById(userID);
      //customerCheck(userResult);
      if (userResult.getIsSu() === 1) {
        dispatch({ type: 'fetchedUser', user: userResult, isManager: true });
      } else {
        try {
          if (
            userResult
              .getPermissionGroupsList()
              .find(p => p.getName() === 'Manager') ||
            userResult
              .getPermissionGroupsList()
              .find(p => p.getName() === 'Payroll')
          ) {
            dispatch({
              type: 'fetchedUser',
              user: userResult,
              isManager: true,
            });
          } else {
            dispatch({
              type: 'fetchedUser',
              user: userResult,
              isManager: false,
            });
          }
        } catch (err) {
          dispatch({ type: 'fetchedUser', user: userResult, isManager: false });
        }
      }
    })();
  }, [userID]);

  if (!user?.getId()) {
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

      <Drawer
        open={isOpen}
        onClose={toggleMenu}
        style={{ width: 250, padding: 10 }}
      >
        <List style={{ width: 250 }}>
          {user.getIsEmployee() === 1 &&
            employeeItems({
              toggleUploadReceipt: toggleOpenUploadReceipt,
            }).map(item => (
              <KalosMenuItem
                key={`empl_${item?.title || 'divider'}`}
                item={item}
                userId={userID}
              />
            ))}
          {user.getIsAdmin() === 1 && (
            <>
              {adminItems.map(item => (
                <KalosMenuItem
                  key={`admin_${item?.title || 'divider'}`}
                  item={item}
                  userId={userID}
                />
              ))}
            </>
          )}
          {user.getPermissionGroupsList().find(p=>p.getName() === "Dispatch") && (
            <>
              {dispatchItems.map(item => (
                <KalosMenuItem
                  key={`dispatch_${item?.title || 'divider'}`}
                  item={item}
                  userId={userID}
                />
              ))}
            </>
          )}
          {isManager && (
            <>
              {managerItems.map(item => (
                <KalosMenuItem
                  key={`manager_${item?.title || 'divider'}`}
                  item={item}
                  userId={userID}
                />
              ))}
            </>
          )}
          {user.getIsEmployee() === 0 &&
            customerItems(toggleMenu).map(item => (
              <KalosMenuItem
                key={`customer_${item?.title || 'divider'}`}
                item={item}
                userId={userID}
              />
            ))}
          {user.getIsEmployee() === 1 &&
            commonItems.map(item => {
              if (item.title === 'Report a Bug') {
                return (
                  <KalosMenuItem
                    key={`com_${item?.title}`}
                    item={item}
                    userId={userID}
                    onClick={handleReportBugClicked}
                  />
                );
              } else {
                return (
                  <KalosMenuItem
                    key={`com_${item?.title || 'divider'}`}
                    item={item}
                    userId={userID}
                  />
                );
              }
            })}
        </List>
      </Drawer>
      {reportBugFormShown && (
        <ReportBugForm onClose={handleCloseReportBugForm} user={user} />
      )}
      {openUploadReceipt && (
        <Modal open onClose={toggleOpenUploadReceipt}>
          <UploadPhoto
            title="Upload Photo"
            bucket="kalos-pre-transactions"
            onClose={toggleOpenUploadReceipt}
            loggedUserId={userID}
          />
        </Modal>
      )}
    </ThemeProvider>
  );
};

export default SideMenu;
