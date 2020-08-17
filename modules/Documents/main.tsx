import React, { FC } from 'react';
import { InternalDocuments } from '../ComponentsLibrary/InternalDocuments';
import { PageWrapper } from '../PageWrapper/main';

interface Props {
  userId: number;
}

export const Documents: FC<Props> = ({ userId }) => (
  <PageWrapper userID={userId}>
    <InternalDocuments />
  </PageWrapper>
);
