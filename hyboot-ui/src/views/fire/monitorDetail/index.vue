<template>
  <div class="detail-main">
    <div class="content">
      <Split style="height: 100%;width: 100%;" ratio="1/5">
        <template #one>
          <div class="left">
            <div class="left-title" style="display: flex;align-items: center;margin-bottom: 32px;">
              <el-icon>
                <ArrowLeft />
              </el-icon>
              <span class="left-back" @click="back">返回</span>
            </div>
            <div style="text-align: center;">
              <img width="48" height="48" v-if="info.loopStatus == '正常'" src="@/assets/images/fire/loop-zc.svg" alt="">
              <img width="48" height="48" v-if="info.loopStatus == '告警'" src="@/assets/images/fire/loop-warn.svg" alt="">
              <img width="48" height="48" v-if="info.loopStatus == '离线'" src="@/assets/images/fire/loop-offline.svg" alt="">
            </div>
            <div class="title-name">
              <div>{{ info.name ? info.name : "" }}</div>
            </div>
            <div class="left-status">
              <firePdcStatus :status="info.loopStatus"></firePdcStatus>
            </div>
            <div class="step-left-info">
              <el-row>
                <el-col class="left-info-key" :span="9">回路名称：</el-col>
                <el-col class="left-info-value" :span="15">{{ info.loopName ? info.loopName : "" }}</el-col>
              </el-row>
              <el-row>
                <el-col class="left-info-key" :span="9">所属区域：</el-col>
                <el-col class="left-info-value" :span="15">{{ info.regionName ? info.regionName : "" }}</el-col>
              </el-row>
              <el-row>
                <el-col class="left-info-key" :span="9">所属配电柜：</el-col>
                <el-col class="left-info-value" :span="15">{{ info.cabinetName ? info.cabinetName : "" }}</el-col>
              </el-row>
              <el-row>
                <el-col class="left-info-key" :span="9">设备名称：</el-col>
                <el-col class="left-info-value" :span="15">{{ info.deviceName ? info.deviceName : "" }}</el-col>
              </el-row>
            </div>
            <div class="leave-button">
              <el-button type="primary" @click="dispatchParams">参数下发</el-button>
            </div>
          </div>
        </template>
        <template #two>
          <div class="right">
            <div class="right-content">
              <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="近24小时数据统计" name="1">
                  <div class="chart-box" v-loading="chartLoading">
                    <div class="chart-item">
                      <div>剩余电流（mA）</div>
                      <div v-if="restEFlowData.data.length" id="chart1" class="chart"></div>
                      <div v-else style="text-align: center;padding-top: 5%;">
                        <img src="@/assets/images/fire/monitor-chart-null.png" alt="">
                        <div style="color: #B4B9BF;font-size: 14px;">暂无数据</div>
                      </div>
                    </div>
                    <div class="chart-item">
                      <div>温度（℃）</div>
                      <div v-if="temData.data.length && temData.data[0] != null" id="chart2" class="chart"></div>
                      <div v-else style="text-align: center;padding-top: 5%;">
                        <img src="@/assets/images/fire/monitor-chart-null.png" alt="">
                        <div style="color: #B4B9BF;font-size: 14px;">暂无数据</div>
                      </div>
                    </div>
                    <div class="chart-item">
                      <div>电流（A）</div>
                      <div v-if="eleFLowData.data.length && eleFLowData.data[0] != null" id="chart3" class="chart"></div>
                      <div v-else style="text-align: center;padding-top: 5%;">
                        <img src="@/assets/images/fire/monitor-chart-null.png" alt="">
                        <div style="color: #B4B9BF;font-size: 14px;">暂无数据</div>
                      </div>
                    </div>
                    <div class="chart-item">
                      <div>电压（V）</div>
                      <div v-if="eleVoltageData.data.length && eleVoltageData.data[0] != null" id="chart4" class="chart"></div>
                      <div v-else style="text-align: center;padding-top: 5%;">
                        <img src="@/assets/images/fire/monitor-chart-null.png" alt="">
                        <div style="color: #B4B9BF;font-size: 14px;">暂无数据</div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="历史数据" name="2">
                  <div style="margin-top: 16px;">
                    <el-button @click="preDay" type="text" class="history-button">
                      <el-icon>
                        <CaretLeft />
                      </el-icon>
                      <span style="padding-left: 3px;">前一天</span>
                    </el-button>
                    <el-button @click="nextDay" type="text" class="history-button">
                      <span style="padding-right: 3px;">后一天</span>
                      <el-icon>
                        <CaretRight />
                      </el-icon>
                    </el-button>
                    <el-date-picker style="margin-left: 24px;" :clearable="false" v-model="historySearchDate" type="date" placeholder="选择日期" @change="getTableData" value-format="YYYY-MM-DD" />
                  </div>

                  <div style="margin-top: 24px;margin-bottom: 24px;">
                    <div v-if="tableData.length">
                      <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%;" :header-cell-style="{ 'text-align': 'center' }">
                        <el-table-column type="index" fixed="left" label="序号" width="60" align="center" />
                        <el-table-column v-for="(item, index) in columns" :key="index" :label="item.label" :prop="item.prop" :align="item.align" :width="item.width" :fixed="item.fixed">
                          <template #default="scope">
                            <div v-if="item.prop == 'online'">
                              {{ scope.row[item.prop] == '0' ? '在线' : '离线' }}
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                      <pagination class="pagination" v-show="queryParams.total > 0" :total="queryParams.total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getTableData" />
                    </div>
                    <div v-else style="text-align: center;padding-top: 10%;">
                      <img src="@/assets/images/fire/monitor-chart-null.png" alt="">
                      <div style="color: #B4B9BF;font-size: 14px;">暂无数据</div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </template>
      </Split>
    </div>

    <el-dialog title="参数下发" v-model="visible" append-to-body destroy-on-close :before-close="dialogClose" width="500px">
      <el-form :model="form" ref="paramsRef" label-width="130px">
        <el-form-item label="剩余电流警告阈值:">
          <el-input v-model="form.remainElectricThreshold" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>mA</template>
          </el-input>
        </el-form-item>
        <el-form-item label="漏电延时:">
          <el-input v-model="form.electricLeakageDelay" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="A相温度告警阈值:">
          <el-input v-model="form.atemperatureThreshold" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>℃</template>
          </el-input>
        </el-form-item>
        <el-form-item label="A相温度延时:">
          <el-input v-model="form.atemperatureDelay" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="B相温度告警阈值:">
          <el-input v-model="form.btemperatureThreshold" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>℃</template>
          </el-input>
        </el-form-item>
        <el-form-item label="B相温度延时:">
          <el-input v-model="form.btemperatureDelay" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="C相温度告警阈值:">
          <el-input v-model="form.ctemperatureThreshold" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>℃</template>
          </el-input>
        </el-form-item>
        <el-form-item label="C相温度延时:">
          <el-input v-model="form.ctemperatureDelay" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>秒</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button type="primary" @click="dialogConfirm(paramsRef)" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Split from '../../../components/Split/index.vue';
