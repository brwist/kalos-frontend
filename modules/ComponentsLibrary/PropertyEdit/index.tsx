import React, { FC, useState, useCallback, useEffect } from 'react';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { Form, Schema } from '../Form';
import {
  PropertyClientService,
  MapClientService,
  makeSafeFormObject,
} from '../../../helpers';
import {
  RESIDENTIAL_OPTIONS,
  PROP_LEVEL,
  USA_STATES_OPTIONS,
} from '../../../constants';

interface Props {
  onSave?: (data: Property) => void;
  onClose: () => void;
  userId: number;
  propertyId?: number;
  property?: Property;
  viewedAsCustomer?: boolean;
}

export const PropertyEdit: FC<Props> = ({
  onClose,
  onSave,
  userId,
  propertyId: _propertyId = 0,
  property: _property,
  viewedAsCustomer = false,
}) => {
  const [propertyId, setPropertyId] = useState<number>(_propertyId);
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [formKey, setFormKey] = useState<number>(0);
  const [entry, setEntry] = useState<Property>(_property || new Property());
  const load = useCallback(async () => {
    if (propertyId) {
      if (!_property) {
        setLoading(true);
        const entry = await PropertyClientService.loadPropertyByID(propertyId);
        setEntry(entry);
        setFormKey(formKey + 1);
      }
    }
    setLoading(false);
  }, [propertyId, setLoading, setFormKey, formKey, _property]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleCheckLocation = useCallback(async () => {
    const address = entry.getAddress();
    const city = entry.getCity();
    const addressState = entry.getState();
    const zip = entry.getZip();
    const geo = await MapClientService.loadGeoLocationByAddress(
      `${address}, ${city}, ${addressState} ${zip}`,
    );
    if (geo) {
      entry.setGeolocationLat(geo.geolocationLat);
      entry.setGeolocationLng(geo.geolocationLng);
      setEntry(entry);
      setFormKey(formKey + 1);
    }
  }, [entry, setEntry, formKey, setFormKey]);
  const handleSave = useCallback(
    async (data: Property) => {
      setSaving(true);
      const temp = makeSafeFormObject(data, new Property());
      const entry = await PropertyClientService.saveProperty(
        temp,
        userId,
        propertyId,
      );
      setEntry(entry);
      setPropertyId(entry.getId());
      setSaving(false);
      if (onSave) {
        onSave(entry);
      }
    },
    [userId, propertyId, onSave, setSaving, setPropertyId],
  );
  const SCHEMA_PROPERTY_INFORMATION: Schema<Property> = [
    ...(viewedAsCustomer
      ? []
      : ([
          [
            {
              label: 'Personal Details',
              headline: true,
              description: PROP_LEVEL,
            },
          ],
          [
            { label: 'First Name', name: 'getFirstname' },
            { label: 'Last Name', name: 'getLastname' },
            { label: 'Business Name', name: 'getBusinessname' },
          ],
          [
            {
              label: 'Contact Details',
              headline: true,
              description: PROP_LEVEL,
            },
          ],
          [
            { label: 'Primary Phone', name: 'getPhone' },
            { label: 'Alternate Phone', name: 'getAltphone' },
            { label: 'Email', name: 'getEmail' },
          ],
        ] as Schema<Property>)),
    [{ label: 'Address Details', headline: true }],
    [
      { label: 'Address', name: 'getAddress', required: true, multiline: true },
      { label: 'City', name: 'getCity', required: true },
      {
        label: 'State',
        name: 'getState',
        options: USA_STATES_OPTIONS,
        required: true,
      },
      { label: 'Zip Code', name: 'getZip', required: true },
    ],
    [
      {
        label: 'Location Details',
        headline: true,
        actions: viewedAsCustomer
          ? undefined
          : [
              {
                label: 'Check Location',
                compact: true,
                onClick: handleCheckLocation,
                disabled: saving,
                variant: 'outlined',
                size: 'xsmall',
              },
            ],
      },
    ],
    [
      { label: 'Directions', name: 'getDirections', multiline: true },
      { label: 'Subdivision', name: 'getSubdivision' },
    ],
    ...(viewedAsCustomer
      ? []
      : ([
          [
            {
              label: 'Zoning',
              name: 'getIsResidential',
              options: RESIDENTIAL_OPTIONS,
            },
            { label: 'Latitude', name: 'getGeolocationLat', type: 'number' },
            { label: 'Longitude', name: 'getGeolocationLng', type: 'number' },
          ],
        ] as Schema<Property>)),
    [{ label: 'Notes', headline: true }],
    [{ label: 'Notes', name: 'getNotes', multiline: true }],
  ];
  return (
    <Form<Property>
      key={formKey}
      title={propertyId ? 'Edit Property Information' : 'Add Property'}
      schema={SCHEMA_PROPERTY_INFORMATION}
      data={entry}
      onChange={setEntry}
      onSave={handleSave}
      onClose={onClose}
      disabled={saving || loading}
    />
  );
};
