import React, { FC, useEffect, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
  loadUserById,
  loadUserGroupLinksByUserId,
  UserGroupLinkClientService,
  makeFakeRows,
  saveUser,
} from '../../../helpers';
import { USA_STATES_OPTIONS, BILLING_TERMS_OPTIONS } from '../../../constants';

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
  ],
  [{ label: 'Notes', headline: true }],
  [
    {
      label: 'Customer notes',
      name: 'notes',
      helperText: 'Visible to customer',
      multiline: true,
    },
    {
      label: 'Internal Notes',
      name: 'intNotes',
      helperText: 'NOT visible to customer',
      multiline: true,
    },
  ],
  // {label:'Who recommended us?', name:''}, // TODO
  [{ label: 'Login details', headline: true }],
  [
    {
      label: 'Login',
      name: 'login',
      required: true,
      helperText:
        'NOTE: If they have an email address, their login ID will automatically be their email address.',
    },
    { label: 'Password', name: 'pwd', type: 'password' },
  ],
];

const useStyles = makeStyles(theme => ({
  editForm: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  form: {
    flexGrow: 1,
  },
  groups: {
    [theme.breakpoints.up('md')]: {
      width: 250,
      marginLeft: theme.spacing(1),
    },
  },
  groupLinks: {
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(2),
  },
  group: {
    marginBottom: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'inline-block',
      width: 'calc(100% / 3)',
      marginBottom: theme.spacing(),
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginBottom: 0,
    },
  },
}));

interface Props {
  onSave?: (data: UserType) => void;
  onClose: () => void;
  userId?: number;
  customer?: UserType;
  groups?: GroupType[];
  groupLinks?: UserGroupLinkType[];
}

export const CustomerEdit: FC<Props> = ({
  onSave,
  onClose,
  userId: _userId = 0,
  customer: _customer,
  groups: _groups,
  groupLinks: _groupLinks,
}) => {
  const classes = useStyles();
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
        const customer = await loadUserById(userId);
        setCustomer(customer);
      }
      if (!_groupLinks) {
        const groupLinks = await loadUserGroupLinksByUserId(userId);
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
    [setSaving, userId, setCustomer, groupLinks, groupLinksInitial],
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
    <div className={classes.editForm}>
      <Form<UserType>
        key={formKey}
        title={userId ? 'Edit Customer Information' : 'Add Customer'}
        schema={SCHEMA}
        data={customer}
        onSave={handleSave}
        onClose={onClose}
        disabled={saving || loading}
        className={classes.form}
      />
      <div className={classes.groups}>
        <SectionBar title="Groups" />
        {loading ? (
          <InfoTable data={makeFakeRows(1, 8)} loading />
        ) : (
          <div className={classes.groupLinks}>
            {groups.map(({ id, name }) => (
              <Field
                key={id}
                label={name}
                type="checkbox"
                onChange={handleChangeLinkGroup(id)}
                value={groupLinks.find(({ groupId }) => groupId === id) ? 1 : 0}
                name={`group_${id}`}
                className={classes.group}
                disabled={saving}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
