<template>
  <div class="new-dashboard">
    <el-row :gutter="48" class="full">
      <el-col :span="20" :xl="20" :lg="20" :md="24" :sm="24" :xs="24" class="full" style="padding-right: 0;">
        <el-row :gutter="24" class="new-top full">
          <el-col :span="8" class="new-top-item full">
            <div class="new-top-content full">
              <div class="flex-start">
                <img src="@/assets/images/new-dashboard-day.png" alt="">
                <div style="padding-left: 7%;">
                  <div class="top-label">日缴费金额：</div>
                  <div class="top-money" style="padding-top: 5%;">¥{{ (payData && payData.dayAmount) ? toThousand(payData.dayAmount) : 0 }} <span style="font-size: 14px;">元</span></div>
                </div>
              </div>
              <div class="flex-start" :style="{ 'margin-top': fitMacStyle.rowOneMT }">
                <div style="padding-left: 3%;">
                  <span class="top-label">日缴费次数：</span>
                  <span class="top-time">{{ (payData && payData.dayRecharge) ? Number(payData.dayRecharge) : 0 }}次</span>
                </div>
                <div style="padding-left: 3%;">
                  <span class="top-label">日退费次数：</span>
                  <span class="top-time">{{ (payData && payData.dayRefund) ? Number(payData.dayRefund) : 0 }}次</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8" class="new-top-item full">
            <div class="new-top-content full">
              <div class="flex-start">
                <img src="@/assets/images/new-dashboard-month.png" alt="">
                <div style="padding-left: 7%;">
                  <div class="top-label">月缴费金额：</div>
                  <div class="top-money" style="padding-top: 5%;">¥{{ (payData && payData.monthAmount) ? toThousand(payData.monthAmount) : 0 }}<span style="font-size: 14px;">元</span></div>
                </div>
              </div>
              <div class="flex-start" :style="{ 'margin-top': fitMacStyle.rowOneMT }">
                <div style="padding-left: 3%;">
                  <span class="top-label">月缴费次数：</span>
                  <span class="top-time">{{ (payData && payData.monthRecharge) ? Number(payData.monthRecharge) : 0 }}次</span>
                </div>
                <div style="padding-left: 3%;">
                  <span class="top-label">月退费次数：</span>
                  <span class="top-time">{{ (payData && payData.monthRefund) ? Number(payData.monthRefund) : 0 }}次</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8" class="new-top-item full">
            <div class="new-top-content full">
              <div class="flex-start">
                <img src="@/assets/images/new-dashboard-year.png" alt="">
                <div style="padding-left: 7%;">
                  <div class="top-label">年缴费金额：</div>
                  <div class="top-money" style="padding-top: 5%;">¥{{ (payData && payData.yearAmount) ? toThousand(payData.yearAmount) : 0 }}<span style="font-size: 14px;">元</span></div>
                </div>
              </div>
              <div class="flex-start" :style="{ 'margin-top': fitMacStyle.rowOneMT }">
                <div style="padding-left: 3%;">
                  <span class="top-label">年缴费次数：</span>
                  <span class="top-time">{{ (payData && payData.yearRecharge) ? Number(payData.yearRecharge) : 0 }}次</span>
                </div>
                <div style="padding-left: 3%;">
                  <span class="top-label">年退费次数：</span>
                  <span class="top-time">{{ (payData && payData.yearRefund) ? Number(payData.yearRefund) : 0 }}次</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="48" class="new-2 full">
          <el-col :span="24" class="new-2-content full">
            <el-row style="margin-top: 1%;">
              <el-col :span="20" class="new-title">缴费趋势示意图</el-col>
              <el-col :span="4" style="text-align: right;">
                <div class="flex">
                  <div></div>
                  <div class="type">
                    <div class="type-item" :class="{ 'type-item-active': typeIndex1 == 'day' }" @click="switchType1('day')">日</div>
                    <div class="type-item" :class="{ 'type-item-active': typeIndex1 == 'month' }" @click="switchType1('month')">月</div>
                    <div class="type-item" :class="{ 'type-item-active': typeIndex1 == 'year' }" @click="switchType1('year')">年</div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div :id="chart1" style="height: 100%;min-height: 200px;margin-top: 1%;"></div>
          </el-col>
        </el-row>
        <el-row :gutter="48" class="new-3 full">
          <el-col :span="12" class="new-3-item full">
            <div class="new-3-content full flex-start">
              <div style="position: relative;width: 30%;text-align: center;">
                <el-progress type="circle" :percentage="(eleUsage && eleUsage.rate) ? Number(eleUsage.rate) : 0" :stroke-width="15" :width="Number(fitMacStyle.rateCircleSize)" :color="'#4960E5'">
                  <span style="color: #4960E5">{{ (eleUsage && eleUsage.rate) ? Number(eleUsage.rate) : 0 }}%</span>
                </el-progress>
                <span style="position: absolute;" :style="{ 'left': fitMacStyle.rateCircleTextL, 'bottom': fitMacStyle.rateCircleTextB }">电表在线率</span>
              </div>
              <div style="width: 70%;height: 100%;padding-right: 3%;" class="flex">
                <div>
                  <div class="new-3-label">今日用电：</div>
                  <div class="new-3-value">{{ (usageData && usageData.dayElectric) ? toThousand(usageData.dayElectric) : 0 }}kwh</div>
                </div>
                <div>
                  <div class="new-3-label">本月用电：</div>
                  <div class="new-3-value">{{ (usageData && usageData.monthElectric) ? toThousand(usageData.monthElectric) : 0 }}kwh</div>
                </div>
                <div>
                  <div class="new-3-label">年度用电：</div>
                  <div class="new-3-value">{{ (usageData && usageData.yearElectric) ? toThousand(usageData.yearElectric) : 0 }}kwh</div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12" class="new-3-item full" style="margin-right: 0px;padding-right: 0;">
            <div class="new-3-content full flex-start">
              <div style="position: relative;width: 30%;text-align: center;">
                <el-progress type="circle" :percentage="(waterUsage && waterUsage.rate) ? Number(waterUsage.rate) : 0" :stroke-width="15" :width="Number(fitMacStyle.rateCircleSize)" :color="'#69DFAE'">
                  <span style="color: #4960E5">{{ (waterUsage && waterUsage.rate) ? Number(waterUsage.rate) : 0 }}%</span>
                </el-progress>
                <span style="position: absolute;" :style="{ 'left': fitMacStyle.rateCircleTextL, 'bottom': fitMacStyle.rateCircleTextB }">水表在线率</span>
              </div>
              <div style="width: 70%;height: 100%;padding-right: 3%;" class="flex">
                <div>
                  <div class="new-3-label">今日用水：</div>
                  <div class="new-3-value">{{ (usageData && usageData.dayWater) ? toThousand(usageData.dayWater) : 0 }}t</div>
                </div>
                <div>
                  <div class="new-3-label">本月用水：</div>
                  <div class="new-3-value">{{ (usageData && usageData.monthWater) ? toThousand(usageData.monthWater) : 0 }}t</div>
                </div>
                <div>
                  <div class="new-3-label">年度用水：</div>
                  <div class="new-3-value">{{ (usageData && usageData.yearWater) ? toThousand(usageData.yearWater) : 0 }}t</div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="48" class="new-2 full">
          <el-col :span="24" class="new-2-content full">
            <el-row style="margin-top: 1%;">
              <el-col :span="20" class="new-title">用能趋势示意图</el-col>
              <el-col :span="4" style="text-align: right;">
                <div class="flex">
                  <div></div>
                  <div class="type">
                    <div class="type-item" :class="{ 'type-item-active': typeIndex2 == 'day' }" @click="switchType2('day')">日</div>
                    <div class="type-item" :class="{ 'type-item-active': typeIndex2 == 'month' }" @click="switchType2('month')">月</div>
                    <div class="type-item" :class="{ 'type-item-active': typeIndex2 == 'year' }" @click="switchType2('year')">年</div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div :id="chart2" style="height: 100%;min-height: 200px;margin-top: 1%;"></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4" :xl="4" :lg="4" :md="24" :sm="24" :xs="24" class="full" style="padding-left: 0;padding-right: 0;">
        <el-row class="full new-right1">
          <el-col class="full" :span="24">
            <div class="full right1-content">
              <div class="new-title">摊位情况</div>
              <div class="right1-inner1">
                <div class="flex" style="margin-bottom: 3%;">
                  <div class="right1-label">商户数：</div>
                  <div class="right1-value">{{ (stallData && stallData.businessNum) ? stallData.businessNum : '' }}</div>
                </div>
                <div class="flex" style="margin-bottom: 3%;">
                  <div class="right1-label">摊位数：</div>
                  <div class="right1-value">{{ (stallData && stallData.stallNum) ? stallData.stallNum : '' }}</div>
                </div>
                <div class="flex" style="margin-bottom: 3%;">
                  <div class="right1-label">入驻率：</div>
                  <div class="right1-value">{{ (stallData && stallData.rate) ? stallData.rate : '' }}</div>
                </div>
              </div>
              <div style="margin-top: 15%;padding-left: 5%;padding-right: 5%;">
                <div class="flex right1-label" style="margin-bottom: 8%;">
                  <div style="width: 20%;">正常</div>
                  <el-progress style="width: 80%;" :text-inside="true" :stroke-width="16" :percentage="normalPercent" color="#69DFAE">
                    <span style="color: #000;">{{ (stallData && stallData.normal) ? stallData.normal : '' }}</span>
                  </el-progress>
                </div>
                <div class="flex right1-label" style="margin-bottom: 8%;">
                  <div style="width: 20%;">报警</div>
                  <el-progress style="width: 80%;" :text-inside="true" :stroke-width="16" :percentage="alarmPercent" color="#ED4A4A">
                    <span style="color: #000;">{{ (stallData && stallData.alarm) ? stallData.alarm : '' }}</span>
                  </el-progress>
                </div>
                <div class="flex right1-label" style="margin-bottom: 8%;">
                  <div style="width: 20%;">离线</div>
                  <el-progress style="width: 80%;" :text-inside="true" :stroke-width="16" :percentage="offlinePercent" color="#F7C990">
                    <span style="color: #000;">{{ (stallData && stallData.offline) ? stallData.offline : '' }}</span>
                  </el-progress>
                </div>
                <div class="flex right1-label" style="margin-bottom: 8%;">
                  <div style="width: 20%;">空置</div>
                  <el-progress style="width: 80%;" :text-inside="true" :stroke-width="16" :percentage="vacantPercent" color="#E6EFFA">
                    <span style="color: #000;">{{ (stallData && stallData.vacant) ? stallData.vacant : '' }}</span>
                  </el-progress>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row class="full new-right2">
          <el-col :span="24">
            <div class="full right1-content">
              <div class="new-title">异常情况</div>
              <div :id="chart4" style="height: 50%;width: 100%;" :style="{ 'margin-top': fitMacStyle.warnContentMT }"></div>
              <div class="new-last flex-start">
                <div class="last-img">
                  <img src="@/assets/images/dashboard-warn.png" alt="">
                </div>
                <div style="margin-left: 10%;">
                  <div class="last-label">当前系统异常总数</div>
                  <div class="last-value" style="margin-top: 7%;">{{ (warnData && warnData.total) ? warnData.total : '' }} <span class="last-unit">个</span> </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>