import firePdcStatus from '@/components/firePdcStatus/index.vue'
import { reactive, ref } from 'vue';
import moment from 'moment';
import { useRouter, useRoute } from "vue-router"
import monitorService from '../../../api/fire/monitor';
import * as echarts from 'echarts';
import loopService from '../../../api/fire/loop';
import { ElMessage } from 'element-plus'

const router = useRouter();
const route = useRoute();

let activeName = ref('1')
let info = reactive({
  name: '',
  loopStatus: '',
  cabinetName: "",
  deviceName: "",
  deviceId: "",
  deviceNumber: "",
  id: "",
  loopName: "",
  regionName: ""
})
let chartLoading = ref(false);
let tableLoading = ref(false);
let restEFlowId = ref('');
let temId = ref('');
let eleFLowId = ref('');
let eleVoltageId = ref('');
let dialogLoading = ref(false)

let restEFlowData = reactive({
  data: []
});
let temData = reactive({
  data: []
});
let eleFLowData = reactive({
  data: []
});
let eleVoltageData = reactive({
  data: []
});

let tempChart = null;
let restEFlowChart = null;
let eleFLowChart = null;
let eleVoltageChart = null;

let historySearchDate = ref(null)

let visible = ref(false)
let paramsRef = ref()
let form = reactive({
  remainElectricThreshold: null,
  electricLeakageDelay: null,
  atemperatureThreshold: null,
  atemperatureDelay: null,
  btemperatureThreshold: null,
  btemperatureDelay: null,
  ctemperatureThreshold: null,
  ctemperatureDelay: null,
  loopRecordBos: [
    {
      loopId: null,
      deviceId: null
    }
  ]
})

