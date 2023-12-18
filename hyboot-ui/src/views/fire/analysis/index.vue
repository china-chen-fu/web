<template>
  <div class="page-container">
    <div class="content" style="padding: 24px 0 0 0;">
      <div class="search" style="padding: 24px 0 12px 32px;" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="汇总方式" prop="type">
            <el-select v-model="queryParams.timeType" placeholder="全部" style="width: 240px" @change="timeTypeChange">
              <el-option v-for="dict in timeOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择日期" prop="warn">
            <el-date-picker v-model="queryParams.time" :type="rangeType" :clearable="false" :format="dateFormat" :value-format="dateFormat" style="width: 240px" />
          </el-form-item>
          <el-form-item class="button-container">
            <el-button type="primary" icon="Search" :loading="searchLoading" @click="getData">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table" ref="tableWrapper">
        <el-row :gutter="10" class="mb8" style="margin-top: 16px;">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="exportData" v-hasPermi="['fire:stat:export']">导出
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getData"></right-toolbar>
        </el-row>
        <el-table :data="tableData" border style="width: 100%;margin-top: 16px;" :max-height="tableHeight" :header-cell-style="{ 'text-align': 'center' }" name="table" v-loading="loading" element-loading-text="加载中...">
          <el-table-column type="index" label="序号" width="60" fixed align="center"></el-table-column>
          <el-table-column v-for="(item, index) in column" :key="item.index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :fixed="item.fixed"></el-table-column>
        </el-table>
        <pagination class="pagination" v-show="queryParams.total > 0" :total="queryParams.total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from "vue";
import moment from "moment";
import analysisService from "../../../api/fire/analysis";

const { proxy } = getCurrentInstance();
//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(false);
let tableData = ref([]);
const areaOption = ref([]);
const rangeType = ref("year");
const timeOption = ref([
  { value: "yyyy", label: "按年汇总" },
  { value: "yyyy-MM", label: "按月汇总" },
  { value: "yyyy-MM-dd", label: "按日汇总" },
]);
let queryParams = reactive({
  timeType: "yyyy",
  time: moment().format("YYYY"),
  pageSize: 10,
  pageNum: 1,
  total: 0
});
let searchLoading = ref(false)

const column = [
  {
    label: '区域',
    prop: 'regionName',
    align: 'left',
    fixed: 'left',
    width: 100
  },
  {
    label: '配电柜',
    prop: 'electricCabinetName',
    align: 'left',
    fixed: 'left',
    width: 180
  },
  {
    label: '回路名称',
    prop: 'loopName',
    width: '',
    align: 'left',
    width: 180
  },
  {
    label: '设备名称',
    prop: 'deviceName',
    width: 220,
    align: 'left'
  },
  {
    label: '剩余电流超限告警次数(次)',
    prop: 'remainElectricCount',
    width: 180,
    align: 'right'
  },
  {
    label: '三相温度超限告警次数(次)',
    prop: 'threeTemperatureAlarmCount',
    width: 180,
    align: 'right'
  },
  {
    label: '用电量(kWh)',
    prop: 'diffIndication',
    width: 180,
    align: 'right'
  },
  {
    label: '平均剩余电流(mA)',
    prop: 'avgRemainElectric',
    width: 140,
    align: 'right'
  },
  {
    label: '最大剩余电流(mA)',
    prop: 'maxRemainElectric',
    width: 140,
    align: 'right'
  },
  {
    label: 'A相平均温度(℃)',
    prop: 'avgATemperature',
    width: 140,
    align: 'right'
  },
  {
    label: 'A相最高温度(℃)',
    prop: 'maxATemperature',
    width: 140,
    align: 'right'
  },
  {
    label: 'B相平均温度(℃)',
    prop: 'avgBTemperature',
    width: 140,
    align: 'right'
  },
  {
    label: 'B相最高温度(℃)',
    prop: 'maxBTemperature',
    width: 140,
    align: 'right'
  },
  {
    label: 'C相平均温度(℃)',
    prop: 'avgCTemperature',
    width: 140,
    align: 'right'
  },
  {
    label: 'C相最高温度(℃)',
    prop: 'maxCTemperature',
    width: 140,
    align: 'right',
  },
  {
    label: '设备离线次数(次)',
    prop: 'offlineCount',
    width: 130,
    align: 'right',
    fixed: 'right'
  },
]

//汇总方式改变
const timeTypeChange = (value) => {
  switch (value) {
    case 'yyyy':
      rangeType.value = 'year'
      queryParams.time = moment().format('YYYY')
      break;
    case 'yyyy-MM':
      rangeType.value = 'month'
      queryParams.time = moment().format('YYYY-MM')
      break;
    case 'yyyy-MM-dd':
      rangeType.value = 'date'
      queryParams.time = moment().format('YYYY-MM-DD')
      break;
    default:
      break;
  }
}

//计算属性
const dateFormat = computed(() => {
  let dateFormateVal = ''
  switch (rangeType.value) {
    case 'date':
      dateFormateVal = 'YYYY-MM-DD'
      break;
    case 'month':
      dateFormateVal = 'YYYY-MM'
      break;
    case 'year':
      dateFormateVal = 'YYYY'
      break;
    default:
      break;
  }
  return dateFormateVal
})


onBeforeMount(() => {
  getData();
})

function getData () {
  tableData.value = [];
  let params = {
    dateType: queryParams.timeType,
    time: queryParams.time,
    pageSize: queryParams.pageSize,
    pageNum: queryParams.pageNum
  }
  searchLoading.value = true;
  loading.value = true;
  analysisService.getData(params).then(res => {
    if (res.data && res.data.length) {
      tableData.value = res.data;
    }
  }).finally(() => {
    loading.value = false;
    searchLoading.value = false;
    nextTick(() => {
      fetTableHeight()
    })
  })
}

function resetQuery () {
  let time = moment().format("YYYY");
  queryParams.timeType = 'yyyy';
  queryParams.time = time;
  queryParams.pageSize = 10;
  queryParams.pageNum = 1;
  queryParams.total = 0;
  rangeType.value = 'year';
  getData();
}

function exportData () {
  proxy.download("fire/stat/analysis/export",
    { dateType: queryParams.timeType, time: queryParams.time },
    `数据统计${new Date().getTime()}.xlsx`
  );
}

const tableHeight = ref(0)
const resetHeight = () => {
  return new Promise((resolve, reject) => {
    tableHeight.value = 0
    resolve()
  })
}
// 设置table高度
const tableWrapper = ref()
const fetTableHeight = () => {
  resetHeight().then(res => {
    tableHeight.value = tableWrapper.value.getBoundingClientRect().height - 100
  })
}

watch(showSearch, (newValue) => {
  fetTableHeight()
})
</script>

<style scoped lang="scss">

</style>
