import React, { FC } from 'react';
import { InternalDocuments } from '../ComponentsLibrary/InternalDocuments';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  userId: number;
}

export const Documents: FC<Props> = ({ userId, ...props }) => (
  <PageWrapper {...props} userID={userId}>
    <InternalDocuments />
  </PageWrapper>
);
