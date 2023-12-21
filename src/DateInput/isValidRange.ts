import { Dayjs } from 'dayjs';

const isInValidRange = (
  targetDate: Dayjs,
  disableDatesBefore?: Dayjs,
  disableDatesAfter?: Dayjs,
): boolean => {
  if (disableDatesBefore && targetDate.isBefore(disableDatesBefore)) {
    return false;
  }

  if (disableDatesAfter && targetDate.isAfter(disableDatesAfter)) {
    return false;
  }

  return true;
};

export default isInValidRange;
