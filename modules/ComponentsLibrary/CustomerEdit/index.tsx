import React, { FC, useEffect, useCallback, useState } from 'react';
import { User } from '@kalos-core/kalos-rpc/User';
import { UserGroupLink } from '@kalos-core/kalos-rpc/UserGroupLink';
import { SectionBar } from '../SectionBar';
import { Form, Schema } from '../Form';
import { Field, Value } from '../Field';
import { InfoTable } from '../InfoTable';
import {
  UserType,
  GroupType,
  UserGroupLinkType,
  loadGroups,
  UserGroupLinkClientService,
  makeFakeRows,
  saveUser,
  UserClientService,
} from '../../../helpers';
import { USA_STATES_OPTIONS, BILLING_TERMS_OPTIONS } from '../../../constants';
import './styles.less';

interface Props {
  onSave?: (data: UserType) => void;
  onClose: () => void;
  userId?: number;
  customer?: UserType;
  groups?: GroupType[];
  groupLinks?: UserGroupLinkType[];
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
  const [customer, setCustomer] = useState<UserType>(
    _customer || new User().toObject(),
  );
  const [groupLinks, setGroupLinks] = useState<UserGroupLinkType[]>(
    _groupLinks || [],
  );
  const [groupLinksInitial, setGroupLinksInitial] = useState<
    UserGroupLinkType[]
  >(_groupLinks || []);
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [groups, setGroups] = useState<GroupType[]>(_groups || []);
  const load = useCallback(async () => {
    if (userId) {
      if (!_customer) {
        const customer = await UserClientService.loadUserById(userId);
        setCustomer(customer);
      }
      if (!_groupLinks) {
        const groupLinks = await UserGroupLinkClientService.loadUserGroupLinksByUserId(
          userId,
        );
        setGroupLinks(groupLinks);
        setGroupLinksInitial(groupLinks);
      }
    }
    if (!_groups) {
      const groups = await loadGroups();
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
  const SCHEMA: Schema<UserType> = [
    [{ label: 'Personal Details', headline: true }],
    [
      { label: 'First Name', name: 'firstname', required: true },
      { label: 'Last Name', name: 'lastname', required: true },
      { label: 'Business Name', name: 'businessname', multiline: true },
    ],
    [{ label: 'Contact Details', headline: true }],
    [
      { label: 'Primary Phone', name: 'phone' },
      { label: 'Alternate Phone', name: 'altphone' },
      { label: 'Cell Phone', name: 'cellphone' },
    ],
    [
      { label: 'Email', name: 'email', required: true },

      {
        label: 'Alternate Email(s)',
        name: 'altEmail',
        helperText: 'Separate multiple email addresses w/comma',
      },
      {
        label: 'Wishes to receive promotional emails',
        name: 'receiveemail',
        type: 'checkbox',
      },
    ],
    [{ label: 'Address Details', headline: true }],
    [
      { label: 'Bulling Address', name: 'address', multiline: true },
      { label: 'Billing City', name: 'city' },
      { label: 'Billing State', name: 'state', options: USA_STATES_OPTIONS },
      { label: 'Billing Zip Code', name: 'zip' },
    ],
    ...(viewedAsCustomer
      ? []
      : ([
          [{ label: 'Billing Details', headline: true }],
          [
            {
              label: 'Billing Terms',
              name: 'billingTerms',
              options: BILLING_TERMS_OPTIONS,
            },
            {
              label: 'Discount',
              name: 'discount',
              required: true,
              type: 'number',
              endAdornment: '%',
            },
            {
              label: 'Rebate',
              name: 'rebate',
              required: true,
              type: 'number',
              endAdornment: '%',
            },
            {
              label: 'Referred By',
              name: 'recommendedBy',
              type: 'text',
            },
          ],
        ] as Schema<UserType>)),
    [{ label: 'Notes', headline: true }],
    [
      {
        label: viewedAsCustomer ? 'Additional Notes' : 'Customer Notes',
        name: 'notes',
        helperText: viewedAsCustomer ? '' : 'Visible to customer',
        multiline: true,
      },
      ...(viewedAsCustomer
        ? []
        : [
            {
              label: 'Internal Notes',
              name: 'intNotes' as const,
              helperText: 'NOT visible to customer',
              multiline: true,
            },
          ]),
    ],
  ];
  const saveGroupLinks = useCallback(
    async (
      groupLinks: UserGroupLinkType[],
      groupLinksInitial: UserGroupLinkType[],
      userId,
    ) => {
      const operations: {
        operation: 'Create' | 'Delete';
        entry: UserGroupLink;
      }[] = [];
      for (let i = 0; i < groups.length; i += 1) {
        const id = groups[i].id;
        const isInGroupLinks = groupLinks.find(({ groupId }) => groupId === id);
        const isInGroupLinksInitial = groupLinksInitial.find(
          ({ groupId }) => groupId === id,
        );
        const entry = new UserGroupLink();
        if (isInGroupLinksInitial && !isInGroupLinks) {
          entry.setId(isInGroupLinksInitial.id);
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
    async (data: UserType) => {
      setSaving(true);
      const customer = await saveUser(data, userId);
      setCustomer(customer);
      setUserId(customer.id);
      await saveGroupLinks(groupLinks, groupLinksInitial, customer.id);
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
        ? [...groupLinks, newGroupLink.toObject()]
        : groupLinks.filter(item => item.groupId !== groupId);
      setGroupLinks(newGroupLinks);
    },
    [groupLinks, userId, setGroupLinks],
  );
  return (
    <div className="CustomerEditEditForm">
      <Form<UserType>
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
              {groups.map(({ id, name }) => (
                <div key={id} className="CustomerEditGroup">
                  <Field
                    label={name}
                    type="checkbox"
                    onChange={handleChangeLinkGroup(id)}
                    value={
                      groupLinks.find(({ groupId }) => groupId === id) ? 1 : 0
                    }
                    name={`group_${id}`}
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
