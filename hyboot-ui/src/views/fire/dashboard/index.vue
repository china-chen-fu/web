<template>
  <div class="dashboard-main">
    <div class="top">
      <div class="top-item" style="padding-left: 0px;width: calc(20% - 24px);">
        <div class="top-item-content">
          <img src="@/assets/images/fire/warn-today.png" alt="">
          <div class="content-text">
            <div>
              <span class="num-class">{{ (topData.todayWarn) ? topData.todayWarn : 0 }}</span>
              <span class="unit-class">次</span>
            </div>
            <div class="desc-class">今日未处理告警</div>
          </div>
        </div>
      </div>
      <div class="top-item">
        <div class="top-item-content">
          <img src="@/assets/images/fire/warn-total.png" alt="">
          <div class="content-text">
            <div>
              <span class="num-class">{{ (topData.warnTotal) ? topData.warnTotal : 0 }}</span>
              <span class="unit-class">次</span>
            </div>
            <div class="desc-class">未处理告警总数</div>
          </div>
        </div>
      </div>
      <div class="top-item top-item-long">
        <div class="top-item-content">
          <div class="flex top-right-item">
            <img src="@/assets/images/fire/region-num.png" alt="">
            <div class="content-text">
              <div>
                <span class="num-class">{{ (topData.regionNum) ? topData.regionNum : 0 }}</span>
                <span class="unit-class">个</span>
              </div>
              <div class="desc-class">区域数量</div>
            </div>
          </div>
          <div class="flex top-right-item">
            <img src="@/assets/images/fire/pdc-num.png" alt="">
            <div class="content-text">
              <div>
                <span class="num-class">{{ (topData.pdcNum) ? topData.pdcNum : 0 }}</span>
                <span class="unit-class">个</span>
              </div>
              <div class="desc-class">配电柜数量</div>
            </div>
          </div>
          <div class="flex top-right-item">
            <img src="@/assets/images/fire/loop-num.png" alt="">
            <div class="content-text">
              <div>
                <span class="num-class">{{ (topData.loopNum) ? topData.loopNum : 0 }}</span>
                <span class="unit-class">个</span>
              </div>
              <div class="desc-class">回路数量</div>
            </div>
          </div>
          <div class="flex top-right-item">
            <img src="@/assets/images/fire/device-num.png" alt="">
            <div class="content-text">
              <div>
                <span class="num-class">{{ (topData.deviceNum) ? topData.deviceNum : 0 }}</span>
                <span class="unit-class">个</span>
              </div>
              <div class="desc-class">设备数量</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="middle">
      <div class="middle-left">
        <div class="left-content flex">
          <div class="md-con-title">告警类型排名</div>
          <div class="md-con-unit">单位：次</div>
        </div>
        <div class="progress">
          <div class="progress-item" v-for="(item, index) in middleData.warnTypeSort">
            <div class="progress-title" style="display: flex;align-items: center;">
              <img v-if="index == 0" src="@/assets/images/fire/first.svg" alt="">
              <img v-if="index == 1" src="@/assets/images/fire/second.svg" alt="">
              <img v-if="index == 2" src="@/assets/images/fire/third.svg" alt="">
              <span style="padding-left: 5px;">{{ item.name }}</span>
            </div>
            <el-progress style="width: 70%;" :stroke-width="14" :percentage="Number(item.percentage)">
              <span></span>
            </el-progress>
            <div class="progress-text">{{ item.num }}次</div>
          </div>
        </div>
      </div>
      <div class="middle-right">
        <div style="color: #1A1919;font-size: 16px;font-weight: 500;">告警日趋势</div>
        <div :id="chart1Id" style="height: calc(100% - 24px);"></div>
      </div>
    </div>

    <div class="middle">
      <div class="middle-left">
        <div class="left-content flex">
          <div class="md-con-title">区域告警排名</div>
          <div class="md-con-unit">单位：次</div>
        </div>
        <div class="progress">
          <div class="progress-item" v-for="(item, index) in bottomData.warnData" :key="index">
            <div class="progress-title" style="display: flex;align-items: center;">
              <img v-if="index == 0" src="@/assets/images/fire/first.svg" alt="">
              <img v-if="index == 1" src="@/assets/images/fire/second.svg" alt="">
              <img v-if="index == 2" src="@/assets/images/fire/third.svg" alt="">
              <div v-if="index == 3" class="rest-rank">4</div>
              <div v-if="index == 4" class="rest-rank">5</div>
              <span style="padding-left: 5px;">{{ item.name }}</span>
            </div>
            <el-progress style="width: 70%;" :stroke-width="14" :percentage="item.percentage">
              <span></span>
            </el-progress>
            <div class="progress-text">{{ item.num }}次</div>
          </div>
        </div>
      </div>
      <div class="middle-right">
        <div style="color: #1A1919;font-size: 16px;font-weight: 500;">告警月趋势</div>
        <div :id="chart2Id" style="height: calc(100% - 24px);"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import * as echarts from 'echarts';
