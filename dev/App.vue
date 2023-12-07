<script setup lang="ts">
import DatePicker from '@/components/DatePicker';
import dayjs from "dayjs";

const selectedDates = [new Date()];

const disableDatesAfter = dayjs().startOf('day').add(5, 'day').toDate();

const starDate = dayjs().startOf('month');
const endDate = dayjs().startOf('month').add(5, 'day');
</script>

<template>
  <div>
    <div style="display: inline-block;background-color: white;border-radius: 8px;">
      <DatePicker
        :year="2023"
        :month-index="11"
        :selected-dates="selectedDates"
        :start-date="starDate.toDate()"
        :end-date="endDate.toDate()"
        :disable-dates-after="disableDatesAfter"
        @select="handleSelectDate"
      />
    </div>
  </div>
</template>
