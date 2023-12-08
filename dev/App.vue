<script setup lang="ts">
import DatePicker from '@/DatePicker';

const startDate = new Date('1995-12-17T03:24:00');
const endDate = new Date('1995-12-23T03:24:00');

const disableDatesAfter = new Date('1995-12-26T18:24:00');

const customCurrentDate = new Date('1995-12-25T13:07:00');
const handleSelectDate = (dateString: string, event: Event) => {
  console.log(dateString, event);
};
</script>

<template>
  <div style="padding: 128px;">
    <div style="display: inline-block;background-color: white;border-radius: 8px;box-shadow: 0 4px 10px rgba(165,165,165,0.2);">
      <DatePicker
        :year="1995"
        :month-index="11"
        :start-date="startDate"
        :end-date="endDate"
        :disable-dates-after="disableDatesAfter"
        :current-date="customCurrentDate"
        @select="handleSelectDate"
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