import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import * as echarts from 'echarts';
import dashboardService from '../../../api/payment/dashboard'
import axios from 'axios'
import toThousand from '../../../utils/thousand';

let payData = ref(null);
let usageData = ref(null);
let warnData = ref(null)
let stallData = ref(null)

let typeIndex1 = ref('day')
let typeIndex2 = ref('day')

let myChart1 = ref(null)
let myChart2 = ref(null)
// let myChart3 = ref(null)
let myChart4 = ref(null)

let chart1 = ref(null)
let chart2 = ref(null)
let chart4 = ref(null)

let eleUsage = ref(null)
let waterUsage = ref(null)

let fitMacStyle = reactive({
  rowOneMT: '2%',
  moneyTendBottom: '36%',
  moneyTendRight: '2%',
  rateCircleSize: '110',
  rateCircleTextL: '30%',
  rateCircleTextB: '-20px',
  energyTendBottom: '38%',
  energyTendRight: '2%',
  warnContentMT: '20%',
  radorOut: '55%',
  radorIn: '55%'
})

let normalPercent = computed(() => {
  if (stallData.value) {
    if (Number(stallData.value.stallNum) !== 0) {
      return (Number(stallData.value.normal) / Number(stallData.value.stallNum)) * 100
    } else {
      return 0
    }
  } else {
    return 0
  }
})

