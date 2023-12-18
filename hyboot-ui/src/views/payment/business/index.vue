<template>
  <div class="business-container" v-loading="pageLoading">
    <el-row style="width: 100%;height: 100%;overflow: auto;min-height: 100%;">
      <el-col :md="5" :lg="5" :xl="3" :sm="8" :xs="10" class="left">
        <div class="menu-box">
          <div class="menu" v-for="(item, index) in menuList" :key="index" @click="menuClick(index)" :class="{ 'menu-active': currentMenuIndex == index }">
            <img v-if="currentMenuIndex !== index" width="24" height="24" :src="getUrl(item.url)" alt="">
            <img v-else :src="getUrl(item.activeUrl)" width="24" height="24" alt="">
            <div class="menu-text">{{ item.name }}</div>
          </div>
        </div>
      </el-col>
      <el-col :md="9" :lg="11" :sm="14" :xl="15" :xs="14" class="center">
        <div class="center-content-box">
          <div class="center-content">
            <centerComponent ref="rechargeRef" v-if="currentMenuIndex == 0" :key="componentRandom" :data="componentData" @refreshAfterFinishBusiness="refreshAfterFinishBusiness"></centerComponent>
            <centerComponent ref="refundRef" v-if="currentMenuIndex == 1" :key="componentRandom" :data="componentData" @refreshAfterFinishBusiness="refreshAfterFinishBusiness"></centerComponent>
            <centerComponent ref="leaveRef" v-if="currentMenuIndex == 2" :key="componentRandom" :data="componentData" @refreshAfterFinishBusiness="refreshAfterFinishBusiness"></centerComponent>
            <centerComponent ref="balanceRef" v-if="currentMenuIndex == 3" :key="componentRandom" :data="componentData" @refreshAfterFinishBusiness="refreshAfterFinishBusiness"></centerComponent>
          </div>
        </div>
      </el-col>
      <el-col :md="9" :lg="8" :xl="6" class="right hidden-sm-and-down">
        <div class="right-content-box">
          <div class="right-content">
            <div class="transaction">
              <div class="transaction-title">最近交易记录</div>
              <div style="display: flex;align-items: center;color: #4960E5;">
                <el-icon style="cursor: pointer;" @click="getOrderRecord" v-hasPermi="['chaoyang:business:close:query']">
                  <Refresh />
                </el-icon>
                <div class="transaction-more" @click="jumpToAnalysis" v-hasPermi="['chaoyang:business:close:more']">更多</div>
              </div>
            </div>
            <div class="record" v-for="(item, index) in payRecords.data" :key="index">
              <div class="record-date">{{ item.time }}</div>
              <div class="record-list-box">
                <div class="list-item" v-for="(it, idx) in item.list" :key="idx">
                  <div class="item-top">
                    <div style="width: 50%; cursor: pointer;" @click="print(it)">{{ it.orderNo }}</div>
                    <div style="width: 50%; cursor: pointer;" @click="jumpToStall(it)">{{ it.stallName }}</div>
                  </div>
                  <div class="item-bottom">
                    <div style="width: 50%;">{{ it.orderTime ? it.orderTime.substring(10) : '' }}</div>
                    <div style="width: 30%;text-align: left;">{{ it.orderType }}</div>
                    <div style="width: 20%;text-align: right" v-if="it.orderType.includes('缴费')" class="item-money item-money-plus">+{{ it.orderAmount }}</div>
                    <div style="width: 20%;text-align: right" v-if="it.orderType.includes('退费')" class="item-money item-money-minus">-{{ it.orderAmount }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, nextTick, reactive } from 'vue'
import businessService from '../../../api/payment/business';
import centerComponent from './component/index.vue'
import moment from 'moment'
import useUserStore from '@/store/modules/user'

const { proxy } = getCurrentInstance();
const router = useRouter()
const roles = useUserStore().roles
const permissions = useUserStore().permissions

const rechargeRef = ref(null)
const refundRef = ref(null)
const leaveRef = ref(null)
const balanceRef = ref(null)

let pageLoading = ref(false);
let componentRandom = ref(null)

let componentData = reactive({
  warning: '',
  type: null,
  warningWidth: '',
})

const menuList = [
  {
    activeUrl: 'pay-active.png',
    url: 'pay.png',
    name: '缴费'
  },
  {
    activeUrl: 'pay-active.png',
    url: 'pay.png',
    name: '退费'
  },
  {
    activeUrl: 'back-active.png',
    url: 'back.png',
    name: '离场清算'
  },
  {
    activeUrl: 'balance-active.png',
    url: 'balance.png',
    name: '平账'
  },
]

let currentMenuIndex = ref(0);

let payRecords = reactive({
  data: []
})

onBeforeMount(() => {
  if (sessionStorage.getItem('bs')) {
    currentMenuIndex.value = Number(sessionStorage.getItem('bs'));
  }
  componentRandom.value = Math.random();
  setComponentProps();
  getOrderRecord();
})

const getUrl = (url) => {
  return new URL(`../../../assets/images/${url}`, import.meta.url).href
}

const menuClick = (index) => {
  nextTick(() => {
    currentMenuIndex.value = index;
    router.currentRoute.value.query = {};
    componentRandom.value = Math.random();
    sessionStorage.setItem('bs', currentMenuIndex.value)
    setComponentProps();
  })
}

