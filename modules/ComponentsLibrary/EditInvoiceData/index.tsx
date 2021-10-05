/* 

  Design Specification: TODO add spec

*/

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { reducer, ACTIONS } from './reducer';

// add any prop types here
interface props { }

export const EditInvoiceData: FC<props> = () => {
  const [state, dispatch] = useReducer(reducer, { 
    isLoaded: false,
  });

  const load = useCallback(() => {
    // RPCs that are in here should be stubbed in the tests at least 9 times out of 10. 
    // This ensures that the fake data gets "loaded" instantly and the tests can progress quickly and without RPC errors 
    // For some examples, check out /test/modules/Teams or /test/modules/Payroll

    dispatch({type: ACTIONS.SET_LOADED, data: true});
  }, []);

  const cleanup = useCallback(() => {
    // TODO clean up your function calls here (called once the component is unmounted, prevents "Can't perform a React state update on an unmounted component" errors)
    // This is important for long-term performance of our components
  }, []);

  useEffect(() => {
    load();

    return () => {
      cleanup(); 
    };
  }, [load, cleanup]);

  return ( 
    <> 
      <h1>EditInvoiceData works!</h1>
      <h2>Checklist</h2>
      <ul>
        <li>Please add more tests for your component as you write your functionality (preferably to a spec or design document of some kind)</li>
        <li>Please ensure your component can properly display errors (for a good example, look at errors in <code>InfoTable</code>)</li>
        <li>Please link your design doc / spec at the top of this file inside the comments (and in the test file as well in the same place)</li>
      </ul>
      <h2>About this boilerplate</h2>
      <ul>
        <li>Frontend unit tests were created for this module automatically in <code>/test/modules/ComponentsLibrary/EditInvoiceData</code></li>
        <li>You can see the templates for <code>yarn make</code> inside <code>/templates</code></li>
      </ul>
      <h2>Some resources to get you started with unit testing in Mocha with Enzyme: </h2>
      <ul>
        <li><a href="https://www.robinwieruch.de/react-testing-mocha-chai-enzyme-sinon">This article</a> is extremely long, but it <strong>MOSTLY</strong> shows you how to do what we aim to do</li>
        <li>There is a readme in <code>/test</code> that goes into how to get started from a technical standpoint in our current setup</li>
        <li><code>/modules/ComponentsLibrary/Test</code> is the component that was unit-tested on call during our meeting, and <code>/test/modules/ComponentsLibrary/Test</code> is where its corresponding tests are located</li> 
      </ul>
    </>
  );
};