let alarmPercent = computed(() => {
  if (stallData.value) {
    if (Number(stallData.value.stallNum) !== 0) {
      return (Number(stallData.value.alarm) / Number(stallData.value.stallNum)) * 100
    } else {
      return 0
    }
  } else {
    return 0
  }
})

let offlinePercent = computed(() => {
  if (stallData.value) {
    if (Number(stallData.value.stallNum) !== 0) {
      return (Number(stallData.value.offline) / Number(stallData.value.stallNum)) * 100
    } else {
      return 0
    }
  } else {
    return 0
  }
})

let vacantPercent = computed(() => {
  if (stallData.value) {
    if (Number(stallData.value.stallNum) !== 0) {
      return (Number(stallData.value.vacant) / Number(stallData.value.stallNum)) * 100
    } else {
      return 0
    }
  } else {
    return 0
  }
})

const column = [
  {
    label: '表具类型',
    prop: 'deviceType'
  },
  {
    label: '总数',
    prop: 'total'
  },
  {
    label: '在线',
    prop: 'online'
  },
  {
    label: '离线',
    prop: 'offline'
  },
  {
    label: '在线率',
    prop: 'rate'
  },
]

let tableData = ref()

function getDeviceInfo () {
  dashboardService.getDeviceInfo().then(res => {
    res.data[res.data.length - 1].deviceType = '合计';
    tableData.value = res.data;
    res.data.forEach(item => {
      if (item.deviceType.includes('电')) {
        eleUsage.value = item;
      }
      if (item.deviceType.includes('水')) {
        waterUsage.value = item;
      }
    })
  })
}

