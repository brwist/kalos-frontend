import React, { FC, useState, useCallback, useEffect } from 'react';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { Form, Schema } from '../Form';
import {
  PropertyType,
  loadGeoLocationByAddress,
  loadPropertyById,
  saveProperty,
} from '../../../helpers';
import {
  RESIDENTIAL_OPTIONS,
  PROP_LEVEL,
  USA_STATES_OPTIONS,
} from '../../../constants';

interface Props {
  onSave?: (data: PropertyType) => void;
  onClose: () => void;
  userId: number;
  propertyId?: number;
}

export const PropertyEdit: FC<Props> = ({
  onClose,
  onSave,
  userId,
  propertyId: _propertyId = 0,
}) => {
  const [propertyId, setPropertyId] = useState<number>(_propertyId);
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [formKey, setFormKey] = useState<number>(0);
  const [entry, setEntry] = useState<PropertyType>(new Property().toObject());
  const load = useCallback(async () => {
    if (propertyId) {
      setLoading(true);
      const entry = await loadPropertyById(propertyId);
      setEntry(entry);
      setFormKey(formKey + 1);
    }
    setLoading(false);
  }, [propertyId, setLoading, setFormKey, formKey]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleCheckLocation = useCallback(async () => {
    const { address, city, state: addressState, zip } = entry;
    const geo = await loadGeoLocationByAddress(
      `${address}, ${city}, ${addressState} ${zip}`,
    );
    if (geo) {
      setEntry({ ...entry, ...geo });
      setFormKey(formKey + 1);
    }
  }, [entry, setEntry, formKey, setFormKey]);
  const handleSave = useCallback(
    async (data: PropertyType) => {
      setSaving(true);
      const entry = await saveProperty(data, userId, propertyId);
      setEntry(entry);
      setPropertyId(entry.id);
      setSaving(false);
      if (onSave) {
        onSave(entry);
      }
    },
    [userId, propertyId, onSave, setSaving, setPropertyId],
  );
  const SCHEMA_PROPERTY_INFORMATION: Schema<PropertyType> = [
    [{ label: 'Personal Details', headline: true, description: PROP_LEVEL }],
    [
      { label: 'First Name', name: 'firstname' },
      { label: 'Last Name', name: 'lastname' },
      { label: 'Business Name', name: 'businessname' },
    ],
    [{ label: 'Contact Details', headline: true, description: PROP_LEVEL }],
    [
      { label: 'Primary Phone', name: 'phone' },
      { label: 'Alternate Phone', name: 'altphone' },
      { label: 'Email', name: 'email' },
    ],
    [{ label: 'Address Details', headline: true }],
    [
      { label: 'Address', name: 'address', required: true, multiline: true },
      { label: 'City', name: 'city', required: true },
      {
        label: 'State',
        name: 'state',
        options: USA_STATES_OPTIONS,
        required: true,
      },
      { label: 'Zip Code', name: 'zip', required: true },
    ],
    [
      {
        label: 'Location Details',
        headline: true,
        actions: [
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
      { label: 'Directions', name: 'directions', multiline: true },
      { label: 'Subdivision', name: 'subdivision' },
    ],
    [
      { label: 'Zoning', name: 'isResidential', options: RESIDENTIAL_OPTIONS },
      { label: 'Latitude', name: 'geolocationLat', type: 'number' },
      { label: 'Longitude', name: 'geolocationLng', type: 'number' },
    ],
    [{ label: 'Notes', headline: true }],
    [{ label: 'Notes', name: 'notes', multiline: true }],
  ];
  return (
    <Form<PropertyType>
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
