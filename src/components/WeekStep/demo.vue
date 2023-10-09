<template>
  <!--  WeekStep组件已在main.js中注册,页面直接使用，无需引入-->
  <WeekStep
    :beginTime="beginTime"
    :endTime="endTime"
    @change="handleDateChange"
  ></WeekStep>
</template>

<script>
export default {
  name: 'demo'
}
</script>
<script setup>
import { ref } from 'vue'
import * as moment from 'moment'
const beginTime = ref(moment().subtract(6, 'days').format('YYYY-MM-DD'))
const endTime = ref(moment().format('YYYY-MM-DD'))
const handleDateChange = (e) => {
  beginTime.value = e['calcBeginTime']
  endTime.value = e['calcEndTime']
}
</script>
<style scoped></style>
