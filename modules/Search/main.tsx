import React, { PureComponent } from 'react';
import { AdvancedSearch } from '../ComponentsLibrary/AdvancedSearch';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  loggedUserId: number;
}

export class Search extends PureComponent<Props> {
  render() {
    const { loggedUserId, withHeader } = this.props;
    const content = (
      <AdvancedSearch
        kinds={['serviceCalls', 'properties', 'customers']}
        loggedUserId={loggedUserId}
        title="Search"
        editableCustomers
        editableProperties
      />
    );
    if (withHeader)
      return (
        <PageWrapper {...this.props} userID={loggedUserId}>
          {content}
        </PageWrapper>
      );
    return content;
  }
}
