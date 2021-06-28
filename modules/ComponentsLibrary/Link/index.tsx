import React, { FC } from 'react';
import './styles.less';

interface Props {
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  blank?: boolean;
}

export const Link: FC<Props> = ({ href = '', blank = false, ...props }) => (
  <a
    className="Link"
    href={href}
    {...props}
    target={blank ? '_blank' : '_self'}
    rel={'noreferrer'}
  />
);
