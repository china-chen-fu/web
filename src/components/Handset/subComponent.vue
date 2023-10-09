<template>
  <div class="center-air">
    <div class="switch mb24">
      <div class="title">开关设定</div>
      <el-switch v-model="control.switch" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #1677FF"></el-switch>
    </div>
    <div class="mb24">
      <div class="title">模式设定</div>
      <div class="mode-box">
        <div class="module" :class="{'module-active': control.mode == 0}" @click="switchMode(0)">
          <div class="icon">
            <img v-if="control.mode != 0" src="@/assets/images/control/manage/panel-cold.png" width="20" height="20" alt="">
            <img v-else src="@/assets/images/control/manage/cold-active.png" width="20" height="20" alt="">
          </div>
          <div class="text">制冷</div>
        </div>
        <div class="module" :class="{'module-active': control.mode == 1}" @click="switchMode(1)">
          <div class="icon">
            <img v-if="control.mode != 1" src="@/assets/images/control/manage/panel-hot.png" width="20" height="20" alt="">
            <img v-else src="@/assets/images/control/manage/hot-active.png" width="20" height="20" alt="">
          </div>
          <div class="text">制热</div>
        </div>
        <div v-if="props.airType == '多联机'" class="module" :class="{'module-active': control.mode == 2}" @click="switchMode(2)">
          <div class="icon">
            <img v-if="control.mode != 2" src="@/assets/images/control/manage/panel-shi.png" width="20" height="20" alt="">
            <img v-else src="@/assets/images/control/manage/shi-active.png" width="20" height="20" alt="">
          </div>
          <div class="text">除湿</div>
        </div>
        <div v-if="props.airType == '多联机'" class="module" :class="{'module-active': control.mode == 3}" @click="switchMode(3)">
          <div class="icon">
            <img v-if="control.mode != 3" src="@/assets/images/control/manage/panel-song.png" width="20" height="20" alt="">
            <img v-else src="@/assets/images/control/manage/song-active.png" width="20" height="20" alt="">
          </div>
          <div class="text">送风</div>
        </div>
      </div>
    </div>
    <div class="mb24">
      <div class="title">风速设置</div>
      <div class="mode-box">
        <div class="module" :class="{'module-active': control.wind == 0}" @click="switchWind(0)">
          <div v-if="props.airType == '中央'">
            <div class="icon">
              <img v-if="control.wind != 0" src="@/assets/images/control/manage/panel-auto.png" width="20" height="20" alt="">
              <img v-else src="@/assets/images/control/manage/auto-active.png" width="20" height="20" alt="">
            </div>
            <div class="text">自动</div>
          </div>
          <div v-else>
            <div class="icon">
              <img v-if="control.wind != 0" src="@/assets/images/control/manage/panel-small.png" width="20" height="20" alt="">
              <img v-else src="@/assets/images/control/manage/small-active.png" width="20" height="20" alt="">
            </div>
            <div class="text">微风</div>
          </div>
        </div>
        <div class="module" :class="{'module-active': control.wind == 1}" @click="switchWind(1)">
          <div class="icon">
            <img v-if="control.wind != 1" src="@/assets/images/control/manage/panel-wind1.png" width="20" height="20" alt="">
            <img v-else src="@/assets/images/control/manage/wind1-active.png" width="20" height="20" alt="">
          </div>
          <div class="text">低速</div>
        </div>
        <div class="module" :class="{'module-active': control.wind == 2}" @click="switchWind(2)">
          <div class="icon">
            <img v-if="control.wind != 2" src="@/assets/images/control/manage/panel-wind2.png" width="20" height="20" alt="">
            <img v-else src="@/assets/images/control/manage/wind2-active.png" width="20" height="20" alt="">
          </div>
          <div class="text">中速</div>
        </div>
        <div class="module" :class="{'module-active': control.wind == 3}" @click="switchWind(3)">
          <div class="icon">
            <img v-if="control.wind != 3" src="@/assets/images/control/manage/panel-wind3.png" width="20" height="20" alt="">
            <img v-else src="@/assets/images/control/manage/wind3-active.png" width="20" height="20" alt="">
          </div>
          <div class="text">高速</div>
        </div>
      </div>
    </div>
    <div class="temp mb24">
      <div class="title">温度设定</div>
      <el-input-number v-model="control.temperature" :min="16" :max="32" :step="1" controls-position="right" />
      <span class="unit">℃</span>
    </div>
    <div v-if="props.isDetail" class="mb24">
      <div class="title">控制策略</div>
      <div class="mb16 strategy" v-if="props.strategyData" @click="showStrategyDialog">{{ props.strategyData.sName }}</div>
      <div class="mb16 strategy" style="color: #888;" v-else>暂无策略</div>
    </div>

    <el-dialog v-model="dialogVisible" title="策略详情" width="60%" :before-close="handleDialogClose">
      <el-scrollbar height="500">
        <StrategyComponent style="margin-bottom: 16px;" :title="'工作日（周一至周五）'" :preview="true" :type="props.airType == '中央' ? '2' : '1'" :list="holidayStrategy"></StrategyComponent>
        <StrategyComponent style="margin-bottom: 16px;" :title="'周末（周六至周日）'" :preview="true" :type="props.airType == '中央' ? '2' : '1'" :list="weekdayStrategy"></StrategyComponent>
        <StrategyComponent :preview="true" :title="'节假日（设置节假日策略后，优先按照节假日策略运行）'" :type="props.airType == '中央' ? '2' : '1'" :list="weekendDayStrategy"></StrategyComponent>
      </el-scrollbar>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { defineProps, defineExpose, ref, watch, onBeforeUnmount } from 'vue';
