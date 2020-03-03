type Colors = {
  [key: string]: string,
};

export const colorsMapping: Colors = {
  'Requested': '#EFC281',
  'Confirmed': '#FEFDB9',
  'Enroute': '#FFFF00',
  'On Call': '#88EDB3',
  'Delayed':  '#07CCEC',
  'Incomplete': '#BFD4FF',
  'Part on order': '#AA93EA',
  'Pend Sched': '#FD9834',
  'Canceled': '#E74C3C',
  'Completed': '#55E552',
  'Admin Review': '#55DD55',
  'ffbfbf': '#FFBFBF',
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
