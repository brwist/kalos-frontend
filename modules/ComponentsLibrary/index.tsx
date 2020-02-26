import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Button from './Button/examples';
import Field from './Field/examples';
import Form from './Form/examples';
import InfoTable from './InfoTable/examples';
import Modal from './Modal/examples';
import SectionBar from './SectionBar/examples';

const COMPONENTS = { Button, Field, Form, InfoTable, Modal, SectionBar };

const ComponentsLibrary = () => {
  const [component, setComponent] = useState<keyof typeof COMPONENTS>(
    Object.keys(COMPONENTS)[0] as keyof typeof COMPONENTS
  );
  const Component = COMPONENTS[component];
  const handleClickMenuItem = useCallback(v => () => setComponent(v), []);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          width: 150,
          padding: 10,
          backgroundColor: '#eee',
        }}
      >
        <h1
          style={{
            fontSize: 20,
            margin: 0,
            marginBottom: 10,
            fontFamily: 'arial',
            color: '#888',
            borderBottom: '1px solid #ccc',
            paddingBottom: 10,
          }}
        >
          Components Library
        </h1>
        {Object.keys(COMPONENTS).map(key => (
          <div
            key={key}
            style={{
              marginTop: 15,
              fontFamily: 'arial',
              fontWeight: key === component ? 900 : 400,
              cursor: 'pointer',
            }}
            onClick={handleClickMenuItem(key)}
          >
            {key}
          </div>
        ))}
      </div>
      <div style={{ padding: 10, flexGrow: 1 }}>
        <Component />
      </div>
    </div>
  );
};

ReactDOM.render(<ComponentsLibrary />, document.getElementById('root'));
