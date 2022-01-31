import React, { FC, useEffect, useState, useCallback } from 'react';
import { InfoTable } from '../../InfoTable';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { Payment } from '@kalos-core/kalos-rpc/Payment';
import parseISO from 'date-fns/esm/parseISO';
import format from 'date-fns/esm/format';
import { NULL_TIME } from '../../../../constants';

export interface Props {
  event: Event;
  paidServices: Payment[];
  mobileView: boolean;
}

export const InvoiceDetails: FC<Props> = props => {
  const {
    event,
    paidServices,
    mobileView,
  } = props;

  useEffect(()=>{

  }, [mobileView])

  if (mobileView) {
    return (
      <InfoTable  data={
        [
          [
            {
              label: "Service (1)",
              value: event.getServicesperformedrow1().length <= 50 ? event.getServicesperformedrow1() : event.getServicesperformedrow1().substring(0, 50).concat("..."),
            },
            {
              label: "Total Amount (1)",
              value: `$${Number(event.getTotalamountrow1())}`
            },
            
          ],
          [
            {
              label: "Service (2)",
              value: event.getServicesperformedrow2().length <= 50 ? event.getServicesperformedrow2() : event.getServicesperformedrow2().substring(0,50).concat("..."),
            },
            {
              label: "Total Amount (2)",
              value: `$${Number(event.getTotalamountrow2())}`
            },
            
          ],
          [
            {
              label: "Service (3)",
              value: event.getServicesperformedrow3().length <= 50 ? event.getServicesperformedrow3() : event.getServicesperformedrow3().substring(0,50).concat("..."),
            },
            {
              label: "Total Amount (3)",
              value: `$${Number(event.getTotalamountrow3())}`
            },
            
          ],
          [
            {
              label: "Service (4)",
              value: event.getServicesperformedrow4().length <= 50 ? event.getServicesperformedrow4() : event.getServicesperformedrow4().substring(0,50).concat("..."),
            },
            {
              label: "Total Amount (4)",
              value: `$${Number(event.getTotalamountrow4())}`
            },
            
          ],
          [
            {
              label: "Materials",
              value: event.getMaterialUsed().length <= 50 ? event.getMaterialUsed() : event.getMaterialUsed().substring(0, 50).concat("..."),
            },
            {
              label: "Material Total",
              value: `$${event.getMaterialTotal()}`
            },
            {
              label: "Use Property-level Billing?",
              value: event.getPropertyBilling() === 1 ? "Yes" : "No",
            },
          ],
          [
            {
              label: "Grand Total",
              value: `$${Number(event.getTotalamountrow1()) + 
                Number(event.getTotalamountrow2()) + 
                Number(event.getTotalamountrow3()) + 
                Number(event.getTotalamountrow4()) + 
                Number(event.getMaterialTotal())}`
            },
            {
              label: "Discount",
              value: `${Number(event.getDiscount())}%`
            },
            {
              label: "Payments",
              value: `$${paidServices.reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue.getAmountCollected(),
                0,
              )}`
            },
            {
              label: "Remaining Due",
              value: `$${(1 - Number(event.getDiscount()) / 100) * 
                (Number(event.getTotalamountrow1()) + 
                Number(event.getTotalamountrow2()) + 
                Number(event.getTotalamountrow3()) + 
                Number(event.getTotalamountrow4()) + 
                Number(event.getMaterialTotal())) -
                Number(paidServices.reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue.getAmountCollected(),
                  0,
                ))}`
            },
          ],
          [
            {
              label: "Billing Date",
              value: event.getLogBillingDate() !== NULL_TIME ? format(parseISO(event.getLogBillingDate()), 'MM/dd/yyyy') : format(new Date(), 'MM/dd/yyyy'),
            },
            {
              label: "Payment Type",
              value: event.getLogPaymentType()
            },
            {
              label: "PO",
              value: event.getLogPo()
            },
          ],
          [
            {
              label: "Invoice Notes",
              value: event.getNotes().length <= 150 ? event.getNotes() : event.getNotes().substring(0, 150).concat("..."),
            },
          ],
        ]
      }
      />
    )
  } else {
    return (
      <InfoTable  data={
        [
          [
            {
              label: "Service (1)",
              value: event.getServicesperformedrow1().length <= 50 ? event.getServicesperformedrow1() : event.getServicesperformedrow1().substring(0, 50).concat("..."),
            },
            {
              label: "Total Amount (1)",
              value: `$${Number(event.getTotalamountrow1())}`
            },
            {
              label: "Materials",
              value: event.getMaterialUsed().length <= 50 ? event.getMaterialUsed() : event.getMaterialUsed().substring(0, 50).concat("..."),
            },
          ],
          [
            {
              label: "Service (2)",
              value: event.getServicesperformedrow2().length <= 50 ? event.getServicesperformedrow2() : event.getServicesperformedrow2().substring(0,50).concat("..."),
            },
            {
              label: "Total Amount (2)",
              value: `$${Number(event.getTotalamountrow2())}`
            },
            {
              label: "Material Total",
              value: `$${event.getMaterialTotal()}`
            },
          ],
          [
            {
              label: "Service (3)",
              value: event.getServicesperformedrow3().length <= 50 ? event.getServicesperformedrow3() : event.getServicesperformedrow3().substring(0,50).concat("..."),
            },
            {
              label: "Total Amount (3)",
              value: `$${Number(event.getTotalamountrow3())}`
            },
            {
              label: "Discount",
              value: `${Number(event.getDiscount())}%`
            },
          ],
          [
            {
              label: "Service (4)",
              value: event.getServicesperformedrow4().length <= 50 ? event.getServicesperformedrow4() : event.getServicesperformedrow4().substring(0,50).concat("..."),
            },
            {
              label: "Total Amount (4)",
              value: `$${Number(event.getTotalamountrow4())}`
            },
            {
              label: "Use Property-level Billing?",
              value: event.getPropertyBilling() === 1 ? "Yes" : "No",
            },
          ],
          [
            {
              label: "Grand Total",
              value: `$${Number(event.getTotalamountrow1()) + 
                Number(event.getTotalamountrow2()) + 
                Number(event.getTotalamountrow3()) + 
                Number(event.getTotalamountrow4()) + 
                Number(event.getMaterialTotal())}`
            },
            {
              label: "Payments",
              value: `$${paidServices.reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue.getAmountCollected(),
                0,
              )}`
            },
            {
              label: "Remaining Due",
              value: `$${(1 - Number(event.getDiscount()) / 100) * 
                (Number(event.getTotalamountrow1()) + 
                Number(event.getTotalamountrow2()) + 
                Number(event.getTotalamountrow3()) + 
                Number(event.getTotalamountrow4()) + 
                Number(event.getMaterialTotal())) -
                Number(paidServices.reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue.getAmountCollected(),
                  0,
                ))}`
            },
          ],
          [
            {
              label: "Billing Date",
              value: event.getLogBillingDate() !== NULL_TIME ? format(parseISO(event.getLogBillingDate()), 'MM/dd/yyyy') : format(new Date(), 'MM/dd/yyyy'),
            },
            {
              label: "Payment Type",
              value: event.getLogPaymentType()
            },
            {
              label: "PO",
              value: event.getLogPo()
            },
          ],
          [
            {
              label: "Invoice Notes",
              value: event.getNotes().length <= 150 ? event.getNotes() : event.getNotes().substring(0, 150).concat("..."),
            },
          ],
        ]
      }
      />
    )
  }
}