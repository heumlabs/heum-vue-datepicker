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

const propsRefs = toRefs(props);

const emit = defineEmits<{
  (e: 'select', dateString: string, event: Event): void;
}>();

const convertedCurrentDate = computed(() => dayjs(propsRefs.currentDate.value).startOf('day'));
const convertedStartDate = computed(() => propsRefs.startDate.value ? dayjs(propsRefs.startDate.value).startOf('day') : undefined);
const convertedEndDate = computed(() => propsRefs.endDate.value ? dayjs(propsRefs.endDate.value).startOf('day') : undefined);
const convertedSelectedDates = computed(() => propsRefs.selectedDates.value.map((date) => dayjs(date).startOf('day')));
const convertedDisableDatesBefore = computed(() => propsRefs.disableDatesBefore.value ? dayjs(propsRefs.disableDatesBefore.value).startOf('day') : undefined);
const convertedDisableDatesAfter = computed(() => propsRefs.disableDatesAfter.value ? dayjs(propsRefs.disableDatesAfter.value).startOf('day') : undefined);

const calendarDates = useCalendarDates(
  convertedCurrentDate,
  propsRefs.year,
  propsRefs.monthIndex,
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
  `${propsRefs.year.value}-${propsRefs.monthIndex.value + 1}`,
  'YYYY-M',
).format(propsRefs.headerFormat.value));
</script>

<template>
  <div class="heum-vue-datepicker">
    <h4 class="header-text">
      {{ headerText }}
    </h4>

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

<style lang="scss" scoped>
button {
  background-color: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  overflow: visible;
  cursor: pointer;
}

.heum-vue-datepicker {
  color: #4D4E58;

  .header-text {
    text-align: center;
    padding: 0 20px;
    font-size: 18px;
    line-height: 20px;
    font-weight: normal;
  }

  .calendar {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(7, 1fr);
    margin-top: 24px;
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
        background-color: #E7EDFF;

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
          background-color: #7B90FF;
          color: #ffffff;
        }

        &.bold {
          font-weight: bold;
        }

        &:disabled {
          color: #CACDD8;
        }

        &.hidden {
          visibility: hidden;
        }
      }
    }
  }
}
</style>