function getStallInfo () {
  return dashboardService.getStallInfo()
}

function getWarnInfo () {
  return dashboardService.getWarnInfo();
}

function getPayInfo () {
  dashboardService.getPayInfo().then(res => {
    payData.value = res.data;
  })
}

function getUsageInfo () {
  dashboardService.getUsageInfo().then(res => {
    usageData.value = res.data;
  })
}

function getPayChart () {
  return dashboardService.getPayChart(typeIndex1.value)
}

function getUsageChart () {
  return dashboardService.getUsageChart(typeIndex2.value)
}

onBeforeMount(() => {
  getDeviceInfo();
  getPayInfo();
  getUsageInfo();
  chart1.value = 'echarts1' + Date.now() + Math.random();
  chart2.value = 'echarts2' + Date.now() + Math.random();
  chart4.value = 'echarts4' + Date.now() + Math.random();
})

//请求数据
const getEChartData = () => {
  getStallInfo().then((res) => {
    stallData.value = res.data;//摊位情况数据
  }
  )
  getWarnInfo().then((res) => {
    warnData.value = res.data;//异常情况数据
    nextTick(() => {
      initChart4()
    })
  }
  )
  getPayChart().then((res) => {
    nextTick(() => {
      initChart1(res.data)
    })
  }
  )
  getUsageChart().then((res) => {
    nextTick(() => {
      initChart2(res.data)
    })
  }
  )
}
getEChartData()

onMounted(() => {
  setChartHeight();
  setSize()
  window.addEventListener('resize', () => {
    myChart1.resize();
    myChart2.resize();
    // myChart3.resize();
    myChart4.resize();
    setSize()
  })
})

