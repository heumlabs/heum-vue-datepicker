import { Dayjs } from 'dayjs';
import convertDate from "@/utils/convertDate.ts";

const isInValidRange = (
  targetDate: Dayjs,
  disableDatesBefore?: Date,
  disableDatesAfter?: Date,
): boolean => {
  if (disableDatesBefore && targetDate.isBefore(convertDate(disableDatesBefore))) {
    return false;
  }

  if (disableDatesAfter && targetDate.isAfter(convertDate(disableDatesAfter))) {
    return false;
  }

  return true;
};

export default isInValidRange;
