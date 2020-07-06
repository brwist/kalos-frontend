import React, {
  ReactElement,
  useCallback,
  useState,
  useEffect,
  useRef,
  CSSProperties,
} from 'react';
import { User } from '@kalos-core/kalos-rpc/User';
import { makeStyles } from '@material-ui/core/styles';
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
import { format, roundToNearestMinutes } from 'date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker,
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
} from '../../../helpers';
import { ClassCodePicker, DepartmentPicker } from '../../Pickers/';
import { AdvancedSearch } from '../AdvancedSearch';
import './styles.css';

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
  | 'mui-date'
  | 'mui-time'
  | 'technician'
  | 'technicians'
  | 'signature'
  | 'file'
  | 'department'
  | 'classCode'
  | 'hidden'
  | 'color'
  | 'eventId'
  | 'multiselect';

export type Value = string | number;

export type Option = {
  label: string;
  value: string | number;
  color?: string;
};

export type Options = (string | Option)[];

type Style = {
  type?: Type;
  disabled?: boolean;
};

export interface Props<T> extends SchemaProps<T> {
  value?: T[keyof T];
  disabled?: boolean;
  validation?: string;
  readOnly?: boolean;
  className?: string;
  placeholder?: string;
  style?: CSSProperties;
}

export const getDefaultValueByType = (type: Type) => {
  if (type === 'number') return 0;
  if (type === 'time') return '00:00';
  if (type === 'checkbox') return 0;
  return '';
};

const useStyles = makeStyles(theme => ({
  fieldWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    flexShrink: 0,
    flexGrow: 1,
  },
  field: ({ type, disabled }: Style) => ({
    marginTop: 0,
    marginBottom: theme.spacing(2),
    ...(type === 'hidden' ? { display: 'none' } : {}),
    ...(disabled ? { filter: 'grayscale(1)' } : {}),
  }),
  required: {
    color: theme.palette.error.main,
  },
  headline: ({ disabled }: Style) => ({
    backgroundColor: theme.palette.grey[200],
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(-1),
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    marginBottom: theme.spacing(),
    fontWeight: 600,
    flexGrow: 1,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: disabled ? theme.palette.grey[500] : theme.palette.common.black,
  }),
  description: {
    fontWeight: 400,
    marginLeft: theme.spacing(),
    fontSize: 12,
    color: theme.palette.grey[600],
  },
  content: {
    width: '100%',
  },
  technicians: {
    marginTop: theme.spacing(2),
  },
  technician: {
    marginTop: `${theme.spacing(-1.5)}px !important`,
    marginBottom: `${theme.spacing(-1.5)}px !important`,
  },
  searchTechnician: {
    marginTop: `${theme.spacing(-2.5)}px !important`,
    marginBottom: `0px !important`,
  },
  technicalButton: {
    alignSelf: 'flex-start',
  },
  color: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: '50%',
    display: 'inline-flex',
    marginRight: theme.spacing(),
    verticalAlign: 'bottom',
  },
  option: {
    whiteSpace: 'normal',
  },
  actions: {
    marginLeft: theme.spacing(),
  },
  actionsInLabel: {
    position: 'absolute',
    top: -5,
    right: 0,
  },
  hourWrapper: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  hour: {
    display: 'flex',
    flexGrow: 1,
    marginTop: theme.spacing(-2) + 3,
  },
  signatureHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
  },
  signature: {
    display: 'block',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[300],
    position: 'relative',
    boxSizing: 'content-box',
    marginBottom: theme.spacing(2),
    '&:before': {
      display: 'block',
      content: "' '",
      position: 'absolute',
      bottom: theme.spacing(4),
      left: theme.spacing(),
      right: theme.spacing(),
      height: 2,
      backgroundColor: theme.palette.grey[400],
      pointerEvents: 'none',
      zIndex: -1,
    },
  },
  canvas: {
    display: 'block',
  },
  upload: {
    marginLeft: 0,
    height: 25,
  },
  file: {
    display: 'none',
  },
}));