let tableData = ref([])
const columns = [
  {
    label: '时间',
    prop: '_time',
    align: 'center',
    width: 180,
    fixed: 'left'
  },
  {
    label: '剩余电流(mA)',
    prop: 'dev_leakage',
    align: 'right',
    width: 120,
  },
  {
    label: '温度1(℃)',
    prop: 'dev_t1',
    align: 'right',
    width: 100,
  },
  {
    label: '温度2(℃)',
    prop: 'dev_t1',
    align: 'right',
    width: 100,
  },
  {
    label: '温度3(℃)',
    prop: 'dev_t1',
    align: 'right',
    width: 100,
  },
  {
    label: '正向有功电能(kWh)',
    prop: 'dev_consumption',
    align: 'right',
    width: 150,
  },
  {
    label: 'A相电压(V)',
    prop: 'dev_ua',
    align: 'right',
    width: 120,
  },
  {
    label: 'B相电压(V)',
    prop: 'dev_ub',
    align: 'right',
    width: 120,
  },
  {
    label: 'C相电压(V)',
    prop: 'dev_uc',
    align: 'right',
    width: 120,
  },
  {
    label: 'AB相电压(V)',
    prop: 'dev_uab',
    align: 'right',
    width: 120,
  },
  {
    label: 'CA相电压(V)',
    prop: 'dev_uca',
    align: 'right',
    width: 120,
  },
  {
    label: 'BC相电压(V)',
    prop: 'dev_ubc',
    align: 'right',
    width: 120,
  },
  {
    label: 'A相电流(A)',
    prop: 'dev_ia',
    align: 'right',
    width: 120,
  },
  {
    label: 'B相电流(A)',
    prop: 'dev_ib',
    align: 'right',
    width: 120,
  },
  {
    label: 'C相电流(A)',
    prop: 'dev_ic',
    align: 'right',
    width: 120,
  },
  {
    label: 'A相频率(Hz)',
    prop: 'dev_fa',
    align: 'right',
    width: 120,
  },
  {
    label: 'B相频率(Hz)',
    prop: 'dev_fb',
    align: 'right',
    width: 120,
  },
  {
    label: 'C相频率(Hz)',
    prop: 'dev_fc',
    align: 'right',
    width: 120,
  },
  {
    label: '是否在线',
    prop: 'online',
    align: 'left',
    width: 100,
    fixed: 'right'
  },
]
let queryParams = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0
})

let currentDevice = reactive({
  id: "",
  number: ""
})

onBeforeMount(() => {
  restEFlowId.value = 'restEFlow' + Math.random();
  temId.value = 'tem' + Math.random();
  eleFLowId.value = 'eleFLow' + Math.random();
  eleVoltageId.value = 'eleVoltage' + Math.random();
  historySearchDate.value = moment().format('YYYY-MM-DD');
})

onMounted(() => {
  if (route.query.deviceId) {
    currentDevice.id = route.query.deviceId;
    getDataData(currentDevice.id);
  }
  if (route.query.number) {
    currentDevice.number = route.query.number;
  }
  window.addEventListener('resize', () => {
    tempChart.resize();
    restEFlowChart.resize();
    eleFLowChart.resize();
    eleVoltageChart.resize();
  })
})

