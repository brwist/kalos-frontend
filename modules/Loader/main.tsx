import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function Loader() {
  const style: React.CSSProperties = {
    backgroundColor: 'grey',
    position: 'absolute',
    opacity: 0.2,
    zIndex: 100,
    height: window.innerHeight,
    width: window.innerWidth,
    top: window.scrollY,
  };

  React.useEffect(() => {
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
          zIndex: 300,
          position: 'absolute',
          top: window.innerHeight * 0.5 + window.scrollY,
          left: '50%',
          marginLeft: -10,
          marginTop: -10,
        }}
      />
    </>
  );
}

export { Loader };
