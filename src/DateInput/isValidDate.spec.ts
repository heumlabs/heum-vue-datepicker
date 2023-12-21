import dayjs from 'dayjs';
import isValidDate from './isValidDate';

const today =  dayjs();
const yesterday = dayjs().subtract(1, 'day');
const tomorrow = dayjs().add(1, 'day');

describe('isValidDate', () => {
  test.each([
    [today, yesterday, tomorrow, true],
    [yesterday, today, tomorrow, false],
    [tomorrow, yesterday, today, false],
    [today, undefined, undefined, true],
    [dayjs('2020asdg14-76awhreerah'), undefined, undefined, false],
    [today, today, tomorrow, true],
    [today, yesterday, today, true],
  ])(
    '%# if targetDate is %s, startDate is %s, and endDate is %s should return %s',
    (targetDate, startDate, endDate, expected) => {
      expect(isValidDate(targetDate, startDate, endDate)).toBe(expected);
    }
  );
});
