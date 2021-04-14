import React, { FC, useState } from 'react';
import { ExtendedProjectTaskType } from '../EditProject';

interface Props {}

export const CheckInProjectTask: FC<Props> = ({}) => {
  const [checkedInTask, setCheckedInTask] = useState<ExtendedProjectTaskType>();

  return <div>test</div>;
};
