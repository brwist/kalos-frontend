import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import { QuoteLine } from '@kalos-core/kalos-rpc/QuoteLine';

interface props {
  ql: QuoteLine.AsObject;
  isSelected: boolean;
  onSelect(e: React.ChangeEvent<HTMLInputElement>, checked: boolean): void;
}

export const QuoteLineRow = ({ ql, isSelected, onSelect }: props) => {
  return (
    <TableRow>
      <TableCell>{ql.description}</TableCell>
      <TableCell>${ql.adjustment}</TableCell>
      <TableCell>
        <Checkbox checked={isSelected} value={ql.id} onChange={onSelect} />
      </TableCell>
    </TableRow>
  );
};
