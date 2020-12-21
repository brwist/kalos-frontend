import React, {
  ReactElement,
  FC,
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
  CSSProperties,
  RefObject,
  ForwardedRef,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { User } from '@kalos-core/kalos-rpc/User';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import CircularProgress from '@material-ui/core/CircularProgress';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import DateFnsUtils from '@date-io/date-fns';
import { format, parseISO } from 'date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker,
  DateTimePicker,
} from '@material-ui/pickers';
//@ts-ignore
import SignatureCanvas from 'react-signature-pad-wrapper';
import { Button } from '../Button';
import { SchemaProps } from '../PlainForm';
import { Actions } from '../Actions';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import {
  makeFakeRows,
  loadTechnicians,
  trailingZero,
  EventType,
  EventClientService,
} from '../../../helpers';
import { ClassCodePicker, DepartmentPicker } from '../Pickers';
import { AdvancedSearch } from '../AdvancedSearch';
import './styles.less';
import { Form, Schema } from '../Form';

type SelectOption = {
  id: number;
  description: string;
};

const renderSelectOptions = (i: SelectOption) => (
  <option value={i.id} key={`${i.id}-${i.description}`}>
    {i.description}
  </option>
);

type UserType = User.AsObject;

export type Type =
  | 'text'
  | 'password'
  | 'number'
  | 'search'
  | 'checkbox'
  | 'date'
  | 'time'
  | 'datetime'
  | 'mui-date'
  | 'mui-time'
  | 'mui-datetime'
  | 'technician'
  | 'technicians'
  | 'signature'
  | 'file'
  | 'department'
  | 'classCode'
  | 'hidden'
  | 'color'
  | 'eventId'
  | 'multiselect'
  | 'button';

export type Value = string | number;

export type Option = {
  label: string;
  value: string | number;
  color?: string;
  icon?: FC<SvgIconProps>;
};

export type Options = (string | Option)[];

export interface Props<T> extends SchemaProps<T> {
  value?: T[keyof T];
  disabled?: boolean;
  validation?: string;
  readOnly?: boolean;
  className?: string;
  placeholder?: string;
  style?: CSSProperties;
  compact?: boolean;
  white?: boolean;
  ref?: RefObject<T> | ForwardedRef<T>;
}

export const getDefaultValueByType = (type: Type) => {
  if (type === 'number') return 0;
  if (type === 'time') return '00:00';
  if (type === 'datetime') return '0000-00-00 00:00';
  if (type === 'checkbox') return 0;
  return '';
};

