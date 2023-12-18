<template>
  <div class="monitor-container" v-loading="pageLoading" element-loading-text="加载中...">
    <Split style="height: 100%;width: 100%;" ratio="1/6">
      <template #one>
        <div class="monitor-left">
          <div class="monitor-tree">
            <el-tree ref="treeRef" :data="treeData" :props="treeProps" :expand-on-click-node="false" @node-click="nodeClick" default-expand-all node-key="id" :current-node-key="currentTreeNodeKey" highlight-current></el-tree>
          </div>
        </div>
      </template>
      <template #two>
        <div class="monitor-right">
          <div v-loading="tableLoading" element-loading-text="加载中..." class="monitor-content">
            <div class="status-top">
              <div class="status-tab">
                <div class="tab-item" v-for="(item, index) in statusTabs" :key="index" :class="{ 'tab-item-active': currentActiveTab == index }" @click="tabChange(index, item.key)">
                  {{ item.label }} {{ getTabNum(item.key) }}
                </div>
              </div>
              <div>
                <el-input v-model="searchText" @keyup.enter="getList" placeholder="请输入配电柜名称" clearable @clear="getList" :suffix-icon="Search" style="width: 280px;"></el-input>
              </div>
            </div>
            <div class="monitor-list" v-if="tableData.length">
              <el-table element-loading-text="加载中..." :data="tableData" height="calc(100vh - 177px)" :show-header="false" style="width: 100%; margin-top: 20px;padding-bottom: 20px;" :header-cell-style="{ 'text-align': 'center' }">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column label="状态" width="120" align="center">
                  <template #default="scope">
                    <firePdcStatus :status="scope.row.loopStatus"></firePdcStatus>
                  </template>
                </el-table-column>
                <el-table-column label="全名" width="400" align="left">
                  <template #default="scope">
                    <span @click="jumpToDetail(scope.row)" style="cursor: pointer;color: #1890ff;">{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-for="(item, index) in columns" :key="index" :label="item.label" :prop="item.prop" :width="item.width" :align="item.align">
                  <template #default="scope">
                    {{ item.label }}
                    <span style="padding-right: 3px;">{{ scope.row[item.prop] ? scope.row[item.prop] : '' }}</span>
                    <span v-if="index == 0 && scope.row[item.prop]">mA</span>
                    <!--                    <span v-if="index == 2 && scope.row[item.prop]">mA</span>-->
                    <span v-if="(index == 1 || index == 2 || index == 3) && scope.row[item.prop]">℃</span>
                  </template>
                </el-table-column>
              </el-table>
              <pagination class="pagination" v-show="queryParams.total > 0" :total="queryParams.total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
            </div>
            <div class="monitor-list" style="text-align: center;width: 100%;height: 100%;padding-top: 10%;" v-else>
              <img src="@/assets/images/fire/monitor-chart-null.png" alt="">
              <div style="color: #B4B9BF;font-size: 14px;">暂无数据</div>
            </div>
          </div>
        </div>
      </template>
    </Split>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, reactive, onMounted } from "vue";
import Split from '../../../components/Split/index.vue';
import { Search } from '@element-plus/icons-vue';
import firePdcStatus from '@/components/firePdcStatus/index.vue'
import pdcService from "../../../api/fire/pdc";
import monitorService from "../../../api/fire/monitor";
import { useRouter } from "vue-router"

const router = useRouter();
let pageLoading = ref(false)
let treeData = ref(null)
let treeProps = {
  label: 'regionName',
  children: 'children',
  id: 'id',
  parentId: 'parentId',
  value: 'id'
}
let currentTreeNode = ref(null)
let currentTreeNodeKey = ref(null)
let treeRef = ref();

const statusTabs = ref([
  {
    label: '全部',
    key: '0',
  },
  {
    label: '正常',
    key: '1',
  },
  {
    label: '离线',
    key: '2',
  },
  {
    label: '告警',
    key: '3',
  },
])
let countNumber = reactive({
  total: 0,
  normal: 0,
  offline: 0,
  alarm: 0
})
let currentActiveTab = ref(0)
let searchText = ref("")

