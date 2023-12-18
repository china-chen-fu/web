<template>
  <div class="page-container">
    <div class="content">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="起止时间" style="width: 400px">
            <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
          </el-form-item>
          <el-form-item label="摊位" prop="stallName">
            <el-input v-model="queryParams.stallName" placeholder="请输入摊位名称" clearable style="width: 240px" @keyup.enter="getData" />
          </el-form-item>
          <el-form-item label="表具类型" prop="deviceType">
            <el-select v-model="queryParams.deviceType" placeholder="全部" style="width: 240px">
              <el-option v-for="dict in tableOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="search-button-container">
          </el-form-item>
          <el-form-item class="button-container">
            <el-button type="primary" icon="Search" v-hasPermi="['chaoyang:analysis:energy:list']" @click="getData">搜索</el-button>
            <el-button icon="Refresh" @click="clear" v-hasPermi="['chaoyang:analysis:energy:list']">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table" ref="tableWrapper">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="getExcel" v-hasPermi="['chaoyang:analysis:energy:export']">导出
            </el-button>
          </el-col>
          <right-toolbar v-hasPermi="['chaoyang:analysis:energy:list']" v-model:showSearch="showSearch" @queryTable="getData"></right-toolbar>
        </el-row>
        <el-table element-loading-text="加载中..." :data="tableData" border class="customer-table" :max-height="tableHeight" show-summary :summary-method="getSummaries" style="width: 100%" :cell-style="setSellStyle" :header-cell-style="{ 'text-align': 'center' }" name="table" v-loading="loading">
          <el-table-column type="index" label="序号" width="60" fixed>
          </el-table-column>
          <el-table-column v-for="item in columns" :key="item" :prop="item.prop" :label="item.label" :fixed="item.fixed" :width="item.width"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import moment from "moment";
import { getList } from "@/api/payment/difference";

const { proxy } = getCurrentInstance();
//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(false);
let tableData = ref([]);
let componentKey = ref(-1)
const queryParams = ref({
  stallName: "",
  deviceType: "0",
});
let columns = ref([]);
const tableOption = ref([
  { value: "0", label: "电表" },
  { value: "1", label: "水表" },
]);
const dateRange = ref([
  moment().startOf("month").format("YYYY-MM-DD"),
  moment().endOf("month").format("YYYY-MM-DD"),
]);

function getExcel () {
  queryParams.value.startTime = dateRange.value[0] ? dateRange.value[0] : moment().format("YYYY-MM-DD");
  queryParams.value.endTime = dateRange.value[1] ? dateRange.value[1] : moment().format("YYYY-MM-DD");
  proxy.download(
    "/payment/stat/analysis/energy/difference/export",
    queryParams.value,
    `交易明细导出.xlsx`
  );
}

function setSellStyle ({ row, column, rowIndex, columnIndex }) {
  let textAlign = {};
  //数值型
  if (columnIndex == 6 || columnIndex == 8 || columnIndex == 9) {
    textAlign = { 'text-align': 'right' }
  }
  //字符串类型
  if (columnIndex == 1 || columnIndex == 2 || columnIndex == 4 || columnIndex == 3) {
    textAlign = { 'text-align': 'left' }
  }
  //日期类型
  if (columnIndex == 7 || columnIndex == 5 || columnIndex == 0) {
    textAlign = { 'text-align': 'center' }
  }
  return textAlign;
}

function getSummaries (param) {
  const { columns, data } = param;
  let sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    if (index !== 0 && index !== 9) {
      sums[index] = ''
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    const flag = values.every(item => isNaN(item))
    if (!flag) {
      sums[index] = values.reduce((total, item) => total + item);
      sums[index] = Math.round(sums[index] * 100) / 100;
    } else {
      sums[index] = ''
    }
  })
  return sums
}

function getData () {
  columns.value = [
    { prop: "stallName", label: "摊位", width: '' },
    { prop: "deviceType", label: "表具类型", width: '', },
    { prop: "deviceModel", label: "表具型号", width: '' },
    { prop: "deviceNumber", label: "表具编号", width: '' },
    { prop: "beginTime", label: "开始时间", width: '160' },
    { prop: "startIndication", label: queryParams.value.deviceType == '0' ? '开始示数（kwh）' : queryParams.value.deviceType == '1' ? '开始示数（t）' : '开始示数', width: '' },
    { prop: "finishTime", label: "结束时间", width: '160' },
    { prop: "endIndication", label: queryParams.value.deviceType == '0' ? '结束示数（kwh）' : queryParams.value.deviceType == '1' ? '结束示数（t）' : '结束示数', width: '' },
    { prop: "differenceIndication", label: queryParams.value.deviceType == '0' ? '用量（kwh）' : queryParams.value.deviceType == '1' ? '用量（t）' : '用量', width: '' },
  ]
  loading.value = true;
  queryParams.value.startTime = dateRange.value[0] ? dateRange.value[0] : moment().format("YYYY-MM-DD");
  queryParams.value.endTime = dateRange.value[1] ? dateRange.value[1] : moment().format("YYYY-MM-DD");
  componentKey.value = Math.random();
  getList(queryParams.value).then((res) => {
    res.data.forEach((item, index) => {
      res.data[index].differenceIndication = Number(res.data[index].differenceIndication)
    })
    tableData.value = res.data;
  }).finally(() => {
    loading.value = false;
  });
}

watch(showSearch, (newValue) => {
  fetTableHeight()
})

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

function clear () {
  dateRange.value = [
    moment().startOf("month").format("YYYY-MM-DD"),
    moment().endOf("month").format("YYYY-MM-DD"),
  ];
  queryParams.value = {
    stallName: "",
    deviceType: "0",
  };
  getData();
}

onBeforeMount(() => {
  getData();
})

onMounted(() => {
  fetTableHeight()
})
</script>

<style scoped lang="scss">
.transaction {
  background-color: #f8f8f8;
  width: 100%;
  height: calc(100vh - 70px);

  .content {
    width: 100%;
    height: 100%;
    padding: 24px 24px 0 24px;
    display: flex;
    flex-direction: column;
  }

  .search {
    margin-bottom: 24px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 8px;
  }

  .search-item {
    padding: 16px 0 0 16px;

    // ::v-deep .el-form {
    //   display: flex;
    //   flex-flow: row wrap;
    // }

    // .search-button-container {
    //   flex-grow: 1;
    //   justify-content: end;
    // }

    // ::v-deep .el-form-item__content {
    //   flex: none;
    // }
  }

  .my-button {
    border: 1px solid #546fff;
    background: #eef1ff;

    &:hover {
      border: 1px solid rgba(84, 111, 255, 0.8);
      color: rgba(84, 111, 255, 0.8);
    }
  }

  .search-button {
    padding: 16px 16px 16px 0;
    display: flex;
    flex: 1;
    flex-wrap: nowrap;
    justify-content: end;
  }

  .mb8 {
    padding: 0 21px;
  }

  .table {
    padding: 24px;
    width: 100%;
    flex: 1;
    background-color: #fff;
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .my-pagination {
    position: relative;
    margin: 10px 0;
  }
}

.search-button-container {
  flex-grow: 1;
  justify-content: end;
}

:deep(.el-table__footer .el-table__cell) {
  text-align: right;
}
</style>
