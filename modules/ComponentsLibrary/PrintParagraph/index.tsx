import React, { FC } from 'react';
import clsx from 'clsx';
import './styles.css';

type Tag = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

type Style = {
  tag?: Tag;
};

interface Props extends Style {
  align?: 'left' | 'center' | 'right';
}

export const PrintParagraph: FC<Props> = ({
  tag = 'div',
  align = 'left',
  children,
}) => {
  return (
    <div
      style={{
        textAlign: align,
      }}
      className={clsx('PrintParagraph', tag)}
    >
      {children}
    </div>
  );
};
