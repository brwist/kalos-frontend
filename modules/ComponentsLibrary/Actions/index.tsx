import React, { FC } from 'react';
import { Button, Props as ButtonProps } from '../Button';

interface Props {
  actions: ButtonProps[];
}

export const Actions: FC<Props> = ({ actions }) => (
  <>
    {actions.length > 0 && (
      <div>
        {actions.map((props, idx) => (
          <Button key={idx} {...props} />
        ))}
      </div>
    )}
  </>
);
