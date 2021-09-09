import React, { FC, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

interface Props {
  zIndex?: number;
  backgroundColor?: string;
  opacity?: number;
  height?: number | string;
  width?: number | string;
}

const Loader: FC<Props> = ({ zIndex = 100, backgroundColor= 'grey', opacity = 0.2, height = window.innerHeight, width = window.innerWidth}) => {
  const style: React.CSSProperties = {
    backgroundColor,
    position: 'absolute',
    opacity,
    zIndex,
    height,
    width,
    top: window.scrollY,
  };
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return function cleanup() {
      if (oldOverflow === 'hidden' || oldOverflow === '') {
        document.body.style.overflow = 'visible';
      } else {
        document.body.style.overflow = oldOverflow;
      }
    };
  });
  return (
    <>
      <div style={style} />
      <CircularProgress
        style={{
          zIndex: zIndex + 300,
          position: 'absolute',
          top: window.innerHeight * 0.5 + window.scrollY,
          left: '50%',
          marginLeft: -10,
          marginTop: -10,
        }}
      />
    </>
  );
};

export { Loader };
