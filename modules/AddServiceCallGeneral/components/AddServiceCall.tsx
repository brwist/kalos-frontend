import React, { FC, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import {
  loadUsersByFilter,
  UserType,
  makeFakeRows,
  PropertyType,
} from '../../../helpers';
import { Modal } from '../../ComponentsLibrary/Modal';
import { CustomerEdit } from '../../ComponentsLibrary/CustomerEdit';
import { PropertyEdit } from '../../ComponentsLibrary/PropertyEdit';
import { ServiceCall } from '../../ComponentsLibrary/ServiceCall';
import { CustomerDetails } from '../../CustomerDetails/components/CustomerDetails';
import { SearchForm, FormType, getFormInit } from './SearchForm';
import { CustomerItem, Props as CustomerItemProps } from './CustomerItem';
import { ROWS_PER_PAGE } from '../../../constants';

export type Props = Pick<CustomerItemProps, 'loggedUserId'>;

export const useStyles = makeStyles(theme => ({
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

export const AddServiceCall: FC<Props> = props => {
  const classes = useStyles();
  const { loggedUserId } = props;
  const [addCustomer, setAddCustomer] = useState<boolean>(false);
  const [customerOpened, setCustomerOpened] = useState<UserType>();
  const [propertyOpened, setPropertyOpened] = useState<UserType>();
  const [serviceCallOpened, setServiceCallOpened] = useState<PropertyType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [search, setSearch] = useState<FormType>(getFormInit);
  const [entries, setEntries] = useState<UserType[]>([]);
  const load = useCallback(
    async (page: number, search: FormType) => {
      setLoading(true);
      const { results, totalCount } = await loadUsersByFilter({
        page,
        ...search,
        withProperties: true,
      });
      setEntries(results);
      setCount(totalCount);
      setLoading(false);
    },
    [setEntries, setCount, setLoading],
  );
  const handleReset = useCallback(() => {
    setEntries([]);
  }, [setEntries]);
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      load(page, search);
    },
    [setPage, load, search],
  );
  const handleSearch = useCallback(
    (search: FormType) => {
      setSearch(search);
      load(page, search);
    },
    [load, setSearch, page],
  );
  const handleToggleAddCustomer = useCallback(
    (addCustomer: boolean) => () => setAddCustomer(addCustomer),
    [setAddCustomer],
  );
  const handlePropertyClose = useCallback(() => setPropertyOpened(undefined), [
    setPropertyOpened,
  ]);
  const handleServiceCallClose = useCallback(
    () => setServiceCallOpened(undefined),
    [setServiceCallOpened],
  );
  const handleSetCustomerOpened = useCallback(
    (customerOpened?: UserType) => setCustomerOpened(customerOpened),
    [setCustomerOpened],
  );
  const handleCustomerClose = useCallback(() => setCustomerOpened(undefined), [
    setCustomerOpened,
  ]);
  const handleCustomerSave = useCallback(
    (data: UserType) => {
      setAddCustomer(false);
      setCustomerOpened(data);
      setPropertyOpened(data);
    },
    [setCustomerOpened, setAddCustomer],
  );
  const handlePropertySave = useCallback(
    (data: PropertyType) => {
      setPropertyOpened(undefined);
      setCustomerOpened(undefined);
      setServiceCallOpened(data);
    },
    [setPropertyOpened],
  );
  return (
    <div>
      <SectionBar
        title="New Service Call"
        pagination={{
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handlePageChange,
          page,
        }}
      />
      <SearchForm
        onSearch={handleSearch}
        onReset={handleReset}
        onAddCustomer={handleToggleAddCustomer(true)}
      />
      {loading ? (
        <InfoTable data={makeFakeRows()} loading />
      ) : (
        entries.map(entry => (
          <CustomerItem
            key={entry.id}
            customer={entry}
            {...props}
            onAddServiceCall={setServiceCallOpened}
            onCustomerClick={handleSetCustomerOpened}
          />
        ))
      )}
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
      {propertyOpened && (
        <Modal open onClose={handlePropertyClose}>
          <PropertyEdit
            userId={propertyOpened.id}
            onClose={handlePropertyClose}
            onSave={handlePropertySave}
          />
        </Modal>
      )}
      {serviceCallOpened && (
        <Modal open onClose={handleServiceCallClose} fullScreen>
          <div className={classes.wrapper}>
            <div className={classes.header}>
              <SectionBar
                title="New Service Call"
                actions={[{ label: 'Close', onClick: handleServiceCallClose }]}
                fixedActions
              />
            </div>
            <div className={classes.content}>
              <ServiceCall
                propertyId={serviceCallOpened.id}
                userID={serviceCallOpened.userId}
                loggedUserId={loggedUserId}
              />
            </div>
          </div>
        </Modal>
      )}
      {addCustomer && (
        <Modal open onClose={handleToggleAddCustomer(false)}>
          <CustomerEdit
            onClose={handleToggleAddCustomer(false)}
            onSave={handleCustomerSave}
          />
        </Modal>
      )}
    </div>
  );
};
