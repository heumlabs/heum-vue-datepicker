import dayjs from "dayjs";

const convertDate = (date?: Date) => {
  return dayjs(date).startOf('day');
};

export default convertDate;