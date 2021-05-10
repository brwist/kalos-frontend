// This is a component for comparing differences much like the diff view in VSCode. However, instead of a
// view comparing code to keep / change, it's used to merge elements together by giving the user a choice
// of which table fields to keep and which to get rid of, resulting in a full object.

// For example, a Transaction could be provided that was incomplete - the user would be given multiple choices,
// and these choices will be given back as an array of any type once the user clicked all of the changes to accept.
// There will also be editing control available as a prop, so that the user can edit the fields in the table.

import { Typography } from '@material-ui/core';
import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { Button } from '../Button';
import { Columns, Data, InfoTable } from '../InfoTable';
import { SectionBar } from '../SectionBar';

interface Props {
  columnHeaders: Columns;
  rows: {
    choices: string[];
    rowName: string; // What is the label to display to the side?
    onSelect?: (selected: string) => void;
  }[];
  onSubmit: (results: string[]) => void; // Index of the results is the index of the relevant row
  onCancel: () => void;
}

export const MergeTable: FC<Props> = ({
  columnHeaders,
  rows,
  onSubmit,
  onCancel,
}) => {
  // Index of the array is the index of the relevant row
  const [selectedChoices, setSelectedChoices] = useState<string[]>(
    rows.map(() => ''), // Actually proud of how this one works not gonna lie
  );
  const [data, setData] = useState<Data>();
  const handleSetSelectedChoiceIndices = useCallback(
    (selectedChoice: string, rowIndex: number) => {
      let sci = selectedChoices;
      sci[rowIndex] = selectedChoice;
      setSelectedChoices(sci);
    },
    [setSelectedChoices, selectedChoices],
  );
  let handleSetData = useCallback(() => {
    let rowChoices: { value: ReactNode; onClick: () => void }[][] = [];

    rows.forEach((row, rowIndex) => {
      rowChoices.push([
        {
          value: <Typography>{row.rowName}</Typography>,
          onClick: () => {},
        },
        ...row.choices.map(choice => {
          return {
            value: (
              <>
                <Button
                  style={{ textTransform: 'none' }}
                  label={choice}
                  onClick={() => {
                    handleSetSelectedChoiceIndices(choice, rowIndex);
                    handleSetData();
                  }}
                  disabled={
                    selectedChoices[rowIndex] !== '' &&
                    selectedChoices[rowIndex] !== choice
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
      ]);
    });
    console.log(rowChoices);
    setData(rowChoices as Data);
  }, [rows]);

  let handleSubmit = useCallback(
    (submission: string[]) => onSubmit(submission),
    [onSubmit],
  );

  useEffect(() => {
    handleSetData();
  }, [handleSetData]);

  return (
    <>
      <SectionBar
        actions={[
          { label: 'Submit', onClick: () => handleSubmit(selectedChoices) },
          { label: 'Cancel', onClick: () => onCancel() },
        ]}
        fixedActions
      />
      <InfoTable
        key={selectedChoices.toString()}
        columns={columnHeaders}
        data={data}
      />
    </>
  );
};
