import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { makeStyles } from '@material-ui/core/styles';
import customTheme from '../Theme/main';
import { CustomerInformation } from './components/CustomerInformation';
import { PropertyInfo } from './components/PropertyInfo';
import { PropertyDocuments } from './components/PropertyDocuments';
import { ServiceItems } from './components/ServiceItems';
import { ServiceCalls } from './components/ServiceCalls';

interface Props {
  userID: number;
  propertyId: number;
  loggedUserId: number;
}

const useStyles = makeStyles(theme => ({
  propertiesWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  properties: {
    flexGrow: 1,
  },
  documents: {
    flexShrink: 0,
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(2),
      width: 470,
    },
  },
}));

export const PropertyInformation = (props: Props) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <CustomerInformation {...props} />
      <div className={classes.propertiesWrapper}>
        <div className={classes.properties}>
          <PropertyInfo {...props} />
          <ServiceItems {...props} />
        </div>
        <PropertyDocuments className={classes.documents} {...props} />
      </div>
      <ServiceCalls {...props} />
    </ThemeProvider>
  );
};
