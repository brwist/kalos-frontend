import React, { useState, useCallback } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ReactDOM from 'react-dom';
import customTheme from '../Theme/main';
import Button from './Button/examples';
import Confirm from './Confirm/examples';
import ConfirmDelete from './ConfirmDelete/examples';
import CustomerInformation from './CustomerInformation/examples';
import Field from './Field/examples';
import Form from './Form/examples';
import InfoTable from './InfoTable/examples';
import Link from './Link/examples';
import Modal from './Modal/examples';
import PlainForm from './PlainForm/examples';
import Search from './Search/examples';
import SectionBar from './SectionBar/examples';

const DEFAULT_COMPONENT_IDX = 0;

const COMPONENTS = {
  Button,
  Confirm,
  ConfirmDelete,
  CustomerInformation,
  Field,
  Form,
  InfoTable,
  Link,
  Modal,
  PlainForm,
  Search,
  SectionBar,
};

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  menu: {
    width: 185,
    padding: theme.spacing(),
    backgroundColor: theme.palette.grey[100],
  },
  list: {
    marginLeft: theme.spacing(2.5),
    paddingInlineStart: 0,
    ...theme.typography.body2,
    userSelect: 'none',
  },
  item: {
    cursor: 'pointer',
  },
  itemText: {
    padding: theme.spacing(0.5),
  },
  content: {
    padding: theme.spacing(),
    flexGrow: 1,
  },
  select: {
    margin: theme.spacing(),
    outline: 'none',
    background: 'gold',
    height: 30,
    ...theme.typography.body1,
  },
}));

const ComponentsLibrary = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const [component, setComponent] = useState<keyof typeof COMPONENTS>(
    Object.keys(COMPONENTS)[DEFAULT_COMPONENT_IDX] as keyof typeof COMPONENTS,
  );
  const Component = COMPONENTS[component];
  const handleClickMenuItem = useCallback(v => () => setComponent(v), [
    setComponent,
  ]);
  const handleSelect = useCallback(
    ({ target: { value } }) => setComponent(value),
    [setComponent],
  );
  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <div className={classes.wrapper}>
        {matches ? (
          <select
            className={classes.select}
            value={component}
            onChange={handleSelect}
          >
            {Object.keys(COMPONENTS).map(key => (
              <option key={key}>{key}</option>
            ))}
          </select>
        ) : (
          <div className={classes.menu}>
            <Typography variant="h6">Components Library</Typography>
            <ol className={classes.list}>
              {Object.keys(COMPONENTS).map(key => (
                <li
                  key={key}
                  className={classes.item}
                  onClick={handleClickMenuItem(key)}
                >
                  <div
                    className={classes.itemText}
                    style={{
                      backgroundColor:
                        key === component ? 'gold' : 'transparent',
                    }}
                  >
                    {key}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
        <div className={classes.content}>
          <Component />
        </div>
      </div>
    </ThemeProvider>
  );
};

ReactDOM.render(<ComponentsLibrary />, document.getElementById('root'));
