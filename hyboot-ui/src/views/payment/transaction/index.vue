<template>
  <div class="page-container">
    <div class="content">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px" label-position="left">
          <el-form-item label="交易日期">
            <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" clearable style="width: 240px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="摊位" prop="stallName">
            <el-input v-model="queryParams.stallName" placeholder="请输入摊位名称" clearable style="width: 240px" @keyup.enter="getListData" />
          </el-form-item>
          <el-form-item label="表具类型" prop="deviceType">
            <el-select v-model="queryParams.deviceType" placeholder="全部" clearable style="width: 240px">
              <el-option v-for="dict in tableOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型" prop="businessType">
            <el-select v-model="queryParams.businessType" placeholder="全部" style="width: 240px">
              <el-option v-for="dict in businessOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="操作人" prop="operator">
            <el-select v-model="operator" placeholder="全部" clearable style="width: 240px">
              <el-option v-for="dict in operatorOption" :key="dict.userId" :label="dict.operatorName" :value="dict.userId" />
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式" prop="orderPay">
            <el-select v-model="queryParams.orderPay" placeholder="全部" clearable style="width: 240px">
              <el-option v-for="dict in payOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="订单状态" prop="orderStatus">
            <el-select v-model="queryParams.orderStatus" clearable style="width: 240px">
              <el-option label="进行中" value="0" />
              <el-option label="成功" value="1" />
              <el-option label="失败" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getListData" v-hasPermi="['chaoyang:analysis:order:list']">搜索</el-button>
            <el-button icon="Refresh" @click="clear" v-hasPermi="['chaoyang:analysis:order:list']">重置</el-button>
          </el-form-item>
        </el-form>


      </div>
      <div class="table" ref="tableWrapper">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="getExcel" v-hasPermi="['chaoyang:analysis:order:export']">导出
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getListData"></right-toolbar>
        </el-row>

        <el-table :data="tableData" border style="width: 100%;" :header-cell-style="{ 'text-align': 'center' }" name="table" v-loading="loading" element-loading-text="加载中..."
                  :row-class-name="rowClass" :max-height="tableHeight">
          <el-table-column type="index" label="序号" width="60" fixed align="center">
            <template #default="scope">
              <template v-if="scope.row.cellName == '合计'">
                <span>
                  合计
                </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column v-for="item in columns" :key="item" :prop="item.prop" :label="item.label" :fixed="item.fixed" :align="item.align" :min-width="item.minWidth" :width="item.width"></el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">

              <template v-if="scope.row.orderStatus == '成功'">
                <el-button type="text" icon="Edit" @click="openPDF(scope)" v-hasPermi="['chaoyang:analysis:order:export']">下载收据</el-button>
              </template>
              <template v-else-if="scope.row.cellName == '合计'">

              </template>
              <template v-else>
                <el-button type="text" icon="Edit" v-hasPermi="['chaoyang:analysis:order:export']" disabled>下载收据</el-button>
              </template>


            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import moment from "moment";
import { getUser, getList, pdfExport } from "@/api/payment/transaction";
import useUserStore from '@/store/modules/user'
const permissions = useUserStore().permissions

const { proxy } = getCurrentInstance();
//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(false);
let tableData = ref([]);
let columns = ref([
  {
    prop: "orderNo",
    label: "交易订单号",
    align: 'left',
    width: '',
    minWidth: '200'
  },
  {
    prop: "orderTime",
    label: "交易日期",
    align: 'center',
    width: '',
    minWidth: '160'
  },
  {
    prop: "orderAmount",
    label: "金额（元）",
    align: 'right',
    width: '',
    minWidth: '120'
  },
  {
    prop: "orderStatus",
    label: "订单状态",
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    prop: "stallName",
    label: "摊位",
    align: 'left',
    width: '',
    minWidth: '150'
  },
  {
    prop: "deviceType",
    label: "表具类型",
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    prop: "deviceName",
    label: "表具型号",
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    prop: "deviceNumber",
    label: "表具编号",
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    prop: "orderPayName",
    label: "业务类型",
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    prop: "operator",
    label: "操作人",
    align: 'left',
    width: '100',
    minWidth: ''
  },
  {
    prop: "orderPay",
    label: "支付方式",
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    prop: "contacts",
    label: "联系人",
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    prop: "phonenumber",
    label: "手机号",
    align: 'left',
    width: '',
    minWidth: '110'
  },

]);
const tableOption = ref([
  { value: "", label: "全部" },
  { value: "0", label: "电表" },
  { value: "1", label: "水表" },
]);
const businessOption = ref([
  { value: "0", label: "全部" },
  { value: "1", label: "充值" },
  { value: "2", label: "退费" },
  { value: "3", label: "充值记账" },
  { value: "4", label: "退费记账" },
  { value: "5", label: "离场充值" },
  { value: "6", label: "离场退费" },
]);
const operatorOption = ref([]);
const payOption = ref([
  { value: "0", label: "微信" },
  { value: "1", label: "支付宝" },
  { value: "2", label: "现金" },
]);
const dateRange = ref([
  moment().startOf("month").format("YYYY-MM-DD"),
  moment().endOf("month").format("YYYY-MM-DD"),
]);
const operator = ref("");
const queryParams = ref({
  stallName: "",
  deviceType: "",
  businessType: "0",
  operatorName: undefined,
  orderPay: undefined,
  orderPlatform: "",
  orderStatus: '1'
});
const total = ref(0);

