<template>
  <div class="date-switch">
    <div class="switch-button-box">
      <div class="switch-button" @click="last">
        <el-icon>
          <CaretLeft />
        </el-icon>
        <span style="padding-left: 8px;">{{ getSwitchText(props.type).before }}</span>
      </div>
      <div class="switch-button" @click="next">
        <span style="padding-right: 8px;">{{ getSwitchText(props.type).after }}</span>
        <el-icon>
          <CaretRight />
        </el-icon>
      </div>
    </div>
    <div class="time">
      {{ timeStart }} - {{ timeEnd }}
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import moment from 'moment'

const props = defineProps({
  type: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(["dateChange"]);

let calcTimes = computed(() => {
  return plusTimes.value - minusTimes.value
})
let plusTimes = ref(0);
let minusTimes = ref(0);

watch(() => props.type, () => {
  plusTimes.value = 0;
  minusTimes.value = 0;
  initTime();
})

let timeStart = ref(null)
let timeEnd = ref(null)

onBeforeMount(() => {
  initWeek()
})

onMounted(() => {
  emit('dateChange', { startTime: timeStart.value, endTime: timeEnd.value })
})

const initTime = () => {
  switch (props.type) {
    case 'week': {
      initWeek()
      break;
    }
    case 'month': {
      initMonth();
      break;
    }
    case 'year': {
      initYear();
      break;
    }
  }
  emit('dateChange', { startTime: timeStart.value, endTime: timeEnd.value })
}

const initWeek = () => {
  let weekOfDay = parseInt(moment().format('E'));//计算今天是这周第几天
  let last_monday = moment().startOf('day').subtract(weekOfDay - 1, 'days').toDate();//周一日期
  let last_sunday = moment().startOf('day').subtract(weekOfDay - 7, 'days').toDate();//周日日期
  let mondayTime = moment(last_monday).hours(23).minutes(59).seconds(59).valueOf();
  let sundayTime = moment(last_sunday).hours(23).minutes(59).seconds(59).valueOf();
  timeStart.value = moment(mondayTime).format("YYYY-MM-DD");
  timeEnd.value = moment(sundayTime).format("YYYY-MM-DD");
}

const initMonth = () => {
  let currentDate = moment().format('YYYY-MM-DD');
  timeStart.value = moment(currentDate).startOf("month").format("YYYY-MM-DD");
  timeEnd.value = moment(currentDate).endOf("month").format("YYYY-MM-DD");
}

const initYear = () => {
  let currentDate = moment().format('YYYY-MM-DD');
  timeStart.value = moment(currentDate).startOf('year').format("YYYY-MM-DD");
  timeEnd.value = moment(currentDate).endOf('year').format("YYYY-MM-DD");
}

const next = () => {
  plusTimes.value = plusTimes.value + 1;
  switch (props.type) {
    case 'week': {
      timeStart.value = moment(timeStart.value).add(7, 'days').format('YYYY-MM-DD');
      timeEnd.value = moment(timeEnd.value).add(7, 'days').format('YYYY-MM-DD');
      break;
    }
    case 'month': {
      timeStart.value = moment().month(moment().month() + calcTimes.value).startOf('month').format('YYYY-MM-DD')
      timeEnd.value = moment().month(moment().month() + calcTimes.value).endOf('month').format('YYYY-MM-DD')
      break;
    }
    case 'year': {
      timeStart.value = moment().year(moment().year() + calcTimes.value).startOf('year').format('YYYY-MM-DD')
      timeEnd.value = moment().year(moment().year() + calcTimes.value).endOf('year').format('YYYY-MM-DD')
      break;
    }
  }
  emit('dateChange', { startTime: timeStart.value, endTime: timeEnd.value })
}

const last = () => {
  minusTimes.value = minusTimes.value + 1;
  switch (props.type) {
    case 'week': {
      timeStart.value = moment(timeStart.value).subtract(7, 'days').format('YYYY-MM-DD');
      timeEnd.value = moment(timeEnd.value).subtract(7, 'days').format('YYYY-MM-DD');
      break;
    }
    case 'month': {
      timeStart.value = moment().month(moment().month() + calcTimes.value).startOf('month').format('YYYY-MM-DD')
      timeEnd.value = moment().month(moment().month() + calcTimes.value).endOf('month').format('YYYY-MM-DD')
      break;
    }
    case 'year': {
      timeStart.value = moment().year(moment().year() + calcTimes.value).startOf('year').format('YYYY-MM-DD')
      timeEnd.value = moment().year(moment().year() + calcTimes.value).endOf('year').format('YYYY-MM-DD')
      break;
    }
  }
  emit('dateChange', { startTime: timeStart.value, endTime: timeEnd.value })
}

const getSwitchText = () => {
  let obj = {
    before: '',
    after: ''
  }
  switch (props.type) {
    case 'week': {
      obj.before = '前七天';
      obj.after = '后七天';
      break;
    }
    case 'month': {
      obj.before = '前一月';
      obj.after = '后一月';
      break;
    }
    case 'year': {
      obj.before = '前一年';
      obj.after = '后一年';
      break;
    }
  }
  return obj;
}
</script>

<style scoped lang="scss">
.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.date-switch {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 55%;

  .switch-button-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .switch-button {
    width: 76px;
    height: 24px;
    background-color: #F8F8FF;
    font-size: 12px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #141522;
    margin-right: 16px;
    cursor: pointer;
    padding-left: 8px;
    padding-right: 8px;
    display: flex;
    align-items: center;
  }

  .time {
    font-size: 12px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #9291A5;
    min-width: 4560px;
  }
}
</style>