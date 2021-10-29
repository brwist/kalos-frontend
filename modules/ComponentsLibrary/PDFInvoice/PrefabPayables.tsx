import { Event } from '@kalos-core/kalos-rpc/Event';
import React, { FC } from 'react';
import { usd } from '../../../helpers';
import './styles.scss';

interface Props {
  event: Event;
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
            <div className="serviceTerms">{event.getNotes()}</div>
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="servicePerformed">
            {event.getServicesperformedrow1()}
          </td>
          <td className="totalAmount">
            {+event.getTotalamountrow1()
              ? usd(+event.getTotalamountrow1())
              : ''}
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="servicePerformed">
            {event.getServicesperformedrow2()}
          </td>
          <td className="totalAmount">
            {+event.getTotalamountrow2()
              ? usd(+event.getTotalamountrow2())
              : ''}
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="servicePerformed">
            {event.getServicesperformedrow3()}
          </td>
          <td className="totalAmount">
            {+event.getTotalamountrow3()
              ? usd(+event.getTotalamountrow3())
              : ''}
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="servicePerformed">
            {event.getServicesperformedrow4()}
          </td>
          <td className="totalAmount">
            {+event.getTotalamountrow4()
              ? usd(+event.getTotalamountrow4())
              : ''}
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
