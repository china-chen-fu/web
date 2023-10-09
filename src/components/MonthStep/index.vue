<template>
  <div>
    <el-icon class="preWeek" @click="calcPreWeek"><CaretLeft /></el-icon>
    <span>{{ beginMonth }} ~ {{ endMonth }}</span>
    <el-icon class="nextWeek" :class="{ disabled: noNext }" @click="calcNextWeek"><CaretRight /></el-icon>
  </div>
</template>

<script>
export default {
  name: "index"
};
</script>
<script setup>
import moment from "moment";
import { toRefs, computed } from "vue";
const props = defineProps({
  beginMonth: {
    type: String,
    default: () => ""
  },
  endMonth: {
    type: String,
    default: () => ""
  },
  step:{
    type: Number,
    default: () => 12
  }
});
const emits = defineEmits(["change"]);
const { beginMonth, endMonth } = toRefs(props);
const today = moment(new Date()).format("YYYY-MM");
const noNext = computed(() => {
  return props.endMonth === today;
});
//向前计算时间-做减法
const calcPreWeek = () => {
  const calcBeginMonth = moment(beginMonth.value).subtract(props.step, "months").format("YYYY-MM");
  const calcEndMonth = moment(endMonth.value).subtract(props.step, "months").format("YYYY-MM");
  emits("change", { calcBeginMonth, calcEndMonth });
};
//向后计算时间-做加法
const calcNextWeek = () => {
  if (noNext.value) return;
  const calcBeginMonth = moment(beginMonth.value).add(props.step, "months").format("YYYY-MM");
  const calcEndMonth = moment(endMonth.value).add(props.step, "months").format("YYYY-MM");
  emits("change", { calcBeginMonth, calcEndMonth });
};
</script>
<style scoped lang="scss">
.el-icon {
  position: relative;
  top: 4px;
  cursor: pointer;
  user-select: none;
  color: #4AA5A6;
  font-size: 20px;
}
.disabled {
  color: #ddd;
}
span {
  margin: 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: #2f3133;
}
</style>
