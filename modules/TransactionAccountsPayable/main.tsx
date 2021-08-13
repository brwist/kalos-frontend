import React, { FC } from 'react';
import { Props } from '../ComponentsLibrary/TransactionTable';
import { TransactionTable } from '../ComponentsLibrary/TransactionTable';
import { PageWrapper } from '../PageWrapper/main';

export const TransactionAccountsPayable: FC<Props> = props => (
  <PageWrapper {...props} userID={props.loggedUserId} withHeader>
    <TransactionTable {...props} loggedUserId={props.loggedUserId} hasActions />
  </PageWrapper>
);
