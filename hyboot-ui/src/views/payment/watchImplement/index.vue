<template>
  <div class="page-container">
    <div class="content">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px" label-position="left">
          <el-form-item label="摊位" prop="name">
            <el-input v-model="queryParams.stallName" placeholder="请输入摊位名称" clearable style="width: 240px" @keyup.enter="getData" />
          </el-form-item>
          <el-form-item label="表具类型" prop="type">
            <el-select v-model="queryParams.deviceType" placeholder="全部" :clearable="true" style="width: 240px">
              <el-option v-for="dict in tableOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="告警类型" prop="warn">
            <el-select v-model="queryParams.alarmType" placeholder="全部" clearable style="width: 240px">
              <el-option v-for="dict in warnOption" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" prop="userName">
            <el-input v-model="queryParams.contacts" placeholder="请输入联系人" clearable style="width: 240px" @keyup.enter="getData" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable style="width: 240px" @keyup.enter="getData" />
          </el-form-item>
          <el-form-item label="表具编号" prop="deviceNumber">
            <el-input v-model="queryParams.deviceNumber" placeholder="请输入表具编号" clearable style="width: 240px" @keyup.enter="getData" />
          </el-form-item>
          <el-form-item label="时间" prop="alarmTime">
            <el-date-picker v-model="queryParams.alarmTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" @change="getData" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getData" v-hasPermi="['chaoyang:alarmLog:list']">搜索</el-button>
            <el-button icon="Refresh" @click="clear" v-hasPermi="['chaoyang:alarmLog:list']">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table">
        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getData"></right-toolbar>
        </el-row>
        <el-table :data="tableData" border class="customer-table" style="width: 100%" :header-cell-style="{ 'text-align': 'center' }" name="table" v-loading="loading" element-loading-text="加载中...">
          <el-table-column type="index" label="序号" width="60" align="center" fixed />
          <el-table-column v-for="item in columns" :key="item" :prop="item.prop" :label="item.label" :fixed="item.fixed" :align="item.align" :min-width="item.minWidth" :width="item.width"></el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <template v-if="scope.row.alarmType == '换表失败' && !(scope.row?.doTimes > 0)">
                <el-popconfirm :title="'确定是否进行重新下发操作？?'" @confirm="confirmEvent(scope.row)">
                  <template #reference>
                    <el-button type="text" icon="RefreshRight" v-hasPermi="['chaoyang:alarmLog:reGiveOut']">重新下发</el-button>
                  </template>
                </el-popconfirm>
              </template>
              <template v-else-if="!(scope.row.alarmType == '换表失败')">
                <el-button type="text" icon="Edit" @click="handleDelete(scope)" v-hasPermi="['chaoyang:alarmLog:remove']">手动解除
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <pagination class="pagination" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { ElMessage } from 'element-plus'
import { getListAPI, delAlarmAPI, rechargeAPI } from "@/api/payment/watchImplement";
import moment from "moment";
const { proxy } = getCurrentInstance();
//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(false);
let tableData = ref([]);

const indication = ref('剩余用量(KWh/t)')

//根据查询条件显示列的单位
const indicationChange = () => {
  if (queryParams.value.deviceType == '0')
    indication.value = '剩余用量(KWh)'
  else if (queryParams.value.deviceType == '1')
    indication.value = '剩余用量(t)'
  else
    indication.value = '剩余用量(KWh/t)'
}

watch(indication, (newValue, oldValue) => {
  columns.value[9].label = newValue
})


let columns = ref([
  {
    prop: "stallName",
    label: "摊位",
    align: 'left',
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
    prop: "contacts",
    label: "联系人",
    align: 'left',
    width: '100',
    minWidth: '100'
  },
  {
    prop: "phonenumber",
    label: "手机号",
    align: 'left',
    width: '110',
    minWidth: ''
  },
  {
    prop: "deviceModel",
    label: "表具型号",
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    prop: "deviceName",
    label: "表具名称",
    align: 'left',
    width: '',
    minWidth: '180'
  },
  {
    prop: "deviceNumber",
    label: "表具编号",
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    prop: "alarmType",
    label: "告警类型",
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    prop: "alarmTime",
    label: "告警时间",
    align: 'center',
    width: '160',
    minWidth: '100'
  },
  {
    prop: "indication",
    label: indication.value,
    align: 'right',
    width: '',
    minWidth: '150'
  },
  {
    prop: "indicationAmount",
    label: "剩余金额（元）",
    align: 'right',
    width: '',
    minWidth: '150'
  },
  {
    prop: "smsCount",
    label: "通知次数（次）",
    align: 'right',
    width: '',
    minWidth: '150'
  },
  {
    prop: "smsTime",
    label: "通知时间",
    align: 'center',
    width: '160',
    minWidth: '100'
  },
]);



const tableOption = ref([
  { value: "0", label: "电表" },
  { value: "1", label: "水表" },
]);
const warnOption = ref([
  { value: "1", label: "低量报警" },
  { value: "2", label: "欠费报警" },
  { value: "3", label: "强制关断" },
  { value: "4", label: "强制合闸" },
  { value: "5", label: "换表失败" },
]);
const queryParams = ref({
  stallName: "",
  deviceType: "",
  alarmType: undefined,
  contacts: "",
  phonenumber: "",
  pageSize: 10,
  pageNum: 1,
  alarmTime: moment().format('YYYY-MM-DD'),
  deviceNumber: ''
});

const total = ref(0)

function clear () {
  queryParams.value = {
    stallName: "",
    deviceType: "",
    alarmType: undefined,
    contacts: "",
    phonenumber: "",
    pageNum: 1,
    pageSize: 10,
    alarmTime: moment().format('YYYY-MM-DD'),
    deviceNumber: ''
  };
  getData()
}

function getData () {
  tableData.value = [];
  loading.value = true;
  getListAPI(queryParams.value)
    .then((res) => {
      if (res.code == 200) {
        tableData.value = res.rows;
        total.value = res.total;
      }
    })
    .finally(() => {
      indicationChange()
      loading.value = false;
    });
}

function handleDelete (scope) {
  proxy.$modal
    .confirm('确定是否进行手动解除操作？')
    .then(function () {
      return delAlarmAPI(scope.row.alarmLogId);
    })
    .then(() => {
      getData();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => { });
}

//重新下发按钮
const confirmEvent = (row) => {
  let obj = {
    alarmLogId: row.alarmLogId,
  }
  loading.value = true;
  rechargeAPI(obj).then(res => {
    ElMessage({
      type: 'success',
      message: '重新下发成功'
    })
  }).finally(() => {
    loading.value = false;
  })
}

getData();
</script>

<style scoped lang="scss">

</style>
