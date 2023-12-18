<template>
  <div style="width: 100%;height: 100%;overflow-y: auto;padding-bottom: 24px;">
    <div class="center-title">{{ typeName }}</div>
    <div class="center-remind" :style="{ 'width': props.data.warningWidth }">
      <el-icon style="color: #FA9601;">
        <WarningFilled />
      </el-icon>
      <div style="padding-left: 10px;">
        {{ props.data.warning }}
      </div>
    </div>

    <!-- 平账切换按钮 -->
    <div class="pingzhang-button" v-if="props.data.type == 3">
      <el-button class="ping-button left-button" :disabled="buttonDisabled1" :class="{ 'ping-button-active': pingActive == 1 }" @click="pingActive = 1">缴费记账</el-button>
      <el-button class="ping-button right-button" :disabled="buttonDisabled2" :class="{ 'ping-button-active': pingActive == 2 }" @click="pingActive = 2">退费记账</el-button>
    </div>

    <div class="search" v-if="props.data.type !== 2">
      <div class="search-title">查询：</div>
      <div style="width: 100%;display: flex;justify-content: flex-start;align-items: center;">
        <el-select style="width: 50%;" class="search-select" v-model="searchedDeviceId" v-hasPermi="['chaoyang:business:device:query']" remote clearable filterable placeholder="请输入摊位名称查询对应表具" @change="selectDeviceChange" :remote-method="remoteMethod" :loading="remoteLoading">
          <template #prefix>
            <el-icon class="el-input__icon">
              <search />
            </el-icon>
          </template>
          <el-option v-for="item in deviceOptions" :key="item.deviceId" :label="item.deviceNameWithLevel" :value="item.deviceId" />
        </el-select>
        <div v-if="searchedDeviceId" style="display: flex;justify-content: flex-start;align-items: center;margin-left: 16px;">
          <img v-if="currentSelectDevice.deviceType.includes('电')" src="@/assets/images/business-ele.png" alt="">
          <img v-else src="@/assets/images/business-water.png" alt="">
          <div style="padding-left: 11px;">{{ currentSelectDevice.deviceType.includes('电') ? '电表' : '水表' }}</div>
        </div>
      </div>
    </div>

    <div v-if="props.data.type == 3">
      <div class="ping-count" v-if="searchedDeviceId">
        <div class="ping-label">累计缴费金额: <span class="ping-value">{{ countPay? countPay + '元' : '' }}</span></div>
        <div class="ping-label">累计到账金额: <span class="ping-value">{{ countIn? countIn + '元' : '' }}</span></div>
        <div class="ping-label">差值: <span class="ping-value" style="color: #FC474C;">{{ difference? difference + '元' : '' }}</span></div>
      </div>
    </div>

    <!-- 缴费金额 -->
    <div class="rest-money-box" v-if="props.data.type == 0 || props.data.type == 1">
      <div class="rest-inner-box">
        <div class="rest-money-out-circle">
          <div class="rest-money-inner-circle"></div>
        </div>
        <div class="rest-money-text">剩余{{ payDialog.label }}：{{ restMoney == '-----' ? '-----' : restMoney + payDialog.unit }}</div>
      </div>
      <div class="rest-inner-box">
        <div class="rest-money-out-circle">
          <div class="rest-money-inner-circle"></div>
        </div>
        <div class="rest-money-text">单价：{{ perPrice == '-----' ? '-----' : (perPrice + (currentSelectDevice.deviceType.includes('电') ? ' 元/kwh' : ' 元/t')) }}</div>
      </div>
    </div>
    <div v-if="props.data.type !== 2" class="money-div">
      <div v-if="props.data.type == 0 || props.data.type == 1" style="margin-bottom: 16px;">
        <div class="money-div-title" style="height: 40px;line-height: 40px;margin-bottom: 0px;">请选择{{ props.data.type == 0 ? '缴费' : '退费' }}金额：</div>
        <el-input style="width: 39%;" class="new-search" v-model="customMoney" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入">
          <template #append>元</template>
        </el-input>
      </div>
      <div v-else style="margin-bottom: 16px;">
        <div class="money-div-title" style="height: 40px;line-height: 40px;margin-bottom: 0px;">请选择{{ pingActive == 1 ? '缴费' : '退费' }}金额:</div>
        <el-input style="width: 39%;" v-model="customMoney" class="new-search" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入">
          <template #append>元</template>
        </el-input>
      </div>
      <div class="money-div-box">
        <div v-for="(item, index) in moneyDiv" :key="index" class="money-div-item" :class="{ 'money-div-item-active': currentMoneyDivIndex == index }" @click="clickMoneyDiv(index, item)">
          {{ item }}
        </div>
        <!-- <div v-if="!isCustomMoney" class="money-div-item" :class="{ 'money-div-item-active': currentMoneyDivIndex == -1 && customMoney !== '自定义' }" @click="clickMoneyDiv(-1)">{{ customMoney }}</div>
        <el-input class="money-div-item" v-else :autofocus="true" oninput="value=value.replace(/[^\d.]/g,'')" v-model="customMoney" @blur="customBlur"></el-input> -->
      </div>
    </div>

    <!-- 交易订单号 -->
    <div v-if="props.data.type == 0 || props.data.type == 1">
      <div class="search-title">请输入交易订单号：</div>
      <el-input class="search-select" v-model="orderNumber" style="width: 50%;" placeholder="请输入交易订单号"></el-input>
    </div>

    <!-- 离场清算 -->
    <div class="search" v-if="props.data.type == 2">
      <div class="search-title">查询：</div>
      <!-- <el-input class="search-select" v-model="stallName" style="width: 50%;" @keyup.enter="getDeviceByStallName" placeholder="请输入摊位名称查询对应表具 (按下回车键搜索)"></el-input> -->
      <div style="width: 100%;display: flex;justify-content: flex-start;align-items: center;">
        <el-select style="width: 50%;" class="search-select" v-hasPermi="['chaoyang:business:device:query']" v-model="searchedStallId" remote clearable filterable placeholder="请输入摊位名称查询要离场的摊位" :remote-method="remoteMethod" :loading="remoteLoading" @change="stallInputChange">
          <template #prefix>
            <el-icon class="el-input__icon">
              <search />
            </el-icon>
          </template>
          <el-option v-for="item in stallOptions" :key="item.stallId" :label="item.stallNameWithLevel" :value="item.stallId" />
        </el-select>
      </div>
    </div>
    <div class="search" v-if="props.data.type == 2">
      <div v-if="deviceList.data.length">
        <div class="device-list" v-for="(item, index) in deviceList.data" :key="index">
          <div class="device-left">
            <div>
              <img v-if="item.deviceType.includes('水')" src="@/assets/images/business-water.png" alt="">
              <img v-if="item.deviceType.includes('电')" src="@/assets/images/business-ele.png" alt="">
            </div>
            <div class="device-left-text">
              <div class="device-left-name">{{ item.name }}</div>
              <div class="device-left-price">单价：{{ item.price }} {{ item.deviceType.includes('电') ? '元/kwh' : '元/t' }}</div>
            </div>
          </div>
          <div class="device-rest">剩余{{ item.deviceType.includes('电') ? '电' : '水' }}费：{{ item.indicationAmount }}</div>
        </div>
      </div>
      <div v-if="(leaveIsSearched && deviceList.data.length == 0)">
        <img src="@/assets/images/search-null.png" alt="">
      </div>
    </div>
    <div class="liquidation-count" v-if="props.data.type == 2">
      <div style="padding-top: 1px;">
        <el-icon>
          <CircleCheckFilled />
        </el-icon>
      </div>
      <div style="padding-left: 8px;">实际清算合计： {{ Number(liquidationCount).toFixed(2) }} 元</div>
    </div>

    <!-- 备注 -->
    <div class="search" style="margin-top: 16px;">
      <div class="search-title">请输入备注信息：</div>
      <el-input type="textarea" style="width: 50%;" class="search-select" v-model="remark" placeholder="请输入备注信息"></el-input>
    </div>


    <el-button class="pay-button" v-hasPermi="['chaoyang:business:charge']" v-loading.fullscreen.lock="fullscreenLoading" v-if="props.data.type == 0" @click="confirm(0)">
      立即缴费
    </el-button>
    <el-button class="pay-button" v-hasPermi="['chaoyang:business:refund']" v-loading.fullscreen.lock="fullscreenLoading" v-if="props.data.type == 1" @click="confirm(1)">
      立即退费
    </el-button>
    <el-button class="pay-button" v-hasPermi="['chaoyang:business:leave']" v-loading.fullscreen.lock="fullscreenLoading" v-if="props.data.type == 2" @click="confirm(2)">
      立即清算
    </el-button>
    <el-button class="pay-button" v-hasPermi="['chaoyang:business:balance']" v-loading.fullscreen.lock="fullscreenLoading" v-if="props.data.type == 3" @click="confirm(3)">
      {{ (pingActive == 1 ? '缴费记账' : '退费记账') }}
    </el-button>

    <div v-show="payBoxVisible" style="margin-top: 10px;">
      <PayBox :key="payBoxKey" ref="payBoxRef" :data="payBoxData" @falseWatchVisible="falseWatchVisible" :type="typeName"></PayBox>
    </div>
  </div>