import dashboardService from '../../../api/fire/dashboard';

let topData = reactive({
  todayWarn: 0,
  warnTotal: 0,
  regionNum: 0,
  pdcNum: 0,
  loopNum: 0,
  deviceNum: 0
})

let middleData = reactive({
  warnTypeSort: [],
  warnDayTrend: {
    data: [],
    xAxis: []
  }
})

let bottomData = reactive({
  warnData: [],
  warnMonthTrend: {
    data: [],
    xAxis: []
  }
})

let myChart1 = ref(null)
let myChart2 = ref(null)
let chart1Id = ref(null);
let chart2Id = ref(null);

onBeforeMount(() => {
  chart1Id.value = 'echarts1' + Date.now() + Math.random();
  chart2Id.value = 'echarts2' + Date.now() + Math.random();
  getRegion();
  getWarnTypeRank();
  getWarnRegionRank();
  getWarnDayTrend();
  getWarnMonthTrend();
})

onMounted(() => {
  window.addEventListener('resize', () => {
    myChart1.resize();
    myChart2.resize();
  })
})

function getRegion () {
  dashboardService.getRegionData().then(res => {
    if (res.data) {
      topData.deviceNum = res.data.deviceNum;
      topData.loopNum = res.data.loopNum;
      topData.regionNum = res.data.regionNum;
      topData.todayWarn = res.data.todayAlarm;
      topData.warnTotal = res.data.totalAlarm;
      topData.pdcNum = res.data.cabinetNum;
    }
  })
}

function getWarnTypeRank () {
  dashboardService.getWarnTypeRank().then(res => {
    if (res.data) {
      let sum = 0;
      res.data.forEach(item => {
        sum += item.num;
      })
      middleData.warnTypeSort = [];
      res.data.forEach(item => {
        middleData.warnTypeSort.push({
          name: item.name,
          num: item.num,
          percentage: item.num == 0 ? 0 : ((item.num) / sum).toFixed(2) * 100
        })
      })
    }
  })
}

function getWarnRegionRank () {
  dashboardService.getWarnRegionRank().then(res => {
    if (res.data) {
      let sum = 0;
      res.data.forEach(item => {
        sum += item.num;
      })
      bottomData.warnData = [];
      res.data.forEach(item => {
        bottomData.warnData.push({
          name: item.regionName,
          num: item.num,
          percentage: item.num == 0 ? 0 : ((item.num) / sum).toFixed(2) * 100
        })
      })
    }
  })
}

function getWarnDayTrend () {
  dashboardService.getWarnDayTrend().then(res => {
    if (res.data) {
      let xData = res.data.map(item => {
        return item.timeSub
      });
      let offline = res.data.map(item => {
        return item.offline
      });
      let electric = res.data.map(item => {
        return item.electric
      });
      let temperature = res.data.map(item => {
        return item.temperature
      });
      let yData = [
        { name: '设备离线', value: offline },
        { name: '剩余电流超限', value: electric },
        { name: '三项温度超限', value: temperature },
      ];
      loadDayTrend(xData, yData);
    }
  })
}

function getWarnMonthTrend () {
  dashboardService.getWarnMonthTrend().then(res => {
    if (res.data) {
      let xData = res.data.map(item => {
        return item.timeSub
      });
      let offline = res.data.map(item => {
        return item.offline
      });
      let electric = res.data.map(item => {
        return item.electric
      });
      let temperature = res.data.map(item => {
        return item.temperature
      });
      let yData = [
        { name: '设备离线', value: offline },
        { name: '剩余电流超限', value: electric },
        { name: '三项温度超限', value: temperature },
      ];
      loadMonthTrend(xData, yData);
    }
  })
}

