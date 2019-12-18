import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

function Loader() {
  const style: React.CSSProperties = {
    backgroundColor: 'grey',
    position: 'absolute',
    opacity: 0.1,
    zIndex: 100,
    height: window.innerHeight,
    width: window.innerWidth,
    top: -1 * window.scrollX,
  };

  return (
    <>
      <div style={style} />
      <CircularProgress
        style={{
          zIndex: 300,
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginLeft: -10,
          marginTop: -10,
        }}
      />
    </>
  );
}

export { Loader };