// @ts-ignore
export const Field: <T>(props: Props<T>) => ReactElement<Props<T>> = forwardRef(
  (
    {
      name,
      label,
      headline,
      options,
      onChange,
      onFileLoad,
      disabled = false,
      required = false,
      validation = '',
      helperText = '',
      type = 'text',
      readOnly = false,
      className = '',
      startAdornment,
      endAdornment,
      content,
      actionsInLabel = false,
      style = {},
      compact = false,
      technicianAsEmployee = false,
      white = false,
      minutesStep = 15,
      ...props
    },
    functionRef,
  ) => {
    const signatureRef = useRef(null);
    const dateTimePart =
      type === 'date' ? (props.value + '').substr(11, 8) : '';
    const value =
      type === 'date' ? (props.value + '').substr(0, 10) : props.value;
    const [technicians, setTechnicians] = useState<UserType[]>([]);
    const [loadedTechnicians, setLoadedTechnicians] = useState<boolean>(false);
    const [eventsOpened, setEventsOpened] = useState<boolean>(false);
    const [techniciansOpened, setTechniciansOpened] = useState<boolean>(false);
    const [techniciansIds, setTechniciansIds] = useState<number[]>(
      (value + '').split(',').map(id => +id),
    );
    const [filename, setFilename] = useState<string>('');
    const [searchTechnician, setSearchTechnician] = useState<Value>('');
    const [eventStatus, setEventStatus] = useState<number>(
      +(value || '') > 0 ? 1 : -1,
    );
    const [eventIdValue, setEventIdValue] = useState<number>(+(value || ''));
    const loadUserTechnicians = useCallback(async () => {
      const technicians = await loadTechnicians();
      setLoadedTechnicians(true);
      setTechnicians(technicians);
    }, [setLoadedTechnicians, setTechnicians]);
    const handleEventsOpenedToggle = useCallback(
      (opened: boolean) => () => setEventsOpened(opened),
      [setEventsOpened],
    );

    const handleEventsSearchClicked = useCallback(async () => {
      if (eventIdValue === 0) {
        setEventStatus(-1);
        setEventsOpened(true);
        return;
      }
      setEventStatus(0);
      try {
        //const event = await loadEventById(eventIdValue);
        const event = await EventClientService.LoadEventsByServiceCallID(
          eventIdValue,
        );
        if (onChange) {
          onChange(event.id);
        }
        setEventStatus(1);
      } catch (e) {
        setEventStatus(-1);
        setEventsOpened(true);
      }
    }, [setEventStatus, eventIdValue, onChange, setEventsOpened]);
    const handleEventSelect = useCallback(
      (event: EventType) => {
        if (onChange) {
          onChange(event.id);
        }
        setEventIdValue(event.id);
        setEventStatus(1);
      },
      [onChange, setEventStatus, setEventIdValue],
    );
    const handleSetTechniciansOpened = useCallback(
      (opened: boolean) => () => {
        setTechniciansOpened(opened);
        setSearchTechnician('');
        if (!loadedTechnicians) {
          loadUserTechnicians();
        }
      },
      [setTechniciansOpened, setSearchTechnician, loadedTechnicians],
    );
    useEffect(() => {
      if (
        (type === 'technicians' || type === 'technician') &&
        !loadedTechnicians &&
        value !== '0'
      ) {
        loadUserTechnicians();
      }
    }, [loadedTechnicians, value]);
    const handleTechniciansSelect = useCallback(() => {
      if (onChange) {
        onChange(techniciansIds.filter(id => id > 0).join(','));
      }
      setTechniciansOpened(false);
    }, [onChange, techniciansIds, setTechniciansOpened]);
    const handleTechnicianChecked = useCallback(
      (id: number) => (checked: Value) => {
        if (id === 0) {
          setTechniciansIds([0]);
        } else if (type === 'technician') {
          setTechniciansIds([id]);
        } else {
          const ids = [
            ...techniciansIds.filter(techId => {
              if (techId === 0) return false;
              if (!checked && id === techId) return false;
              return true;
            }),
            ...(checked ? [id] : []),
          ];
          setTechniciansIds(ids.length > 0 ? ids : [0]);
        }
      },
      [techniciansIds, setTechniciansIds, type],
    );
    const { actions = [], description } = props;
    const handleChange = useCallback(
      ({ target: { value } }) => {
        if (type === 'eventId') {
          setEventIdValue(+value);
          setEventStatus(-2);
          if (onChange) {
            onChange('');
          }
          return;
        }
        if (onChange) {
          let newValue = type === 'number' ? +value : value;
          if (type === 'date') {
            newValue = (newValue + ' ' + dateTimePart).trim();
          }
          onChange(newValue);
        }
      },
      [type, setEventIdValue, dateTimePart, onChange],
    );
    const handleFileChange = useCallback(
      ({ target }) => {
        const file = target.files[0];
        if (file) {
          const filename = file.name;
          setFilename(filename);
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            if (onFileLoad) {
              onFileLoad(fileReader.result, filename);
            }
            if (onChange) {
              onChange(filename);
            }
          };
        }
      },
      [setFilename, onFileLoad, onChange],
    );
    const handleChangeCheckbox = useCallback(
      (_, value) => {
        if (onChange) {
          onChange(+value);
        }
      },
      [onChange],
    );
    const handleDateTimeChange = useCallback(
      (date, hour) => {
        if (onChange) {
          onChange(`${date} ${hour}`);
        }
      },
      [onChange],
    );
    const handleTimeChange = useCallback(
      (hour, minutes, ampm) => {
        if (onChange) {
          let hourVal = +hour;
          if (hourVal === 12 && ampm === 'AM') {
            hourVal = 0;
          }
          if (ampm === 'PM' && hourVal < 12) {
            hourVal += 12;
          }
          onChange(`${trailingZero(hourVal)}:${trailingZero(+minutes)}`);
        }
      },
      [onChange],
    );
    const handleSignatureEnd = useCallback(() => {
      if (onChange && signatureRef !== null && signatureRef.current !== null) {
        // @ts-ignore
        const signature = signatureRef.current.toDataURL();
        onChange(signature);
      }
    }, [onChange, signatureRef]);
    const handleSignatureClear = useCallback(() => {
      if (signatureRef !== null && signatureRef.current !== null) {
        // @ts-ignore
        signatureRef.current.clear();
        if (onChange) {
          onChange('');
        }
      }
    }, [onChange, signatureRef]);
    const inputLabel = (
      <>
        {label}
        {required && !readOnly ? <span className="FieldRequired"> *</span> : ''}
      </>
    );
    const error = validation !== '';
    const helper =
      validation !== '' || helperText !== ''
        ? validation + ' ' + helperText
        : undefined;
    if (name === undefined || value === undefined) {
      if (headline) {
        return (
          <Typography
            component="div"
            className={clsx('FieldHeadline', { disabled })}
          >
            {label}
            {description && (
              <span className="FieldDescription">{description}</span>
            )}
            {actions.length > 0 && <Actions actions={actions} fixed />}
          </Typography>
        );
      }
      return (
        <div
          className={clsx('FieldInput', 'FieldContent', className, {
            compact,
            disabled,
          })}
        >
          {content}
          {actions.length > 0 && <Actions actions={actions} fixed />}
        </div>
      );
    }

    if (type === 'signature') {
      return (
        <div className={clsx('Field', className)} style={style}>
          <div>
            <div className="FieldSignatureHeader">
              <InputLabel shrink>{inputLabel}</InputLabel>
              <Button
                label="Clear"
                size="xsmall"
                variant="outlined"
                compact
                onClick={handleSignatureClear}
              />
            </div>
            <span className="FieldSignature">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 300,
                  height: 160,
                  className: 'FieldCanvas',
                }}
                options={{
                  onEnd: handleSignatureEnd,
                }}
              />
            </span>
          </div>
        </div>
      );
    }
    if (type === 'datetime') {
      const { value } = props;
      const [valDate, valHour] = String(
        value || getDefaultValueByType('datetime'),
      ).split(' ');
      return (
        <div className="FieldDateTime">
          <Field
            value={valDate}
            name={`${name}_date`}
            type="date"
            label={label}
            onChange={date => handleDateTimeChange(date, valHour)}
            required={required} // FIXME
          />
          <Field
            value={valHour}
            name={`${name}_hour`}
            onChange={hour => handleDateTimeChange(valDate, hour)}
          />
        </div>
      );
    }
    if (type === 'time') {
      const { value } = props;
      const [valHour, valMinutes] = String(
        value || getDefaultValueByType('time'),
      ).split(':');
      let hour = +valHour === 0 ? 12 : +valHour > 12 ? +valHour - 12 : +valHour;
      let minutes = +valMinutes;
      if (minutes >= 45) {
        minutes = 45;
      } else if (minutes >= 30) {
        minutes = 30;
      } else if (minutes >= 15) {
        minutes = 15;
      } else {
        minutes = 0;
      }
      const ampm = +valHour < 12 ? 'AM' : 'PM';
      return (
        <div
          className={clsx('Field', 'FieldHourWrapper', className)}
          style={style}
        >
          <InputLabel shrink disabled={disabled}>
            {inputLabel}
          </InputLabel>
          <div className="FieldHour">
            <Field
              name={`${name}_hour`}
              value={trailingZero(hour)}
              options={[
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12',
              ]}
              onChange={hour => handleTimeChange(hour, minutes, ampm)}
              style={{ width: 'calc(100% / 3' }}
              disabled={disabled}
            />
            <Field
              name={`${name}_minutes`}
              value={trailingZero(minutes)}
              options={['00', '15', '30', '45']}
              onChange={minutes =>
                handleTimeChange(trailingZero(hour), minutes, ampm)
              }
              style={{ width: 'calc(100% / 3' }}
              disabled={disabled}
            />
            <Field
              name={`${name}_ampm`}
              value={ampm}
              options={['AM', 'PM']}
              onChange={ampm =>
                handleTimeChange(trailingZero(hour), minutes, ampm)
              }
              style={{ width: 'calc(100% / 3' }}
              disabled={disabled}
            />
          </div>
        </div>
      );
    }

    if (type === 'mui-datetime') {
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            className={clsx('FieldInput', className, { compact, disabled })}
            label={inputLabel}
            value={parseISO((props.value as unknown) as string)}
            onChange={value =>
              handleChange({
                target: {
                  value: format(value || new Date(), 'yyyy-MM-dd HH:mm'),
                },
              })
            }
            minutesStep={minutesStep}
            disabled={disabled}
            fullWidth
          />
        </MuiPickersUtilsProvider>
      );
    }

    if (type === 'mui-date') {
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            className={clsx('FieldInput', className, { compact, disabled })}
            label={inputLabel}
            value={parseISO((props.value as unknown) as string)}
            onChange={value =>
              handleChange({
                target: {
                  value: format(value || new Date(), 'yyyy-MM-dd HH:mm'),
                },
              })
            }
            disabled={disabled}
            fullWidth
          />
        </MuiPickersUtilsProvider>
      );
    }

    if (type === 'mui-time') {
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TimePicker
            className={clsx('FieldInput', className, { compact, disabled })}
            label={inputLabel}
            value={parseISO((props.value as unknown) as string)}
            onChange={value =>
              handleChange({
                target: {
                  value: format(value || new Date(), 'yyyy-MM-dd HH:mm'),
                },
              })
            }
            minutesStep={minutesStep}
            disabled={disabled}
            fullWidth
          />
        </MuiPickersUtilsProvider>
      );
    }

    if (type === 'checkbox') {
      return (
        <FormControl
          className={clsx('FieldInput', className, { compact, disabled })}
          fullWidth
          disabled={disabled}
          error={error}
          style={style}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={+value === 1}
                onChange={handleChangeCheckbox}
                value={value}
                color="primary"
              />
            }
            label={inputLabel}
          />
          {helper && <FormHelperText>{helper}</FormHelperText>}
        </FormControl>
      );
    }
    if (type === 'technicians' || type === 'technician') {
      const id = `${name}-technician-label`;
      const ids = (value + '').split(',').map(id => +id);
      const valueTechnicians =
        ids.length === 1 && ids[0] === 0
          ? 'Unassigned'
          : ids
              .map(id => {
                const technician = technicians.find(item => item.id === id);
                if (!technician) return 'Loading...';
                const { firstname, lastname } = technician;
                return `${firstname} ${lastname}`;
              })
              .join('\n');
      const searchTechnicianPhrase = (searchTechnician + '').toLowerCase();
      const data: Data = loadedTechnicians
        ? [
            [
              {
                value: (
                  <Field
                    name="technician-0"
                    value={techniciansIds.includes(0)}
                    label="Unassigned"
                    type="checkbox"
                    className="FieldTechnician"
                    onChange={handleTechnicianChecked(0)}
                  />
                ),
              },
            ],
            ...technicians
              .filter(
                ({ firstname, lastname }) =>
                  firstname.toLowerCase().includes(searchTechnicianPhrase) ||
                  lastname.toLowerCase().includes(searchTechnicianPhrase),
              )
              .map(({ id, firstname, lastname }) => [
                {
                  value: (
                    <Field
                      name={`technician-${id}`}
                      value={techniciansIds.includes(id)}
                      label={`${firstname} ${lastname}`}
                      type="checkbox"
                      className="FieldTechnician"
                      onChange={handleTechnicianChecked(id)}
                    />
                  ),
                },
              ]),
          ]
        : makeFakeRows(1, 30);
      return (
        <>
          <FormControl
            className={clsx('FieldInput', className, { compact, disabled })}
            fullWidth
            disabled={disabled}
            error={error}
          >
            <InputLabel htmlFor={id}>{inputLabel}</InputLabel>
            <div className="FieldTechnicians">
              <Input
                id={id}
                value={valueTechnicians}
                readOnly
                fullWidth
                multiline
                endAdornment={
                  <InputAdornment
                    position="end"
                    className="FieldTechnicianButton"
                  >
                    <Button
                      label="Change"
                      variant="outlined"
                      size="xsmall"
                      onClick={handleSetTechniciansOpened(true)}
                      disabled={disabled}
                      compact
                    />
                  </InputAdornment>
                }
              />
            </div>
          </FormControl>
          {techniciansOpened && (
            <Modal open onClose={handleSetTechniciansOpened(false)} fullHeight>
              <SectionBar
                title={`Select ${
                  technicianAsEmployee ? 'Employee' : 'Technician'
                }${type === 'technicians' ? '(s)' : ''}`}
                subtitle={
                  techniciansIds.length === 1 && techniciansIds[0] === 0
                    ? 'Unassigned'
                    : `${techniciansIds.length} selected`
                }
                actions={[
                  { label: 'Select', onClick: handleTechniciansSelect },
                  {
                    label: 'Close',
                    variant: 'outlined',
                    onClick: handleSetTechniciansOpened(false),
                  },
                ]}
                fixedActions
                footer={
                  <Field
                    className="FieldSearchTechnician"
                    name="searchTechnician"
                    value={searchTechnician}
                    placeholder={`Search ${
                      technicianAsEmployee ? 'employee' : 'technician'
                    }...`}
                    type="search"
                    onChange={setSearchTechnician}
                  />
                }
              />
              <InfoTable data={data} loading={!loadedTechnicians} />
            </Modal>
          )}
        </>
      );
    }
    if (options) {
      const id = `${name}-select-label`;
      return (
        <div className={clsx('Field', className, { white })} style={style}>
          <FormControl
            className={clsx('FieldInput', { compact, disabled })}
            fullWidth
            disabled={disabled}
            error={error}
          >
            <InputLabel id={id}>{inputLabel}</InputLabel>
            <Select
              labelId={id}
              id={`${name}-select`}
              onChange={handleChange}
              {...props}
              value={value}
              readOnly={readOnly}
              multiple={type === 'multiselect'}
              renderValue={
                type === 'multiselect'
                  ? selected => {
                      const { length } = selected as Value[];
                      return `${length} item${length === 1 ? '' : 's'}`;
                    }
                  : undefined
              }
            >
              {options.map(option => {
                const isStringOption = typeof option === 'string';
                const label = isStringOption
                  ? (option as string)
                  : (option as Option).label;
                const valueOption = isStringOption
                  ? (option as string)
                  : (option as Option).value;
                const color = isStringOption
                  ? undefined
                  : (option as Option).color;
                const Icon = isStringOption
                  ? undefined
                  : (option as Option).icon;
                return (
                  <MenuItem
                    key={valueOption}
                    value={valueOption}
                    className="FieldOption"
                    dense
                  >
                    {type === 'multiselect' && (
                      <Checkbox
                        checked={
                          //@ts-ignore
                          value.indexOf(valueOption) > -1
                        }
                        // size="small"
                        color="primary"
                      />
                    )}
                    {color && (
                      <div
                        className="FieldColor"
                        style={{ backgroundColor: color }}
                      />
                    )}
                    {Icon && (
                      <div className="FieldIcon">
                        <Icon />
                      </div>
                    )}
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
            {helper && <FormHelperText>{helper}</FormHelperText>}{' '}
          </FormControl>
          {actions.length > 0 && !actionsInLabel && (
            <Actions
              className="FieldActions"
              actions={actions}
              fixed
              responsiveColumn
            />
          )}
          {actions.length > 0 && actionsInLabel && (
            <Actions
              className="FieldActionsInLabel"
              actions={actions.map(item => ({
                ...item,
                size: 'xsmall',
                compact: true,
              }))}
              fixed
            />
          )}
        </div>
      );
    }
    if (type === 'department') {
      return (
        <div className={clsx('Field', className)} style={style}>
          <DepartmentPicker
            className={clsx('FieldInput', { compact, disabled })}
            withinForm
            renderItem={renderSelectOptions}
            selected={(props.value as unknown) as number}
            onSelect={handleChange}
            disabled={disabled}
            required={required}
            fullWidth
          />
          {actions.length > 0 && !actionsInLabel && (
            <Actions
              className="FieldActions"
              actions={actions}
              fixed
              responsiveColumn
            />
          )}
        </div>
      );
    }
    if (type === 'classCode') {
      return (
        <ClassCodePicker
          className={clsx('FieldInput', className, { compact, disabled })}
          withinForm
          renderItem={renderSelectOptions}
          selected={(props.value as unknown) as number}
          onSelect={handleChange}
          disabled={disabled}
          required={required}
          fullWidth
        />
      );
    }
    const eventAdornment = useMemo(() => {
      if (eventStatus === -1)
        return <BlockIcon className="FieldEventFailure" />;
      if (eventStatus === 0) return <CircularProgress size={20} />;
      if (eventStatus === -2)
        return <HelpOutlineIcon className="FieldEventUnknown" />;
      return <CheckIcon className="FieldEventSuccess" />;
    }, [eventStatus]);
    return (
      <div className={clsx('Field', className, `type-${type}`)} style={style}>
        {type === 'file' && (
          <input
            id={name + '-file'}
            onChange={handleFileChange}
            type="file"
            className="FieldFile"
          />
        )}

        {/*TS-ignoring because of known bug with MUI and Textfields: 
        https://github.com/mui-org/material-ui/issues/2699
        */}
        {/* @ts-ignore */}
        <TextField
          inputRef={functionRef}
          variant={'standard'}
          className={clsx('FieldInput', { compact, disabled })}
          disabled={disabled}
          onChange={handleChange}
          label={inputLabel}
          fullWidth
          InputProps={{
            readOnly: type === 'file' ? true : readOnly,
            startAdornment:
              startAdornment || type === 'file' ? (
                <InputAdornment position="start">
                  {startAdornment}
                  {type === 'file' && (
                    <label htmlFor={name + '-file'}>
                      <Button
                        label="Upload file"
                        className="FieldUpload"
                        disabled={disabled}
                        span
                        compact
                      />
                    </label>
                  )}
                </InputAdornment>
              ) : undefined,
            endAdornment: endAdornment ? (
              <InputAdornment position="end">{endAdornment}</InputAdornment>
            ) : type === 'eventId' ? (
              eventAdornment
            ) : undefined,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          error={error}
          {...props}
          type={type === 'file' ? 'text' : type === 'eventId' ? 'number' : type}
          value={
            type === 'file'
              ? filename || value
              : type === 'eventId'
              ? eventIdValue
              : value // Need to change this value to being the initial value passed
            // done via state
          }
          helperText={helper}
        />
        {actions.length > 0 && !actionsInLabel && (
          <Actions
            className="FieldActions"
            actions={actions}
            fixed
            responsiveColumn
          />
        )}
        {((actions.length > 0 && actionsInLabel) || type === 'eventId') && (
          <Actions
            className="FieldActionsInLabel"
            actions={[
              ...actions,
              ...(type === 'eventId'
                ? [
                    {
                      label: 'Search Service Calls',
                      variant: 'outlined' as const,
                      onClick: handleEventsSearchClicked,
                    },
                  ]
                : []),
            ].map(item => ({
              ...item,
              size: 'xsmall' as const,
              compact: true,
            }))}
            fixed
          />
        )}
        {eventsOpened && (
          <Modal open onClose={handleEventsOpenedToggle(false)} fullScreen>
            <AdvancedSearch
              title="Service Calls Search"
              loggedUserId={0}
              kinds={['serviceCalls']}
              onSelectEvent={handleEventSelect}
              onClose={handleEventsOpenedToggle(false)}
            />
          </Modal>
        )}
      </div>
    );
  },
);
