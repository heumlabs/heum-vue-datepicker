import { DATE_FORMAT } from "@/constants";
import convertDate from "@/utils/convertDate";
import dayjs from "dayjs";
import isValidDate from "./isValidDate";

const validateAndEmitDate = (
  disableDatesBefore?: Date, 
  disableDatesAfter?: Date,
) => (
  value: string, 
  format: string, 
) => {
  const newDateValue = dayjs(value, format);
  if (isValidDate(
      newDateValue,
      disableDatesBefore ? convertDate(disableDatesBefore) : undefined,
      disableDatesAfter ? convertDate(disableDatesAfter) : undefined,
  )) {
    return newDateValue.format(DATE_FORMAT);
  }
  return undefined;
};

export default validateAndEmitDate;
