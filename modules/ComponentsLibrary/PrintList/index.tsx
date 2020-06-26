import React, { FC, ReactNode } from 'react';
import './styles.css';

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
