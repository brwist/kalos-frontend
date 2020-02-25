import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import SectionBar from './components/SectionBar';
import { CustomerInformation } from './components/CustomerInformation';
import { PropertyInfo } from './components/PropertyInfo';

interface props {
  userID: number;
  propertyId: number;
}

interface state {}

export class PropertyInformation extends React.PureComponent<props, state> {
  render() {
    const { userID } = this.props;
    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        <SectionBar
          title="Customer Information"
          buttons={[
            {
              label: 'Calendar',
              url: `/index.cfm?action=admin:service.calendar&calendarAction=week&userIds=${userID}`,
            },
          ]}
        />
        <CustomerInformation {...this.props} />
        <SectionBar title="Property Information" />
        <PropertyInfo {...this.props} />
      </ThemeProvider>
    );
  }
}
