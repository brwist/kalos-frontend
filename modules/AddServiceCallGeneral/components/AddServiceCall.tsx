import React, { FC, useState, useCallback, useEffect } from 'react';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import {
  UserType,
  makeFakeRows,
  PropertyType,
  UserClientService,
} from '../../../helpers';
import { Modal } from '../../ComponentsLibrary/Modal';
import { CustomerEdit } from '../../ComponentsLibrary/CustomerEdit';
import { PropertyEdit } from '../../ComponentsLibrary/PropertyEdit';
import { ServiceCall } from '../../ComponentsLibrary/ServiceCall';
import { CustomerDetails } from '../../CustomerDetails/components/CustomerDetails';
import { SearchForm } from './SearchForm';
import { CustomerItem, Props as CustomerItemProps } from './CustomerItem';
import { ROWS_PER_PAGE } from '../../../constants';
import './addServiceCall.less';
import { LoadUsersByFilter, UsersFilter } from '@kalos-core/kalos-rpc/User';
export type Props = Pick<CustomerItemProps, 'loggedUserId'> & {
  onClose?: () => void;
  onSave?: () => void;
  asProject?: boolean;
  projectParentId?: number;
};

export const AddServiceCall: FC<Props> = props => {
  const { loggedUserId, onClose, onSave, asProject = false } = props;
  const [addCustomer, setAddCustomer] = useState<boolean>(false);
  const [customerOpened, setCustomerOpened] = useState<UserType>();
  const [propertyOpened, setPropertyOpened] = useState<UserType>();
  const [serviceCallOpened, setServiceCallOpened] = useState<PropertyType>();
  const [loaded, setLoaded] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [search, setSearch] = useState<UsersFilter>({});
  const [entries, setEntries] = useState<UserType[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const criteria: LoadUsersByFilter = {
      page,
      filter: search,
      sort: {
        orderByField: 'firstname',
        orderBy: 'user_firstname',
        orderDir: 'ASC',
      },
      withProperties: true,
    };
    const { results, totalCount } = await UserClientService.loadUsersByFilter(
      criteria,
    );
    setEntries(results);
    setCount(totalCount);
    setLoading(false);
  }, [setEntries, setCount, setLoading, search, page]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleReset = useCallback(() => {
    setEntries([]);
  }, [setEntries]);
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );
  const handleSearch = useCallback(
    (search: UsersFilter) => {
      setSearch(search);
      setLoaded(false);
    },
    [setSearch, setLoaded],
  );
  const handleToggleAddCustomer = useCallback(
    (addCustomer: boolean) => () => setAddCustomer(addCustomer),
    [setAddCustomer],
  );
  const handlePropertyClose = useCallback(
    () => setPropertyOpened(undefined),
    [setPropertyOpened],
  );
  const handleServiceCallClose = useCallback(
    () => setServiceCallOpened(undefined),
    [setServiceCallOpened],
  );
  const handleSetCustomerOpened = useCallback(
    (customerOpened?: UserType) => setCustomerOpened(customerOpened),
    [setCustomerOpened],
  );
  const handleCustomerClose = useCallback(
    () => setCustomerOpened(undefined),
    [setCustomerOpened],
  );
  const handleCustomerSave = useCallback(
    (data: UserType) => {
      setAddCustomer(false);
      setCustomerOpened(data);
      setPropertyOpened(data);
    },
    [setCustomerOpened, setAddCustomer, setPropertyOpened],
  );
  const handlePropertySave = useCallback(
    (data: PropertyType) => {
      setPropertyOpened(undefined);
      setCustomerOpened(undefined);
      setServiceCallOpened(data);
    },
    [setPropertyOpened, setCustomerOpened, setServiceCallOpened],
  );
  const handleAddProperty = useCallback(
    (customer: UserType) => {
      setCustomerOpened(customer);
      setPropertyOpened(customer);
    },
    [setCustomerOpened, setPropertyOpened],
  );
  const title = asProject ? 'New Project' : 'New Service Call';
  return (
    <div>
      <SectionBar
        title={title}
        pagination={{
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handlePageChange,
          page,
        }}
        actions={onClose ? [{ label: 'Close', onClick: onClose }] : []}
        fixedActions
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
            onAddProperty={handleAddProperty}
          />
        ))
      )}
      {customerOpened && (
        <Modal open onClose={handleCustomerClose} fullScreen>
          <div className="AddServiceCall">
            <div className="AddServiceCallHeader">
              <SectionBar
                title="Customer Details"
                actions={[{ label: 'Close', onClick: handleCustomerClose }]}
                fixedActions
              />
            </div>
            <div className="AddServiceCallContent">
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
          <div className="AddServiceCallWrapper">
            <div className="AddServiceCallHeader">
              <SectionBar
                title={title}
                actions={[{ label: 'Close', onClick: handleServiceCallClose }]}
                fixedActions
              />
            </div>
            <div className="AddServiceCallContent">
              <ServiceCall
                propertyId={serviceCallOpened.id}
                userID={serviceCallOpened.userId}
                loggedUserId={loggedUserId}
                onSave={onSave}
                asProject={asProject}
                onClose={handleServiceCallClose}
                projectParentId={props.projectParentId}
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
