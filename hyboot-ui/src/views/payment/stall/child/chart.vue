<template>
  <div class="chart-box">
    <div class="chart-top">
      <dateSwitch :type="typeIndex" @dateChange="updateChart"></dateSwitch>
      <div class="type">
        <div class="type-item" :class="{ 'type-item-active': typeIndex == 'week' }" @click="switchType('week')">周</div>
        <div class="type-item" :class="{ 'type-item-active': typeIndex == 'month' }" @click="switchType('month')">月</div>
        <div class="type-item" :class="{ 'type-item-active': typeIndex == 'year' }" @click="switchType('year')">年</div>
      </div>
    </div>
    <div v-if="props.data.number" :id="('chart' + props.data.id)" :key="componentKey" class="chart"></div>
    <div v-else style="text-align: center;padding-top: 10%;">暂无数据</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import moment from 'moment'
import { onBeforeMount, onMounted } from 'vue';
import dateSwitch from './dateSwitch.vue'
import * as echarts from 'echarts';
import stallService from '../../../../api/payment/stall';

const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})

let typeIndex = ref('week')
let myChart = null;
let componentKey = ref(-1)

onMounted(() => {
  window.addEventListener('resize', () => {
    if (myChart) {
      myChart.resize();
    }
  })
})

// watch(() => props.data.id, (newValue) => {
//   updateChart()
// })

watch(() => typeIndex.value, (newValue) => {

})

const updateChart = (data) => {
  if (props.data.number) {
    let params = {
      deviceNumber: props.data.number,
      timeType: typeIndex.value,
      startTime: data.startTime,
      endTime: data.endTime
    }
    stallService.getTendChart(params).then(res => {
      initChart(res.data);
    })
  }
}

const initChart = (data) => {
  let chartDom = document.getElementById('chart' + props.data.id);
  myChart = echarts.init(chartDom);
  let serData = data.map(item => {
    return item.usage
  })
  let unit = props.data.deviceType.includes('电') ? 'kwh' : 't';
  let weekOption = [
    {
      type: 'category',
      data: data.map(d => d.time),
      axisTick: {
        show: true,
        alignWithLabel: true,
      },
      axisLabel: {
        show: true,
        interval: (_, value) => moment(value).get('hour') === 12,
        formatter: function (value) {
          let weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
          let myDate = new Date(Date.parse(moment(value).format('yyyy-MM-DD')));
          let num = moment(value).format('yyyy-MM-DD');
          let arr = data.filter(item => item.time.includes(num));
          let t = 0;
          for (let i = 0; i < arr.length; i++) {
            const n = arr[i].usage;
            t += Number(n);
          }
          return (
            moment(value).format('MM-DD') +
            weekDay[myDate.getDay()] +
            `\n ${t.toFixed(2)}` + `${unit}`
          );
        }
      },
      splitLine: {
        show: true,
        interval: (_, value) => moment(value).get('hour') === 0,
        lineStyle: {
          type: 'dashed',
          color: ['#000'],
        },
      },
    }];
  let commonOption = {
    type: 'category',
    data: data.map(item => {
      return item.time
    })
  }
  let xAxisOptions = typeIndex.value == 'week' ? weekOption : commonOption;
  let option = {
    tooltip: {
      trigger: 'axis',
      triggerOn: 'mousemove',
      axisPointer: {
        type: 'none',
      },
      backgroundColor: '#1E1B39',
      borderColor: '#1E1B39',
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: xAxisOptions,
    yAxis: {
      type: 'value'
    },
    grid: {
      left: '8%',
      bottom: '18%',
      top: '10%',
      right: '5%',
    },
    series: [
      {
        data: serData,
        type: 'line',
        smooth: true,
        itemStyle: {
          color: 'rgba(74,25,255,0.9)'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(74,25,255,0.6)'
            },
            {
              offset: 1,
              color: 'rgba(74,58,255,0.05)'
            }
          ])
        }
      }
    ]
  }

  option && myChart.setOption(option);
}

const switchType = (type) => {
  typeIndex.value = type;
  componentKey.value = Math.random()
}

</script>

<style lang="scss" scoped>
.chart-box {
  width: 100%;

  .chart-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .type {
    width: 188px;
    height: 24px;
    display: flex;
    background: #F8F8FF;
    border-radius: 86px 86px 86px 86px;

    .type-item {
      width: 48px;
      height: 24px;
      border-radius: 7px 7px 7px 7px;
      text-align: center;
      font-size: 12px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: #9291A5;
      line-height: 24px;
      margin-left: 18px;
      cursor: pointer;
    }

    .type-item-active {
      background: #4960E5;
      color: #F8F8FF;
    }
  }

  .chart {
    width: 100%;
    height: 225px;
    min-height: 225px;
  }
}

:deep(.custom-tooltip-box) {
  background-color: #1E1B39;
  border-radius: 4px 4px 4px 4px;
  color: #fff;
}
</style>