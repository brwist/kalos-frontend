import React, { FC } from 'react';

export interface Props {
  loggedUserId: number;
}

export const SpiffTool: FC<Props> = ({ loggedUserId }) => {
  return <h1>SpiffToll! {loggedUserId}</h1>;
};
