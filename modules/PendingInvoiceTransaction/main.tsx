import React, { FC } from 'react';
import { PendingInvoiceTransactionComponent } from '../ComponentsLibrary/PendingInvoiceTransaction';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props {
  userID: number;
}

export const PendingInvoiceTransaction: FC<Props & PageWrapperProps> = ({
  userID,
}) => (
  <PageWrapper userID={userID} withHeader>
    <PendingInvoiceTransactionComponent loggedUserId={userID} />
  </PageWrapper>
);
