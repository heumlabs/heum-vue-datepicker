import { Dayjs } from 'dayjs';

const isValidDate = (
  targetDate: Dayjs,
  disableDatesBefore?: Dayjs,
  disableDatesAfter?: Dayjs,
): boolean => {
  if (!targetDate.isValid()) {
    return false;
  } 

  if (
    disableDatesBefore 
    && disableDatesBefore.isValid() 
    && targetDate.isBefore(disableDatesBefore)
  ) {
    return false;
  }

  if (
    disableDatesAfter 
    && disableDatesAfter.isValid()
    && targetDate.isAfter(disableDatesAfter)
  ) {
    return false;
  }

  return true;
};

export default isValidDate;
