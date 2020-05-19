import React from 'react';
import { AdvancedSearch } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Service Calls, Customers and Properties</ExampleTitle>
    <AdvancedSearch
      title="Search"
      kinds={['serviceCalls', 'customers', 'properties']}
      loggedUserId={101253}
    />
    <ExampleTitle>Service Calls</ExampleTitle>
    <AdvancedSearch
      title="Service Calls"
      loggedUserId={101253}
      kinds={['serviceCalls']}
      deletableEvents
    />
    <ExampleTitle>Customers</ExampleTitle>
    <AdvancedSearch
      title="Customers"
      kinds={['customers']}
      loggedUserId={101253}
      editableCustomers
      deletableCustomers
    />
    <ExampleTitle>Properties</ExampleTitle>
    <AdvancedSearch
      title="Properties"
      kinds={['properties']}
      loggedUserId={101253}
      editableProperties
      deletableProperties
    />
  </>
);
