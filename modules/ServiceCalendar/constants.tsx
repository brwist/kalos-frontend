type Colors = {
  [key: string]: string,
};

export const colorsMapping: Colors = {
  Requested: '#EFC281',
  Confirmed: '#FEFDB9',
  Enroute: '#FFFF00',
  'On Call': '#88EDB3',
  Delayed:  '#07CCEC',
  Incomplete: '#BFD4FF',
  'Part on order': '#AA93EA',
  'Pend Sched': '#FD9834',
  Canceled: '#E74C3C',
  'Admin Review': '#55DD55',
  ffbfbf: '#FFBFBF',
  completed: '#55E552',
  reminder: '#FFBFBF',
  timeoff: '#000000',
  timeoff10: '#4d4dff',
  '*': '',
};

type Repeats = {
  [key: string]: string,
};

export const repeatsMapping: Repeats = {
  '1': 'daily',
  '2': 'weekly',
  '3': 'bi-weekly',
  '4': 'monthly',
  '5': 'yearly',
  '6': 'Mon-Fri',
  '7': 'Sat-Sun',
};

type RequestTypes = {
  [key: string]: string,
};

export const requestTypeMappping: RequestTypes = {
  '7': 'Sick',
  '8': 'Time off',
  '9': 'Vacation',
};
