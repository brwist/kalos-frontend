import React, { FC } from 'react';
import './styles.less';

interface Props {
  userID: number;
}

export const Payroll: FC<Props> = ({ userID }) => <div>Payroll {userID}</div>;
