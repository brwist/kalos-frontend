import React, { FC, useState, useCallback, useEffect } from 'react';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { makeFakeRows, UserClientService } from '../../../helpers';
import { Modal } from '../../ComponentsLibrary/Modal';
import { CustomerEdit } from '../../ComponentsLibrary/CustomerEdit';
import { PropertyEdit } from '../../ComponentsLibrary/PropertyEdit';
import { ServiceCall } from '../../ComponentsLibrary/ServiceCall';
import { CustomerDetails } from '../../CustomerDetails/components/CustomerDetails';
import { SearchForm } from './SearchForm';
import { CustomerItem, Props as CustomerItemProps } from './CustomerItem';
import { ROWS_PER_PAGE } from '../../../constants';
import './addServiceCall.less';
import {
  LoadUsersByFilter,
  User,
  UsersFilter,
} from '@kalos-core/kalos-rpc/User';
import { Property } from '@kalos-core/kalos-rpc/Property';
export type Props = Pick<CustomerItemProps, 'loggedUserId'> & {
  onClose?: () => void;
  onSave?: () => void;
  asProject?: boolean;
  projectParentId?: number;
};

// TODO do not release yet, still has issues with the Search capability.

export const AddServiceCall: FC<Props> = props => {
  const { loggedUserId, onClose, onSave, asProject = false } = props;
  const [addCustomer, setAddCustomer] = useState<boolean>(false);
  const [customerOpened, setCustomerOpened] = useState<User>();
  const [propertyOpened, setPropertyOpened] = useState<User>();
  const [serviceCallOpened, setServiceCallOpened] = useState<Property>();
  const [loaded, setLoaded] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [search, setSearch] = useState<UsersFilter>({});
  const [entries, setEntries] = useState<User[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const criteria: LoadUsersByFilter = {
      page,
      filter: search,
      sort: {
        orderByField: 'getFirstname',
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
  }, [page, search]);
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
  const handlePropertyClose = useCallback(() => setPropertyOpened(undefined), [
    setPropertyOpened,
  ]);
  const handleServiceCallClose = useCallback(
    () => setServiceCallOpened(undefined),
    [setServiceCallOpened],
  );
  const handleSetCustomerOpened = useCallback(
    (customerOpened?: User) => setCustomerOpened(customerOpened),
    [setCustomerOpened],
  );
  const handleCustomerClose = useCallback(() => setCustomerOpened(undefined), [
    setCustomerOpened,
  ]);
  const handleCustomerSave = useCallback(
    (data: User) => {
      setAddCustomer(false);
      setCustomerOpened(data);
      setPropertyOpened(data);
    },
    [setCustomerOpened, setAddCustomer, setPropertyOpened],
  );
  const handlePropertySave = useCallback(
    (data: Property) => {
      setPropertyOpened(undefined);
      setCustomerOpened(undefined);
      setServiceCallOpened(data);
    },
    [setPropertyOpened, setCustomerOpened, setServiceCallOpened],
  );
  const handleAddProperty = useCallback(
    (customer: User) => {
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
          onPageChange: handlePageChange,
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
            key={entry.getId()}
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
                userID={customerOpened.getId()}
                loggedUserId={loggedUserId}
              />
            </div>
          </div>
        </Modal>
      )}
      {propertyOpened && (
        <Modal open onClose={handlePropertyClose}>
          <PropertyEdit
            userId={propertyOpened.getId()}
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
                propertyId={serviceCallOpened.getId()}
                userID={serviceCallOpened.getUserId()}
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