const setComponentProps = () => {
  switch (currentMenuIndex.value) {
    case 0: {
      componentData.warning = '温馨提示：用于缴费操作';
      componentData.warningWidth = '288px';
      componentData.type = 0;
      break;
    }
    case 1: {
      componentData.warning = '温馨提示：用于退费操作';
      componentData.warningWidth = '288px';
      componentData.type = 1;
      break;
    }
    case 2: {
      componentData.warning = '温馨提示：用于摊位离场前账目的清算，多退少补。';
      componentData.warningWidth = '430px';
      componentData.type = 2;
      break;
    }
    case 3: {
      componentData.warning = '温馨提示：手工平账用于处理因特殊异常引起的系统账目和表具设备的金额不相符的情况，请谨慎处理。';
      componentData.warningWidth = '795px';
      componentData.type = 3;
      break;
    }
  }
}

const getOrderRecord = () => {
  let params = {
    params: {
      endTime: moment().format('YYYY-MM-DD') + ' ' + '23:59:59',
      beginTime: moment().add(-4, 'd').format('YYYY-MM-DD') + ' ' + '00:00:00'
    }
  }
  payRecords.data = [];
  businessService.businessRecordGroup(params).then(res => {
    if (JSON.stringify(res.data) != '{}') {
      res.data.dateList.forEach(item => {
        payRecords.data.push({
          time: item,
          list: res.data.listMap[item] ? res.data.listMap[item] : []
        })
      })
    }
  })
}

const jumpToStall = (order) => {
  if (permissions.includes('chaoyang:stall:info:query') || permissions.includes('chaoyang:stall:stallList') || permissions.includes('*:*:*')) {
    router.push({
      path: '/stall',
      query: {
        stallId: order.stallId
      }
    })
  }
}

const jumpToAnalysis = () => {
  router.push({
    path: '/analysis/transaction',
  })
}

const print = (it) => {
  // if (permissions.includes('chaoyang:business:export') || permissions.includes('*:*:*')) {
  businessService.downloadPdf({ orderNo: it.orderNo }).then(res => {
    const blob = new Blob([res], { type: 'application/pdf;charset-UTF-8' });
    const href = URL.createObjectURL(blob)
    window.open(href, "_blank")
    // const fileName = `${it.orderNo}.pdf`
    // if ('download' in document.createElement('a')) { // 非IE下载
    //   const eLink = document.createElement('a')
    //   eLink.download = fileName
    //   eLink.style.display = 'none'
    //   eLink.href = URL.createObjectURL(blob)
    //   document.body.appendChild(eLink)
    //   eLink.click()
    //   URL.revokeObjectURL(eLink.href) // 释放URL 对象
    //   document.body.removeChild(eLink)
    // } else {
    //   // navigator.msSaveBlob(blob, fileName)
    //   const href = URL.createObjectURL(blob)
    //   window.open(href, "_blank")
    // }
  })
  // }
}

const refreshAfterFinishBusiness = () => {
  getOrderRecord()
}

</script>

<style scoped lang="scss">
.business-container {
  background-color: #F8F8F8;
  width: 100vw;
  height: calc(100vh - 70px);
  position: relative;

  .left {
    height: 100%;
    background: #FFFFFF;
    box-shadow: 4px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 4px 4px 4px 4px;
    padding: 24px;

    .menu-box {
      .menu {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 16px;
        padding: 12px 0px 12px 24px;
        cursor: pointer;
        border-radius: 12px 12px 12px 12px;
        color: #1D1929;

        .menu-text {
          font-size: 16px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          padding-left: 16px;
          color: #8E92BC !important;
        }
      }

      .menu:hover {
        background: #EEF3FF;
        color: #546FFF;
      }

      .menu-active {
        background: #EEF3FF;
        color: #546FFF
      }
    }
  }

  .center {
    height: 100%;
    padding: 24px 0px 0px 24px;

    .center-content-box {
      height: 100%;
      width: 100%;
      background-color: #fff;
    }

    .center-content {
      height: 100%;
      width: 100%;
      padding-top: 16px;
      padding-left: 24px;
    }
  }

  .right {
    height: 100%;
    padding: 24px 24px 0px 24px;
    overflow: auto;

    .right-content-box {
      height: 100%;
      width: 100%;
      background: #FFFFFF;
    }

    .right-content {
      height: 100%;
      width: 100%;
      padding: 24px;
      overflow: auto;

      .transaction {
        width: 100%;
        height: 30px;
        border-left: 4px solid #4960E5;
        padding-left: 16px;
        padding-right: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .transaction-title {
          font-size: 18px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #1C1C28;
        }

        .transaction-more {
          font-size: 16px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #4960E5;
          cursor: pointer;
          padding-left: 10px;
        }
      }

      .record {
        margin-bottom: 20px;

        .record-date {
          font-size: 16px;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          font-weight: 500;
          color: #141522;
        }

        .record-list-box {
          margin-top: 15px;

          .list-item {
            font-size: 14px;
            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            font-weight: 400;
            margin-top: 20px;

            .item-top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: #4960E5;
              margin-bottom: 3px;
            }

            .item-bottom {
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: #8E92BC;

              .item-money {
                font-size: 18px;
                font-family: Roboto-Medium, Roboto;
                font-weight: 600;
              }

              .item-money-plus {
                color: #FA9600;
                text-align: right;
              }

              .item-money-minus {
                color: #FC474C;
                text-align: right;
              }
            }
          }
        }
      }
    }
  }
}
</style>