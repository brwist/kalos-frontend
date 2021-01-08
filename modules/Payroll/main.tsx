import React, { FC } from 'react';
import { Payroll as PayrollComponent } from '../ComponentsLibrary/Payroll';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props {
  userID: number;
}

export const Payroll: FC<Props & PageWrapperProps> = ({ userID, ...props }) => (
  <PageWrapper {...props} userID={userID} withHeader>
    <PayrollComponent userID={userID} />
  </PageWrapper>
);
