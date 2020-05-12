import React, { FC, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { Modal } from '../../ComponentsLibrary/Modal';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Link } from '../../ComponentsLibrary/Link';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { CustomerDetails } from '../../CustomerDetails/components/CustomerDetails';
import {
  getCFAppUrl,
  UserType,
  getCustomerNameAndBusinessName,
  getPropertyAddress,
} from '../../../helpers';

export interface Props {
  loggedUserId: number;
  customer: UserType;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexShrink: 0,
  },
  content: {
    flexGrow: 1,
    overflowY: 'auto',
    height: 'calc(100vh - 54px)',
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100vh - 46px)',
    },
  },
}));

export const CustomerItem: FC<Props> = ({ customer, loggedUserId }) => {
  const classes = useStyles();
  const { id, propertiesList } = customer;
  const [customerOpened, setCustomerOpened] = useState<UserType>();
  const handleCustomerClick = useCallback(
    (customer: UserType) => (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
      event.preventDefault();
      setCustomerOpened(customer);
    },
    [setCustomerOpened],
  );
  const handleCustomerClose = useCallback(() => setCustomerOpened(undefined), [
    setCustomerOpened,
  ]);
  return (
    <div>
      <InfoTable
        columns={[
          {
            name: (
              <Link onClick={handleCustomerClick(customer)}>
                <strong>{getCustomerNameAndBusinessName(customer)}</strong>
              </Link>
            ),
          },
        ]}
        data={propertiesList.map(property => [
          {
            value: (
              <Link
                href={[
                  getCFAppUrl('admin:service.addserviceCall'),
                  `user_id=${id}`,
                  `property_id=${property.id}`,
                ].join('&')}
              >
                {getPropertyAddress(property)}
              </Link>
            ),
          },
        ])}
      />
      {customerOpened && (
        <Modal open onClose={handleCustomerClose} fullScreen>
          <div className={classes.wrapper}>
            <div className={classes.header}>
              <SectionBar
                title="Customer Details"
                actions={[{ label: 'Close', onClick: handleCustomerClose }]}
                fixedActions
              />
            </div>
            <div className={classes.content}>
              <CustomerDetails
                userID={customerOpened.id}
                loggedUserId={loggedUserId}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
