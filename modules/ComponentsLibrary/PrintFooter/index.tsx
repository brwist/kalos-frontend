import React, { FC, ReactNode } from 'react';
import './styles.css';

export interface Props {
  height: number;
  children?: ReactNode;
}

export const PrintFooter: FC<Props> = ({ height, children }) => (
  <div className="PrintFooter" style={{ height }}>
    {children}
  </div>
);