const chartOptions = (xData, yData) => {
  let series = [];
  if (yData && yData.length) {
    yData.forEach(item => {
      let obj = {
        data: null,
        name: '',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        },
        itemStyle: {
          opacity: 0
        },
        // areaStyle: {
        //   color: {
        //     type: 'linear',
        //     x: 0,
        //     y: 0,
        //     x2: 0,
        //     y2: 1,
        //     colorStops: [{
        //       offset: 0, color: 'rgba(59, 130, 246, .33)'
        //     }, {
        //       offset: 0.5, color: 'rgba(170, 199, 246, .33)'
        //     }, {
        //       offset: 1, color: 'rgba(255, 255, 255, .33)'
        //     }],
        //     global: false
        //   }
        // },
      }
      obj.data = item.value;
      obj.name = item.name;
      series.push(obj)
    })
  }
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function (params) {
        let result = params[0].name;
        for (let i = 0; i < params.length; i++) {
          result += '<br/>' + params[i].marker + "<div style='display: inline-block;width: 120px'>" + params[i].seriesName + "</div>" + '<span style="padding-left: 70px">' + params[i].value + '次'
        }
        return result
      }
    },
    grid: {
      top: '30',
      left: "5%",
      right: "2%",
      bottom: "24",
      containLabel: true,
    },
    xAxis: {
      axisTick: {
        show: false
      },
      type: 'category',
      axisPointer: {
        show: true
      },
      data: [...xData]
    },
    yAxis: {
      type: 'value',
      position: "right",
      name: "单位（次）",
      axisPointer: {
        show: false
      },
      minInterval: 1
    },
    series: series
  }
}

function loadDayTrend (xData, yDataArr) {
  let chartDom = document.getElementById(chart1Id.value);
  myChart1 = echarts.init(chartDom);
  let option = chartOptions(xData, yDataArr);
  option && myChart1.setOption(option);
}

function loadMonthTrend (xData, yDataArr) {
  let chartDom = document.getElementById(chart2Id.value);
  myChart2 = echarts.init(chartDom);
  let option = chartOptions(xData, yDataArr);
  option && myChart2.setOption(option);
}
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-main {
  padding-top: 24px;
  padding-left: 24px;
  min-width: 1400px;
  height: calc(100vh - 70px);
  box-sizing: border-box;
  background-color: #F6F9FD;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    width: 4px;
    background: #bbb;
    border-radius: 2px;
  }

  .top {
    width: 100%;
    height: 20%;
    max-height: 144px;
    display: flex;
    flex-wrap: nowrap;

    .top-item {
      padding: 24px;
      padding-top: 0px;
      padding-right: 0px;
      height: 100%;
      width: calc(20%);
      border-radius: 8px 8px 8px 8px;
      box-sizing: border-box;

      .top-item-content {
        width: 100%;
        background-color: #fff;
        height: 100%;
        display: flex;
        align-items: center;
        padding-left: 24px;

        .content-text {
          margin-left: 24px;
        }

        .num-class {
          font-size: 40px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #2F3133;
        }

        .unit-class {
          font-size: 18px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #2F3133;
        }

        .desc-class {
          font-size: 14px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #8D9094;
        }

        .top-right-item {
          width: 25%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }
    }

    .top-item-long {
      width: calc(60%);
    }
  }

  .progress-text {
    font-size: 14px;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
    color: #2F3133;
    width: 10%;
  }

  .progress {
    margin-top: 24px;

    .progress-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 24px;
      margin-bottom: 24px;

      .progress-title {
        width: 20%;
        font-size: 14px;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2F3133;
      }
    }
  }

  .middle {
    display: flex;
    flex-wrap: nowrap;
    max-height: 328px;
    height: 38.8%;
    margin-bottom: 24px;

    .middle-left {
      flex: 0 0 600px;
      width: 600px;
      background: #ffffff;
      height: 100%;
      margin-right: 24px;

      .left-content {
        padding: 16px 24px 0 24px;

        .md-con-title {
          font-size: 16px;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          font-weight: 500;
          color: #1A1919;
        }

        .md-con-unit {
          color: #8D9094;
          font-size: 12px;
        }
      }
    }

    .middle-right {
      flex: 1;
      margin-right: 24px;
      // height: 328px;
      height: 100%;
      background: #ffffff;
      padding: 16px 24px 0 24px;
    }
  }

  .rest-rank {
    width: 20px;
    height: 20px;
    background-color: #DBEAFE;
    color: #60A5FA;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
  }
}

@media screen and (max-width:1500px) {
  .num-class {
    font-size: 36px !important;
  }

  .unit-class {
    font-size: 14px !important;
  }

  .desc-class {
    font-size: 12px !important;
  }
}

@media screen and (max-width:1400px) {
  .num-class {
    font-size: 32px !important;
  }

  .unit-class {
    font-size: 14px !important;
  }

  .desc-class {
    font-size: 12px !important;
  }
}
</style>