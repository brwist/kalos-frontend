/* 

  Description: Provides a preview for invoices before they go out via email.

  Design Specification / Document: None Specified
  
*/

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { reducer, ACTIONS } from './reducer';
import { Devlog } from '@kalos-core/kalos-rpc/Devlog';
import { DevlogClientService, EmailClientService } from '../../../helpers';
import { format } from 'date-fns';
import Typography from '@material-ui/core/Typography';
import { Document } from '@kalos-core/kalos-rpc/Document';

// add any prop types here
interface props {
  loggedUserId: number;
  propertyId: number;
  invoiceId: number;
}

export const InvoicePreview: FC<props> = ({
  loggedUserId,
  propertyId,
  invoiceId,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    error: undefined,
  });

  const cleanup = useCallback(() => {
    // TODO clean up your function calls here (called once the component is unmounted, prevents "Can't perform a React state update on an unmounted component" errors)
    // This is important for long-term performance of our components
  }, []);

  const handleError = useCallback(
    async (errorToSet: string) => {
      // This will send out an error devlog automatically when called
      // The idea is that this will be used for any errors which we should be able to look up for debugging

      try {
        let errorLog = new Devlog();
        errorLog.setUserId(loggedUserId);
        errorLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        errorLog.setIsError(1);
        errorLog.setDescription(
          `An error occurred in InvoicePreview: ${errorToSet}`,
        );
        await DevlogClientService.Create(errorLog);
        dispatch({ type: ACTIONS.SET_ERROR, data: errorToSet });
      } catch (err) {
        console.error(`An error occurred while saving a devlog: ${err}`);
      }
    },
    [loggedUserId],
  );

  const getInvoiceBody = useCallback(async () => {
    if (!propertyId) {
      console.error(
        'No property id was provided for getInvoiceBody. Please supply propertyId as a prop to InvoicePreview. If you see this, report it in #webtech.',
      );
      dispatch({
        type: ACTIONS.SET_ERROR,
        data: 'No property id was provided for getInvoiceBody. Please supply propertyId as a prop to InvoicePreview. If you see this, report it in #webtech.',
      });
      return;
    }
    if (!invoiceId) {
      console.error(
        'No invoice id was provided for getInvoiceBody. Please supply invoiceId as a prop to InvoicePreview. If you see this, report it in #webtech.',
      );
      dispatch({
        type: ACTIONS.SET_ERROR,
        data: 'No invoice id was provided for getInvoiceBody. Please supply invoiceId as a prop to InvoicePreview. If you see this, report it in #webtech.',
      });
      return;
    }
    try {
      let req = new Document();
      req.setPropertyId(propertyId);
      req.setInvoiceId(invoiceId);
      const res = await EmailClientService.GetInvoiceBody(req);
      console.log('Got res: ', res);
      return res;
    } catch (err) {
      console.error(`An error occurred while getting an invoice body:`);
      console.error(err);
      handleError(err as string);
    }
  }, [handleError, invoiceId, propertyId]);

  const load = useCallback(async () => {
    await getInvoiceBody();
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, [getInvoiceBody]);

  useEffect(() => {
    if (!state.isLoaded) load();

    return () => {
      cleanup();
    };
  }, [load, cleanup, state.isLoaded]);

  return (
    <>
      <Typography variant="h1">Invoice Preview</Typography>
      {state.error && (
        <>
          <Typography variant="h2">
            An error occurred while getting the invoice body:{' '}
          </Typography>
          <Typography variant="h4">{state.error}</Typography>
        </>
      )}
    </>
  );
};
