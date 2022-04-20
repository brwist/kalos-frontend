import React, { FC, ReactNode } from 'react';
import './PrintFooter.module.css';
export interface Props {
  height: number;
  children?: ReactNode;
}

export const PrintFooter: FC<Props> = ({ height, children }) => (
  <div className="PrintFooter" style={{ height }}>
    <h1>PRINT</h1>
    {children}
  </div>
);
