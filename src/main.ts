import { createApp } from 'vue'
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import App from './App.vue'

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

createApp(App).mount('#app')