function getDataData (deviceId) {
  let params = {
    deviceId: deviceId
  }
  chartLoading.value = true;
  monitorService.monitorTrend(params).then(res => {
    info.cabinetName = res.data.cabinetName;
    info.loopStatus = res.data.loopStatus;
    info.name = res.data.name;
    info.deviceName = res.data.deviceName;
    info.deviceId = res.data.deviceId;
    info.deviceNumber = res.data.deviceNumber;
    info.id = res.data.id;
    info.loopName = res.data.loopName;
    info.regionName = res.data.regionName;
    if (JSON.stringify(res.data.map) != "{}") {
      temData.data.push(res.data.map.dev_t1, res.data.map.dev_t2, res.data.map.dev_t3);
      if (temData.data.length) {
        nextTick(() => {
          if (document.getElementById('chart2')) {
            loadTemChart();
          }
        })
      }
      restEFlowData.data = res.data.map.dev_leakage;
      if (restEFlowData.data.length) {
        nextTick(() => {
          if (document.getElementById('chart1')) {
            loadRestChart();
          }
        })
      }
      eleFLowData.data.push(res.data.map.dev_ia, res.data.map.dev_ib, res.data.map.dev_ic);
      if (eleFLowData.data.length) {
        nextTick(() => {
          if (document.getElementById('chart3')) {
            loadEleChart()
          }
        })
      }
      eleVoltageData.data.push(res.data.map.dev_ua, res.data.map.dev_ub, res.data.map.dev_uc);
      if (eleVoltageData.data.length) {
        nextTick(() => {
          if (document.getElementById('chart4')) {
            loadVoltageChart()
          }
        })
      }
    }
  }).finally(() => {
    chartLoading.value = false;
  })
}

function getTableData () {
  let params = {
    pageSize: queryParams.pageSize,
    pageNumber: queryParams.pageNum,
    deviceNumber: currentDevice.number,
    beginDateTime: historySearchDate.value + ' ' + '00:00:00',
    endDateTime: historySearchDate.value + ' ' + '23:59:59'
  }
  tableLoading.value = true;
  monitorService.monitorHistory(params).then(res => {
    queryParams.total = res.data.total;
    if (res.data.records != null) {
      tableData.value = res.data.records
    } else {
      tableData.value = [];
    }
  }).finally(() => {
    tableLoading.value = false;
  })
}

function back () {
  router.go(-1)
}

function handleClick () {
  if (activeName.value == 1) {
    getDataData(currentDevice.id)
  } else {
    getTableData()
  }
}

function dispatchParams () {
  let params = {
    deviceId: info.deviceId,
    loopId: info.id
  }
  if (params.deviceId && params.loopId) {
    loopService.getDispatchedParams(params).then(res => {
      if (JSON.stringify(res.data) != '{}') {
        form.atemperatureDelay = res.data.atemperatureDelay;
        form.atemperatureThreshold = res.data.atemperatureThreshold;
        form.btemperatureDelay = res.data.btemperatureDelay;
        form.btemperatureThreshold = res.data.btemperatureThreshold
        form.ctemperatureDelay = res.data.ctemperatureDelay;
        form.ctemperatureThreshold = res.data.ctemperatureThreshold;
        form.remainElectricThreshold = res.data.remainElectricThreshold;
        form.electricLeakageDelay = res.data.electricLeakageDelay;
      }
      form.loopRecordBos[0].deviceId = info.deviceId;
      form.loopRecordBos[0].loopId = info.id;
      visible.value = true;
    })
  } else {
    ElMessage({
      type: 'warning',
      message: '请保证回路处于在线状态或绑定设备后再重试！'
    })
  }
}

function dialogClose () {
  form.remainElectricThreshold = null
  form.electricLeakageDelay = null
  form.atemperatureThreshold = null
  form.atemperatureDelay = null
  form.btemperatureThreshold = null
  form.btemperatureDelay = null
  form.ctemperatureThreshold = null
  form.ctemperatureDelay = null
  form.loopRecordBos = [
    {
      deviceId: '',
      loopId: ''
    }
  ]
  visible.value = false;
}

async function dialogConfirm (formEl) {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      dialogLoading.value = true;
      loopService.dispatchParams(form).then(res => {
        ElMessage({ type: 'success', message: '下发成功！' })
      }).finally(() => {
        dialogLoading.value = false;
        getDataData(currentDevice.id);
        dialogClose();
      })
    }
  })
}

