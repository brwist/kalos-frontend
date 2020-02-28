import React, { useState, useCallback } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import ReactDOM from 'react-dom';
import customTheme from '../Theme/main';
import Button from './Button/examples';
import ConfirmDelete from './ConfirmDelete/examples';
import Field from './Field/examples';
import Form from './Form/examples';
import InfoTable from './InfoTable/examples';
import Link from './Link/examples';
import Modal from './Modal/examples';
import SectionBar from './SectionBar/examples';

const DEFAULT_COMPONENT_IDX = 0;

const COMPONENTS = {
  Button,
  ConfirmDelete,
  Field,
  Form,
  InfoTable,
  Link,
  Modal,
  SectionBar,
};

const ComponentsLibrary = () => {
  const [component, setComponent] = useState<keyof typeof COMPONENTS>(
    Object.keys(COMPONENTS)[DEFAULT_COMPONENT_IDX] as keyof typeof COMPONENTS
  );
  const Component = COMPONENTS[component];
  const handleClickMenuItem = useCallback(v => () => setComponent(v), []);

  return (
    <ThemeProvider theme={customTheme.lightTheme}>
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
    </ThemeProvider>
  );
};

ReactDOM.render(<ComponentsLibrary />, document.getElementById('root'));