function setSize () {
  let height = document.getElementsByClassName('new-dashboard')[0].offsetHeight;
  if (height <= 726) {
    fitMacStyle.rowOneMT = '0%';
    fitMacStyle.moneyTendBottom = '45%';
    fitMacStyle.moneyTendRight = '3%';
    fitMacStyle.rateCircleSize = 100;
    fitMacStyle.rateCircleTextL = '26%';
    fitMacStyle.rateCircleTextB = '-18px';
    fitMacStyle.energyTendBottom = '45%';
    fitMacStyle.energyTendRight = '3%';
    fitMacStyle.warnContentMT = '8%';
    fitMacStyle.radorOut = '50%';
    fitMacStyle.radorIn = '50%';
  } else {
    fitMacStyle.rowOneMT = '2%'
    fitMacStyle.moneyTendBottom = '36%'
    fitMacStyle.moneyTendRight = '2%'
    fitMacStyle.rateCircleSize = 110;
    fitMacStyle.rateCircleTextL = '30%'
    fitMacStyle.rateCircleTextB = '-20px'
    fitMacStyle.energyTendBottom = '38%';
    fitMacStyle.energyTendRight = '2%';
    fitMacStyle.warnContentMT = '20%';
    fitMacStyle.radorOut = '55%';
    fitMacStyle.radorIn = '55%';
  }
}

const setChartHeight = () => {
  // let chart1 = document.getElementById('chart1');
  // let chart2 = document.getElementById('chart2');
  // let chart3 = document.getElementById('chart3');
  // let chart4 = document.getElementById('chart4');
  // let height = document.getElementsByClassName('row-public')[0].offsetHeight;
  // chart1.style.height = (height - 24) + 'px';
  // chart2.style.height = (height - 24) + 'px';
  // chart3.style.height = (height - 24) + 'px';
  // chart4.style.height = (height - 24) + 'px';
}

const switchType1 = (type) => {
  typeIndex1.value = type;
  getPayChart().then(res => {
    initChart1(res.data)
  })
}
const switchType2 = (type) => {
  typeIndex2.value = type;
  getUsageChart().then(res => {
    initChart2(res.data)
  })
}

const initChart1 = (data) => {
  let xAxis = data.amountList.map(item => {
    return item.timeSub;
  })
  let data1 = data.amountList.map(item => {
    return item.amount;
  })
  let data2 = data.numList.map(item => {
    return item.amount;
  })
  let chartDom = document.getElementById(chart1.value);
  myChart1 = echarts.init(chartDom);
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
    xAxis: {
      type: 'category',
      data: xAxis
    },
    legend: {
      data: ['金额', '笔数'],
      top: '-0.5%',
    },
    yAxis: [
      {
        type: 'value',
        // name: typeIndex1.value == 'day' ? '单位：元' : '单位： 万元',
        name: '单位：元',
        position: 'left',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '单位：笔',
        position: 'right',
        minInterval: 1,
        axisLabel: {
          formatter: '{value}'
        }
      },
    ],
    grid: {
      left: '3%',
      bottom: fitMacStyle.moneyTendBottom,
      top: '15%',
      right: fitMacStyle.moneyTendRight,
    },
    series: [
      {
        data: data1,
        type: 'line',
        name: '金额',
        smooth: true,
        itemStyle: {
          color: '#69DFAE'
        },
      },
      {
        data: data2,
        type: 'line',
        name: '笔数',
        smooth: true,
        yAxisIndex: 1,
        itemStyle: {
          color: '#2D5BFF'
        },
      }
    ]
  }
  option && myChart1.setOption(option);
}