function getChartOption (unit, xAxis, series) {
  let option = {
    color: ['#69DFAE', '#4689F7', '#FBAB33'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function (params) {
        let result = params[0].name;
        for (let i = 0; i < params.length; i++) {
          result += '<br/>' + params[i].marker + "<div style='display: inline-block;width: 120px'>" + params[i].seriesName + "</div>" + '<span style="padding-left: 70px">' + params[i].value + unit
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
      data: xAxis
    },
    yAxis: {
      type: 'value',
      position: "right",
      axisPointer: {
        show: false
      },
    },
    series: series
  }
  return option;
}

function loadRestChart () {
  let xAxis = [];
  xAxis = restEFlowData.data.map(item => {
    return item.time.slice(10);
  })
  let data = restEFlowData.data.map(item => {
    return item.value;
  })
  let series = [
    {
      data: data,
      name: '剩余电流',
      type: 'line',
      smooth: true,
      lineStyle: {
        width: 2
      },
      itemStyle: {
        opacity: 0
      },
    }
  ];
  let option = getChartOption('mA', xAxis, series);
  let chartDom = document.getElementById('chart1');
  if (chartDom) {
    restEFlowChart = echarts.init(chartDom);
    option && restEFlowChart.setOption(option);
  }
}

function loadTemChart () {
  let xAxis = [];
  let series = [];
  let data1 = {
    name: "A相温度",
    data: []
  };
  let data2 = {
    name: "B相温度",
    data: []
  };
  let data3 = {
    name: "C相温度",
    data: []
  };
  let data = temData.data;
  if (data.length) {
    if (data[0] != null) {
      xAxis = data[0].map(item => {
        return item.time.slice(10);
      })
    }
    // xAxis = data[0].map(item => {
    //   return item.time.slice(10);
    // })
    // let date = data[0][0].time.substring(0, 10);
    if (data[0] != null) {
      data1.data = data[0].map(item => {
        return item.value;
      })
    }
    if (data[1] != null) {
      data2.data = data[1].map(item => {
        return item.value;
      })
    }
    if (data[2] != null) {
      data3.data = data[2].map(item => {
        return item.value;
      })
    }
    let seriesData = [data1, data2, data3];
    seriesData.forEach(item => {
      let obj = {
        data: item.data,
        name: item.name,
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        },
        itemStyle: {
          opacity: 0
        },
      }
      series.push(obj)
    })
    let option = getChartOption('℃', xAxis, series);
    option.grid.left = "5%";
    // option.xAxis = [
    //   {
    //     type: 'category',
    //     data: xAxis,
    //     axisTick: {
    //       show: true,
    //       alignWithLabel: true,
    //     },
    //     axisLabel: {
    //       show: true,
    //       formatter: function (value) {
    //         return (
    //           date
    //           +
    //           `\n ${value}`
    //         );
    //       }
    //     },
    //   }
    // ]
    let chartDom = document.getElementById('chart2');
    if (chartDom) {
      tempChart = echarts.init(chartDom);
      option && tempChart.setOption(option);
    }
  }
}

function loadEleChart () {
  let xAxis = [];
  let series = [];
  let data1 = {
    name: "A相电流",
    data: []
  };
  let data2 = {
    name: "B相电流",
    data: []
  };
  let data3 = {
    name: "C相电流",
    data: []
  };
  let data = eleFLowData.data;
  if (data.length) {
    if (data[0] != null) {
      xAxis = data[0].map(item => {
        return item.time.slice(10);
      })
    }
    if (data[0] != null) {
      data1.data = data[0].map(item => {
        return item.value;
      })
    }
    if (data[1] != null) {
      data2.data = data[1].map(item => {
        return item.value;
      })
    }
    if (data[2] != null) {
      data3.data = data[2].map(item => {
        return item.value;
      })
    }
    let seriesData = [data1, data2, data3];
    seriesData.forEach(item => {
      let obj = {
        data: item.data == null ? [] : item.data,
        name: item.name,
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        },
        itemStyle: {
          opacity: 0
        },
      }
      series.push(obj)
    })
    let option = getChartOption('A', xAxis, series);
    option.grid.left = "5%";
    let chartDom = document.getElementById('chart3');
    if (chartDom) {
      eleFLowChart = echarts.init(chartDom);
      option && eleFLowChart.setOption(option);
    }
  }
}

