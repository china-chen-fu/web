<template>
  <div class="container" v-loading.fullscreen.lock="false" element-loading-text="加载中...">

    <div class="left-container">
      <div class="equipment-profile">
        <div class="header">
          <div class="header-icon">

          </div>
          <span class="header-text">
                设备概况
              </span>
        </div>

        <div class="content">
          <div class="total item">
                <span class="describe">
                  总数:
                </span>
            <div class="bar ">
              <el-progress :percentage="totalPercentage" :format="format" color="#3B82F6" class="progress"
                           :stroke-width="8"/>
            </div>
            <span class="num">
                  {{ statisticsData.allNum }}
                </span>
          </div>

          <div class="online item">
                <span class="describe">
                  在线数:
                </span>
            <div class="bar">
              <el-progress :percentage="onlinePercentage" :format="format" color="#19B21E" class="progress"
                           :stroke-width="8"/>
            </div>
            <span class="num">
                 {{ statisticsData.OnLineNum }}
                </span>
          </div>

          <div class="offline item">
                <span class="describe">
                  离线数:
                </span>
            <div class="bar">
              <el-progress :percentage="offlinePercentage" :format="format" color="#8D9094" class="progress"
                           :stroke-width="8"/>
            </div>
            <span class="num">
                  {{ statisticsData.OffLineNum }}
                </span>
          </div>
        </div>
      </div>

      <div class="dashboard">
        <el-progress type="dashboard" :percentage="Number(statisticsData.onlineRate)" color="#3B82F6" :stroke-width="12" :width="156">
          <template #default="{ percentage }">
            <div class="dashboard-progress">
              <span class="label">当前</span>
              <span class="value">{{ percentage }}%</span>
            </div>
          </template>
        </el-progress>

        <span class="describe">
              设备在线率
            </span>
      </div>

    </div>

    <div class="page-container">
      <div class="content" v-loading.fullscreen.lock="fullscreenLoading">

        <div class="table" ref="tableWrapper">
          <div class="tab-bar">
            <!-- tab 切换 -->
            <el-tabs class="tabs" @tab-change="tabChange" v-model="tabValue">
              <el-tab-pane label="控制器" name="switch"></el-tab-pane>
              <el-tab-pane label="电表" name="device"></el-tab-pane>
            </el-tabs>
          </div>
          <el-table :data="tableData" border class="customer-table" style="width: 100%"
                    :header-cell-style="{ 'text-align': 'center' }" name="table" v-loading="loading"
                    element-loading-text="加载中...">
            <el-table-column type="index" label="序号" width="60" align="center" fixed/>
            <el-table-column v-for="item in columns" :key="item" :prop="item.prop" :label="item.label"
                             :fixed="item.fixed" :min-width="item.minWidth" :width="item.width"
                             :align="item.align">
              <template #default="scope" v-if="item.label == '设备状态'">
                <div style="display: flex; align-items: center;justify-content: center;">
                  <div :class="scope.row.online == '0' ? 'online' : 'offline'">
                    <div>
                    </div>
                    <span>
                      {{ scope.row.online == '0' ? '在线' : '离线' }}
                    </span>
                  </div>

                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160">
              <template #default="scope">
                <el-button type="text" icon="Loading" v-hasPermi="['chaoyang:lamp:alarmLog:communication']"
                           @click="testCommunication(scope.row)">测试通讯
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination class="pagination" v-show="total > 0" :total="total"
                      v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                      @pagination="getListData"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import {ref, onMounted, nextTick, computed} from "vue";
import {
  statisticsAPI, switchAlarmListAPI,testCommunicationAPI
} from "@/api/lamp/abnormalAlarm";
import Split from '@/components/Split/index.vue'
import {ElMessage} from "element-plus";

const {proxy} = getCurrentInstance();
const loading = ref(false);

