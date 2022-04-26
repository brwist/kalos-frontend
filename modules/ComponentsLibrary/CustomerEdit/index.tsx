import React, { FC, useEffect, useCallback, useState } from 'react';
import { User } from '../../../@kalos-core/kalos-rpc/User';
import { UserGroupLink } from '../../../@kalos-core/kalos-rpc/UserGroupLink';
import { SectionBar } from '../SectionBar';
import { Form, Schema } from '../Form';
import { Field, Value } from '../Field';
import { InfoTable } from '../InfoTable';
import { Property } from '../../../@kalos-core/kalos-rpc/Property';
import {
  UserGroupLinkClientService,
  makeFakeRows,
  UserClientService,
  PropertyClientService,
  GroupClientService,
  makeSafeFormObject,
  MapClientService,
} from '../../../helpers';
import { USA_STATES_OPTIONS, BILLING_TERMS_OPTIONS } from '../../../constants';
import { Group } from '../../../@kalos-core/kalos-rpc/Group';
import './CustomerEdit.module.less';
import { PropertyDropdown } from '../PropertyDropdown';

interface Props {
  onSave?: (data: User) => void;
  onClose: () => void;
  userId?: number;
  customer?: User;
  groups?: Group[];
  groupLinks?: UserGroupLink[];
  viewedAsCustomer?: boolean;
}

