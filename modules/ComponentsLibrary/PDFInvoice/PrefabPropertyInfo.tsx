import React, { FC } from 'react';
import { EventType, formatDate } from '../../../helpers';

interface Props {
  event: EventType;
}

export const PrefabPropertyInfo: FC<Props> = ({ event }) => {
  const property = event.property!;
  const customer = event.customer!;
  return (
    <table className="invoiceSection border">
      <tbody>
        <tr>
          <td
            className="headerDiv propertyInfo"
            style={{ textAlign: 'center' }}
          >
            <div className="propertyInfo">Site Address</div>
            <div>
              {property.businessname} {property.firstname} {property.lastname}
            </div>
            <div>{property.address}</div>
            <div>
              {property.city} {property.zip}
            </div>
            <div>{property.phone}</div>
          </td>
          <td
            className="headerDiv propertyInfo"
            style={{ textAlign: 'center' }}
          >
            <div className="propertyInfo">Site Address</div>
            <div>
              {customer.businessname} {customer.firstname} {customer.lastname}
            </div>
            <div>{customer.address}</div>
            <div>
              {customer.city} {customer.zip}
            </div>
            <div>{customer.phone}</div>
          </td>
          <td className="headerDiv propertyInfo" style={{ textAlign: 'right' }}>
            <div className="propertyInfo" style={{ textAlign: 'right' }}>
              Invoice
            </div>
            <div style={{ paddingLeft: 30, paddingRight: 30 }}>
              <b style={{ float: 'left' }}>Date:</b>{' '}
              {formatDate(event.logBillingDate)}
            </div>
            <div style={{ paddingLeft: 30, paddingRight: 30 }}>
              <b style={{ float: 'left' }}>Job #:</b> {event.logJobNumber}
            </div>
            <div style={{ paddingLeft: 30, paddingRight: 30 }}>
              {event.logPo}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
