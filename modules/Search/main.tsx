import React, { PureComponent } from 'react';
import { refreshToken } from '../../helpers';
import { AdvancedSearch } from '../ComponentsLibrary/AdvancedSearch';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  loggedUserId: number;
}

export class Search extends PureComponent<Props> {
  async componentDidMount() {
    await refreshToken();
  }
  render() {
    const { loggedUserId, withHeader } = this.props;
    const content = (
      <AdvancedSearch
        kinds={['serviceCalls', 'properties', 'customers']}
        loggedUserId={loggedUserId}
        title="Search"
        editableCustomers
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
