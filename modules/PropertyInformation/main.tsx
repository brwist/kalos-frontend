import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { makeStyles } from '@material-ui/core/styles';
import customTheme from '../Theme/main';
import { CustomerInformation } from './components/CustomerInformation';
import { PropertyInfo } from './components/PropertyInfo';
import { PropertyDocuments } from './components/PropertyDocuments';
import { ServiceItems } from './components/ServiceItems';
import { ServiceCalls } from './components/ServiceCalls';

interface props {
  userID: number;
  propertyId: number;
}

interface state {}

const useStyles = makeStyles(theme => ({
  propertiesWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  properties: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
  },
  documents: {
    width: '34%',
  },
}));

export const PropertyInformation = (props: props) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      {/* <CustomerInformation {...props} />
      <div className={classes.propertiesWrapper}>
        <div className={classes.properties}>
          <PropertyInfo {...props} />
          <ServiceItems {...props} />
        </div>
        <PropertyDocuments className={classes.documents} {...props} />
      </div> */}
      <ServiceCalls {...props} />
    </ThemeProvider>
  );
};
