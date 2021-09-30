/* 

  Design Specification: Property Pane at https://app.kalosflorida.com/index.cfm?action=admin:contracts.contractnew&contract_id=3365

*/

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { reducer, ACTIONS } from './reducer';

// add any prop types here
interface props {
  contractId: number;
}

export const PropertyTable: FC<props> = ({ contractId }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
  });

  const load = useCallback(() => {
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, []);

  const cleanup = useCallback(() => {}, []);

  useEffect(() => {
    load();

    return () => {
      cleanup();
    };
  }, [load, cleanup]);

  return (
    <>
      <h1>PropertyTable works!</h1>
      <h2>Checklist</h2>
      <ul>
        <li>
          Please add more tests for your component as you write your
          functionality (preferably to a spec or design document of some kind)
        </li>
        <li>
          Please ensure your component can properly display errors (for a good
          example, look at errors in <code>InfoTable</code>)
        </li>
        <li>
          Please link your design doc / spec at the top of this file inside the
          comments (and in the test file as well in the same place)
        </li>
      </ul>
      <h2>About this boilerplate</h2>
      <ul>
        <li>
          Frontend unit tests were created for this module automatically in{' '}
          <code>/test/modules/ComponentsLibrary/PropertyTable</code>
        </li>
        <li>
          You can see the templates for <code>yarn make</code> inside{' '}
          <code>/templates</code>
        </li>
      </ul>
      <h2>
        Some resources to get you started with unit testing in Mocha with
        Enzyme:{' '}
      </h2>
      <ul>
        <li>
          <a href="https://www.robinwieruch.de/react-testing-mocha-chai-enzyme-sinon">
            This article
          </a>{' '}
          is extremely long, but it <strong>MOSTLY</strong> shows you how to do
          what we aim to do
        </li>
        <li>
          There is a readme in <code>/test</code> that goes into how to get
          started from a technical standpoint in our current setup
        </li>
        <li>
          <code>/modules/ComponentsLibrary/Test</code> is the component that was
          unit-tested on call during our meeting, and{' '}
          <code>/test/modules/ComponentsLibrary/Test</code> is where its
          corresponding tests are located
        </li>
      </ul>
    </>
  );
};
