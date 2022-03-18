import { DateRange } from '../compiled-protos/common_pb';
import { TimesheetDepartment } from '../TimesheetDepartment';

export function makeDateRange(field: string, start: string, end?: string) {
  const res = new DateRange();
  const reg = new RegExp(/>= |> |< |<= |like |= /g);
  const dateReg = new RegExp(/\d{4}-\d{2}-\d{2}/g);
  if (reg.test(start) && dateReg.test(start)) {
    res.setStart(start);
  } else {
    console.warn(
      'Invalid date string detected; date strings must contain a comparison operator following a date in the format YYYY-MM-DD'
    );
  }
  res.setField(field);
  res.setStart(start);
  if (end) {
    res.setEnd(end);
  }
  return res;
}

export function getPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    try {
      const geo = window.navigator.geolocation;
      geo.getCurrentPosition(pos => {
        resolve(pos);
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 *
 * @param dateOnly if true, returns only the date portion YYYY-MM-DD
 * @returns a timestamp in the format YYYY-MM-DD HH:MM:SS
 */
export function timestamp(dateOnly = false, date?: Date) {
  const dateObj = date || new Date();
  let month = `${dateObj.getMonth() + 1}`;
  if (month.length === 1) {
    month = `0${month}`;
  }
  let day = `${dateObj.getDate()}`;
  if (day.length === 1) {
    day = `0${day}`;
  }
  let hour = `${dateObj.getHours()}`;
  if (hour.length === 1) {
    hour = `0${hour}`;
  }
  let minute = `${dateObj.getMinutes()}`;
  if (minute.length === 1) {
    minute = `0${minute}`;
  }
  let second = `${dateObj.getSeconds()}`;
  if (second.length === 1) {
    second = `0${second}`;
  }

  if (dateOnly) {
    return `${dateObj.getFullYear()}-${month}-${day}`;
  }
  return `${dateObj.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function unique(original: any[]) {
  let container: any[] = [];
  for (const el of original) {
    if (!container.includes(el)) {
      container.push(el);
    }
  }
  return container;
}

export const getDepartmentName = (d?: TimesheetDepartment): string =>
  d ? `${d.getValue()} - ${d.getDescription()}` : '';

export function getMimeType(fileName: string) {
  const arr = fileName.split('.');
  const ext = arr[arr.length - 1];
  if (ext === 'pdf') {
    return 'application/pdf';
  } else if (ext === 'doc' || ext === 'docx') {
    return 'application/msword';
  } else if (ext === 'png') {
    return 'image/png';
  } else if (ext === 'jpg' || ext === 'jpeg') {
    return 'image/jpeg';
  }
}

export function b64toBlob(b64Data: string, fileName: string) {
  const sliceSize = 512;
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  const contentType = getMimeType(fileName);

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export type OrderDir = 'ASC' | 'DESC';

export default {
  DateRange,
  makeDateRange,
  getPosition,
  timestamp,
  unique,
  getDepartmentName,
  getMimeType,
  b64toBlob,
};