function loadVoltageChart () {
  let xAxis = [];
  let series = [];
  let data1 = {
    name: "A相电压",
    data: []
  };
  let data2 = {
    name: "B相电压",
    data: []
  };
  let data3 = {
    name: "C相电压",
    data: []
  };
  let data = eleVoltageData.data;
  if (data.length) {
    if (data[0] != null) {
      xAxis = data[0].map(item => {
        return item.time.slice(10);
      })
    }
    if (data[0] != null) {
      data1.data = data[0].map(item => {
        return item.value;
      })
    }
    if (data[1] != null) {
      data2.data = data[1].map(item => {
        return item.value;
      })
    }
    if (data[2] != null) {
      data3.data = data[2].map(item => {
        return item.value;
      })
    }
    let seriesData = [data1, data2, data3];
    seriesData.forEach(item => {
      let obj = {
        data: item.data == null ? [] : item.data,
        name: item.name,
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        },
        itemStyle: {
          opacity: 0
        },
      }
      series.push(obj)
    })
    let option = getChartOption('A', xAxis, series);
    option.grid.left = "5%";
    let chartDom = document.getElementById('chart4');
    if (chartDom) {
      eleVoltageChart = echarts.init(chartDom);
      option && eleVoltageChart.setOption(option);
    }
  }
}

function preDay () {
  queryParams.pageNum = 1;
  historySearchDate.value = moment(historySearchDate.value).subtract(1, "days").startOf("days").format('YYYY-MM-DD');
  getTableData()
}

function nextDay () {
  queryParams.pageNum = 1;
  historySearchDate.value = moment(historySearchDate.value).add(1, "days").startOf("days").format('YYYY-MM-DD');
  getTableData()
}
</script>

<style lang="scss" scoped>
.detail-main {
  width: 100%;
  height: calc(100vh - 70px);
  padding-top: 24px;
  padding-right: 24px;

  .content {
    width: 100%;
    height: 100%;

    .left {
      padding-left: 24px;
      padding-top: 24px;
      padding-right: 24px;
      width: 100%;
      height: 100%;
      position: relative;

      .left-title {
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #4960E5;
        padding-right: 8px;
      }

      .left-back {
        padding-left: 5px;
        cursor: pointer;
      }

      .title-name {
        margin-top: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #18191A;
      }

      .left-status {
        margin-top: 20px;
      }

      .step-left-info {
        margin-top: 40px;
        font-size: 14px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #141522;

        .el-row {
          margin-bottom: 16px;
        }

        .left-info-key {
          text-align: left;
        }

        .left-info-value {
          text-align: right;
        }
      }

      .leave-button {
        position: absolute;
        bottom: 20%;
        left: 11%;
        width: 100%;

        button {
          min-width: 180px;
          width: 80%;
          height: 42px;
          border-radius: 54px 54px 54px 54px;
        }
      }
    }

    .right {
      width: 100%;
      height: 100%;
      padding-left: 24px;

      .right-content {
        width: 100%;
        height: 100%;
        background-color: #fff;
        padding: 16px;
        padding-left: 24px;
        overflow: auto;

        .chart-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          align-content: baseline;
          width: 100%;
          height: calc(100vh - 180px);

          .chart-item {
            width: 48%;
            height: 40%;
            min-height: 300px;
            margin-top: 24px;
            margin-right: 24px;
            border-radius: 2px 2px 2px 2px;
            padding: 16px 16px 10px 16px;
            border: 1px solid rgba(0, 0, 0, 0.1);

            .chart {
              width: 100%;
              height: 98%;
            }
          }
        }

        .history-button {
          border: 1px solid #3B82F6;
          color: #3B82F6;
          border: 1px solid #3B82F6;
          font-size: 14px;
          padding-left: 16px;
          padding-right: 16px;
        }
      }
    }

    :deep(.el-tabs__item) {
      color: #B4B9BF !important;
    }

    :deep(.el-tabs__item.is-active) {
      color: #1890ff !important;
    }

    :deep(.el-tabs__nav-wrap::after) {
      // position: static !important;
      border: 1px solid #F3F3F3;
    }
  }
}
</style>