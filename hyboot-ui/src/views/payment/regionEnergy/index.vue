<template>
  <div class="page-container">
    <div class="content">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="汇总方式">
            <el-select v-model="rangeType" placeholder="全部" style="width: 240px" @change="rangeTypeOptionsChange">
              <el-option v-for="dict in timeOption" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="activeLabel" style="">
            <el-date-picker v-model="queryParams.startTime" :type="rangeType == 'years' ? 'year' : rangeType" :format="
              rangeType == 'month'
                ? 'YYYY-MM'
                : rangeType == 'year'
                  ? 'YYYY'
                  : 'YYYY'
            " @change="changeDate" :disabled-date="disabledDate" style="width: 240px" :clearable="false"/>
            <span style="margin: 0 20px" v-if="rangeType == 'years'">至</span>
            <el-date-picker v-model="queryParams.endTime" :type="rangeType == 'years' ? 'year' : rangeType"
                            v-if="rangeType == 'years'" :clearable="false" format="YYYY" @change="changeDate"
                            :disabled-date="disabledDate" style="width: 240px"/>
          </el-form-item>
          <el-form-item label="区域" prop="warn">
            <el-tree-select v-model="queryParams.regionId" :data="regionTree" check-strictly
                            :render-after-expand="false" style="width: 240px"/>
          </el-form-item>
          <el-form-item label="用能类型" prop="deviceType">
            <el-select v-model="queryParams.deviceType" placeholder="全部" style="width: 240px">
              <el-option v-for="dict in typeOption" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item class="button-container">
            <el-button type="primary" icon="Search" @click="getData" v-hasPermi="['chaoyang:record:regionEnerySum']">
              搜索
            </el-button>
            <el-button icon="Refresh" @click="clear" v-hasPermi="['chaoyang:record:regionEnerySum']">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table" ref="tableWrapper" style="height: 100%">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="getExcel"
                       v-hasPermi="['chaoyang:record:region:export']">导出
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getData"></right-toolbar>
        </el-row>
        <el-table :data="tableData" border class="customer-table" :max-height="tableHeight"
                  :header-cell-style="{ 'text-align': 'center' }" name="table" v-loading="loading"
                  element-loading-text="加载中..."    :row-class-name="rowClass">
          <el-table-column type="index" label="序号" width="60" fixed align="center">
            <template #default="scope">
              <template v-if="scope.row.cellName == '合计'">
                <span>
                  合计
                </span>
              </template>
            </template>

          </el-table-column>
          <el-table-column v-for="item in columns" :key="item" :prop="item.prop" :label="item.label" :fixed="item.fixed"
                           :align="item.align" :min-width="item.minWidth" :width="item.width"></el-table-column>
          <el-table-column prop="sum" :label="lastColumn" min-width="120" fixed="right" align="right"/>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import moment from "moment";
import {getRegionTree, getRegionEnergyList} from '@/api/payment/regionEnergy.js'
const {proxy} = getCurrentInstance();
//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(false);
let tableData = ref([]);
let activeLabel = ref('选择范围')
let columns = ref([
  {
    label: '区域',
    prop: 'regionName',
    align: 'left',
    fixed: 'left',
    width: '',
    minWidth: '120'
  },
  {
    label: '用能类型',
    prop: 'deviceType',
    fixed: 'left',
    align: 'left',
    width: '',
    minWidth: '100'
  }
]);
const rangeType = ref("years");
const format = ref({
  years: "YYYY",
  year: "YYYY",
  month: "YYYY-MM",
});
const timeOption = ref([
  {value: "years", label: "按年汇总"},
  {value: "year", label: "按月汇总"},
  {value: "month", label: "按日汇总"},
]);
const typeOption = ref([
  {value: "0", label: "电"},
  {value: "1", label: "水"},
]);
const queryParams = ref({
  startTime: ref(moment().format("YYYY")),
  endTime: ref(moment().format("YYYY")),
  deviceType: "0",
  type: "",
});
let lastColumn = ref('年合计(KWh)')
//最后一列显示单位
const getLastColumn = () => {
  let unit = queryParams.value.deviceType == '0' ? 'KWh' : 't'
  lastColumn.value = `${rangeType.value == 'years' ? '年合计' : (rangeType.value == 'year' ? '月合计' : '日合计')}(${unit})`
}
const rangeTypeOptionsChange = (val) => {
  activeLabel.value = val == 'years' ? '选择范围' : (rangeType.value == 'year' ? '选择年份' : '选择月份')
}

const regionTree = ref([]);

