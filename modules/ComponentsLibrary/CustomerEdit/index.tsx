import React, { FC, useEffect, useCallback, useState } from 'react';
import { User } from '@kalos-core/kalos-rpc/User';
import { UserGroupLink } from '@kalos-core/kalos-rpc/UserGroupLink';
import { SectionBar } from '../SectionBar';
import { Form, Schema } from '../Form';
import { Field, Value } from '../Field';
import { InfoTable } from '../InfoTable';
import {
  UserGroupLinkClientService,
  makeFakeRows,
  UserClientService,
  GroupClientService,
} from '../../../helpers';
import { USA_STATES_OPTIONS, BILLING_TERMS_OPTIONS } from '../../../constants';
import './styles.less';
import { Group } from '@kalos-core/kalos-rpc/Group';

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
      { label: 'First Name', name: 'setFirstname', required: true },
      { label: 'Last Name', name: 'setLastname', required: true },
      { label: 'Business Name', name: 'setBusinessname', multiline: true },
    ],
    [{ label: 'Contact Details', headline: true }],
    [
      { label: 'Primary Phone', name: 'setPhone' },
      { label: 'Alternate Phone', name: 'setAltphone' },
      { label: 'Cell Phone', name: 'setCellphone' },
    ],
    [
      { label: 'Email', name: 'setEmail', required: true },

      {
        label: 'Alternate Email(s)',
        name: 'setAltEmail',
        helperText: 'Separate multiple email addresses w/comma',
      },
      {
        label: 'Wishes to receive promotional emails',
        name: 'setReceiveemail',
        type: 'checkbox',
      },
    ],
    [{ label: 'Address Details', headline: true }],
    [
      { label: 'Bulling Address', name: 'setAddress', multiline: true },
      { label: 'Billing City', name: 'setCity' },
      { label: 'Billing State', name: 'setState', options: USA_STATES_OPTIONS },
      { label: 'Billing Zip Code', name: 'setZip' },
    ],
    [{ label: 'Billing Details', headline: true }],
    [
      {
        label: 'Billing Terms',
        name: 'setBillingTerms',
        options: BILLING_TERMS_OPTIONS,
      },
      {
        label: 'Discount',
        name: 'setDiscount',
        required: true,
        type: 'number',
        endAdornment: '%',
      },
      {
        label: 'Rebate',
        name: 'setRebate' as keyof User,
        required: true,
        type: 'number',
        endAdornment: '%',
      },
      {
        label: 'Referred By',
        name: 'setRecommendedBy' as keyof User,
        type: 'text',
      },
    ],
    [{ label: 'Notes', headline: true }],
    [
      {
        label: viewedAsCustomer ? 'Additional Notes' : 'Customer Notes',
        name: 'setNotes',
        helperText: viewedAsCustomer ? '' : 'Visible to customer',
        multiline: true,
      },
      {
        label: 'Internal Notes',
        name: 'setIntNotes',
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
      const customer = await UserClientService.saveUser(data, userId);
      setCustomer(customer);
      setUserId(customer.getId());
      await saveGroupLinks(groupLinks, groupLinksInitial, customer.getId());
      setSaving(false);
      if (onSave) {
        onSave(customer);
      }
    },
    [
      setSaving,
      userId,
      setCustomer,
      groupLinks,
      groupLinksInitial,
      onSave,
      saveGroupLinks,
    ],
  );
  const handleChangeLinkGroup = useCallback(
    (groupId: number) => (value: Value) => {
      const newGroupLink = new UserGroupLink();
      newGroupLink.setGroupId(groupId);
      newGroupLink.setUserId(userId);
      const newGroupLinks = value
        ? [...groupLinks, newGroupLink]
        : groupLinks.filter(item => item.getGroupId() !== groupId);
      setGroupLinks(newGroupLinks);
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
      />
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
                    label={g.getName()}
                    type="checkbox"
                    onChange={handleChangeLinkGroup(g.getId())}
                    value={
                      groupLinks.find(g => g.getGroupId() === g.getId()) ? 1 : 0
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
