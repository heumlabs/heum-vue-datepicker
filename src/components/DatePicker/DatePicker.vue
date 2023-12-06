<script lang="ts" setup>
import { toRefs } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import useCalendarDates from './useCalendarDates';

const props = withDefaults(defineProps<{
  year: number;
  monthIndex: number;
  startDate?: Dayjs;
  endDate?: Dayjs;
  selectedDates?: Dayjs[];
  disableDatesAfter?: Dayjs;
  disableDatesBefore?: Dayjs;
}>(), {
  startDate: undefined,
  endDate: undefined,
  selectedDates: undefined,
  disableDatesAfter: undefined,
  disableDatesBefore: undefined,
});

const propsRefs = toRefs(props);

const emit = defineEmits<{
  (e: 'click-next', forceState: boolean): void
  (e: 'click-prev'): void
  (e: 'select', value: Dayjs, event: Event): void
}>();

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

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

  emit('select', dayjs(datestring, 'YYYY.M.D'), e);
};
</script>

<template>
  <div>
    <h4 class="tw-text-center tw-text-md tw-py-5">
      {{ year }}년 {{ monthIndex + 1 }}월
    </h4>
    <table>
      <thead>
        <tr>
          <th
            v-for="weekDay in weekDays"
            :key="weekDay"
          >
            {{ weekDay }}
          </th>
        </tr>
      </thead>
      <tbody @click.capture="handleClickDate">
        <tr
          v-for="(datesRow, rowIndex) in calendarDetailDates"
          :key="`${year}-${monthIndex}-${rowIndex}`"
          class="tw-text-center tw-mb-1"
        >
          <td
            v-for="(date) in datesRow"
            :key="date.dateString"
            class="table-date"
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
              >오늘</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
table {
  thead {
    th {
      @apply tw-text-sm tw-font-normal tw-h-6;
    }
  }

  tbody {
    td {
      @apply tw-relative tw-p-0 tw-m-0;

      .in-range {
        @apply tw-absolute tw-top-1 tw-bottom-0 tw-left-0 tw-right-0 tw-bg-B4;

        &.start {
          @apply tw-left-1/2;
        }

        &.end {
          @apply tw-right-1/2;
        }
      }

      button {
        @apply tw-relative tw-flex tw-flex-col tw-items-center tw-pt-2 tw-mt-1
          tw-w-[42px] tw-h-[42px] tw-rounded-md tw-text-sm tw-text-G1 tw-ml-[1px];

        .today-label {
          @apply tw-text-[9px] tw-leading-[10px] tw-pointer-events-none;
        }

        &:hover {
          @apply tw-text-B1;
        }

        &.bold {
          @apply tw-font-bold;
        }

        &.invert {
          @apply tw-text-white tw-bg-B2;
        }

        &:disabled {
          @apply tw-text-G3;
        }

        &.hidden {
          visibility: hidden;
        }
      }
    }
  }
}
</style>