</template>

<script setup>

import { onBeforeMount, reactive, ref, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import businessService from '../../../../api/payment/business';
import addFloat from '../../../../utils/calc'
import PayBox from '@/components/PayBox/index.vue'

const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})

let payBoxVisible = ref(false)
let payBoxData = ref(null)
let watchVisible = ref(false)
let payBoxKey = ref(1)
let payBoxRef = ref()

watch(() => watchVisible.value, (newValue) => {
  payBoxVisible.value = newValue;
})

function falseWatchVisible () {
  watchVisible.value = false;
  payBoxKey.value = Math.random();
}

const emit = defineEmits(['refreshAfterFinishBusiness'])

const moneyDiv = [50, 100, 200, 500, 1000];
let currentMoneyDivIndex = ref(-1);
let customMoney = ref(null)

let fullscreenLoading = ref(false)
let deviceOptions = ref(null)

let stallOptions = ref(null)
let searchedStallId = ref(null)
let searchedStall = ref(null)
let buttonDisabled1 = ref(false)
let buttonDisabled2 = ref(false)

let remoteLoading = ref(false)
let searchedDeviceId = ref(null)
let stallName = ref(null)
let deviceList = reactive({
  data: []
})
let currentSelectDevice = ref(null)
let restMoney = computed(() => {
  let result;
  if (currentSelectDevice.value) {
    result = currentSelectDevice.value.indicationAmount
  } else {
    result = '-----';
  }
  restMoney1.value = result;
  return result;
})
let restMoney1 = ref(null)
let perPrice = computed(() => {
  let result;
  if (currentSelectDevice.value) {
    result = currentSelectDevice.value.price
  } else {
    result = '-----';
  }
  return result;
})
let liquidationCount = computed(() => {
  let total = 0;
  if (deviceList.data.length) {
    deviceList.data.forEach(item => {
      total = addFloat(total, Number(item.indicationAmount))
    })
  }
  return total;
})
let typeName = computed(() => {
  return props.data.type == 0 ? '缴费' : props.data.type == 1 ? '退费' : props.data.type == 2 ? '离场清算' : '平账'
})