let columns = ref([
  {prop: "switchName", label: "设备名称", minWidth: '160', align: 'left'},
  {prop: "switchNumber", label: "设备编号", minWidth: '160', align: 'left'},
  {prop: "switchModel", label: "设备型号", minWidth: '160', align: 'left'},
  {prop: "online", label: "设备状态", width: '100', align: 'center'},
  {prop: "indicationTime", label: "最后通讯", minWidth: '160', align: 'center'},
]);
//tab栏切换变量
const tabValue = ref('switch')
//查询参数
let queryParams = ref({
  pageSize: 10,
  pageNum: 1,
  type:tabValue.value
});
const total = ref(0)
const tabChange = (value) => {
//切换 重新请求数据
  getStatisticsData()
  getListData()
}
//获得列表数据
const tableData = ref([]);
const getListData = () => {
  loading.value = true;
  tableData.value = []
  queryParams.value.type=tabValue.value
  switchAlarmListAPI(queryParams.value)
      .then((res) => {
        tableData.value = res.rows;
        total.value = res.total
      })
      .finally(() => {
        loading.value = false;
      });
}


//请求 左侧数据
const statisticsData = ref({
  OffLineNum: "0",
  OnLineNum: "0",
  allNum: "0",
  onlineRate: "0",
})
const getStatisticsData = () => {
  statisticsAPI({type: tabValue.value}).then((res) => {
    statisticsData.value = res.data
  })
}
getStatisticsData()


const totalPercentage = computed(() => {
  return (Number(statisticsData.value.allNum) / Number(statisticsData.value.allNum == '0' ? 1 : statisticsData.value.allNum)) * 100
})

const onlinePercentage = computed(() => {
  return (Number(statisticsData.value.OnLineNum) / Number(statisticsData.value.allNum == '0' ? 1 : statisticsData.value.allNum)) * 100
})

const offlinePercentage = computed(() => {
  return (Number(statisticsData.value.OffLineNum) / Number(statisticsData.value.allNum == '0' ? 1 : statisticsData.value.allNum)) * 100
})

const format = () => ''

//测试通讯
const  fullscreenLoading=ref(false)
const testCommunication = (row) => {
  loading.value = true;
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
    loading.value = false;
  });
};

getListData()

</script>

<style lang="scss" scoped>
$bar--active--color: #546fff;
$total: #3B82F6;
$online: #19B21E;
$offline: #8D9094;

.tab-bar {
  .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: transparent !important;
    height: 2px;
    z-index: var(--el-index-normal);
  }

  .el-tabs__item:hover {
    color: $bar--active--color !important;
  }

  .el-tabs__active-bar {
    background-color: $bar--active--color !important;
  }

  .el-tabs__item.is-active {
    color: $bar--active--color;
  }
}



.container{
  width: 100%;
  display: flex;
  .left-container {
    width: 349px;
    height: calc(100vh - 70px);
    padding: 21px;
    background: #FFFFFF;
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .equipment-profile {
      //background: #4D5061;
      width: 307px;
      margin-bottom: 80px;

      .header {
        display: flex;
        margin-bottom: 46px;

        .header-icon {
          width: 4px;
          height: 18px;
          background: #3B82F6;
          border-radius: 0px 0px 0px 0px;
          opacity: 1;
        }

        .header-text {
          margin-left: 18px;
          font-size: 18px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #18191A;
          line-height: 21px;
        }
      }

      .content {
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 19px;
          border-radius: 0px 0px 0px 0px;
          opacity: 1;
          margin-bottom: 23px;

          .describe {
            width: 64px;
          }

          .bar {
            width: 200px;
            height: 14px;
            display: flex;
            align-items: center;
            justify-content: center;

            .progress {
              width: 100%;
            }

            :deep(.el-progress__text){
              display: none;
            }

          }

          .num {
            margin-left: 25px;
            font-size: 14px;
            font-family: Source Han Sans CN-Bold, Source Han Sans CN;
            font-weight: bold;
            color: #3B82F6;
            line-height: 19px;
          }
        }



      }
    }

    .dashboard {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 48px;

      .dashboard-progress {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .label {
          font-size: 12px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #8D9094;
          line-height: 18px;
        }

        .value {
          font-size: 36px;
          font-family: DINPro-Bold, DINPro;
          font-weight: bold;
          color: #18191A;
          line-height: 42px;
        }
      }

      .describe {
        font-size: 14px;
        font-family: PingFang SC-Semibold, PingFang SC;
        font-weight: 600;
        color: #2F3133;
        line-height: 21px;
      }
    }


  }

  .page-container{
    .content{
      padding: 0 0 0 16px;

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
    }
  }
}

</style>

