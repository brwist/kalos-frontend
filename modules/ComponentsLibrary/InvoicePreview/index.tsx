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
import ReactHtmlParser from 'react-html-parser';
import {
  InvoiceBodyRequest,
  SQSEmail,
  SQSEmailAndDocument,
} from '@kalos-core/kalos-rpc/compiled-protos/email_pb';

// add any prop types here
interface props {
  loggedUserId: number;
  propertyId: number;
  invoiceId: number;
  onLoaded?: (invoiceHTML: string | undefined) => any;
}

export const InvoicePreview: FC<props> = ({
  loggedUserId,
  propertyId,
  invoiceId,
  onLoaded,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    error: undefined,
    invoiceHTML: undefined,
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
      let req = new InvoiceBodyRequest();
      req.setPropertyId(propertyId);
      req.setInvoiceId(invoiceId);
      console.log(`Property id: ${propertyId}, invoice id: ${invoiceId}`);
      const res = await EmailClientService.GetInvoiceBody(req);
      console.log('Got res: ', res);
      dispatch({ type: ACTIONS.SET_INVOICE_HTML, data: res.getValue() });
      return res;
    } catch (err) {
      console.error(`An error occurred while getting an invoice body:`);
      console.error(err);
      handleError(err as string);
    }
  }, [handleError, invoiceId, propertyId]);

  // ? This function is for reference on how to send invoices via email
  const sendInvoice = useCallback(async () => {
    if (!state.invoiceHTML) {
      console.error(`No invoice HTML set, returning. `);
      return;
    }
    try {
      let document = new Document();
      document.setPropertyId(propertyId);
      document.setInvoiceId(invoiceId);
      let sqsEmail = new SQSEmail();
      // Email to send the message to
      sqsEmail.setTo('justin.farrell@kalosflorida.com');
      sqsEmail.setSubject('Doc test');
      let req = new SQSEmailAndDocument();
      req.setEmail(sqsEmail);
      req.setDocument(document);
      const res = await EmailClientService.SendSQSInvoiceEmail(req);
      console.log('res: ', res);
    } catch (err) {
      console.error(`An error occurred while sending out an invoice: ${err}`);
      handleError(err as string);
    }
  }, [handleError, invoiceId, propertyId, state.invoiceHTML]);

  const load = useCallback(async () => {
    await getInvoiceBody();
    if (onLoaded) onLoaded(state.invoiceHTML);
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, [getInvoiceBody, onLoaded, state.invoiceHTML]);

  useEffect(() => {
    if (!state.isLoaded) load();

    return () => {
      cleanup();
    };
  }, [load, cleanup, state.isLoaded]);

  return (
    <>
      <Typography variant="h5">Invoice Preview</Typography>
      {state.error && (
        <>
          <Typography variant="h6">
            An error occurred while getting the invoice body:{' '}
          </Typography>
          <h4 style={{ color: 'red' }}>
            {state.error !== undefined ? state.error : ''}
          </h4>
        </>
      )}
      {!state.error && state.invoiceHTML && (
        <> {ReactHtmlParser(state.invoiceHTML)} </>
      )}
    </>
  );
};
