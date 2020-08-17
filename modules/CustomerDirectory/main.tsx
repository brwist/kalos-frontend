import React, { FC } from 'react';
import {
  CustomerAccountDashboard,
  Props,
} from '../ComponentsLibrary/CustomerAccountDashboard';
import { StyledPage } from '../PageWrapper/styled';

export const CustomerDirectory: FC<Props> = (props) => (
  <StyledPage>
    <CustomerAccountDashboard {...props} />
  </StyledPage>
);
