<template>
  <div class="page-container">
    <div class="content">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px" label-position="left">
          <el-form-item label="摊位" prop="stallName">
            <el-input v-model="queryParams.stallName" placeholder="请输入摊位名称" clearable style="width: 240px" @keyup.enter="getData" />
          </el-form-item>
          <el-form-item label="表具类型" prop="deviceType">
            <el-select v-model="queryParams.deviceType" placeholder="全部" clearable style="width: 240px">
              <el-option v-for="dict in tableOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="失败类型" prop="orderType">
            <el-select v-model="queryParams.orderType" placeholder="全部" clearable style="width: 240px">
              <el-option v-for="dict in warnOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="queryParams.contacts" placeholder="请输入联系人" clearable style="width: 240px" @keyup.enter="getData" />
          </el-form-item>
          <el-form-item label="手机号" prop="phonenumber">
            <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable style="width: 240px" @keyup.enter="getData" />
          </el-form-item>
          <el-form-item class="button-container">
            <el-button type="primary" icon="Search" @click="getData" v-hasPermi="['chaoyang:alarmLog:list']">搜索</el-button>
            <el-button icon="Refresh" @click="clear" v-hasPermi="['chaoyang:alarmLog:list']">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- <div class="search-button"></div> -->
      </div>
      <div class="table">
        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getData"></right-toolbar>
        </el-row>

        <el-table :data="tableData" border class="customer-table" style="width: 100%" :header-cell-style="{ 'text-align': 'center' }" name="table" v-loading="loading" element-loading-text="加载中...">
          <el-table-column type="index" label="序号" width="60" fixed align="center" />
          <el-table-column v-for="item in columns" :key="item" :prop="item.prop" :label="item.label" :fixed="item.fixed" :align="item.align" :min-width="item.minWidth" :width="item.width"></el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button type="text" icon="Loading" v-hasPermi="['chaoyang:alarmLog:communication']" @click="testCommunication(scope.row)">测试通讯</el-button>
              <el-popconfirm :title="'确定是否进行重新下发操作？'" @confirm="confirmEvent(scope.row)">
                <template #reference>
                  <el-button type="text" icon="RefreshRight" v-hasPermi="['chaoyang:alarmLog:recharge']">重新下发</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <pagination class="pagination" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getList, alarmLog, reIssued } from "@/api/payment/paymentFiled";
import { ElMessage } from 'element-plus'
//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(false);
let tableData = ref([]);
let columns = ref([
  {
    prop: "orderNo",
    label: "订单号",
    align: 'left',
    width: '',
    minWidth: '210'
  },
  {
    prop: "stallName",
    label: "摊位",
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    prop: "orderAmount",
    label: "金额（元）",
    align: 'right',
    width: '',
    minWidth: '120'
  },
  {
    prop: "deviceType",
    label: "表具类型",
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    prop: "orderType",
    label: "业务类型",
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    prop: "username",
    label: "操作人",
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
    prop: "indication",
    label: "剩余用量（KWh/t）",
    align: 'right',
    width: '',
    minWidth: '150'
  },
  {
    prop: "indicationAmount",
    label: "剩余金额（元）",
    align: 'right',
    width: '',
    minWidth: '130'
  },
  {
    prop: "indicationTime",
    label: "上报时间",
    align: 'center',
    width: '',
    minWidth: '160'
  },
]);
const tableOption = ref([
  { value: "0", label: "电表" },
  { value: "1", label: "水表" },
]);
const warnOption = ref([
  { value: "0", label: "缴费失败" },
  { value: "1", label: "退费失败" },
]);
const total = ref(0);
const queryParams = ref({
  deviceType: "",
  orderType: "",
  stallName: "",
  contacts: undefined,
  phonenumber: undefined,
  pageNum: 1,
  pageSize: 10,
});

function clear () {
  queryParams.value = {
    deviceType: "",
    orderType: "",
    stallName: "",
    contacts: undefined,
    phonenumber: undefined,
    pageNum: 1,
    pageSize: 10,
  };
  getData()
}

function getData () {
  loading.value = true;
  tableData.value = [];
  getList(queryParams.value)
    .then((res) => {
      tableData.value = res.rows;
      total.value = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

function testCommunication (row) {
  loading.value = true;
  alarmLog(row.orderNo).then(res => {
    if(res.msg=='设备离线')
      ElMessage({
        type: 'warning',
        message: `${res.msg}`
      })
    else
      ElMessage({
        type: 'success',
        message: `${res.msg}`
      })
  }).catch((err) => { }).finally(() => {
    loading.value = false;
  });
};

//重新下发按钮是否显示
function confirmEvent (data) {
  let obj = {
    orderId: data.orderId,
    stallName: data.stallName,
  }
  loading.value = true;
  ElMessage({
    type: 'info',
    message: '正在测试通讯状态'
  })
  alarmLog(data.orderNo).then(res => {
    ElMessage({
      type: 'success',
      message: '该表具处于在线状态,正在尝试重新下发'
    })
    reIssued(obj).then(res => {
      ElMessage({
        type: 'info',
        message: '正在尝试重新下发,请耐心等待'
      })
    }).finally(() => {
      getData()
      loading.value = false;
    })
  }).finally(() => {
    loading.value = false;
  })
}

getData();
</script>
