<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { DATE_FORMAT } from '@/constants.ts';
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
    disableDatesAfter?: Date;
    disableDatesBefore?: Date;
  }>(),
  {
    headerFormat: 'YYYY.M',
    dayLabels: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    todayLabel: 'Today',
    startDate: undefined,
    endDate: undefined,
    selectedDates: undefined,
    disableDatesAfter: undefined,
    disableDatesBefore: undefined,
  },
);

const propsRefs = toRefs(props);

const emit = defineEmits<{
  (e: 'click-next', forceState: boolean): void;
  (e: 'click-prev'): void;
  (e: 'select', value: Dayjs, event: Event): void;
}>();

const currentDate = dayjs().startOf('d');
const { calendarDetailDates } = useCalendarDates(
  currentDate,
  propsRefs.year,
  propsRefs.monthIndex,
  propsRefs.startDate,
  propsRefs.endDate,
  propsRefs.selectedDates,
  propsRefs.disableDatesBefore,
  propsRefs.disableDatesAfter,
);

const handleClickDate = (e: Event) => {
  const target = e.target as HTMLElement;

  if (target.tagName !== 'BUTTON') return;

  const { datestring } = target.dataset as { datestring: string };

  emit('select', dayjs(datestring, DATE_FORMAT), e);
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

      <template v-for="datesRow in calendarDetailDates">
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
              v-if="date.isToday"
              class="today-label"
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
  display: inline-block;
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
      width: 42px;

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
        padding-top: 8px;
        font-size: 14px;
        line-height: 16px;

        .today-label {
          font-size: 9px;
          line-height: 10px;
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