let tableData = ref([])
let tableLoading = ref(false)
let originTableData = ref([])
let queryParams = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0,
})
const columns = [
  {
    label: '剩余电流',
    prop: 'remainElec',
    width: '',
    align: 'left'
  },
  {
    label: 'A相温度',
    prop: 'ta',
    width: '',
    align: 'left'
  },
  {
    label: 'B相温度',
    prop: 'tb',
    width: '',
    align: 'left'
  },
  {
    label: 'C相温度',
    prop: 'tc',
    width: '',
    align: 'left'
  },
]

getTree()

function getTree () {
  pdcService.getRegion().then(res => {
    treeData.value = res.data;
    if (currentTreeNode.value == null) {
      currentTreeNode.value = res.data[0];
      nextTick(() => {
        currentTreeNodeKey.value = currentTreeNode.value.id;
        treeRef.value.setCurrentKey(currentTreeNodeKey.value);
      })
    }
    getList();
  })
}

function getTabNum (index) {
  let result = "";
  if (index == 0) {
    result = '(' + countNumber.total + ')'
  } else if (index == 1) {
    result = '(' + countNumber.normal + ')'
  } else if (index == 2) {
    result = '(' + countNumber.offline + ')'
  } else if (index == 3) {
    result = '(' + countNumber.alarm + ')'
  }
  return result;
}

function nodeClick (current) {
  currentTreeNode.value = current;
  getList();
}

function tabChange (index, key) {
  currentActiveTab.value = index;
  filterLoop(index)
}

function filterLoop (index) {
  switch (index) {
    case 0: {
      tableData.value = originTableData.value;
      break;
    }
    case 1: {
      tableData.value = originTableData.value.filter(item => {
        return item.loopStatus == '正常';
      })
      break;
    }
    case 2: {
      tableData.value = originTableData.value.filter(item => {
        return item.loopStatus == '离线';
      })
      break;
    }
    case 3: {
      tableData.value = originTableData.value.filter(item => {
        return item.loopStatus == '告警';
      })
      break;
    }
  }
}

function getList () {
  let params = {
    regionId: currentTreeNode.value.level == 1 ? null : currentTreeNode.value.id,
    pageSize: queryParams.pageSize,
    pageNum: queryParams.pageNum,
    cabinetName: searchText.value
  }
  tableLoading.value = true;
  monitorService.getMonitorList(params).then(res => {
    tableData.value = res.data.list;
    originTableData.value = JSON.parse(JSON.stringify(res.data.list))
    queryParams.total = res.data.total;
    countNumber.total = res.data.total;
    countNumber.normal = res.data.normal;
    countNumber.offline = res.data.offline;
    countNumber.alarm = res.data.alarm;
  }).finally(() => {
    filterLoop(currentActiveTab.value);
    tableLoading.value = false;
  })
}

function jumpToDetail (row) {
  router.push({
    path: '/monitor-detail',
    query: {
      id: row.id,
      deviceId: row.deviceId,
      number: row.deviceNumber
    }
  })
}
</script>

<style scoped lang="scss">
.monitor-container {
  width: 100vw;
  height: calc(100vh - 72px);
  background-color: #F8F8F8;

  .monitor-left {
    height: 100%;
    background-color: #fff;
    box-shadow: 4px 0px 8px 0px rgba(0, 0, 0, 0.08);
  }

  .monitor-tree {
    padding: 32px 20px 20px 20px;
    height: 100%;
    overflow: auto;
    background-color: #F5F6F7;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .monitor-right {
    // min-width: calc(100% - 304px);
    height: 100%;
    padding: 24px 24px 0 24px;

    .monitor-content {
      height: 100%;
      background-color: #fff;
      padding: 16px 24px 0 24px;

      .status-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .status-tab {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        min-width: 900px;

        .tab-item {
          width: 100px;
          height: 35px;
          margin-right: 24px;
          line-height: 35px;
          text-align: center;
          font-size: 16px;
          color: #8E92BC;
          font-weight: 400;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          cursor: pointer;
        }

        .tab-item-active {
          border-bottom: 2px solid #546FFF;
          font-weight: 500;
          color: #141522;
        }
      }

      .stall-list {
        margin-top: 30px;
        height: calc(100% - 63px);
        overflow: auto;
        margin-bottom: 24px;
      }

      .table-status {
        width: 72px;
        height: 28px;
        line-height: 28px;
        border-radius: 65px 65px 65px 65px;
      }
    }
  }
}

:deep(.el-pagination) {
  right: 40px;
}

:deep(.el-tree) {
  background: #F5F6F7;
}
</style>