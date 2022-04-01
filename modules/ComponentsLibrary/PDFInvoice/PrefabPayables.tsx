import React, { FC } from 'react';
import { EventType, usd } from '../../../helpers';

interface Props {
  event: EventType;
}

export const PrefabPayables: FC<Props> = ({ event }) => {
  return (
    <table className="invoiceSection border">
      <tbody>
        <tr>
          <td colSpan={3}>
            <div className="align-center strong padding-top">
              Services Rendered
            </div>
            <div className="serviceTerms">{event.notes}</div>
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="servicePerformed">
            {event.servicesperformedrow1}
          </td>
          <td className="totalAmount">
            {+event.totalamountrow1 ? usd(+event.totalamountrow1) : ''}
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="servicePerformed">
            {event.servicesperformedrow2}
          </td>
          <td className="totalAmount">
            {+event.totalamountrow2 ? usd(+event.totalamountrow2) : ''}
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="servicePerformed">
            {event.servicesperformedrow3}
          </td>
          <td className="totalAmount">
            {+event.totalamountrow3 ? usd(+event.totalamountrow3) : ''}
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="servicePerformed">
            {event.servicesperformedrow4}
          </td>
          <td className="totalAmount">
            {+event.totalamountrow4 ? usd(+event.totalamountrow4) : ''}
          </td>
        </tr>
        {/* .has(prefabQuoteUsed(arguments.invoiceData.callId,'list'));
        if(isnumeric(arguments.invoiceData.discount) and arguments.invoiceData.discount gt 0){
            local.toPass = local.toPass.tr()
                .td(class="servicePerformed",colspan=2).has("less discount").end()
                .td(class="totalAmount").has("-").has(arguments.invoiceData.discount).end()
            .end();
        } */}
        <tr>
          <td colSpan={2} className="servicePerformed padding-top">
            Tax due
          </td>
          <td className="totalAmount padding-top">{usd(0)}</td>
        </tr>
        {/* .tr()
            .td(colspan=2,class="servicePerformed padding-top").has("Payment by ").b(invoiceData.paymentType).has(" is ").b(invoiceData.paymentStatus).has(" for the total of ").end()
            .td(class="totalAmount padding-top").b(invoiceData.totalAmountTotal).end()
        .end()
        .tr().td().has(prefabPayments(arguments.invoiceData.callId)).end().end() */}
      </tbody>
    </table>
  );
};