import { getStrategyTemplateDetailAPI } from '@/api/control/strategy/template.js';
import StrategyComponent from '@/views/aircondition/control/components/filterTimeTable.vue';
const props = defineProps({
  isDetail: {
    type: Boolean,
  },
  airType: {
    type: String
  },
  data: {
    type: Object,
    default: {}
  },
  strategyData: {
    type: Object
  }
})
let control = ref({
  switch: 0,
  mode: -1,
  wind: -1,
  temperature: 16
})
watch(() => props.data, (nv) => {
  if(nv) {
    initData();
  }else {
    resetData();
  } 
}, { deep: true, immediate: true })

function initData() {
  if(props.data) {
    if(props.airType == '多联机') {
      control.value.switch = Number(props.data.startingUp);
      if(props.data.refrigeration == '2') {
        control.value.mode = 0;
      }else if(props.data.refrigeration == '4') {
        control.value.mode = 2;
      }else if(props.data.refrigeration == '8') {
        control.value.mode = 3;
      }else if(props.data.refrigeration == '16') {
        control.value.mode = 1;
      }
      if(props.data.windSpeed == '2') {
        control.value.wind = 3;
      }else if(props.data.windSpeed == '4') {
        control.value.wind = 2;
      }else if(props.data.windSpeed == '6') {
        control.value.wind = 0;
      }else if(props.data.windSpeed == '8') {
        control.value.wind = 1;
      }
    }else {
      control.value.switch = props.data.startingUp == '00' ? 0 : props.data.startingUp == '01' ? 1 : 0;
      if(props.data.refrigeration == '01') {
        control.value.mode = 0;
      }else if(props.data.refrigeration == '04') {
        control.value.mode = 1;
      }
      if(props.data.windSpeed == '00') {
        control.value.wind = 0;
      }else if(props.data.windSpeed == '01') {
        control.value.wind = 1;
      }else if(props.data.windSpeed == '02') {
        control.value.wind = 2;
      }else if(props.data.windSpeed == '03') {
        control.value.wind = 3;
      }
    }
    control.value.temperature = Number(props.data.temperature);
  }
}

function switchMode(type) {
  if(control.value.mode == type) {
    control.value.mode = -1;
  }else {
    control.value.mode = type;
  }
}

function switchWind(type) {
  if(control.value.wind == type) {
    control.value.wind = -1;
  }else {
    control.value.wind = type;
  }
}

function resetData() {
  control.value.mode = -1;
  control.value.switch = 0;
  control.value.wind = -1;
  control.value.temperature = 16;
}

let holidayStrategy = ref([])
let weekdayStrategy = ref([]);
let weekendDayStrategy = ref([]);
function showStrategyDialog() {
  getStrategyTemplateDetailAPI(props.strategyData.strategyId).then(res => {
    dialogVisible.value = true;
    holidayStrategy.value = res.data.holiday;
    weekdayStrategy.value = res.data.weekday;
    weekendDayStrategy.value = res.data.weekendDay;
  })
}

let dialogVisible = ref(false);
function handleDialogClose() {
  dialogVisible.value = false;
}

onBeforeUnmount(() => {
  resetData();
})

defineExpose({
  control
})
</script>

<style lang="scss" scoped>
  .center-air {
    width: 100%;
    padding: 24px;
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .title {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #444444;
    margin-bottom: 8px;
  }

  .mb32 {
    margin-bottom: 32px;
  }

  .mb24 {
    margin-bottom: 24px;
  }

  .mb16 {
    margin-bottom: 16px;
  }

  .mb8 {
    margin-bottom: 8px;
  }
  .switch {
    :deep(.el-switch__core) {
      width: 46px;
      height: 22px;
    }
  }

  .temp {
    :deep(.el-input-number) {
      width: 156px;
      line-height: 34px;
    }

    .unit {
      padding-left: 8px;
      color: #888888;
      font-size: 14px;
    }
  }

  .mode-box {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .module {
      width: 54px;
      height: 54px;
      padding-left: 14px;
      padding-top: 7px;
      background: #F2F3F9;
      border-radius: 6px;
      margin-right: 12px;
      cursor: pointer;
      border: 1px solid #F2F3F9;

      .icon {
        width: 20px;
        height: 20px;
      }

      .text {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        margin-top: 3px;
        color: #888;
      }
    }

    .module-active {
      border: 1px solid #1677FF;
      .text {
        color: #1677FF;
      }
    }
  }

.strategy {
  color: #1677FF;
  font-size: 14px;
  cursor: pointer;
}
</style>