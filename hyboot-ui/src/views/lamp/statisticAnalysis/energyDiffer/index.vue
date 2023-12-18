<template>
  <div class="page-container">
    <div class="content">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="日期">
            <el-date-picker v-model="queryParams.time" type="datetimerange" :clearable="false"
                            value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" style="width: 360px"
                            range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"/>
          </el-form-item>
          <el-form-item label="区域">
            <el-tree-select v-model="queryParams.regionId" :data="regionTree" check-strictly
                            :render-after-expand="false" style="width: 240px"/>
          </el-form-item>
          <el-form-item label="表具名称">
            <el-input v-model="queryParams.deviceName" placeholder="请输入表具名称" style="width: 240px">
            </el-input>
          </el-form-item>
          <el-form-item class="button-container">
            <el-button type="primary" icon="Search" @click="getData" v-hasPermi="['chaoyang:lamp:analysis:energyList']">
              搜索
            </el-button>
            <el-button icon="Refresh" @click="clear" v-hasPermi="['chaoyang:lamp:analysis:energyList']">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table" ref="tableWrapper" style="height: 100%">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="getExcel"
                       v-hasPermi="['chaoyang:lamp:analysis:energyExport']">导出
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getData"></right-toolbar>
        </el-row>
        <el-table :data="tableData" border class="customer-table" :max-height="tableHeight"
                  :header-cell-style="{ 'text-align': 'center' }" name="table" v-loading="loading"
                  element-loading-text="加载中...">
          <el-table-column type="index" label="序号" width="60" fixed align="center"/>


          <el-table-column v-for="item in columns" :key="item" :prop="item.prop" :label="item.label" :fixed="item.fixed"
                           :align="item.align" :min-width="item.minWidth" :width="item.width">
            <template #default="scope" v-if="item.label == '在线状态'">
              <div style="display: flex; align-items: center;justify-content: center;">
                <div :class="scope.row.deviceOnline == '在线' ? 'online' : 'offline'">
                  <div>
                  </div>
                  <span>
                      {{ scope.row.deviceOnline == '在线' ? '在线' : '离线' }}
                       </span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import moment from "moment";
import {listRegionAPI, energyDifferenceAPI} from '@/api/lamp/energyDiffer'

const {proxy} = getCurrentInstance();
//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(false);
let tableData = ref([]);
let columns = ref([
  {
    label: '表具名称',
    prop: 'deviceName',
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    label: '在线状态',
    prop: 'deviceOnline',
    align: 'center',
    width: '',
    minWidth: '100'
  },
  {
    label: '开始示数',
    prop: 'startIndication',
    align: 'right',
    width: '',
    minWidth: '100'
  },
  {
    label: '开始时间',
    prop: 'beginTime',
    align: 'center',
    width: '160',
    minWidth: '100'
  },
  {
    label: '结束示数',
    prop: 'endIndication',
    align: 'right',
    width: '',
    minWidth: '100'
  },
  {
    label: '结束时间',
    prop: 'finishTime',
    align: 'center',
    width: '160',
    minWidth: ''
  },
  {
    label: '用量(kwh)',
    prop: 'differenceIndication',
    align: 'right',
    width: '',
    minWidth: '100'
  }
]);

const queryParams = ref({
  time: [moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"), moment().format("YYYY-MM-DD HH:mm:ss")],
  regionId: null,
  deviceName: null,
});
const regionTree = ref([]);

let initRegionId = ''
const getRegionTreeOptions = () => {
  loading.value = true
  listRegionAPI().then((res) => {
    regionTree.value = recursion(res.rows);
    queryParams.value.regionId = res.rows[0].regionId;
    initRegionId = res.rows[0].regionId
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

let params = ref({})
watch(queryParams, () => {
      params.value = {
        regionId: queryParams.value.regionId,
        deviceName: queryParams.value.deviceName,
        startTime: queryParams.value.time[0],
        endTime: queryParams.value.time[1],
      }
    }, {
      immediate: true,
      deep: true,
    }
)


function getData() {
  loading.value = true;
  tableData.value = []
  energyDifferenceAPI(params.value)
      .then((res) => {
        tableData.value = res.data;
      })
      .finally(() => {
        loading.value = false;
      });
}

function getExcel() {
  proxy.download(
      "/lamp/stat/analysis/energy/difference/export",
      params.value,
      `灯光用能差值.xlsx`
  );
}


function clear() {
  queryParams.value = {
    time: [moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"), moment().format("YYYY-MM-DD HH:mm:ss")],
    deviceName: null,
  };
  getRegionTreeOptions()
}

getRegionTreeOptions()
</script>

<style scoped lang="scss">
$online: #19B21E;
$offline: #8D9094;

.status {
  display: flex;
  justify-content: left;
  align-content: center;
  align-items: center;

  div {

    width: 5px;
    height: 5px;
    border-radius: 3px 3px 3px 3px;
    opacity: 1;
  }

  span {
    padding-left: 5px;
  }
}

.offline {
  @extend .status;
  color: $offline;

  div {
    background: $offline;
  }
}

.online {
  @extend .status;
  color: $online;

  div {
    background: $online;
  }
}
</style>
