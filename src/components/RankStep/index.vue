<template>
  <span style="color: #7685a8">{{ name }}</span>
  <div class="step">
    <div class="step_container">
      <div class="step_container_content"></div>
      <div class="tips">
        <!--        <div class="tips_data">{{ name }}</div>-->
        <div class="tips_data">{{ value }}kw·h</div>
      </div>
    </div>
    <div class="step_rank">{{ ranking }}</div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  //排名
  ranking: {
    type: Number,
    default: () => 0
  },
  //占比
  process: {
    type: String,
    default: () => '0%'
  },
  //数值
  value: {
    type: String,
    default: () => ''
  },
  //建筑名称
  name: {
    type: String,
    default: () => ''
  }
})
const colorEnums = {
  1: 'rgba(62, 125, 221, 1)',
  2: 'rgba(248, 205, 101, 1)',
  3: 'rgba(69, 188, 168, 1)',
  4: 'rgba(206, 212, 219, 1)',
  5: 'rgba(206, 212, 219, 1)',
  6: 'rgba(206, 212, 219, 1)',
  7: 'rgba(206, 212, 219, 1)'
}
const bgEnums = {
  1: 'rgba(62, 125, 221, .3)',
  2: 'rgba(248, 205, 101, .3)',
  3: 'rgba(69, 188, 168, .3)',
  4: 'rgba(206, 212, 219, .3)',
  5: 'rgba(206, 212, 219, .3)',
  6: 'rgba(206, 212, 219, .3)',
  7: 'rgba(206, 212, 219, .3)'
}
const primaryColor = computed(() => colorEnums[props.ranking])
const containerColor = computed(() => bgEnums[props.ranking])
const processing = computed(() => props.process)
</script>
<style scoped lang="scss">
.step {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &_container {
    width: 243px;
    height: 10px;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    cursor: pointer;
    transition: background-color 0.1s linear;
    &_content {
      width: v-bind('processing');
      height: 10px;
      border-radius: 10px;
      background: linear-gradient(
        270deg,
        v-bind('primaryColor') 0%,
        #ffffff 100%
      );
    }
    &:hover {
      background: v-bind('containerColor');
      .tips {
        display: block;
        animation: hideIndex 0.15s;
      }
      .step_container_content {
        background: v-bind('primaryColor');
      }
    }
    .tips {
      position: absolute;
      width: 120px;
      height: 40px;
      background: #333a6f;
      border-radius: 8px;
      color: #ffffff;
      line-height: 40px;
      font-size: 20px;
      font-weight: 400;
      padding-left: 6px;
      left: 50%;
      transform: translateX(-50%);
      bottom: 20px;
      display: none;
      &:after {
        border-top: 15px solid #333a6f;
        border-right: 15px solid transparent;
        border-left: 15px solid transparent;
        content: '';
        display: block;
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  &_rank {
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    background: v-bind('primaryColor');
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
    border-radius: 4px;
  }
}
@keyframes hideIndex {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
