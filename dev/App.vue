<script setup lang="ts">
import {ref} from "vue";
import DatePicker from '@/DatePicker';
import DateInput from "@/DateInput/DateInput.vue";

const yearMonthIndex = ref({
  year: 2023,
  monthIndex: 11,
});

const startDate = new Date('1995-12-17T03:24:00');
const endDate = new Date('1995-12-23T03:24:00');

const disableDatesAfter = new Date('1995-12-26T18:24:00');

const customCurrentDate = new Date('1995-12-25T13:07:00');
const handleSelectDate = (dateString: string, event: Event) => {
  console.log(dateString, event);
};

const startDateInput = ref('');
const handleInputStartDate = (dateString?: string) => {
  startDateInput.value = dateString?.replace(/-/g, '.') || '';
};

const handleClickNext = () => {
  yearMonthIndex.value = {
    year: yearMonthIndex.value.year + (yearMonthIndex.value.monthIndex === 11 ? 1 : 0),
    monthIndex: (yearMonthIndex.value.monthIndex + 1) % 12,
  };
};

const handleClickPrev = () => {
  yearMonthIndex.value = {
    year: yearMonthIndex.value.year - (yearMonthIndex.value.monthIndex === 0 ? 1 : 0),
    monthIndex: yearMonthIndex.value.monthIndex === 0 ? 11 : yearMonthIndex.value.monthIndex - 1,
  };
}
</script>

<template>
  <div style="padding: 128px;">
    <div style="display: inline-block;background-color: white;border-radius: 8px;box-shadow: 0 4px 10px rgba(165,165,165,0.2);">
      <DatePicker
        :year="yearMonthIndex.year"
        :month-index="yearMonthIndex.monthIndex"
        :start-date="startDate"
        :end-date="endDate"
        :disable-dates-after="disableDatesAfter"
        :current-date="customCurrentDate"
        @select="handleSelectDate"
        @click-next="handleClickNext"
        @click-prev="handleClickPrev"
      />
    </div>

    <br><br>

    <div style="display: inline-block;background-color: white;border-radius: 8px;box-shadow: 0 4px 10px rgba(165,165,165,0.2);">
      <DateInput
        label="Start Date"
        :value="startDateInput"
        @input="handleInputStartDate"
      />
    </div>
  </div>
</template>

<!--<style lang="scss">-->
<!--// apply custom theme-->
<!--:root {-->
<!--  &#45;&#45;heumlabs-vue-datepicker-text-color: #000000;-->
<!--  &#45;&#45;heumlabs-vue-datepicker-disabled-color: #DDDDDD;-->
<!--  &#45;&#45;heumlabs-vue-datepicker-select-color: #FFB534;-->
<!--  &#45;&#45;heumlabs-vue-datepicker-range-color: #FBF6EE;-->
<!--}-->
<!--</style>-->