let initRegionId = ''
const getRegionTreeOptions = () => {
  loading.value = true
  getRegionTree().then((res) => {
    if (res.code == 200) {
      regionTree.value = recursion(res.data);
      queryParams.value.regionId = res.data[0].regionId;
      initRegionId = res.data[0].regionId
    }
  }).finally(() => {
    getData()
  })
}

// 递归
const recursion = (data) => {
  data.map((item, idx) => {
    item.value = item.regionId;
    item.label = item.regionName;
    if (item.children?.length) {
      recursion(item.children);
    }
    return item;
  });
  return data;
}


function changeDate(time) {
  if (rangeType.value == "years") {
    let stime = JSON.parse(JSON.stringify(queryParams.value.startTime));
    let etime = JSON.parse(JSON.stringify(queryParams.value.endTime));
    if (moment(stime).format("YYYYMMDD") > moment(etime).format("YYYYMMDD")) {
      let time = stime;
      queryParams.value.startTime = etime;
      queryParams.value.endTime = time;
    }
  }
}

const disabledDate = (time) => {
  return time.getTime() > moment().valueOf()
}

function getExcel() {
  let params = {
    startTime: moment(queryParams.value.startTime).format(format.value[rangeType.value]),
    endTime: moment(queryParams.value.endTime).format(format.value[rangeType.value]),
    regionId: queryParams.value.regionId,
    type: rangeType.value == "years" ? 1 : rangeType.value == "year" ? 2 : 3,
    deviceType: queryParams.value.deviceType
  };
  proxy.download(
      "/payment/region/export",
      params,
      `区域用能汇总.xlsx`
  );
}

//最后一行吸底
const rowClass = ({row, column, rowIndex, columnIndex}) => {
  if (row.cellName == '合计') {
    return 'fixed-row'
  }
}

//动态表格高度
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
    tableHeight.value = tableWrapper.value.getBoundingClientRect().height - 72
  })
}
onMounted(() => {
  fetTableHeight()
})

watch(showSearch, (newValue) => {
  fetTableHeight()
})

function getData() {
  loading.value = true;
  tableData.value = []
  columns.value = [
    {
      label: '区域',
      prop: 'regionName',
      fixed: 'left',
      align: 'left',
      width: '',
      minWidth: '120'

    },
    {
      label: '用能类型',
      prop: 'deviceType',
      fixed: 'left',
      align: 'left',
      width: '',
      minWidth: '100'
    }
  ];
  queryParams.value.type =
      rangeType.value == "years" ? 1 : rangeType.value == "year" ? 2 : 3;
  queryParams.value.startTime = moment(queryParams.value.startTime).format(
      format.value[rangeType.value]
  );
  queryParams.value.endTime = moment(queryParams.value.endTime).format(
      format.value[rangeType.value]
  );
  const minWidth = rangeType.value == "years" ? 100 : rangeType.value == "year" ? 110 : 130
  getRegionEnergyList(queryParams.value)
      .then((res) => {
        tableData.value = res.data.map((item1, index) => {
          if (item1.regionName == '合计') {
            item1.regionName = ''
            item1.cellName = '合计'
          }

          item1.sum = 0;
          item1.xo.forEach((item2, idx) => {
            if (!index) {
              columns.value.push({
                prop: item2.date,
                label: `${item2.date}(${queryParams.value.deviceType == '0' ? 'KWh' : 't'})`,
                minWidth,
                align: 'right'
              });
            }
            item2.usageSum = item2.sum ? Number(item2.sum) : 0;
            item1[item2.date] = item2.usageSum;
            item1.sum=Number((item1.sum+ Number(item2.usageSum)).toFixed(2));
          });
          return item1;
        });

      })
      .finally(() => {
        getLastColumn()
        loading.value = false;
      });
}


function clear() {
  rangeType.value = "years";
  queryParams.value = {
    startTime: ref(moment().format("YYYY-MM-DD")),
    endTime: ref(moment().format("YYYY-MM-DD")),
    deviceType: "1",
    type: "1",
    regionId: initRegionId,
  };
  getData();
}

getRegionTreeOptions()
</script>

<style scoped lang="scss">
:deep(.el-scrollbar) {
  .el-table__body {
    // 吸底
    .fixed-row {
      display: table-row;
      position: sticky;
      // （不要用fixed，因为他是基于屏幕定位，也会出现滚动的问题）
      //（设置自己要的背景色）
      bottom: 0;
      width: 100%;
      z-index: 3; // 列的固定是4（因为有固定列，为了不互相影响所以要注意列的层级， 不然滚动的时候会有bug，发现固定的列不固定了）
      td {
        //  border: 1px solid #181922;
        background-color: var(--el-table-row-hover-bg-color) !important;
      }
    }

  }

  .el-scrollbar__bar {
    z-index: 4 !important;
  }
}
</style>
  