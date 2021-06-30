import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {
  TransactionAccount,
  TransactionAccountClient,
} from '@kalos-core/kalos-rpc/TransactionAccount';
import {
  TimesheetDepartment,
  TimesheetDepartmentClient,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { ClassCode, ClassCodeClient } from '@kalos-core/kalos-rpc/ClassCode';
import { ENDPOINT } from '../../../constants';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';

const MaxCacheItemAge: number = 1; // Max age of the cache item in days before it removes itself
const UseTests = false;
const VersionNumber = 0; // Mostly unused but left in in case we want to isolate old cache keys
// from new ones at some point

interface props<R, T> {
  selected: number;
  disabled?: boolean;
  required?: boolean;
  withinForm?: boolean;
  hideInactive?: boolean;
  fullWidth?: boolean;
  className?: string;
  reqObj?: {
    new (): R;
  };
  client?: {
    new (endpoint: string): Client<R, T>;
  };
  onSelect?(e: React.SyntheticEvent<HTMLSelectElement> | number): void;
  test?(item: T): boolean;
  sort?(a: T, b: T): number;
  filter?(a: T): boolean;
  renderItem(item: T): JSX.Element;
}

interface Client<R, T> {
  BatchGet(req: R): Promise<BatchRes<T>>;
  Get(req: R): Promise<T>;
  Delete(req: R): Promise<T>;
  Create(req: R): Promise<T>;
  Update(req: R): Promise<T>;
}

type BatchRes<T> = { getResultsList(): T[]; getTotalCount(): number };

interface state<T> {
  list: T[];
}

class Picker<R, T> extends React.PureComponent<props<R, T>, state<T>> {
  Client?: Client<R, T>;
  req?: R;
  key: string;
  ver: number;
  label: string;
  className?: string;
  fullWidth?: boolean;
  constructor(props: props<R, T>, label: string, key: string, ver: number) {
    super(props);
    this.state = {
      list: [],
    };
    this.label = label;
    this.key = key;
    this.ver = ver;
    this.handleSelect = this.handleSelect.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  handleSelect(e: React.SyntheticEvent<HTMLSelectElement>) {
    const id = parseInt(e.currentTarget.value);
    if (this.props.onSelect) {
      try {
        this.props.onSelect(this.props.withinForm ? e : id);
      } catch (err) {
        console.log(err);
      }
    }
  }

  async fetchData() {
    const res = await this.Client?.BatchGet(this.req!);
    // console.log(res);
    return res!.getResultsList();
  }

  componentDidMount() {
    this.handleCache();
  }

  async handleCache() {
    const cache = new Cache<T[]>(this.key, this.ver, this.fetchData);
    const data = cache.getItem();
    if (!data) {
      const freshData = await cache.update();
      if (freshData) {
        this.setState({ list: freshData });
      }
    } else {
      this.setState({ list: data });
    }
  }

  render() {
    let list = this.state.list;
    if (this.props.sort) {
      list = this.state.list.sort(this.props.sort);
    }

    if (this.props.filter) {
      list = list.filter(this.props.filter);
    }
    return (
      <FormControl
        className={this.props.className}
        required={this.props.required}
        style={{ marginBottom: 10 }}
        disabled={this.props.disabled}
        fullWidth={this.props.fullWidth}
      >
        <InputLabel htmlFor={`${this.label}-picker`}>{this.label}</InputLabel>
        <NativeSelect
          value={this.props.selected}
          onChange={this.handleSelect}
          IconComponent={undefined}
          inputProps={{ id: `${this.label}-picker` }}
        >
          <option value={0}>Select {this.label}</option>
          {list.map(this.props.renderItem)}
        </NativeSelect>
      </FormControl>
    );
  }
}

class Cache<T> {
  key: string;
  version: number;
  fetchData: () => Promise<T>;
  constructor(key: string, version: number, fetchFn: () => Promise<T>) {
    this.key = `${key}_${version}_|${this.getDateToday().toISOString()}`;
    this.version = version;
    this.fetchData = fetchFn;
    // You can use this to test the functionality of cache deletion after time
    // transaction and TransactionUser will have the tests pop up in the console
    // logs when ran in the browser
    if (UseTests) {
      this.testCacheDateRemoval('DEPARTMENT_LIST', 7000, 2, false);
      this.testGetAllLocalStorageData();
    }
    this.deleteOldItems();
  }

  testGetAllLocalStorageData = () => {
    let arr = [];
    for (var key in localStorage) {
      arr.push(key);
    }

    console.log(arr);
  };

  testCacheDateRemoval = (
    keyToUse: string,
    version: number,
    daysOld: number,
    showRemainingKeys: boolean,
  ) => {
    console.log('STARTING CACHE TEST.');

    console.log('Checking MaxCacheItemAge...');

    if (MaxCacheItemAge < 0) {
      console.error('FAILED! MaxCacheItemAge should not be less than 0.');
      return;
    }

    console.log('%cMaxCacheItemAge PASSED!', 'color: cyan');

    const removeItems = daysOld <= MaxCacheItemAge ? false : true;

    if (daysOld <= MaxCacheItemAge) {
      console.log(
        '%cThe item created in testCacheDateRemoval is not old enough to be removed.',
        'color: yellow',
      );
    }

    if (daysOld < 0) {
      console.log(
        '%cThe item created in testCacheDateRemoval is less than 0 days old - testing edge case.',
        'color: yellow',
      );
    }

    const date = new Date();
    date.setDate(date.getDate() - daysOld);

    const dataAsStr = JSON.stringify(
      'This is a test cache item, remove me if you see me.',
    );
    console.log(
      'Created test string: ' + `${keyToUse}_${version}_|${date.toISOString()}`,
    );
    localStorage.setItem(
      `${keyToUse}_${version}_|${date.toISOString()}`,
      dataAsStr,
    );

    this.testDeleteOldCache(`${keyToUse}_${version}_|${date.toISOString()}`);

    let itemGotten = localStorage.getItem(
      `${keyToUse}_${version}_|${date.toISOString()}`,
    );
    if (itemGotten) {
      if (removeItems) {
        console.error(
          'FAILED! Items left over by deleteOldCache with value of ' +
            itemGotten,
        );
        return;
      }
      // Checks for days old greater than 0 because the keys regenerate when this occurs -
      // the item will not be left behind because it was regenerated
    } else if (!removeItems && daysOld > 0) {
      console.error(
        'FAILED! Items were not left over by deleteOldCache when they were not old enough to be deleted. ',
      );
    }

    console.log('%ctestDeleteOldCache PASSED!', 'color: cyan');

    console.log(
      'Created test string: ' + `${keyToUse}_${version}_|${date.toISOString()}`,
    );
    localStorage.setItem(
      `${keyToUse}_${version}_|${date.toISOString()}`,
      dataAsStr,
    );

    console.log('Testing deleteOldItems...');
    try {
      this.deleteOldItems();
    } catch (err) {
      console.error('FAIL: deleteOldItems - ' + err);
    }

    itemGotten = localStorage.getItem(
      `${keyToUse}_${version}_|${date.toISOString()}`,
    );

    if (itemGotten) {
      if (removeItems) {
        console.error(
          'FAILED! Items left over by deleteOldItems with value of ' +
            itemGotten,
        );
        return;
      }
      // Checks for days old greater than 0 because the keys regenerate when this occurs -
      // the item will not be left behind because it was regenerated
    } else if (!removeItems && daysOld > 0) {
      console.error(
        'FAILED! Items were not left over by deleteOldItems when they were not old enough to be deleted. ',
      );
    }

    if (showRemainingKeys) {
      for (var item in localStorage) {
        console.log(
          `%c"${item}" remains in the list of keys.`,
          'color: yellow',
        );
      }
    }
    console.log(
      '%cPASS - all tests have passed for the Cache class.',
      'color: cyan',
    );
  };

  testDeleteOldCache = (key: string) => {
    console.log('Testing cache deletion. key to test: ' + key);
    const itemDateSplit = key.split('|');
    const itemDateStr = itemDateSplit[itemDateSplit.length - 1];
    console.log('Item date string: ' + itemDateStr);
    let dateToday: Date, itemDate: Date;
    try {
      dateToday = this.getDateToday();
      itemDate = new Date(itemDateStr);
      if (isNaN(itemDate.getTime())) {
        // invalid, throw an error and let catch get it
        throw new RangeError(
          'Invalid date detected in getItemAge caused by outdated cache values',
        );
      }
    } catch (err) {
      // Cache date is not valid, clear those values associated with the keys
      // and regenerate them
      this.generateDateItem(key);
      dateToday = this.getDateToday();
      itemDate = this.getDateToday();
    }
    console.log(
      'Days between: ' + this.getDaysBetweenDates(dateToday, itemDate),
    );
    // if older than MaxCacheAge day old, delete it
    try {
      this.deleteOldCache(key);
    } catch (err) {
      console.error('FAIL: testDeleteOldCache - ' + err);
    }
  };

  getDaysBetweenDates = (startDate: Date, endDate: Date) => {
    return (
      (Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
      ) -
        Date.UTC(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
        )) /
      86400000 // Magic # converts to days
    );
  };

  getItemAge = (key: string): number => {
    const itemDateSplit = key.split('|');
    const itemDateStr = itemDateSplit[itemDateSplit.length - 1];
    const dateToday = this.getDateToday();
    let itemDate: Date;
    try {
      itemDate = new Date(itemDateStr);
      if (isNaN(itemDate.getTime())) {
        // invalid, throw an error and let catch get it
        throw new RangeError(
          'Invalid date detected in getItemAge caused by outdated cache values',
        );
      }
    } catch (err) {
      // Cache date is not valid, clear those values associated with the keys
      // and regenerate them
      this.generateDateItem(key);
      itemDate = this.getDateToday();
    }

    var nDays = this.getDaysBetweenDates(dateToday, itemDate);

    if (nDays < 0) {
      // Found a bad cache key
      this.generateDateItem(key);
      itemDate = this.getDateToday();
      nDays = this.getDaysBetweenDates(dateToday, itemDate);
      console.log('Generated new key');
    }

    return nDays;
  };

  deleteOldCache = (key: string) => {
    // if older than MaxCacheAge day old, delete it
    if (this.getItemAge(key) > MaxCacheItemAge) {
      if (UseTests) console.log('Removing cache key : ' + key);
      localStorage.removeItem(key);
    }
  };

  getDateYesterday = (): Date => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  };

  getDateToday = (): Date => {
    return new Date();
  };

  getItem = () => {
    let dataAsStr = localStorage.getItem(
      `${this.key}_${this.version}_|${this.getDateToday().toISOString()}`,
    );

    if (dataAsStr == null) {
      // Convert the old key to new key params
      this.generateDateItem(`${this.key}_${this.version}`);
    }
    if (!dataAsStr || dataAsStr === '') {
      return;
    } else {
      try {
        const data: T = JSON.parse(dataAsStr);
        return data;
      } catch (err) {
        console.log(err);
        return;
      }
    }
  };

  // Generates a new item with a date at the end of the key from
  // an old item that has no date
  generateDateItem = (oldKey: string) => {
    // get old value
    const dataAsStr = localStorage.getItem(oldKey);
    let data: T;
    if (dataAsStr != null) {
      data = JSON.parse(String(dataAsStr));
    } else {
      this.removeItem(oldKey); // get rid of the old one
      return;
    }

    this.setItem(data); // Set the new item
    this.removeItem(oldKey); // get rid of the old one
  };

  setItem = (data: T) => {
    const dataAsStr = JSON.stringify(data);
    try {
      localStorage.setItem(
        `${this.key}_${this.version}_|${this.getDateToday().toISOString()}`,
        dataAsStr,
      );
      return true;
    } catch (err) {
      console.error(err);
      console.log(`'${dataAsStr}' was inputted as the data.`);
      return false;
    }
  };

  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(err);
    }
  }

  deleteOldItems = () => {
    for (var key in localStorage) {
      try {
        if (key.startsWith(key)) {
          const split = key.split('|');
          if (
            this.getDaysBetweenDates(this.getDateToday(), new Date(split[1])) >
            MaxCacheItemAge
          ) {
            this.deleteOldCache(key);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // not my proudest naming, but you know what it does ;)
  // Also not the most optimized function, but I figure we will
  // probably never get too many keys
  findCacheItemWithListNameAndVersion = (listNameAndVersionNum: string) => {
    for (var key in localStorage) {
      try {
        if (UseTests) console.log('Looking for ' + `${listNameAndVersionNum}`);
        if (key.startsWith(`${listNameAndVersionNum}`)) {
          if (UseTests) console.log('Success');
          return key;
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (UseTests) console.log('Failed');
    // couldn't find that key
    return null;
  };

  clearHistory = () => {
    let version = VersionNumber - 1;
    while (version > 0) {
      try {
        for (var key in localStorage) {
          if (key.startsWith(`${key}_${version}`)) {
            localStorage.removeItem(
              // Regex will allow any alphanumeric value after the string
              key,
            );
          }
        }
      } catch (err) {
        console.error(err);
      }
      version--;
    }
  };

  // Will cause an error the first time about routes -
  // goes away on refresh once those are regenerated
  clearLocalStorage = () => localStorage.clear();

  update = async () => {
    this.clearHistory();
    const freshData = await this.fetchData();
    try {
      this.deleteOldItems();
      const strData = JSON.stringify(freshData);
      const listNameAndVersionNumber = this.key.split('|')[0];
      // Attempts to find the key via the name and version number
      const attemptAtKey = this.findCacheItemWithListNameAndVersion(
        listNameAndVersionNumber,
      );

      if (attemptAtKey) {
        localStorage.setItem(`${attemptAtKey}`, strData);
      } else {
        localStorage.setItem(`${this.key}`, strData);
      }
      return freshData;
    } catch (err) {
      console.error(err);
    }
  };
}

export class AccountPicker extends Picker<
  TransactionAccount,
  TransactionAccount
> {
  constructor(props: props<TransactionAccount, TransactionAccount>) {
    super(props, 'Purchase Type', 'COST_CENTER_LIST', VersionNumber);
    this.Client = new TransactionAccountClient(ENDPOINT);
    this.req = new TransactionAccount();
    this.req.setIsActive(1);
  }
}

export class DepartmentPicker extends Picker<
  TimesheetDepartment,
  TimesheetDepartment
> {
  constructor(props: props<TimesheetDepartment, TimesheetDepartment>) {
    super(props, 'Department', 'DEPARTMENT_LIST', VersionNumber);
    this.Client = new TimesheetDepartmentClient(ENDPOINT);
    this.req = new TimesheetDepartment();
    this.req.setIsActive(1);
  }
}

export class ClassCodePicker extends Picker<ClassCode, ClassCode> {
  constructor(props: props<ClassCode, ClassCode>) {
    super(props, 'Class Code', 'CLASS_CODE_LIST', VersionNumber);
    this.Client = new ClassCodeClient(ENDPOINT);
    this.req = new ClassCode();
    this.req.setIsActive(true);
  }
}

export class EmployeePicker extends Picker<User, User> {
  constructor(props: props<User, User>) {
    super(props, 'Employee', 'EMPLOYEE_LIST_X', VersionNumber);
    this.Client = new UserClient(ENDPOINT);
    this.req = new User();
    this.req.setIsEmployee(1);
    this.req.setIsActive(1);
    this.req.setIsHvacTech(1);
    this.req.setOverrideLimit(true);
  }
}
