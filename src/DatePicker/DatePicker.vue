<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import dayjs from 'dayjs';
import useCalendarDates from './useCalendarDates';

const props = withDefaults(
  defineProps<{
    year: number;
    monthIndex: number;
    headerFormat?: string;
    dayLabels?: [string, string, string, string, string, string, string];
    todayLabel?: string;
    startDate?: Date;
    endDate?: Date;
    selectedDates?: Date[];
    currentDate?: Date;
    disableDatesAfter?: Date;
    disableDatesBefore?: Date;
    hidePrevButton?: boolean;
    hideNextButton?: boolean;
    disablePrevButton?: boolean;
    disableNextButton?: boolean;
  }>(),
  {
    headerFormat: 'YYYY.M',
    dayLabels: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    todayLabel: 'Today',
    startDate: undefined,
    endDate: undefined,
    selectedDates: () => [],
    currentDate: () => dayjs().startOf('day').toDate(),
    disableDatesAfter: undefined,
    disableDatesBefore: undefined,
  },
);

const { year, monthIndex } = toRefs(props);

const emit = defineEmits<{
  (e: 'select', dateString: string, event: Event): void;
  (e: 'click-prev'): void;
  (e: 'click-next'): void;
}>();

const convertedCurrentDate = computed(() => dayjs(props.currentDate).startOf('day'));
const convertedStartDate = computed(() => props.startDate
    ? dayjs(props.startDate).startOf('day')
    : undefined);
const convertedEndDate = computed(() => props.endDate
    ? dayjs(props.endDate).startOf('day')
    : undefined);
const convertedSelectedDates = computed(() => props.selectedDates
    .map((date) => dayjs(date)
    .startOf('day')));
const convertedDisableDatesBefore = computed(() => props.disableDatesBefore
    ? dayjs(props.disableDatesBefore).startOf('day')
    : undefined);
const convertedDisableDatesAfter = computed(() => props.disableDatesAfter
    ? dayjs(props.disableDatesAfter).startOf('day')
    : undefined);

const calendarDates = useCalendarDates(
  convertedCurrentDate,
  year,
  monthIndex,
  convertedStartDate,
  convertedEndDate,
  convertedSelectedDates,
  convertedDisableDatesBefore,
  convertedDisableDatesAfter,
);

const handleClickDate = (e: Event) => {
  const target = e.target as HTMLElement;

  if (target.tagName !== 'BUTTON') return;

  const { datestring } = target.dataset as { datestring: string };

  emit('select', datestring, e);
};

const headerText = computed(() => dayjs(
  `${year.value}-${monthIndex.value + 1}`,
  'YYYY-M',
).format(props.headerFormat));
</script>

<template>
  <div class="heum-vue-datepicker">
    <div class="header">
      <button
        class="prev"
        @click="$emit('click-prev')"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 3.75L6.25 10L12.5 16.25"
            stroke="#000000"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <h4>
        {{ headerText }}
      </h4>
      <button
        class="next"
        @click="$emit('click-next')"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 16.25L13.75 10L7.5 3.75"
            stroke="#000000"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <div
      class="calendar"
      @click.capture="handleClickDate"
    >
      <p
        v-for="weekDay in dayLabels"
        :key="weekDay"
        class="day-label"
      >
        {{ weekDay }}
      </p>

      <template v-for="datesRow in calendarDates">
        <div
          v-for="date in datesRow"
          :key="date.dateString"
          class="date"
        >
          <div
            v-if="date.inRange && !date.hidden"
            class="in-range"
            :class="{ start: date.isStart, end: date.isEnd }"
          />
          <button
            :class="{
              invert: date.selected,
              bold: date.inRange || date.selected,
              hidden: date.hidden,
            }"
            :disabled="date.disabled"
            :data-datestring="date.dateString"
          >
            {{ date.date }}
            <span
              class="today-label"
              :class="{ visible: date.isToday }"
            >{{
              todayLabel
            }}</span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --heumlabs-vue-datepicker-text-color: #4D4E58;
  --heumlabs-vue-datepicker-disabled-color: #CACDD8;
  --heumlabs-vue-datepicker-select-color: #7B90FF;
  --heumlabs-vue-datepicker-range-color: #E7EDFF;
}
</style>

<style lang="scss" scoped>
.heum-vue-datepicker {
  button {
    background-color: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    overflow: visible;
    cursor: pointer;
  }

  color: var(--heumlabs-vue-datepicker-text-color);

  .header{
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      width: 20px;
      height: 20px;

      svg > path {
        stroke: var(--heumlabs-vue-datepicker-text-color);
      }

      &:disabled {
        svg > path {
          stroke: var(--heumlabs-vue-datepicker-disabled-color);
        }
      }
    }

    h4 {
      margin: 0;
      text-align: center;
      font-size: 18px;
      line-height: 20px;
      font-weight: normal;
      padding-top: 24px;
      padding-bottom: 24px;
    }
  }

  .calendar {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(7, 1fr);
    font-size: 14px;
    line-height: 16px;

    .day-label {
      text-align: center;
      font-size: 14px;
      line-height: 16px;
    }

    .date {
      position: relative;
      height: 42px;
      width: 100%;
      min-width: 42px;

      .in-range {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: var(--heumlabs-vue-datepicker-range-color);

        &.start {
          left: 50%;
        }

        &.end {
          right: 50%;
        }
      }

      button {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        border-radius: 6px;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        line-height: 16px;

        .today-label {
          font-size: 9px;
          line-height: 10px;
          visibility: hidden;

          &.visible {
            visibility: visible;
          }
        }

        &.invert {
          background-color: var(--heumlabs-vue-datepicker-select-color);
          color: #ffffff;
        }

        &.bold {
          font-weight: bold;
        }

        &:disabled {
          color: var(--heumlabs-vue-datepicker-disabled-color);
          cursor: not-allowed;
        }

        &.hidden {
          visibility: hidden;
        }
      }
    }
  }
}
</style>
