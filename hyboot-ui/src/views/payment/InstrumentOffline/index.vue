<template>

  <div class="page-container">
    <div class="content" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中...">
      <div class="search" v-show="showSearch">
        <!-- 查询框及按钮 -->
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px" label-position="left">
          <el-form-item prop="decAmount" label="摊位">
            <el-input placeholder="请输入内容" v-model="queryParams.stallName" style="width: 240px">
            </el-input>
          </el-form-item>
          <el-form-item prop="decAmount" label="表具类型">
            <el-select v-model="queryParams.deviceType" placeholder="全部" clearable style="width: 240px" :clearable="true">
              <el-option v-for="item in [{ label: '电表', value: '0' }, { label: '水表', value: '1' }]" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="decAmount" label="联系人">
            <el-input placeholder="请输入内容" v-model="queryParams.contacts" style="width: 240px">
            </el-input>
          </el-form-item>
          <el-form-item prop="decAmount" label="手机号">
            <el-input placeholder="请输入内容" v-model="queryParams.phonenumber" style="width: 240px">
            </el-input>
          </el-form-item>


          <el-form-item class="button-container">
            <el-button type="primary" icon="Search" @click="getListData" v-hasPermi="['chaoyang:alarmLog:deviceOffline']">搜索</el-button>
            <el-button icon="Refresh" @click="resetClick" v-hasPermi="['chaoyang:alarmLog:deviceOffline']">重置</el-button>
          </el-form-item>
        </el-form>

      </div>
      <div class="table">
        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getListData"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="tableData" style="width: 100%;" border class="customer-table" :header-cell-style="{ 'text-align': 'center' }" name="table">

          <el-table-column type="index" label="序号" width="60" fixed align="center" />
          <el-table-column v-for="(item, index) in tableColumn" :key="index" :label="item.label" :prop="item.prop" :min-width="item.minWidth" :width="item.width" />

          <el-table-column prop="indication" :label="indication" min-width="120" align="right" />
          <el-table-column prop="indicationAmount" label="剩余金额(元)" width="120" align="right" />
          <el-table-column prop="reportTime" label="最后上报时间" width="160" align="center" />

          <el-table-column label="操作" width="130">
            <template #default="scope">
              <el-button type="text" icon="Loading" v-hasPermi="['chaoyang:alarmLog:testCommunication']" @click="testCommunication(scope.row)">测试通讯</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination class="pagination" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getListData" />

      </div>

    </div>
  </div>


</template>
<script setup>

import { reactive, ref, toRefs } from "vue";
import { getToken } from "@/utils/auth";
import { getDeviceOfflinelist, testCommunicationAPI } from "@/api/payment/alarmLog";
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance();
let fullscreenLoading = ref(false)
const loading = ref(true);
//是否有显示搜索框
const showSearch = ref(true);
//列表 列头
const tableColumn = [
  {
    label: '摊位',
    prop: 'stallName',
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    label: '表具类型',
    prop: 'deviceType',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '联系人',
    prop: 'contacts',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '手机号',
    prop: 'phonenumber',
    align: 'left',
    width: '110',
    minWidth: ''
  },
  {
    label: '表具型号',
    prop: 'modelName',
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    label: '表具编号',
    prop: 'number',
    align: 'left',
    width: '',
    minWidth: '120'
  },
]

const indication=ref('剩余用量(KWh/t)')

//根据查询条件显示列的单位
const indicationChange=()=>{
  if(queryParams.value.deviceType=='0')
    indication.value= '剩余用量(KWh)'
  else  if(queryParams.value.deviceType=='1')
    indication.value= '剩余用量(t)'
  else
    indication.value= '剩余用量(KWh/t)'
}

//获得列表数据
let queryParams = ref({
  templateName: null,
  deviceModel: null,
  stallName: null,
  deviceType: null,
  contacts: null,
  phonenumber: null,
  pageSize: 10,
  pageNum: 1,
});


const total = ref(0)
//查询条件重置
const resetClick = () => {

  queryParams.value = {
    templateName: null,
    deviceModel: null,
    stallName: "",
    deviceType: null,
    contacts: "",
    phonenumber: "",
    pageSize: 10,
    pageNum: 1,
  }

  getListData()
}

const tableData = ref([]);


const getListData = () => {
  loading.value = true;
  tableData.value = []
  getDeviceOfflinelist(queryParams.value)
    .then((res) => {
      loading.value = false;
      tableData.value = res.rows;
      total.value = res.total
    })
    .finally(() => {
      indicationChange()
      loading.value = false;
    });
}

function testCommunication (row) {
  fullscreenLoading.value = true;

  testCommunicationAPI(row.alarmLogId).then(res => {
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
    getListData()
    fullscreenLoading.value = false;
  });
};

getListData()
</script>
<style lang="scss" scoped>

</style>