let orderNumber = ref(null)
let remark = ref(null)

let pingActive = ref(1)

let leaveIsSearched = ref(false)

let countPay = ref(null)
let countIn = ref(null)
let difference = ref(null)

let payDialog = reactive({
  label: "金额",
  unit: "元",
  inputUnit: '元'
})

watch(() => customMoney.value, (newValue) => {
  if (!moneyDiv.includes(newValue)) {
    currentMoneyDivIndex.value = -1;
  }
})

onBeforeMount(() => {

})

const remoteMethod = (query) => {
  if (query) {
    remoteLoading.value = true;
    businessService.getDeviceByStallName({ stallName: query }).then(res => {
      let arr = [];
      res.data.forEach(item => {
        item.deviceVos.forEach((it, idx) => {
          let obj = JSON.parse(JSON.stringify(it));
          obj['stallId'] = item.stallId;
          obj['businessId'] = item.businessId;
          obj['deviceNameWithLevel'] = item.regionName + '--' + item.stallName + '--' + it.name
          arr.push(obj)
        })
      })
      remoteLoading.value = false;
      deviceOptions.value = arr;
      if (props.data.type == 2) {
        let temp = JSON.parse(JSON.stringify(res.data))
        temp.forEach((item, index) => {
          temp[index]['stallNameWithLevel'] = item.regionName + '--' + item.stallName
        })
        stallOptions.value = temp;
      }
    })
  } else {
    deviceOptions.value = [];
    deviceList.data = [];
    stallOptions.value = [];
  }
}

