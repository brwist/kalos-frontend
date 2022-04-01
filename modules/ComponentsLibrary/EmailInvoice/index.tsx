/* 

  Description: The interface used to send off email-based invoices

  Design Specification / Document: None Specified
  
*/

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { reducer, ACTIONS } from './reducer';
import { Devlog } from '../../../@kalos-core/kalos-rpc/Devlog';
import { DevlogClientService, EmailClientService } from '../../../helpers';
import { format } from 'date-fns';
import { InvoicePreview } from '../InvoicePreview';
import { SectionBar } from '../SectionBar';
import { Confirm } from '../Confirm';
import { Document } from '../../../@kalos-core/kalos-rpc/Document';
import {
  SQSEmail,
  SQSEmailAndDocument,
} from '../../../@kalos-core/kalos-rpc/compiled-protos/email_pb';
import { Loader } from '../../Loader/main';
import { PrintPage } from '../PrintPage';
import ReactHtmlParser from 'react-html-parser';

interface props {
  loggedUserId: number;
  invoiceId: number;
  propertyId: number;
  recipientEmail: string;
  downloadName?: string;
  subject?: string;
}

export const EmailInvoice: FC<props> = ({
  loggedUserId,
  invoiceId,
  propertyId,
  recipientEmail,
  downloadName = 'invoice',
  subject = 'Invoice from Kalos Florida',
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    error: undefined,
    isConfirming: false,
    invoiceHTML: undefined,
  });

  const cleanup = useCallback(() => {}, []);

  const handleError = useCallback(
    async (errorToSet: string) => {
      try {
        let errorLog = new Devlog();
        errorLog.setUserId(loggedUserId);
        errorLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        errorLog.setIsError(1);
        errorLog.setDescription(
          `An error occurred in EmailInvoice: ${errorToSet}`,
        );
        await DevlogClientService.Create(errorLog);
        dispatch({ type: ACTIONS.SET_ERROR, data: errorToSet });
      } catch (err) {
        console.error(`An error occurred while saving a devlog: ${err}`);
      }
    },
    [loggedUserId],
  );

  const sendInvoice = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADED, data: false });
    if (!state.invoiceHTML) {
      console.error(`No invoice HTML set, returning. `);
      return;
    }
    try {
      let document = new Document();
      document.setPropertyId(propertyId);
      document.setInvoiceId(invoiceId);
      let sqsEmail = new SQSEmail();
      sqsEmail.setTo(recipientEmail);
      sqsEmail.setSubject(subject);
      let req = new SQSEmailAndDocument();
      req.setEmail(sqsEmail);
      req.setDocument(document);
      await EmailClientService.SendSQSInvoiceEmail(req);
    } catch (err) {
      console.error(`An error occurred while sending out an invoice: ${err}`);
      handleError(err as string);
    }
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, [
    handleError,
    invoiceId,
    propertyId,
    recipientEmail,
    state.invoiceHTML,
    subject,
  ]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup, state.isLoaded]);

  return (
    <>
      {!state.isLoaded && <Loader />}
      <Confirm
        title="Notice"
        open={state.isConfirming}
        onClose={() =>
          dispatch({ type: ACTIONS.SET_IS_CONFIRMING, data: false })
        }
        onConfirm={() => {
          sendInvoice();
          dispatch({ type: ACTIONS.SET_IS_CONFIRMING, data: false });
        }}
      >
        Are you sure you want to send this email? (Recipient: {recipientEmail})
      </Confirm>
      <SectionBar
        title="Send Invoice Email"
        actions={[
          {
            label: 'Send Email',
            onClick: () =>
              dispatch({ type: ACTIONS.SET_IS_CONFIRMING, data: true }),
            disabled: !state.isLoaded,
          },
        ]}
        asideContent={
          <PrintPage
            key={state.invoiceHTML?.toString()}
            downloadPdfFilename={downloadName}
            onPrint={() => {
              console.log(state.invoiceHTML);
            }}
          >
            {ReactHtmlParser(state.invoiceHTML!)}
          </PrintPage>
        }
      >
        <InvoicePreview
          loggedUserId={loggedUserId}
          invoiceId={invoiceId}
          propertyId={propertyId}
          onLoaded={invoiceHTML => {
            console.log('INVOICE HTML ON LOAD: ', invoiceHTML);
            if (invoiceHTML)
              dispatch({ type: ACTIONS.SET_INVOICE_HTML, data: invoiceHTML });
            dispatch({ type: ACTIONS.SET_LOADED, data: true });
          }}
        />
      </SectionBar>
    </>
  );
};
