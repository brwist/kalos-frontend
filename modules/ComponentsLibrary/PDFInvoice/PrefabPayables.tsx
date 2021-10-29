import { Event } from '@kalos-core/kalos-rpc/Event';
import { Invoice } from '@kalos-core/kalos-rpc/Invoice';
import React, { FC } from 'react';
import { usd } from '../../../helpers';
import './styles.scss';

interface Props {
  invoice: Invoice;
}

export const PrefabPayables: FC<Props> = ({ invoice }) => {
  return (
    <table className="invoiceSection border">
      <tbody>
        <tr>
          <td colSpan={3}>
            <div className="align-center strong padding-top">
              Services Rendered
            </div>
            <div className="serviceTerms">{invoice.getNotes()}</div>
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="servicePerformed">
            {invoice.getServicesperformedrow1()}
          </td>
          <td className="totalAmount">
            {+invoice.getTotalamountrow1()
              ? usd(+invoice.getTotalamountrow1())
              : ''}
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="servicePerformed">
            {invoice.getServicesperformedrow2()}
          </td>
          <td className="totalAmount">
            {+invoice.getTotalamountrow2()
              ? usd(+invoice.getTotalamountrow2())
              : ''}
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="servicePerformed">
            {invoice.getServicesperformedrow3()}
          </td>
          <td className="totalAmount">
            {+invoice.getTotalamountrow3()
              ? usd(+invoice.getTotalamountrow3())
              : ''}
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="servicePerformed">
            {invoice.getServicesperformedrow4()}
          </td>
          <td className="totalAmount">
            {+invoice.getTotalamountrow4()
              ? usd(+invoice.getTotalamountrow4())
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
        <tr>
          <td colSpan={7} className="servicePerformed padding-top">
            <td>Payment by </td>
            <td className="strong">{invoice.getLogPaymentType()}</td>
            <td>is </td>
            <td className="strong">{invoice.getLogPaymentStatus()}</td>
            <td>for the total of</td>
          </td>
          <td className="totalAmount">
            {+invoice.getTotalamounttotal()
              ? usd(+invoice.getTotalamounttotal())
              : ''}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
