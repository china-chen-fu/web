<template>
  <div style="display: flex; align-items: center" class="week-step">
    <el-icon class="preWeek" @click="calcPreWeek"><CaretLeft /></el-icon>
    <span>{{ beginTime }} ~ {{ endTime }}</span>
    <el-icon
      class="nextWeek"
      :class="{ disabled: noNext }"
      @click="calcNextWeek"
      ><CaretRight
    /></el-icon>
  </div>
</template>

<script>
export default {
  name: "index",
};
</script>
<script setup>
import moment from "moment";
import { toRefs, computed } from "vue";
const props = defineProps({
  beginTime: {
    type: String,
    default: () => moment(new Date()).subtract(6, "days").format("YYYY-MM-DD"),
  },
  endTime: {
    type: String,
    default: () => moment(new Date()).format("YYYY-MM-DD"),
  },
  step: {
    type: Number,
    default: () => 7,
  },
});
const emits = defineEmits(["change"]);
const { beginTime, endTime } = toRefs(props);
const today = moment(new Date()).format("YYYY-MM-DD");
const noNext = computed(() => {
  return props.endTime === today;
});
//向前计算时间-做减法
const calcPreWeek = () => {
  const calcBeginTime = moment(beginTime.value)
    .subtract(props.step, "days")
    .format("YYYY-MM-DD");
  const calcEndTime = moment(endTime.value)
    .subtract(props.step, "days")
    .format("YYYY-MM-DD");
  emits("change", { calcBeginTime, calcEndTime });
};
//向后计算时间-做加法
const calcNextWeek = () => {
  if (noNext.value) return;
  const calcBeginTime = moment(beginTime.value)
    .add(props.step, "days")
    .format("YYYY-MM-DD");
  const calcEndTime = moment(endTime.value)
    .add(props.step, "days")
    .format("YYYY-MM-DD");
  emits("change", { calcBeginTime, calcEndTime });
};
</script>
<style scoped lang="scss">
.el-icon {
  cursor: pointer;
  user-select: none;
  color: #4AA5A6;
  font-size: 20px;
}
.disabled {
  color: #ddd;
}
span {
  margin: 0 5px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(96, 98, 102, 1);
}
</style>
