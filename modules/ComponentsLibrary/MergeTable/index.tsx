// This is a component for comparing differences much like the diff view in VSCode. However, instead of a
// view comparing code to keep / change, it's used to merge elements together by giving the user a choice
// of which table fields to keep and which to get rid of, resulting in a full object.

// For example, a Transaction could be provided that was incomplete - the user would be given multiple choices,
// and these choices will be given back as an array of any type once the user clicked all of the changes to accept.
// There will also be editing control available as a prop, so that the user can edit the fields in the table.

import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { Button } from '../Button';
import { Columns, Data, InfoTable } from '../InfoTable';

interface Props {
  columnHeaders: Columns;
  rows: {
    choices: string[];
    onSelect?: (selected: string) => void;
  }[];
}

export const MergeTable: FC<Props> = ({ columnHeaders, rows }) => {
  // Index of the array is the index of the relevant row
  const [selectedChoiceIndices, setSelectedChoiceIndices] = useState<string[]>(
    rows.map(() => ''), // Actually proud of how this one works not gonna lie
  );
  const [data, setData] = useState<Data>();
  const handleSetSelectedChoiceIndices = useCallback(
    (selectedChoice: string, rowIndex: number) => {
      let sci = selectedChoiceIndices;
      sci[rowIndex] = selectedChoice;
      setSelectedChoiceIndices(sci);
    },
    [setSelectedChoiceIndices, selectedChoiceIndices],
  );
  let handleSetData = useCallback(() => {
    let rowChoices: { value: ReactNode; onClick: () => void }[][] = [];

    rows.forEach((row, rowIndex) => {
      rowChoices.push(
        row.choices.map(choice => {
          return {
            value: (
              <>
                <Button
                  label={choice}
                  onClick={() => {
                    handleSetSelectedChoiceIndices(choice, rowIndex);
                    handleSetData();
                  }}
                  disabled={
                    selectedChoiceIndices[rowIndex] !== '' &&
                    selectedChoiceIndices[rowIndex] !== choice
                  }
                />
              </>
            ),
            onClick: () => {
              handleSetSelectedChoiceIndices(choice, rowIndex);
              handleSetData();
            },
          };
        }),
      );
    });
    setData(rowChoices as Data);
  }, [rows]);

  useEffect(() => {
    handleSetData();
  }, [handleSetData]);

  return (
    <>
      <InfoTable
        key={selectedChoiceIndices.toString()}
        columns={columnHeaders}
        data={data}
      />
    </>
  );
};