const initChart2 = (data) => {
  let xAxis = data.waterList.map(item => {
    return item.timeSub;
  })
  let data1 = data.electricList.map(item => {
    return item.amount;
  })
  let data2 = data.waterList.map(item => {
    return item.amount;
  })
  let chartDom = document.getElementById(chart2.value);
  myChart2 = echarts.init(chartDom);
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
      },
      position: function (point, params, dom, rect, size) {
        return [point[0] - 100, '10%']
      }
    },
    legend: {
      data: ['用电量', '用水量'],
      top: '-0.5%',
    },
    xAxis: {
      type: 'category',
      data: xAxis
    },
    yAxis: [
      {
        type: 'value',
        // name: typeIndex2.value == 'day' ? '单位：kwh' : '单位：万kwh',
        name: '单位：kwh',
        position: 'left',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '单位：t',
        position: 'right',
        axisLabel: {
          formatter: '{value}'
        }
      },
    ],
    grid: {
      left: '3%',
      bottom: fitMacStyle.energyTendBottom,
      top: '15%',
      right: fitMacStyle.energyTendRight,
    },
    series: [
      {
        data: data1,
        type: 'line',
        name: '用电量',
        smooth: true,
        itemStyle: {
          color: '#69DFAE'
        },
        // areaStyle: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     {
        //       offset: 0,
        //       color: 'rgba(74,25,255,0.6)'
        //     },
        //     {
        //       offset: 1,
        //       color: 'rgba(74,58,255,0.05)'
        //     }
        //   ])
        // }
      },
      {
        data: data2,
        type: 'line',
        name: '用水量',
        yAxisIndex: 1,
        smooth: true,
        itemStyle: {
          color: '#2D5BFF'
        },
      },
    ]
  }
  option && myChart2.setOption(option);
}

const initChart3 = () => {
  let chartDom = document.getElementById('chart3');
  myChart3 = echarts.init(chartDom);
  let option;
  let data = [
    Number(stallData.value.normal),
    Number(stallData.value.alarm),
    Number(stallData.value.offline),
    Number(stallData.value.vacant),
  ]
  let max = Math.max.apply(null, data) + 10;
  option = {
    radar: {
      center: ['55%', '45%'],
      shape: 'circle',
      radius: 70,
      indicator: [
        { name: '正常', max: max },
        { name: '报警', max: max },
        { name: '离线', max: max },
        { name: '空置', max: max },
      ]
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '摊位情况',
        type: 'radar',
        itemStyle: {
          color: 'rgba(255,116,76,0.25)',
          borderColor: '#FF744C'
        },
        areaStyle: {
          color: 'rgba(255,116,76,0.25)',
        },
        data: [
          {
            value: data
          },
        ]
      }
    ]
  };

  option && myChart3.setOption(option);

}

const initChart4 = () => {
  let chartDom = document.getElementById(chart4.value);
  myChart4 = echarts.init(chartDom);
  let option;
  let data = [
    warnData.value.offline,
    warnData.value.forcedShutdown,
    warnData.value.forcedClosing,
    warnData.value.lowAlarm,
    warnData.value.arrearsAlarm,
    warnData.value.chargeFail,
    warnData.value.refundFail
  ]
  let max = Math.max(...data);
  let indicator = [
    { name: '表具离线', max: max },
    { name: '强制关断', max: max },
    { name: '强制合闸', max: max },
    { name: '低量告警', max: max },
    { name: '欠费告警', max: max },
    { name: '缴费失败', max: max },
    { name: '退费失败', max: max },
  ]
  option = {
    radar: {
      center: [fitMacStyle.radorOut, fitMacStyle.radorIn],
      radius: 70,
      indicator: indicator,
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '异常情况',
        type: 'radar',
        itemStyle: {
          color: 'rgba(235,54,54, 1)',
          borderColor: 'rgba(235,54,54, 1)'
        },
        areaStyle: {
          color: 'rgba(235,54,54,0.25)',
        },
        data: [
          {
            value: data,
            symbolSize: 4,
          },
        ]
      }
    ]
  };

  option && myChart4.setOption(option);
}

</script>

