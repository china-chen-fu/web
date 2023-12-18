<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
import {onMounted, nextTick} from "vue";

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>

<style lang="scss">
//请勿删除 下面的css作用于其他页面
.stall-popper {
  border-radius: 10px !important;
  padding: 0 !important;

  .out-circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: relative;

    .inner-circle {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      position: absolute;
      top: 3px;
      left: 3px;
    }
  }

  .stall-name-popover {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 16px;
    padding-top: 10px;
    padding-bottom: 5px;
    font-size: 16px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #18191A;
  }

  .popover-content-box {
    width: 100%;
    height: 100%;
  }

  .stall-name-popover-info {
    padding-left: 19px;
    padding-top: 0px;
    padding-bottom: 10px;
    font-size: 14px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #8E92BC;
    padding-right: 16px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 10px;

    .info-key {
      display: inline-block;
      width: 70px;
      text-align: left;
      padding-right: 8px;
    }
  }

  .center-stall-name {
    padding-left: 16px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #141522;
    padding-left: 10px;
  }

  .popover-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 16px;
    cursor: pointer;
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #141522;
  }
}
</style>
