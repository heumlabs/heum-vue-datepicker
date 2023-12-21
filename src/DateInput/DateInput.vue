<script lang="ts" setup>
import { ref } from 'vue';

import validateAndEmitDate from './validateAndEmitDate';

const props = defineProps<{
  label: string;
  value: string;
  disableDatesAfter?: Date;
  disableDatesBefore?: Date;
}>();

const emit = defineEmits<{
  (eventName: 'focus', event: Event): void
  (eventName: 'blur', event: Event): void
  (eventName: 'input', value?: string): void
}>();

const inputRef = ref<HTMLInputElement>();
const focused = ref(false);

const handleMouseDownLabel = (e: Event) => {
  if (focused.value) {
    e.preventDefault();
  }
};

const handleFocus = (e: Event) => {
  focused.value = true;
  emit('focus', e);
};

const handleBlur = (e: Event) => {
  focused.value = false;
  emit('blur', e);
};

const handleKeyDownEnter = () => {
  inputRef.value?.blur();
};

const handleClickClear = () => {
  emit('input', undefined);
};

// input handler limit value to numbers and dots
const  handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  target.value = target.value.replace(/([^\d|.])/g, '');
};

// change handler validate date and emit
const handleChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  const getValidDate = validateAndEmitDate(
    props.disableDatesBefore, 
    props.disableDatesAfter
  )

  const formattedDate = getValidDate(value.slice(0, 8).replace(/\./g, ''), 'YYYYMMDD') 
    || getValidDate(value, 'YYYY.M.D');

  emit('input', formattedDate);
};
</script>

<template>
  <div
    class="date-input"
    :class="{ focused }"
  >
    <label
      @mousedown="handleMouseDownLabel"
    >
      {{ label }}
      <input
        ref="inputRef"
        class="tw-text-base md:tw-text-sm focus:tw-outline-none tw-text-G1 placeholder:tw-text-G3"
        placeholder="YYYY.MM.DD"
        :value="value"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleKeyDownEnter"
      >
    </label>
    <button
      :class="{ hidden: !value }"
      @click="handleClickClear"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.25 4.8075L13.1925 3.75L9 7.9425L4.8075 3.75L3.75 4.8075L7.9425 9L3.75
          13.1925L4.8075 14.25L9 10.0575L13.1925 14.25L14.25 13.1925L10.0575 9L14.25 4.8075Z"
        />
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/style.scss';

.date-input {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 4px;
  border: 1px solid var(--heumlabs-vue-datepicker-disabled-color);
  width: 148px;
  height: 50px;
  padding-left: 16px;
  padding-right: 12px;

  &.focused {
    border-color: var(--heumlabs-vue-datepicker-text-color);
  }

  label {
    min-width: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 10px;
    line-height: 12px;
    color: var(--heumlabs-vue-datepicker-label-color);

    input {
      font-size: 14px;
      line-height: 16px;
      font-weight: bold;
      border: none;
      padding: 0;
      margin: 0;
      outline: none;

      &::placeholder {
        color: var(--heumlabs-vue-datepicker-disabled-color);
      }
    }
  }

  button {
    flex-shrink: 0;
    padding: 0;
    width: 18px;
    height: 18px;

    svg {
      fill: var(--heumlabs-vue-datepicker-text-color);
    }

    &.hidden {
      visibility: hidden;
    }
  }
}
</style>
