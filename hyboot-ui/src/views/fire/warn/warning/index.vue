<template>
  <div class="page-container">
    <div class="content">
      <div class="search">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="告警类型" prop="alarmType">
            <el-select v-model="queryParams.alarmType">
              <el-option label="设备离线" :value="0"></el-option>
              <el-option label="剩余电流超限" :value="1"></el-option>
              <el-option label="三项温度超限" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消息推送" prop="smsPush">
            <el-select v-model="queryParams.smsPush">
              <el-option label="已推送" :value="0"></el-option>
              <el-option label="不推送" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="button-container">
            <el-button type="primary" :loading="searchLoading" v-hasPermi="['fire:alarmLog:list']" icon="Search" @click="getData">查询</el-button>
            <el-button icon="Refresh" v-hasPermi="['fire:alarmLog:list']" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="table" ref="pageTableWrapper" style="height: 100%">


        <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border style="width: 100%; margin-top: 20px;" :header-cell-style="{ 'text-align': 'center' }" :max-height="pageTableHeight">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column v-for="(item, index) in column" :key="index" :label="item.label" :width="item.width" :prop="item.prop" :align="item.align" />
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button type="text" v-hasPermi="['fire:alarmLog:query']" icon="View" @click="detail(scope.row)">查看</el-button>
              <el-popconfirm @confirm="relieve(scope.row)" confirm-button-text="确定" cancel-button-text="取消" :title="'是否进行手动解除操作？'">
                <template #reference>
                  <el-button v-hasPermi="['fire:alarmLog:edit']" type="text" icon="Delete">手动解除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <pagination class="pagination" v-show="queryParams.total > 0" :total="queryParams.total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getData" />
        <br />
      </div>
    </div>

    <el-dialog title="告警详情" v-model="visible" append-to-body destroy-on-close :before-close="handleDialogClose" :width="dialogWidth">
      <div style="overflow: auto;max-height: 500px;">
        <el-form v-if="!isLongDialog" ref="warnRef" :model="form" label-width="100px">
          <div class="dialog-basic-info">基本信息</div>
          <el-form-item label="告警时间:">
            {{ form.alarmTime }}
          </el-form-item>
          <el-form-item label="消息推送:">
            {{ form.smsPush }}
          </el-form-item>
          <el-form-item label="告警内容:">
            {{ form.alarmContent }}
          </el-form-item>
          <el-form-item label="告警类型:">
            {{ form.alarmType }}
          </el-form-item>
          <el-form-item label="设备:">
            {{ form.deviceName }}
          </el-form-item>
        </el-form>
        <div v-else>
          <div class="dialog-basic-info">基本信息</div>
          <div class="dialog-inner-box">
            <div class="inner-box-item">
              <div>告警时间:</div>
              <div>{{ form.alarmTime }}</div>
            </div>
            <div class="inner-box-item">
              <div>消息推送:</div>
              <div>{{ form.smsPush }}</div>
            </div>
            <div class="inner-box-item">
              <div style="width: 110px;padding-right: 5px;">告警内容:</div>
              <div>{{ form.alarmContent }}</div>
            </div>
            <div class="inner-box-item">
              <div>告警类型:</div>
              <div>{{ form.alarmType }}</div>
            </div>
            <div class="inner-box-item">
              <div>设备:</div>
              <div>{{ form.deviceName }}</div>
            </div>
          </div>
          <div class="dialog-basic-info">数据明细</div>
          <div class="dialog-inner-box">
            <div class="inner-box-item" v-for="(item, index) in dialogDetail.data" :key="index">
              <div>{{ item.label }}</div>
              <div>{{ item.value }} {{ item.unit }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import warnService from '../../../../api/fire/warn'
import { ElMessage } from 'element-plus'
const loading = ref(false);

let queryParams = reactive({
  alarmType: null,
  smsPush: null,
  pageSize: 10,
  pageNum: 1,
  total: 0
})
let visible = ref(false)

let searchLoading = ref(false)

const column = [
  {
    label: "告警内容",
    prop: 'alarmContent',
    width: '',
    align: 'left'
  },
  {
    label: "告警类型",
    prop: 'alarmType',
    width: '120',
    align: 'left'
  },
  {
    label: "告警时间",
    prop: 'alarmTime',
    width: '160',
    align: 'left'
  },
  {
    label: "消息推送",
    prop: 'smsPush',
    width: '100',
    align: 'left'
  },
]
let tableData = ref([])
let dialogDetail = reactive({
  data: [
    { label: '剩余电流:', value: '', unit: 'mA', prop: 'leakage' },
    { label: '温度1:', value: '', unit: '℃', prop: 'ta' },
    { label: '温度2:', value: '', unit: '℃', prop: 'tb' },
    { label: '温度3:', value: '', unit: '℃', prop: 'tc' },
    { label: '正向有功电能:', value: '', unit: 'kwh', prop: 'consumption' },
    { label: 'A相电压:', value: '', unit: 'V', prop: 'ua' },
    { label: 'B相电压:', value: '', unit: 'V', prop: 'ub' },
    { label: 'C相电压:', value: '', unit: 'V', prop: 'uc' },
    { label: 'AB相电压:', value: '', unit: 'V', prop: 'uab' },
    { label: 'CA相电压:', value: '', unit: 'V', prop: 'uca' },
    { label: 'BC相电压:', value: '', unit: 'V', prop: 'ubc' },
    { label: 'A相电流:', value: '', unit: 'A', prop: 'ia' },
    { label: 'B相电流:', value: '', unit: 'A', prop: 'ib' },
    { label: 'C相电流:', value: '', unit: 'A', prop: 'ic' },
    { label: 'A相频率:', value: '', unit: 'Hz', prop: 'fa' },
    { label: 'B相频率:', value: '', unit: 'Hz', prop: 'fb' },
    { label: 'C相频率:', value: '', unit: 'Hz', prop: 'fc' },
    { label: '剩余电流告警:', value: '否', unit: '', prop: 'remainEleAlarm' },
    { label: '温度1告警:', value: '否', unit: '', prop: 'taAlarm' },
    { label: '温度2告警:', value: '否', unit: '', prop: 'tbAlarm' },
    { label: '温度3告警:', value: '否', unit: '', prop: 'tcAlarm' },
    { label: '供电中断:', value: '否', unit: '', prop: 'supplyAlarm' },
    { label: '电压逆相序:', value: '否', unit: '', prop: 'uaInverse' },
    { label: '电流逆相序:', value: '否', unit: '', prop: 'iaInverse' },
    { label: 'A相过载:', value: '否', unit: '', prop: 'aoverload' },
    { label: 'B相过载:', value: '否', unit: '', prop: 'boverload' },
    { label: 'C相过载:', value: '否', unit: '', prop: 'coverload' },
    { label: 'A相过压:', value: '否', unit: '', prop: 'aoverpressure' },
    { label: 'B相过压:', value: '否', unit: '', prop: 'boverpressure' },
    { label: 'C相过压:', value: '否', unit: '', prop: 'coverpressure' },
    { label: 'A相欠压:', value: '否', unit: '', prop: 'aundervoltage' },
    { label: 'B相欠压:', value: '否', unit: '', prop: 'bundervoltage' },
    { label: 'C相欠压:', value: '否', unit: '', prop: 'cundervoltage' },
    { label: 'A相缺相:', value: '否', unit: '', prop: 'aphase' },
    { label: 'B相缺相:', value: '否', unit: '', prop: 'bphase' },
    { label: 'C相缺相:', value: '否', unit: '', prop: 'cphase' },
    { label: 'A相过流1:', value: '否', unit: '', prop: 'aovercurrentOne' },
    { label: 'B相过流1:', value: '否', unit: '', prop: 'bovercurrentOne' },
    { label: 'C相过流1:', value: '否', unit: '', prop: 'bovercurrentOne' },
    { label: 'A相过流2:', value: '否', unit: '', prop: 'aovercurrentTwo' },
    { label: 'B相过流2:', value: '否', unit: '', prop: 'bovercurrentTwo' },
    { label: 'C相过流2:', value: '否', unit: '', prop: 'covercurrentTwo' },
    { label: '剩余电流故障:', value: '否', unit: '', prop: 'remainEleFault' },
    { label: '温度1故障:', value: '否', unit: '', prop: 'taFault' },
    { label: '温度2故障:', value: '否', unit: '', prop: 'tbFault' },
    { label: '温度3故障:', value: '否', unit: '', prop: 'tcFault' },
  ]
})
let form = reactive({
  alarmTime: "",
  smsPush: "",
  alarmContent: "",
  alarmType: "",
  deviceName: ""
})
let isLongDialog = computed(() => {
  if (form.alarmType.includes('离线')) {
    return false;
  } else {
    return true;
  }
})

let dialogWidth = computed(() => {
  if (isLongDialog.value) {
    return '800px'
  } else {
    return '500px'
  }
})
onBeforeMount(() => {
  getData()
})

function getData () {
  loading.value = true
  let params = {
    pageSize: queryParams.pageSize,
    pageNum: queryParams.pageNum,
    alarmType: queryParams.alarmType,
    smsPush: queryParams.smsPush,
    alarmStatus: 0
  }
  searchLoading.value = true;
  warnService.warnList(params).then(res => {
    queryParams.total = res.total;
    tableData.value = res.rows;
  }).finally(() => {
    loading.value = false;
    searchLoading.value = false;
    nextTick(() => {
      fetPageTableHeight()
    })
  })
}

function resetQuery () {
  queryParams.alarmType = null;
  queryParams.smsPush = null;
  getData()
}

function relieve (row) {
  warnService.relieveWarn(row.id).then(res => {
    ElMessage({ type: 'success', message: '手动解除成功！' })
  }).finally(() => {
    getData();
  })
}

function detail (row) {
  warnService.warnDetail(row.id).then(res => {
    form.alarmContent = row.alarmContent;
    form.alarmTime = row.alarmTime;
    form.alarmType = row.alarmType;
    form.smsPush = row.smsPush;
    form.deviceName = res.data.deviceName;
    dialogDetail.data.forEach((item, index) => {
      dialogDetail.data[index].value = res.data[item.prop] ? res.data[item.prop] : '暂无'
    })
    visible.value = true;
  })
}

function handleDialogClose () {
  visible.value = false;
  form.alarmContent = "";
  form.alarmTime = "";
  form.alarmType = "";
  form.smsPush = "";
  form.deviceName = "";
}

//带分页的表格高度
const pageTableHeight = ref(0)
const resetPageTableHeight = () => {
  return new Promise((resolve, reject) => {
    pageTableHeight.value = 0
    resolve()
  })
}

const pageTableWrapper = ref()
const fetPageTableHeight = () => {
  resetPageTableHeight().then(res => {
    pageTableHeight.value = pageTableWrapper.value.getBoundingClientRect().height - 130
  })
}

</script>

<style lang="scss" scoped>
.dialog-basic-info {
  font-size: 14px;
  font-family: PingFang SC-Semibold, PingFang SC;
  font-weight: 600;
  color: #18191A;
  padding-left: 12px;
  border-left: 4px solid #3B82F6;
  margin-bottom: 24px;
}

:deep(.el-pagination) {
  right: 40px;
}

.dialog-inner-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  color: #2F3133;
  padding-left: 24px;
}

.inner-box-item {
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 48px;
  margin-bottom: 16px;
}
</style>