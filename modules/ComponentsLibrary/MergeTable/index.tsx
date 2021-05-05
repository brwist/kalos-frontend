// This is a component for comparing differences much like the diff view in VSCode. However, instead of a
// view comparing code to keep / change, it's used to merge elements together by giving the user a choice
// of which table fields to keep and which to get rid of, resulting in a full object.

// For example, a Transaction could be provided that was incomplete - the user would be given multiple choices,
// and these choices will be given back as an array of any type once the user clicked all of the changes to accept.
// There will also be editing control available as a prop, so that the user can edit the fields in the table.

import React, { FC } from 'react';

interface Props {}

export const MergeTable: FC<Props> = ({}) => {
  return <>Test</>;
};
