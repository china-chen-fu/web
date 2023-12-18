<template>
  <div class="page-container">
    <div class="content">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="汇总方式" prop="type">
            <el-select v-model="queryParams.timeType" placeholder="全部" style="width: 240px" @change="timeTypeChange">
              <el-option v-for="dict in timeOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择日期" prop="warn">
            <el-date-picker v-if="queryParams.timeType != 'yyyy-MM-dd'" v-model="queryParams.time" :type="rangeType" :clearable="false" :format="dateFormat" style="width: 240px" />
            <el-date-picker v-else v-model="queryParams.dayTypeTime" type="daterange" :clearable="false" value-format="YYYY-MM-DD" format="YYYY-MM-DD" style="width: 240px" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
          </el-form-item>
          <el-form-item label="区域" prop="warn">
            <el-tree-select v-model="queryParams.regionId" :data="areaOption" check-strictly :render-after-expand="false" style="width: 240px" />
          </el-form-item>
          <el-form-item class="button-container">
            <el-button type="primary" icon="Search" @click="getData" v-hasPermi="['chaoyang:analysis:bill:list']">搜索</el-button>
            <el-button icon="Refresh" @click="clear" v-hasPermi="['chaoyang:analysis:bill:list']">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table">


        <el-row :gutter="10" class="mb8">

          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="getExcel" v-hasPermi="['chaoyang:analysis:bill:export']">导出
            </el-button>
          </el-col>

          <right-toolbar v-model:showSearch="showSearch" @queryTable="getData"></right-toolbar>
        </el-row>
        <el-table :data="tableData" border style="width: 100%" :span-method="objectSpanMethod" :header-cell-style="{ 'text-align': 'center' }" name="table" v-loading="loading" element-loading-text="加载中...">
          <el-table-column type="index" label="序号" width="60" fixed align="center">
            <template #default="scope">
              <template v-if="scope.row.cellName == '合计'">
                <span>
                  合计
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="orderPay" label="支付方式" fixed min-width="100" />
          <el-table-column prop="username" label="支付人" fixed width="100" />
          <el-table-column label="电">
            <el-table-column prop="electricCharge" label="缴费(元)" fixed align="right" />
            <el-table-column prop="electricRefund" label="退费(元)" fixed align="right" />
            <el-table-column prop="electricStat" label="小计(元)" fixed align="right" />
          </el-table-column>
          <el-table-column label="水">
            <el-table-column prop="waterCharge" label="缴费(元)" fixed align="right" />
            <el-table-column prop="waterRefund" label="退费(元)" fixed align="right" />
            <el-table-column prop="waterStat" label="小计(元)" fixed align="right" />
          </el-table-column>
          <el-table-column label="统计">
            <el-table-column prop="lineCharge" label="缴费(元)" fixed align="right" />
            <el-table-column prop="lineRefund" label="退费(元)" fixed align="right" />
            <el-table-column prop="lineStat" label="小计(元)" fixed align="right" />
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getList, getTreeNodes } from "@/api/payment/finance";
import moment from "moment";
import { get } from "lodash";
const { proxy } = getCurrentInstance();
//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(false);
let tableData = ref([]);
const areaOption = ref([]);
const rangeType = ref("date");
const timeOption = ref([
  { value: "yyyy", label: "按年汇总" },
  { value: "yyyy-MM", label: "按月汇总" },
  { value: "yyyy-MM-dd", label: "按日汇总" },
]);
let queryParams = ref({
  timeType: "yyyy-MM-dd",
  time: moment().format("YYYY"),
  dayTypeTime: [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
  regionId: "",
});
const colrow = ref([]);

//汇总方式改变 
const timeTypeChange = (value) => {
  switch (value) {
    case 'yyyy':
      rangeType.value = 'year'
      queryParams.value.time = moment().format('YYYY')
      break;
    case 'yyyy-MM':
      rangeType.value = 'month'
      queryParams.value.time = moment().format('YYYY-MM')
      break;
    case 'yyyy-MM-dd':
      rangeType.value = 'date'
      // queryParams.value.time = moment().format('YYYY-MM-DD')
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


function getTree () {
  getTreeNodes().then((res) => {
    if (res.code == 200) {
      areaOption.value = recursion(res.data);
      queryParams.value.regionId = res.data[0].regionId;
    }
    getData();
  });
}

// 递归
function recursion (data) {
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

function getData () {
  tableData.value = [];
  loading.value = true;
  if (queryParams.value.regionId == "") {
    loading.value = false;
    return;
  }

  formateParams()
  let params = {};
  if (rangeType.value != 'date') {
    params['timeType'] = queryParams.value.timeType;
    params['time'] = queryParams.value.time;
    params['regionId'] = queryParams.value.regionId;
  } else {
    params['timeType'] = queryParams.value.timeType;
    params['time'] = queryParams.value.dayTypeTime[0];
    params['endTime'] = queryParams.value.dayTypeTime[1];
    params['regionId'] = queryParams.value.regionId;
  }
  getList(params)
    .then((res) => {
      let num = 0;
      res.data.forEach((item1, idx) => {
        if (item1.orderPay == '合计') {
          item1.cellName = '合计'
          item1.orderPay = ''
        }
        colrow.value.push((num += item1.amountList.length));
        item1.amountList.forEach((item2, idx) => {
          item2.orderPay = item1.orderPay;
          if (item1.cellName)
            item2.cellName = '合计'
          tableData.value.push(item2);
        });
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

//上传时间前先做转化
const formateParams = () => {
  switch (queryParams.value.timeType) {
    case 'yyyy':
      queryParams.value.time = moment(queryParams.value.time).format('YYYY')
      break;
    case 'yyyy-MM':
      queryParams.value.time = moment(queryParams.value.time).format('YYYY-MM')
      break;
    case 'yyyy-MM-dd':
      queryParams.value.time = moment(queryParams.value.time).format('YYYY-MM-DD')
      break;
    default:
      break;
  }
}

function getExcel () {
  formateParams()
  let params = {
    time: '',
    regionId: '',
    timeType: ''
  }
  if (rangeType.value != 'date') {
    params['timeType'] = queryParams.value.timeType;
    params['time'] = queryParams.value.time;
    params['regionId'] = queryParams.value.regionId;
  } else {
    params['timeType'] = queryParams.value.timeType;
    params['time'] = queryParams.value.dayTypeTime[0];
    params['endTime'] = queryParams.value.dayTypeTime[1];
    params['regionId'] = queryParams.value.regionId;
  }
  proxy.download(
    "/payment/stat/analysis/financialAccount/export",
    params,
    `财务对账导出.xlsx`
  );
}

async function clear () {
  queryParams.value = {
    timeType: "yyyy",
    time: moment().format("YYYY"),
    regionId: "",
  }
  rangeType.value = "year";
  await getTree()
}

function objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
  if (columnIndex === 1) {
    if (rowIndex === 0) {
      return {
        rowspan: colrow.value[0],
        colspan: 1,
      };
    } else if (rowIndex === colrow.value[0]) {
      return {
        rowspan: colrow.value[1] - colrow.value[0],
        colspan: 1,
      };
    } else if (rowIndex === colrow.value[1]) {
      return {
        rowspan: colrow.value[2] - colrow.value[1],
        colspan: 1,
      };
    } else if (rowIndex === colrow.value[2]) {
      return {
        rowspan: 1,
        colspan: 2,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  } else if (columnIndex === 2 && rowIndex === colrow.value[2]) {
    return {
      rowspan: 0,
      colspan: 0,
    };
  }
}
getTree();
</script>

<style scoped lang="scss">
::v-deep .el-table__body {
  .el-table__row:last-child td {
    background-color: var(--el-table-row-hover-bg-color) !important;
  }
}
</style>