export const CustomerEdit: FC<Props> = ({
  onSave,
  onClose,
  userId: _userId = 0,
  customer: _customer,
  groups: _groups,
  groupLinks: _groupLinks,
  viewedAsCustomer = false,
}) => {
  const [userId, setUserId] = useState<number>(_userId);
  const [formKey, setFormKey] = useState<number>(0);
  const [createPropertyFlag, setCreatePropertyFlag] = useState<number>(0);

  const [customer, setCustomer] = useState<User>(_customer || new User());
  const [groupLinks, setGroupLinks] = useState<UserGroupLink[]>(
    _groupLinks || [],
  );
  const [groupLinksInitial, setGroupLinksInitial] = useState<UserGroupLink[]>(
    _groupLinks || [],
  );
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [groups, setGroups] = useState<Group[]>(_groups || []);
  const load = useCallback(async () => {
    if (userId) {
      if (!_customer) {
        const customer = await UserClientService.loadUserById(userId);
        setCustomer(customer);
      }
      if (!_groupLinks) {
        const groupLinks =
          await UserGroupLinkClientService.loadUserGroupLinksByUserId(userId);
        setGroupLinks(groupLinks);
        setGroupLinksInitial(groupLinks);
      }
    }
    if (!_groups) {
      const groups = await GroupClientService.loadGroups();
      setGroups(groups);
    }
    setFormKey(formKey + 1);
    setLoading(false);
  }, [
    setGroups,
    userId,
    setCustomer,
    formKey,
    setLoading,
    setGroupLinks,
    setGroupLinksInitial,
    _customer,
    _groups,
    _groupLinks,
  ]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const SCHEMA: Schema<User> = [
    [{ label: 'Personal Details', headline: true }],
    [
      { label: 'First Name', name: 'getFirstname', required: true },
      { label: 'Last Name', name: 'getLastname', required: true },
      { label: 'Business Name', name: 'getBusinessname', multiline: true },
    ],
    [{ label: 'Contact Details', headline: true }],
    [
      { label: 'Primary Phone', name: 'getPhone' },
      { label: 'Alternate Phone', name: 'getAltphone' },
      { label: 'Cell Phone', name: 'getCellphone' },
    ],
    [
      { label: 'Email', name: 'getEmail', required: true },

      {
        label: 'Alternate Email(s)',
        name: 'getAltEmail',
        helperText: 'Separate multiple email addresses w/comma',
      },
      {
        label: 'Wishes to receive promotional emails',
        name: 'getReceiveemail',
        type: 'checkbox',
      },
    ],
    [{ label: 'Address Details', headline: true }],
    [
      { label: 'Bulling Address', name: 'getAddress', multiline: true },
      { label: 'Billing City', name: 'getCity' },
      { label: 'Billing State', name: 'getState', options: USA_STATES_OPTIONS },
      { label: 'Billing Zip Code', name: 'getZip' },
    ],
    [{ label: 'Billing Details', headline: true }],
    [
      {
        label: 'Billing Terms',
        name: 'getBillingTerms',
        options: BILLING_TERMS_OPTIONS,
      },
      {
        label: 'Discount',
        name: 'getDiscount',
        required: true,
        type: 'number',
        endAdornment: '%',
      },
      {
        label: 'Rebate',
        name: 'getRebate' as keyof User,
        required: true,
        type: 'number',
        endAdornment: '%',
      },
      {
        label: 'Referred By',
        name: 'getRecommendedBy' as keyof User,
        type: 'text',
      },
    ],
    [{ label: 'Notes', headline: true }],
    [
      {
        label: viewedAsCustomer ? 'Additional Notes' : 'Customer Notes',
        name: 'getNotes',
        helperText: viewedAsCustomer ? '' : 'Visible to customer',
        multiline: true,
      },
      {
        label: 'Internal Notes',
        name: 'getIntNotes',
        helperText: 'NOT visible to customer',
        multiline: true,
      },
    ],
  ];
  const saveGroupLinks = useCallback(
    async (
      groupLinks: UserGroupLink[],
      groupLinksInitial: UserGroupLink[],
      userId,
    ) => {
      const operations: {
        operation: 'Create' | 'Delete';
        entry: UserGroupLink;
      }[] = [];
      for (let i = 0; i < groups.length; i += 1) {
        const id = groups[i].getId();
        const isInGroupLinks = groupLinks.find(g => g.getGroupId() === id);
        const isInGroupLinksInitial = groupLinksInitial.find(
          g => g.getGroupId() === id,
        );
        const entry = new UserGroupLink();
        if (isInGroupLinksInitial && !isInGroupLinks) {
          entry.setId(isInGroupLinksInitial.getId());
          operations.push({ operation: 'Delete', entry });
        }
        if (!isInGroupLinksInitial && isInGroupLinks) {
          entry.setUserId(userId);
          entry.setGroupId(id);
          operations.push({ operation: 'Create', entry });
        }
      }
      await Promise.all(
        operations.map(
          async ({ operation, entry }) =>
            await UserGroupLinkClientService[operation](entry),
        ),
      );
      setGroupLinksInitial(groupLinks);
    },
    [setGroupLinksInitial, groups],
  );
  const handleSave = useCallback(
    async (data: User) => {
      setSaving(true);
      const temp = makeSafeFormObject(data, new User());
      if (temp.getFieldMaskList().length > 0) {
        const result = await UserClientService.saveUser(temp, userId);
        if (
          createPropertyFlag &&
          temp.getAddress() != '' &&
          temp.getZip() != '' &&
          temp.getCity() != '' &&
          temp.getState() != ''
        ) {
          const property = new Property();
          property.setUserId(result.getId());
          property.setAddress(temp.getAddress());
          property.setZip(temp.getZip());
          property.setCity(temp.getCity());
          property.setState(temp.getState());
          try {
            const geo = await MapClientService.loadGeoLocationByAddress(
              `${temp.getAddress()}, ${temp.getCity()}, ${temp.getState()} ${temp.getZip()}`,
            );
            if (geo) {
              property.setGeolocationLat(geo.geolocationLat);
              property.setGeolocationLng(geo.geolocationLng);
            }
          } catch {
            console.log('could not geolocate');
          }
          await PropertyClientService.Create(property);
        }

        setCustomer(result);
        setUserId(result.getId());
        await saveGroupLinks(groupLinks, groupLinksInitial, result.getId());
        setSaving(false);
        if (onSave) {
          onSave(result);
        }
      } else {
        await saveGroupLinks(groupLinks, groupLinksInitial, customer.getId());
        setSaving(false);
        if (onSave) {
          onSave(customer);
        }
      }
    },
    [
      setSaving,
      userId,
      customer,
      setCustomer,
      groupLinks,
      groupLinksInitial,
      createPropertyFlag,
      onSave,
      saveGroupLinks,
    ],
  );
  const handleChangeLinkGroup = useCallback(
    (groupId: number) => (value: Value) => {
      console.log('changing');
      const newGroupLink = new UserGroupLink();
      newGroupLink.setGroupId(groupId);
      newGroupLink.setUserId(userId);
      console.log('new link', newGroupLink);
      const newGroupLinks = value
        ? [...groupLinks, newGroupLink]
        : groupLinks.filter(item => item.getGroupId() !== groupId);
      setGroupLinks(newGroupLinks);
      console.log('new group links', newGroupLinks);
    },
    [groupLinks, userId, setGroupLinks],
  );
  return (
    <div className="CustomerEditEditForm">
      <Form<User>
        key={formKey}
        title={userId ? 'Edit Customer Information' : 'Add Customer'}
        schema={SCHEMA}
        data={customer}
        onSave={handleSave}
        onClose={onClose}
        disabled={saving || loading}
        className="CustomerEditForm"
      >
        {!userId ? (
          <Field
            type="checkbox"
            name={'createPropertyFlag'}
            value={createPropertyFlag}
            label="Create Property From Address?"
            onChange={data => setCreatePropertyFlag(data as number)}
          />
        ) : undefined}
      </Form>

      {!viewedAsCustomer && (
        <div className="CustomerEditGroups">
          <SectionBar title="Groups" />
          {loading ? (
            <InfoTable data={makeFakeRows(1, 8)} loading />
          ) : (
            <div className="CustomerEditGroupLinks">
              {groups.map(g => (
                <div key={g.getId()} className="CustomerEditGroup">
                  <Field
                    key={g.getId() + g.getName()}
                    label={g.getName()}
                    type="checkbox"
                    onChange={handleChangeLinkGroup(g.getId())}
                    value={
                      groupLinks.find(group => group.getGroupId() === g.getId())
                        ? 1
                        : 0
                    }
                    name={`group_${g.getId()}`}
                    disabled={saving}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
