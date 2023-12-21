import _range from 'lodash/range';
import _chunk from 'lodash/chunk';
import { computed, Ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

import { DATE_FORMAT } from '@/constants.ts';

export interface DateDetail {
  dateString: string;
  year: number;
  month: number;
  date: number;
  day: number;
  hidden: boolean;
  disabled: boolean;
  selected: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
}

const CALENDAR_DATES_SIZE = 7 * 6;

const useCalendarDates = (
  currentDate: Ref<Dayjs | undefined>,
  year: Ref<number>,
  monthIndex: Ref<number>,
  startDate: Ref<Dayjs | undefined>,
  endDate: Ref<Dayjs | undefined>,
  selectedDates: Ref<Dayjs[]>,
  disableDatesBefore: Ref<Dayjs | undefined>,
  disableDatesAfter: Ref<Dayjs | undefined>,
) => {
  const calendarDates = computed<DateDetail[][]>(() => {
    const monthFirstDate = dayjs()
      .set('y', year.value)
      .set('M', monthIndex.value)
      .startOf('M');
    const leftPaddedDatesSize = monthFirstDate.day();
    const calendarFirstDate = monthFirstDate.subtract(leftPaddedDatesSize, 'd');

    const calendarDates = _range(CALENDAR_DATES_SIZE).map((offset) => calendarFirstDate.add(offset, 'd'));

    const convertedDates = calendarDates.map(
      (date) => ({
        dateString: date.format(DATE_FORMAT),
        year: date.year(),
        month: date.month() + 1,
        date: date.date(),
        day: date.day(),
        hidden:
            date.year() !== year.value || date.month() !== monthIndex.value,
        disabled:
            (disableDatesAfter.value
              && date.isAfter(disableDatesAfter.value))
            || (disableDatesBefore.value
              && date.isBefore(disableDatesBefore.value)),
        selected:
            date.isSame(startDate.value)
            || date.isSame(endDate.value)
            || !!selectedDates.value.find((day) => day.isSame(date, 'day')),
        isToday: date.isSame(currentDate.value),
        isStart: date.isSame(startDate.value),
        isEnd: date.isSame(endDate.value),
        inRange:
            startDate.value
            && endDate.value
            && date.isSameOrAfter(startDate.value)
            && date.isSameOrBefore(endDate.value),
      }) as DateDetail,
    );

    return _chunk(convertedDates, 7);
  });

  return calendarDates;
};

export default useCalendarDates;
