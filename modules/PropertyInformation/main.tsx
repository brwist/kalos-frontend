import React, { useState, useCallback } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { makeStyles } from '@material-ui/core/styles';
import customTheme from '../Theme/main';
import { SectionBar } from './components/SectionBar';
import { CustomerInformation } from './components/CustomerInformation';
import { PropertyInfo } from './components/PropertyInfo';
import { PropertyDocuments } from './components/PropertyDocuments';
import { ServiceItems } from './components/ServiceItems';

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
  const { userID, propertyId } = props;
  const [editingCustomerInformation, setEditingCustomerInformation] = useState(
    false
  );
  const [editingPropertyInfo, setEditingPropertyInfo] = useState(false);
  const handleToggleEditingCustomerInformation = useCallback(
    () => setEditingCustomerInformation(!editingCustomerInformation),
    [setEditingCustomerInformation, editingCustomerInformation]
  );
  const handleToggleEditingPropertyInfo = useCallback(
    () => setEditingPropertyInfo(!editingPropertyInfo),
    [setEditingPropertyInfo, editingPropertyInfo]
  );
  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <SectionBar
        title="Customer Information"
        buttons={[
          {
            label: 'Calendar',
            url: `/index.cfm?action=admin:service.calendar&calendarAction=week&userIds=${userID}`,
          },
          {
            label: 'Call History',
            url: `/index.cfm?action=admin:customers.listPhoneCallLogs&code=customers&id=${userID}`,
          },
          {
            label: 'Tasks',
            url: `/index.cfm?action=admin:tasks.list&code=customers&id=${userID}`,
          },
          {
            label: 'Add Notification',
            onClick: () => {}, // TODO: implement onClick
          },
          {
            label: 'Edit Customer Information',
            onClick: handleToggleEditingCustomerInformation,
          },
          {
            label: 'Delete Customer',
            onClick: () => {}, // TODO: implement onClick
          },
        ]}
      />
      <CustomerInformation
        {...props}
        editing={editingCustomerInformation}
        onCloseEdit={handleToggleEditingCustomerInformation}
      />
      <div className={classes.propertiesWrapper}>
        <div className={classes.properties}>
          <SectionBar
            title="Property Information"
            buttons={[
              {
                label: 'Tasks',
                url: `/index.cfm?action=admin:tasks.list&code=properties&id=${propertyId}`,
              },
              {
                label: 'Add Notification',
                onClick: () => {}, // TODO: implement onClick
              },
              {
                label: 'Change Property',
                onClick: handleToggleEditingPropertyInfo,
              },
              {
                label: 'Owner Details',
                url: `/index.cfm?action=admin:customers.details&user_id=${userID}`,
              },
            ]}
          />
          <PropertyInfo
            {...props}
            editing={editingPropertyInfo}
            onCloseEdit={handleToggleEditingPropertyInfo}
          />
          <SectionBar
            title="Service Items"
            buttons={[
              {
                label: 'Add Service Item',
              },
            ]}
          />
        </div>
        <PropertyDocuments className={classes.documents} {...props} />
      </div>
    </ThemeProvider>
  );
};
