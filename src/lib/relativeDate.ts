import { DateTime } from 'luxon';
import { ISODateString } from 'types/common';

export const getRelativeDate = (dateStr: ISODateString) => {
  const now = DateTime.now();
  const date = DateTime.fromISO(dateStr);
  const diff = now.diff(date, ['days']);

  if (diff.days < 1) {
    return 'Today';
  } else if (diff.days < 2) {
    return 'Yesterday';
  } else if (diff.days < 7) {
    return date.toFormat('EEEE');
  } else {
    return date.toFormat('M/d/yy');
  }
};