export const Field: <T>(props: Props<T>) => ReactElement<Props<T>> = ({
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
  ...props
}) => {
  const signatureRef = useRef(null);
  const dateTimePart = type === 'date' ? (props.value + '').substr(11, 8) : '';
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
  const loadUserTechnicians = useCallback(async () => {
    const technicians = await loadTechnicians();
    setLoadedTechnicians(true);
    setTechnicians(technicians);
  }, [setLoadedTechnicians, setTechnicians]);
  const handleEventsOpenedToggle = useCallback(
    (opened: boolean) => () => setEventsOpened(opened),
    [setEventsOpened],
  );
  const handleEventSelect = useCallback(
    (event: EventType) => {
      if (onChange) {
        onChange(event.id);
      }
    },
    [onChange],
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
  const classes = useStyles({ type, disabled });
  const handleChange = useCallback(
    ({ target: { value } }) => {
      if (onChange) {
        let newValue = type === 'number' ? +value : value;
        if (type === 'date') {
          newValue = (newValue + ' ' + dateTimePart).trim();
        }
        onChange(newValue);
      }
    },
    [type, dateTimePart, onChange],
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
      {required && !readOnly ? (
        <span className={classes.required}> *</span>
      ) : (
        ''
      )}
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
        <Typography component="div" className={classes.headline}>
          {label}
          {description && (
            <span className={classes.description}>{description}</span>
          )}
          {actions.length > 0 && <Actions actions={actions} fixed />}
        </Typography>
      );
    }
    return (
      <div className={classes.field + ' ' + classes.content + ' ' + className}>
        {content}
        {actions.length > 0 && <Actions actions={actions} fixed />}
      </div>
    );
  }
  if (type === 'signature') {
    return (
      <div className={classes.fieldWrapper + ' ' + className} style={style}>
        <div>
          <div className={classes.signatureHeader}>
            <InputLabel shrink>{inputLabel}</InputLabel>
            <Button
              label="Clear"
              size="xsmall"
              variant="outlined"
              compact
              onClick={handleSignatureClear}
            />
          </div>
          <span className={classes.signature}>
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                width: 300,
                height: 160,
                className: classes.canvas,
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
        className={[classes.fieldWrapper, classes.hourWrapper, className].join(
          ' ',
        )}
        style={style}
      >
        <InputLabel shrink>{inputLabel}</InputLabel>
        <div className={classes.hour}>
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
          />
          <Field
            name={`${name}_minutes`}
            value={trailingZero(minutes)}
            options={['00', '15', '30', '45']}
            onChange={minutes =>
              handleTimeChange(trailingZero(hour), minutes, ampm)
            }
            style={{ width: 'calc(100% / 3' }}
          />
          <Field
            name={`${name}_ampm`}
            value={ampm}
            options={['AM', 'PM']}
            onChange={ampm =>
              handleTimeChange(trailingZero(hour), minutes, ampm)
            }
            style={{ width: 'calc(100% / 3' }}
          />
        </div>
      </div>
    );
  }

  if (type === 'mui-date') {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          className={classes.field + ' ' + className}
          label={inputLabel}
          value={new Date((props.value as unknown) as string)}
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
          className={classes.field + ' ' + className}
          label={inputLabel}
          value={new Date((props.value as unknown) as string)}
          onChange={value =>
            handleChange({
              target: {
                value: format(value || new Date(), 'yyyy-MM-dd HH:mm'),
              },
            })
          }
          minutesStep={15}
          disabled={disabled}
          fullWidth
        />
      </MuiPickersUtilsProvider>
    );
  }

  if (type === 'checkbox') {
    return (
      <FormControl
        className={classes.field + ' ' + className}
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
              if (!technician) return '...';
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
                  className={classes.technician}
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
                    className={classes.technician}
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
          className={classes.field + ' ' + className}
          fullWidth
          disabled={disabled}
          error={error}
        >
          <InputLabel htmlFor={id}>{inputLabel}</InputLabel>
          <div className={classes.technicians}>
            <Input
              id={id}
              value={valueTechnicians}
              readOnly
              fullWidth
              multiline
              endAdornment={
                <InputAdornment
                  position="end"
                  className={classes.technicalButton}
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
              title={`Select Technician${type === 'technicians' ? '(s)' : ''}`}
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
              footer={
                <Field
                  className={classes.searchTechnician}
                  name="searchTechnician"
                  value={searchTechnician}
                  placeholder="Search technician..."
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
      <div className={classes.fieldWrapper + ' ' + className} style={style}>
        <FormControl
          className={classes.field}
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
              return (
                <MenuItem
                  key={valueOption}
                  value={valueOption}
                  className={classes.option}
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
                      className={classes.color}
                      style={{ backgroundColor: color }}
                    />
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
            className={classes.actions}
            actions={actions}
            fixed
            responsiveColumn
          />
        )}
        {actions.length > 0 && actionsInLabel && (
          <Actions
            className={classes.actionsInLabel}
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
      <DepartmentPicker
        className={classes.field + ' ' + className}
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
  if (type === 'classCode') {
    return (
      <ClassCodePicker
        className={classes.field + ' ' + className}
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
  return (
    <div className={classes.fieldWrapper + ' ' + className} style={style}>
      {type === 'file' && (
        <input
          id={name + '-file'}
          onChange={handleFileChange}
          type="file"
          className={classes.file}
        />
      )}
      <TextField
        className={classes.field}
        disabled={disabled}
        onChange={handleChange}
        label={inputLabel}
        fullWidth
        InputProps={{
          readOnly: type === 'file' || type === 'eventId' ? true : readOnly,
          startAdornment:
            startAdornment || type === 'file' ? (
              <InputAdornment position="start">
                {startAdornment}
                {type === 'file' && (
                  <label htmlFor={name + '-file'}>
                    <Button
                      label="Upload file"
                      className={classes.upload}
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
          ) : undefined,
        }}
        InputLabelProps={{
          shrink: true,
        }}
        error={error}
        {...props}
        type={type === 'file' ? 'text' : type === 'eventId' ? 'number' : type}
        value={type === 'file' ? filename || value : value}
        helperText={helper}
      />
      {actions.length > 0 && !actionsInLabel && (
        <Actions
          className={classes.actions}
          actions={actions}
          fixed
          responsiveColumn
        />
      )}
      {((actions.length > 0 && actionsInLabel) || type === 'eventId') && (
        <Actions
          className={classes.actionsInLabel}
          actions={[
            ...actions,
            ...(type === 'eventId'
              ? [
                  {
                    label: 'Search Service Calls',
                    variant: 'outlined' as const,
                    onClick: handleEventsOpenedToggle(true),
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
};