const stallInputChange = () => {
  stallOptions.value.forEach(item => {
    if (item.stallId == searchedStallId.value) {
      searchedStall.value = item;
    }
  })
  if (searchedStall.value.deviceVos.length) {
    deviceList.data = searchedStall.value.deviceVos;
    leaveIsSearched.value = false;
  } else {
    leaveIsSearched.value = true;
  }
}

const getDialogAmountLabel = (device) => {
  if (device.supAmount == 0) {
    payDialog.label = "用量"
    payDialog.inputUnit = device.deviceType.includes('电') ? ' kwh' : 't';
    payDialog.unit = device.deviceType.includes('电') ? ' kwh' : 't';
  } else if (device.supAmount == 1) {
    payDialog.label = "金额"
    payDialog.inputUnit = "元"
    payDialog.unit = "元"
  }
}

const selectDeviceChange = () => {
  currentSelectDevice.value = deviceOptions.value.filter(item => {
    return item.deviceId == searchedDeviceId.value
  })[0];
  if (props.data.type == '3') {
    let params = {
      stallId: currentSelectDevice.value.stallId,
      businessId: currentSelectDevice.value.businessId,
      deviceId: currentSelectDevice.value.deviceId
    }
    businessService.checkBalance(params).then(res => {
      if (Number(res.data.diffAmount) > 0) {
        buttonDisabled1.value = true;
        pingActive.value = 2;
      } else {
        buttonDisabled2.value = true;
        pingActive.value = 1;
      }
      countPay.value = res.data.orderAmount;
      countIn.value = res.data.rechargeAmount;
      difference.value = res.data.diffAmount;
    })
  }
  getDialogAmountLabel(currentSelectDevice.value)
}

const clickMoneyDiv = (index, item) => {
  customMoney.value = item;
  currentMoneyDivIndex.value = index;
}

const resetCenterData = () => {
  customMoney.value = null;
  remark.value = null;
  currentSelectDevice.value = null;
  searchedDeviceId.value = null;
  currentMoneyDivIndex.value = -1;
  stallName.value = null;
  orderNumber.value = null;
  fullscreenLoading.value = false;
  leaveIsSearched.value = false;
  stallOptions.value = null;
  searchedStallId.value = null;
  searchedStall.value = null;
  countPay.value = null;
  countIn.value = null;
  difference.value = null;
  deviceList.data = [];
  payDialog.label = "金额";
  payDialog.unit = "元";
  payDialog.inputUnit = '元';
}

const recharge = () => {
  let params = {
    money: customMoney.value,
    remark: remark.value,
    orderNumber: orderNumber.value,
    deviceId: props.data.alarmData ? props.data.alarmData.deviceId : searchedDeviceId.value
  }
  fullscreenLoading.value = true;
  businessService.businessRecharge(params).then(res => {
    ElMessage({
      type: 'success',
      message: '正在充值中，请耐心等待充值成功'
    })
    payBoxData.value = {
      orderNo: res.data.orderNo,
      beforeAmount: res.data.beforeAmount,
      afterAmount: res.data.afterAmount,
      deviceName: currentSelectDevice.value.deviceName,
      money: customMoney.value,
      unit: payDialog.unit
    }
    payBoxVisible.value = true;
    payBoxRef.value.openPayBox();
  }).catch(err => { }).finally(() => {
    fullscreenLoading.value = false;
    resetCenterData();
    emit('refreshAfterFinishBusiness');
  })
}

