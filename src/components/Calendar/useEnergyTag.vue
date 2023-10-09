<template>
  <div v-if="timeList.length !== 0">
    <div v-if="timeList.length === 1">
      <template v-if="timeList[0].status === '1'">
        <div class="highEnergy" @click="showEchartHighLight(timeList[0])">
          <div class="highEnergy_left">
            <div class="highEnergy_icon">
              <svg-icon icon-class="battery" style="color: #ffffff"></svg-icon>
            </div>
          </div>
          <div class="highEnergy_right">
            <div class="highEnergy_data">
              <span class="highEnergy_data_title">用电高峰 </span>
              <span class="highEnergy_data_time">{{ timeList[0].startTime }}-{{ timeList[0].endTime }}</span>
            </div>
            <div class="highEnergy_use">最大值{{ timeList[0].deviceUsage }}kW·h</div>
          </div>
        </div>
      </template>
      <template v-if="timeList[0].status === '2'">
        <div class="lowEnergy" @click="showEchartHighLight(timeList[0])">
          <div class="lowEnergy_left">
            <div class="lowEnergy_icon">
              <svg-icon icon-class="battery" style="color: #ffffff"></svg-icon>
            </div>
          </div>
          <div class="lowEnergy_right">
            <div class="lowEnergy_data">
              <span class="lowEnergy_data_title">用电低谷 </span>
              <span class="lowEnergy_data_time">{{ timeList[0].startTime }}-{{ timeList[0].endTime }}</span>
            </div>
            <div class="lowEnergy_use">最小值{{ timeList[0].deviceUsage }}kW·h</div>
          </div>
        </div>
      </template>
    </div>
    <div v-if="timeList.length > 1">
      <div class="energyList">
        <div class="energyList_item" v-for="(item, index) in timeList" :class="{ energyList_low: item.status === '2' }" :key="index">
          <el-popover :width="256" placement="top-start" :teleported="false">
            <template #reference>
              <div class="energyList_item_icon">{{ item.status === "1" ? "高" : "低" }}</div>
            </template>
            <template #default>
              <div class="highEnergy" v-if="item.status === '1'" @click="showEchartHighLight(item)">
                <div class="highEnergy_left">
                  <div class="highEnergy_icon">
                    <svg-icon icon-class="battery" style="color: #ffffff"></svg-icon>
                  </div>
                </div>
                <div class="highEnergy_right">
                  <div class="highEnergy_data">
                    <span class="highEnergy_data_title">用电高峰 </span>
                    <span class="highEnergy_data_time">{{ item.startTime }}-{{ item.endTime }}</span>
                  </div>
                  <div class="highEnergy_use">最大值{{ item.deviceUsage }}kW·h</div>
                </div>
              </div>
              <div class="lowEnergy" v-if="item.status === '2'" @click="showEchartHighLight(item)">
                <div class="lowEnergy_left">
                  <div class="lowEnergy_icon">
                    <svg-icon icon-class="battery" style="color: #ffffff"></svg-icon>
                  </div>
                </div>
                <div class="lowEnergy_right">
                  <div class="lowEnergy_data">
                    <span class="lowEnergy_data_title">用电低谷 </span>
                    <span class="lowEnergy_data_time">{{ item.startTime }}-{{ item.endTime }}</span>
                  </div>
                  <div class="lowEnergy_use">最小值{{ item.deviceUsage }}kW·h</div>
                </div>
              </div>
            </template>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "useEnergyTag"
};
</script>
<script setup>
const props = defineProps({
  timeList: {
    type: Array,
    default: () => []
  }
});
const showEchartHighLight = () => {}
</script>
<style scoped lang="scss">
.highEnergy {
  height: 42px;
  width: 100%;
  background: rgba(115, 83, 214, 0.10);
  border-radius: 4px;
  opacity: 1;
  border: 1px solid #7353D6;
  padding: 3px 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  &_icon {
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background: #7353D6;
    color: #ffffff;
    border-radius: 50%;
    margin-right: 10px;
  }
  &_data {
    font-size: 12px;
    color: #7353D6;
  }
  &_use {
    font-size: 12px;
    color: #7353D6;
  }
}
.lowEnergy {
  height: 42px;
  width: 100%;
  background: rgba(74, 165, 166, 0.10);
  border-radius: 4px;
  opacity: 1;
  border: 1px solid #4AA5A6;
  padding: 3px 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  &_icon {
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background: #4AA5A6;
    color: #ffffff;
    border-radius: 50%;
    margin-right: 10px;
  }
  &_data {
    font-size: 12px;
    color: #4AA5A6;
  }
  &_use {
    font-size: 12px;
    color: #4AA5A6;
  }
}
.energyList {
  display: flex;
  align-items: center;
  padding: 1px 0;
  position: relative;
  top: 5px;
  &_item {
    width: 30px;
    height: 30px;
    color: #ffffff;
    border-radius: 50%;
    font-size: 12px;
    background: #7353D6;
    text-align: center;
    line-height: 30px;
    margin-right: 9px;
  }
  &_low {
    background: #4AA5A6;
  }
}
</style>
