import { DATE_FORMAT } from "@/constants";
import convertDate from "@/utils/convertDate";
import dayjs from "dayjs";
import isInValidRange from "./isValidRange";

const validateAndEmitDate = (
  value: string, 
  format: string, 
  disableDatesBefore?: Date, 
  disableDatesAfter?: Date,
) => {
  const newDateValue = dayjs(value, format);
  if (
    newDateValue.isValid()
    && isInValidRange(
      newDateValue,
      disableDatesBefore ? convertDate(disableDatesBefore) : undefined,
      disableDatesAfter ? convertDate(disableDatesAfter) : undefined,
    )
  ) {
    return newDateValue.format(DATE_FORMAT);
  }
  return undefined;
};

export default validateAndEmitDate;
