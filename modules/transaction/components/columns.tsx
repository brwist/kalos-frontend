import * as React from 'react';
import {
  Cell,
  EditableCell,
  ColumnHeaderCell,
  Column,
} from '@blueprintjs/table';
import { Menu, MenuItem } from '@blueprintjs/core';

export type ICellLookup = (rowIndex: number, columnIndex: number) => any;
export type ISortCallback = (
  columnIndex: number,
  comparator: (a: any, b: any) => number,
  dir: string,
) => void;

export interface ISortableColumn {
  getColumn(
    getCellData: ICellLookup,
    sortColumn: ISortCallback,
    updateCellData: ICellLookup,
  ): JSX.Element;
}

export abstract class AbstractSortableColumn implements ISortableColumn {
  constructor(
    protected name: string,
    protected index: number,
    protected isEditable: boolean,
  ) {}

  public getColumn(
    getCellData: ICellLookup,
    sortColumn: ISortCallback,
    updateCellData: ICellLookup,
  ) {
    let wrapText = false;
    if (this.name === 'Notes') {
      wrapText = true;
    }
    const cellRenderer = (rowIndex: number, columnIndex: number) => {
      if (this.isEditable) {
        return (
          <EditableCell
            value={`${getCellData(rowIndex, columnIndex)}`}
            intent="primary"
            onConfirm={updateCellData(rowIndex, columnIndex)}
            wrapText={wrapText}
          />
        );
      }
      return (
        <Cell intent="primary">{`${getCellData(rowIndex, columnIndex)}`}</Cell>
      );
    };
    const menuRenderer = this.renderMenu.bind(this, sortColumn);
    const columnHeaderCellRenderer = () => (
      <ColumnHeaderCell name={this.name} menuRenderer={menuRenderer} />
    );

    return (
      <Column
        cellRenderer={cellRenderer}
        columnHeaderCellRenderer={columnHeaderCellRenderer}
        key={this.index}
        name={this.name}
      />
    );
  }

  protected abstract renderMenu(sortColumn: ISortCallback): JSX.Element;
}

export class TextSortableColumn extends AbstractSortableColumn {
  protected renderMenu(sortColumn: ISortCallback) {
    const sortAsc = () =>
      sortColumn(this.index, (a, b) => this.compare(a, b), 'asc');
    const sortDesc = () =>
      sortColumn(this.index, (a, b) => this.compare(b, a), 'desc');
    return (
      <Menu>
        <MenuItem onClick={sortAsc} text="Sort Asc" />
        <MenuItem onClick={sortDesc} text="Sort Desc" />
      </Menu>
    );
  }

  private compare(a: string, b: string) {
    return a.toString().localeCompare(b);
  }
}

export class NumberSortableColumn extends AbstractSortableColumn {
  protected renderMenu(sortColumn: ISortCallback) {
    const sortAsc = () =>
      sortColumn(this.index, (a, b) => this.compare(a, b), 'asc');
    const sortDesc = () =>
      sortColumn(this.index, (a, b) => this.compare(b, a), 'desc');
    return (
      <Menu>
        <MenuItem onClick={sortAsc} text="Sort Asc" />
        <MenuItem onClick={sortDesc} text="Sort Desc" />
      </Menu>
    );
  }

  private compare(a: number, b: number) {
    return a - b;
  }
}