const refund = () => {
  let params = {
    money: customMoney.value,
    remark: remark.value,
    orderNumber: orderNumber.value,
    deviceId: props.data.alarmData ? props.data.alarmData.deviceId : searchedDeviceId.value
  }
  fullscreenLoading.value = true;
  businessService.businessRefund(params).then(res => {
    ElMessage({
      type: 'success',
      message: '正在退费中，请耐心等待退费成功'
    })
    payBoxData.value = {
      orderNo: res.data.orderNo,
      beforeAmount: res.data.beforeAmount,
      afterAmount: res.data.afterAmount,
      deviceName: currentSelectDevice.value.deviceName,
      money: customMoney.value,
      unit: payDialog.unit
    }
    payBoxVisible.value = true;
    payBoxRef.value.openPayBox();
  }).catch(err => { }).finally(() => {
    fullscreenLoading.value = false;
    resetCenterData();
    emit('refreshAfterFinishBusiness');
  })
}

const balance = () => {
  let params = {
    amount: customMoney.value,
    remark: remark.value,
    balanceType: pingActive.value,
    stallId: currentSelectDevice.value.stallId,
    businessId: currentSelectDevice.value.businessId,
    deviceId: searchedDeviceId.value
  }
  fullscreenLoading.value = true;
  businessService.businessBalance(params).then(res => {
    ElMessage({
      type: 'success',
      message: '正在平账中，请耐心等待平账成功'
    })
  }).catch(err => { }).finally(() => {
    fullscreenLoading.value = false;
    resetCenterData();
    emit('refreshAfterFinishBusiness');
  })
}

const leave = () => {
  let params = {
    remark: remark.value,
    businessId: searchedStall.value.businessId,
    stallId: searchedStall.value.stallId
  }
  fullscreenLoading.value = true;
  businessService.businessLiquidation(params).then(res => {
    ElMessage({
      type: 'success',
      message: '离场成功'
    })
  }).catch(err => { }).finally(() => {
    fullscreenLoading.value = false;
    resetCenterData();
    emit('refreshAfterFinishBusiness');
  })
}

const confirm = (num) => {
  let flag = false;
  let message = '请核对您提交的信息'
  if (props.data.type !== 2) {
    if (customMoney.value && searchedDeviceId.value) {
      flag = true;
    }
  } else {
    if (searchedStall.value) {
      flag = true;
    }
  }
  if (props.data.type == 1) {
    if (Number(customMoney.value) > Number(restMoney1.value)) {
      message = '退费金额不得大于剩余金额!';
      flag = false;
    }
  }
  if (props.data.type != 2) {
    if (Number(customMoney.value) == 0) {
      message = '请输入大于0的正整数!';
      flag = false;
    }
  }
  if (flag) {
    let message = '';
    let title = '';
    switch (num) {
      case 0: {
        message = '请确定是否进行缴费？';
        title = '缴费';
        break;
      }
      case 1: {
        message = '请确定是否进行退费？';
        title = '退费';
        break;
      }
      case 2: {
        message = '请确定是否进行离场清算？';
        title = '离场清算';
        break;
      }
      case 3: {
        message = '请确定是否进行平账？';
        title = '平账';
        break;
      }
    }
    ElMessageBox.confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      switch (num) {
        case 0: {
          recharge();
          break;
        }
        case 1: {
          refund();
          break;
        }
        case 2: {
          leave();
          break;
        }
        case 3: {
          balance();
          break;
        }
      }
    })
  } else {
    ElMessage({
      type: 'error',
      message: message
    })
  }
}

onBeforeUnmount(() => {
  resetCenterData();
})

</script> 

<style scoped lang="scss">
.center-title {
  border-left: 4px solid #4960E5;
  padding-left: 16px;
  font-size: 20px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: #1C1C28;
}

.center-remind {
  margin-top: 32px;
  height: 48px;
  padding: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #FFFFFF;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px 4px 4px 4px;
}

.search {
  margin-top: 32px;
}

.search-title {
  font-size: 16px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #8E92BC;
  margin-bottom: 16px;
}

