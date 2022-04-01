import React, { FC } from 'react';
import "./PrintPageBreak.module.css";
interface Props {
  height: number;
}

export const PrintPageBreak: FC<Props> = ({ height }) => (
  <div className="PrintPageBreak" style={{ height }} />
);
