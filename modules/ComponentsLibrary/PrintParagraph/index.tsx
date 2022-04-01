import React, { FC, CSSProperties } from 'react';
import "./PrintParagraph.module.css";

import clsx from 'clsx';

type Tag = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

type Style = {
  tag?: Tag;
};

interface Props extends Style {
  align?: 'left' | 'center' | 'right';
  style?: CSSProperties;
}

export const PrintParagraph: FC<Props> = ({
  tag = 'div',
  align = 'left',
  children,
  style = {},
}) => {
  return (
    <div
      style={{
        textAlign: align,
        ...style,
      }}
      className={clsx('PrintParagraph', tag)}
    >
      {children}
    </div>
  );
};