function getExcel () {
  // let params = {
  //   startTime: dateRange.value[0]
  //     ? dateRange.value[0]
  //     : moment().format("YYYY-MM-DD"),
  //   endTime: dateRange.value[1]
  //     ? dateRange.value[1]
  //     : moment().format("YYYY-MM-DD"),
  // };
  proxy.download(
    "/payment/stat/analysis/transactionDetails/export",
    queryParams.value,
    `交易明细导出.xlsx`
  );
}
function openPDF (scope) {
  let it = scope.row;
  // let url = `${window.document.location.origin}${import.meta.env.VITE_APP_BASE_API}/payment/stat/analysis/transactionDetails/pdfExport?orderNo=${scope.row.orderNo}`
  // window.open(url)
  // // pdfExport({orderNo: scope.row.orderNo}).then(async(data) => {
  // //   const isLogin = await blobValidate(data);
  // //   if (isLogin) {
  // //     const blob = new Blob([data])
  // //     saveAs(blob, `${scope.row.orderPayName}${scope.row.deviceType}.pdf`)
  // //   }
  // // })
  if (permissions.includes('chaoyang:analysis:order:export') || permissions.includes('*:*:*')) {
    // let url = `${window.document.location.origin}${import.meta.env.VITE_APP_BASE_API}/payment/stat/analysis/transactionDetails/pdfExport?orderNo=${it.orderNo}`
    // window.open(url)
    pdfExport({ orderNo: it.orderNo }).then(res => {
      const blob = new Blob([res]);
      const fileName = `${it.orderNo}.pdf`
      if ('download' in document.createElement('a')) { // 非IE下载
        const eLink = document.createElement('a')
        eLink.download = fileName
        eLink.style.display = 'none'
        eLink.href = URL.createObjectURL(blob)
        document.body.appendChild(eLink)
        eLink.click()
        URL.revokeObjectURL(eLink.href) // 释放URL 对象
        document.body.removeChild(eLink)
      } else {
        navigator.msSaveBlob(blob, fileName)
      }
    })
  }
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

function getListData () {
  tableData.value = [];
  loading.value = true;
  queryParams.value.startTime = dateRange.value[0]
    ? dateRange.value[0]
    : moment().format("YYYY-MM-DD");
  queryParams.value.endTime = dateRange.value[1]
    ? dateRange.value[1]
    : moment().format("YYYY-MM-DD");
  operatorOption.value.forEach((item, idx) => {
    if (item.userId == operator.value) {
      queryParams.value.orderPlatform = item.orderPlatform;
      queryParams.value.operatorName = item.operatorName;
    }
  });
  getList(queryParams.value)
    .then((res) => {
      tableData.value = res.data;
      tableData.value.map(item => {
        if (item.orderNo == '合计') {
          item.cellName = '合计'
          item.orderNo = ''
        }
        return item
      })
    })
    .finally(() => {
      loading.value = false;
    });
}
function clear () {
  dateRange.value = [
    moment().startOf("month").format("YYYY-MM-DD"),
    moment().endOf("month").format("YYYY-MM-DD"),
  ];
  operator.value = ''
  queryParams.value = {
    stallName: "",
    deviceType: "",
    businessType: "0",
    operatorName: undefined,
    orderPay: undefined,
    orderPlatform: "",
    orderStatus: '1'
  };
  getListData()
}
function getUsername () {
  getUser().then((res) => {
    operatorOption.value = res.data;
  });
}
getUsername();
getListData();
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
