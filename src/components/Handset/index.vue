<template>
  <div class="handset">
    <el-scrollbar style="height: calc(100% - 68px);">
      <!-- 中央空调 -->
      <div v-show="props.airType == '中央' || props.airType == 'all'" class="mb16 header">
        <img src="@/assets/images/control/manage/panel-header.png" alt="">
        <div style="padding-left: 3px;">中央空调控制</div>
      </div>
      <div v-show="props.airType == '中央' || props.airType == 'all'">
        <SubComponent ref="centerAirRef" :is-detail="props.isDetail" :airType="'中央'" :data="transCardData" :strategyData="strategyData"></SubComponent>
      </div>
      <!-- 多联机空调 -->
      <div v-show="props.airType == '多联机' || props.airType == 'all'" class="mb16 header">
        <img src="@/assets/images/control/manage/panel-header.png" alt="">
        <div style="padding-left: 3px;">多联机空调控制</div>
      </div>
      <div v-show="props.airType == '多联机' || props.airType == 'all'">
        <SubComponent ref="vrfAirRef" :is-detail="props.isDetail" :airType="'多联机'" :data="transCardData" :strategyData="strategyData"></SubComponent>
      </div>
    </el-scrollbar>
    <div class="button-group">
      <el-button v-if="!props.isDetail" @click="cancel">取消</el-button>
      <el-button v-else @click="cancel">重置</el-button>
      <el-button type="primary" @click="confirm">生效</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';
import SubComponent from './subComponent.vue'
import { ElMessage } from 'element-plus';

const props = defineProps({
  isDetail: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: []
  },
  airType: {
    type: String
  },
  strategyData: {
    type: Object
  }
})
const emits = defineEmits(['controlPanelConfirm', 'controlPanelCancel'])
let centerAirRef = ref();
let vrfAirRef = ref();

let transCardData = ref(null);
let strategyData = ref(null)

watch(() => props.data, (nv) => {
  if(nv) {
    initData();
  }
}, { deep: true, immediate: true })

watch(() => props.strategyData, (nv) => {
  if(nv) {
    strategyData.value = JSON.parse(JSON.stringify(props.strategyData))
  }
}, { deep: true, immediate: true })

function initData() {
  if(props.data.length == 1) {
    transCardData.value = JSON.parse(JSON.stringify(props.data[0]));
  }else {
    transCardData.value = null;
  }
}

let centralPanel = ref({
  openStatus: '0',
  mode: '',
  windSpeed: '',
  temperature: '',
  type: '中央'
})
let vrvPanel = ref({
  dOpenStatus: '0',
  dMode: '',
  dWindSpeed: '',
  dTemperature: '',
  type: '多联机'
})

function cancel() {
  if(!props.isDetail) {
    emits('controlPanelCancel')
  }else {
    initData();
  }
}

function confirm() {
  getPanelData();
  if(checkParams()) {
    ElMessage({type: 'warning', message: '请全部设置完毕后点击生效！'})
  }else {
    let data = [centralPanel.value, vrvPanel.value];
    emits('controlPanelConfirm', data)
  }
}

function getPanelData() {
  if(props.airType == '中央' || props.airType == 'all') {
    let centralData =  centerAirRef.value.control;
    centralPanel.value.openStatus = transToCommand('switch', centralData.switch, '中央');
    centralPanel.value.mode = transToCommand('mode', centralData.mode, '中央');
    centralPanel.value.windSpeed = transToCommand('wind', centralData.wind, '中央');
    centralPanel.value.temperature = centralData.temperature.toString();
  }
  if(props.airType == '多联机' || props.airType == 'all') {
    let vrvData = vrfAirRef.value.control;
    vrvPanel.value.dOpenStatus = transToCommand('switch', vrvData.switch, '多联机');
    vrvPanel.value.dMode = transToCommand('mode', vrvData.mode, '多联机');
    vrvPanel.value.dWindSpeed = transToCommand('wind', vrvData.wind, '多联机');
    vrvPanel.value.dTemperature = vrvData.temperature.toString();
  }
}

function transToCommand(key, value, airType) {
  let params = '';
  switch(key) {
    case 'switch': {
      if(airType == '中央'){
        params = value == 0 ? '00' : '01';
      }else if(airType == '多联机') {
        params = value == 0 ? '0' : '1';
      }
      break;
    }
    case 'mode': {
      if(airType == '中央'){
        if(value == 0) {
          params = '01';
        }else if(value == 1) {
          params = '04';
        }
      }else if(airType == '多联机') {
        if(value == 0) {
          params = '2';
        }else if(value == 1) {
          params = '16';
        }else if(value == 2) {
          params = '4';
        }else if(value == 3) {
          params = '8';
        }
      }
      break;
    }
    case 'wind': {
      if(airType == '中央'){
        if(value == 0) {
          params = '00';
        }else if(value == 1) {
          params = '01';
        }else if(value == 2) {
          params = '02';
        }else if(value == 3) {
          params = '03';
        }
      }else if(airType == '多联机') {
        if(value == 0) {
          params = '6';
        }else if(value == 1) {
          params = '8';
        }else if(value == 2) {
          params = '4';
        }else if(value == 3) {
          params = '2';
        }
      }
      break;
    }
  }
  return params;
}

function checkParams() {
  let result = null;
  let result1 = loopObjectJudgeValueIsNull(centralPanel.value);
  let result2 = loopObjectJudgeValueIsNull(vrvPanel.value);
  if(props.airType == '中央') {
    result = result1;
  }
  if(props.airType == '多联机') {
    result = result2;
  }
  if(props.airType == 'all') {
    if(result1 || result2) {
      result = true;
    }else {
      result = false;
    }
  }
  return result;
}

function loopObjectJudgeValueIsNull(data) {
  let result = false;
  Object.values(data).forEach(item => {
    if(item === '') {
      result = true;
    }
  })
  return result;
}
</script>


<style lang="scss" scoped>
.handset {
  width: 100%;
  height: 100%;

  .header {
    width: 100%;
    height: 48px;
    background: linear-gradient(270deg, #fff 0%, rgba(22,119,255, 0.07) 100%);
    border-radius: 4px;
    display: flex;
    justify-content: flex-start;
    align-items: center;     
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 550;
    color: #262A30;
    padding-left: 17px;
  }

  .mb16 {
    margin-bottom: 16px;
  }

  .button-group {
    width: 291px;
    height: 68px;
    position: fixed;
    bottom: 16px;
    padding-left: 48px;
    padding-top: 16px;
    border-top: 1px solid rgba(0,0,0,0.05);

    button {
      width: 88px;
      height: 36px;
      line-height: 36px;
    }
  }
}
</style>