.rest-money-box {
  display: flex;
  align-items: center;
  margin-top: 16px;

  .rest-inner-box {
    display: flex;
    height: 24px;
    justify-content: space-between;
    align-items: center;
    background: #FAF2E6;
    margin-right: 16px;
    border-radius: 3px;
    padding-left: 8px;
    padding-right: 8px;
  }

  .rest-money-out-circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: relative;
    border: 1px solid #FA9600;

    .rest-money-inner-circle {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: 2px;
      border: 1px solid #FA9600;
    }
  }

  .rest-money-text {
    font-size: 12px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #FA9600;
    padding-left: 5px;
  }
}

.mony-option-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;

  .option-item {
    width: 68px;
    height: 32px;
    background: #F4F6FC;
    border-radius: 3px 3px 3px 3px;
    border: 1px solid #4960E5;
    margin-right: 16px;
    margin-bottom: 8px;
    text-align: center;
    color: #8E92BC;
    cursor: pointer;
  }

  .option-item-active {
    color: #4960E5;
  }
}

.money-div {
  margin-top: 16px;
  font-size: 16px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #8E92BC;

  .money-div-title {
    margin-bottom: 16px;
  }

  .money-div-box {
    width: 390px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;

    .money-div-item {
      width: 80px;
      height: 42px;
      background: #F4F6FC;
      border-radius: 3px 3px 3px 3px;
      line-height: 42px;
      text-align: center;
      cursor: pointer;
      margin-right: 48px;
      margin-bottom: 25px;
    }

    .money-div-item-active {
      border: 1px solid #4960E5;
      color: #4960E5;
    }
  }
}

.pay-button {
  margin-top: 16px;
  background: #546FFF;
  border-radius: 3px 3px 3px 3px;
  color: #fff;
  height: 40px;
}

.device-list {
  width: 48%;
  height: 100px;
  background: #FFFFFF;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px 8px 8px 8px;
  margin-top: 32px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .device-left {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .device-left-text {
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: #141522;
      padding-left: 8px;

      .device-left-name {
        font-size: 18px;
      }

      .device-left-price {
        margin-top: 5px;
        font-size: 16px;
      }
    }
  }

  .device-rest {
    width: 35%;
    height: 36px;
    background: #FAF2E6;
    border-radius: 50px 50px 50px 50px;
    font-size: 16px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #FA9600;
    text-align: center;
    line-height: 36px;
  }
}

.liquidation-count {
  margin-top: 24px;
  width: 288px;
  height: 56px;
  background: #FFFFFF;
  box-shadow: 0px 12px 32px 0px rgba(0, 0, 0, 0.14);
  border-radius: 8px 8px 8px 8px;
  color: #E57D05;
  display: flex;
  align-items: center;
  padding-left: 16px;
}

.pingzhang-button {
  margin-top: 24px;

  .ping-button {
    width: 120px;
    height: 40px;
    background: #FFFFFF;
    border-radius: 4px 0px 0px 4px;
    opacity: 1;
    border: 1px solid #CED4DB;
  }

  .ping-button-active {
    color: #FFFFFF;
    background: #4960E5;
  }

  .left-button {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  .right-button {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    margin-left: -1px;
  }
}

:deep(.search-select .el-input__inner) {
  background: #F4F6FC !important;
  height: 48px;
  border-radius: 8px;
  border: 0px !important;
  outline: none !important;
  box-shadow: none !important;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: #8E92BC;
}

:deep(.new-search .el-input__inner) {
  height: 40px;
}

:deep(.money-div-item .el-input__inner) {
  width: 80px;
  height: 42px;
  background: #F4F6FC;
  line-height: 42px;
  text-align: center;
  color: #8E92BC;
  border: none;
  border-radius: 3px 3px 3px 3px;
}

:deep(.el-textarea__inner) {
  min-height: 90px !important;
  background: #F4F6FC !important;
  box-shadow: none !important;
}

.ping-label {
  font-size: 18px;
  color: #141522;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
}

.ping-value {
  color: #FA9600;
  font-size: 18px;
}

.ping-count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  background: #FFFFFF;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  height: 56px;
  padding-left: 24px;
  padding-right: 24px;
  margin-top: 20px;
}

input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #CBCDE8;
}

input::-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #CBCDE8;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */

  color: #CBCDE8;
}

input::-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #CBCDE8;
}
</style>