<style scoped lang="scss">
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-main {
  background: #F8F8F8;
  padding: 1.26% 1.14% 1.26% 1.14%;
  width: 100vw;
  height: calc(100vh - 70px);

  .row-public {
    padding: 1.29% 0 0 1.3%;
    width: 100%;
    height: 32%;
    background: #FFFFFF;
    border-radius: 4px 4px 4px 4px;
    margin-bottom: 1%;
  }

  .title {
    border-left: 4px solid #4960E5;
    padding-left: 16px;
    height: 10%;
    font-size: 20px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #1C1C28;
  }

  .row1-box {
    .row1-icon {
      text-align: center;
      margin-top: 5%;
    }

    .row1-title {
      font-size: 20px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      text-align: center;
      margin-top: 9%;

      .row1-title-label {
        color: #141522;
      }

      .row1-title-value {
        color: #4960E5;
      }
    }

    .row1-data {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10%;
      margin-left: 8%;

      .row1-date-label {
        font-size: 18px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #141522;
      }

      .row1-date-value {
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #8E92BC;
      }
    }
  }

  .row2-box {
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #8E92BC;

    .row2-icon {
      text-align: center;
      margin-top: 5%;
    }

    .row2-title {
      margin-top: 8%;
      padding-left: 22%;

      .row2-title-item {
        text-align: left;
        margin-bottom: 2.2%;

        .row2-unit {
          font-size: 14px;
          padding-left: 3%;
        }
      }
    }
  }

  .row2-label {
    font-size: 16px;
    color: #8E92BC;
  }

  .row2-value {
    font-size: 20px;
    font-family: Roboto-Bold, Roboto;
    font-weight: bold;
    color: #4960E5;
    padding-left: 4%;
  }

  .row3-left-box {
    width: 100%;
    background-color: #fff;
    padding: 1.3% 1.5% 0 1.5%;
    margin-right: 2.06%;
  }

  .warn-label {
    font-size: 20px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #8E92BC;
  }

  .warn-value {
    font-size: 20px;
    font-family: Roboto-SemiBold, Roboto;
    font-weight: 600;
    color: #FF744C;
  }

}

:deep(.el-table__footer td) {
  text-align: center;
}

.type {
  width: 188px;
  height: 24px;
  display: flex;
  background: #F8F8FF;
  border-radius: 86px 86px 86px 86px;
  margin-right: 10px;

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


.full {
  width: 100%;
  height: 100%;
}

.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.new-dashboard {
  background: #F8F8F8;
  width: 100vw;
  height: calc(100vh - 70px);
  padding: 1.22% 0% 1.22% 1.22%;

  .new-title {
    font-size: 16px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #1A1919;
  }

  .new-top {
    height: 18.48%;

    .new-top-item {
      .new-top-content {
        background-color: #fff;
        padding: 1% 1% 1% 4.5%;
      }

      .top-label {
        font-size: 14px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #8E92BC;
      }

      .top-money {
        font-size: 28px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #4960E5;
      }

      .top-time {
        font-size: 18px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #141522;
      }
    }
  }

  .new-2 {
    height: 28.48%;
    margin-top: 0.8%;
    padding: 1% 0% 0% 1.4%;

    .new-2-content {
      background-color: #fff;
    }
  }

  .new-3 {
    height: 22.48%;
    margin-top: 0.8%;
    padding: 1% 0% 0% 0%;

    .new-3-item {
      .new-3-content {
        background-color: #fff;
      }
    }

    .new-3-label {
      font-size: 16px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: #8E92BC;
    }

    .new-3-value {
      font-size: 20px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: #4960E5;
      margin-top: 20%;
    }
  }

  .new-right1 {
    height: 48%;

    .right1-content {
      background-color: #fff;
      padding: 7% 5% 5% 5%;

      .right1-inner1 {

        margin-top: 8%;
        padding-left: 5%;
        padding-right: 5%;
      }

      .right1-label {
        font-size: 16px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #8E92BC;
      }

      .right1-value {
        font-size: 20px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #141522;
      }
    }
  }

  .new-right2 {
    height: 52%;
    margin-top: 10%;

    .right1-content {
      background-color: #fff;
      padding: 7% 5% 5% 5%;
    }
  }

  .new-last {
    margin-top: 13%;
    padding-left: 10%;
  }

  .last-img {
    border-radius: 50%;
    width: 60px;
    height: 60px;
    text-align: center;
    padding-top: 13px;
    background: rgba(235, 54, 54, 0.2);
  }

  .last-label {
    font-size: 16px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #8E92BC;
  }

  .last-value {
    font-size: 24px;
    font-family: Roboto-SemiBold, Roboto;
    font-weight: 600;
    color: #141522;
  }

  .last-unit {
    font-size: 12px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #141522;
  }

}
</style>
