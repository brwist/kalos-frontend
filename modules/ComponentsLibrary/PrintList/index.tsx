import React, { FC, ReactNode } from 'react';
import './PrintList.module.css';

export interface Props {
  items: ReactNode[];
}

export const PrintList: FC<Props> = ({ items }) => (
  <ul className="PrintList">
    {items.map((item, idx) => (
      <li key={idx} className="PrintList_item">
        {item}
      </li>
    ))}
  </ul>
);
