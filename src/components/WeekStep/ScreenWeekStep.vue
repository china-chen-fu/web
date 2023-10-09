<template>
  <div class="ScreenWeekStep">
    <img
      :src="imgUrl('energyMonitor/stepLeft.png')"
      @click="calcPreWeek"
      alt=""
    />
    <span>{{ beginTime }} ~ {{ endTime }}</span>
    <img
      :src="imgUrl('energyMonitor/stepRight.png')"
      @click="calcNextWeek"
      alt=""
    />
  </div>
</template>

<script>
export default {
  name: 'ScreenWeekStep'
}
</script>
<script setup>
import moment from 'moment'
import imgUrl from '@/utils/loadImg'
import { toRefs, computed } from 'vue'
const props = defineProps({
  beginTime: {
    type: String,
    default: () => ''
  },
  endTime: {
    type: String,
    default: ''
  },
  step: {
    type: Number,
    default: () => 7
  }
})
const emits = defineEmits(['change'])
const { beginTime, endTime } = toRefs(props)
const today = moment(new Date()).format('YYYY-MM-DD')
const noNext = computed(() => {
  return props.endTime === today
})
//向前计算时间-做减法
const calcPreWeek = () => {
  const calcBeginTime = moment(beginTime.value)
    .subtract(props.step, 'days')
    .format('YYYY-MM-DD')
  const calcEndTime = moment(endTime.value)
    .subtract(props.step, 'days')
    .format('YYYY-MM-DD')
  emits('change', { calcBeginTime, calcEndTime })
}
//向后计算时间-做加法
const calcNextWeek = () => {
  if (noNext.value) return
  const calcBeginTime = moment(beginTime.value)
    .add(props.step, 'days')
    .format('YYYY-MM-DD')
  const calcEndTime = moment(endTime.value)
    .add(props.step, 'days')
    .format('YYYY-MM-DD')
  emits('change', { calcBeginTime, calcEndTime })
}
</script>
<style scoped lang="scss">
img {
  width: 20px;
  height: 20px;
  vertical-align: text-bottom;
  cursor: pointer;
}
span {
  margin: 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}
</style>
