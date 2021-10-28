import { Event } from '@kalos-core/kalos-rpc/Event';
import React, { FC } from 'react';
import { formatDate } from '../../../helpers';
import './styles.scss';

interface Props {
  event: Event;
}

export const PrefabPropertyInfo: FC<Props> = ({ event }) => {
  const property = event.getProperty();
  const customer = event.getCustomer();
  return (
    <table className="invoiceSection border">
      <tbody>
        <tr>
          {property && (
            <td
              className="headerDiv propertyInfo"
              style={{ textAlign: 'center' }}
            >
              <div className="propertyInfo">Site Address</div>
              <div>
                {property.getBusinessname()} {property.getFirstname()}{' '}
                {property.getLastname()}
              </div>
              <div>{property.getAddress()}</div>
              <div>
                {property.getCity()} {property.getZip()}
              </div>
              <div>{property.getPhone()}</div>
            </td>
          )}
          <td
            className="headerDiv propertyInfo"
            style={{ textAlign: 'center' }}
          >
            <div className="propertyInfo">Site Address</div>
            {customer && (
              <>
                <div>
                  {customer.getBusinessname()} {customer.getFirstname()}{' '}
                  {customer.getLastname()}
                </div>
                <div>{customer.getAddress()}</div>
                <div>
                  {customer.getCity()} {customer.getZip()}
                </div>
                <div>{customer.getPhone()}</div>
              </>
            )}
          </td>
          <td className="headerDiv propertyInfo" style={{ textAlign: 'right' }}>
            <div className="propertyInfo" style={{ textAlign: 'right' }}>
              Invoice
            </div>
            <div style={{ paddingLeft: 30, paddingRight: 30 }}>
              <b style={{ float: 'left' }}>Date:</b>{' '}
              {formatDate(event.getLogBillingDate())}
            </div>
            <div style={{ paddingLeft: 30, paddingRight: 30 }}>
              <b style={{ float: 'left' }}>Job #:</b> {event.getLogJobNumber()}
            </div>
            <div style={{ paddingLeft: 30, paddingRight: 30 }}>
              {event.getLogPo()}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
