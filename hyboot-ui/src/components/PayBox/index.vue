<template>
  <div class="main" v-if="ownVisible">
    <div class="icon">
      <el-icon>
        <SuccessFilled />
      </el-icon>
    </div>
    <div class="right">
      <div class="right-top">
        <div class="success-title">{{ props.type }} 成功</div>
        <div>
          <span class="close">{{ count }}s后自动关闭</span>
          <span class="close-icon" @click="close"><el-icon>
              <Close />
            </el-icon></span>
        </div>
      </div>
      <div style="font-size: 14px;">
        {{ props.data.deviceName }}
        表具在线
        {{ props.type }}
        {{ props.data.money }}
        元成功，
        {{ props.type }}前剩余{{ props.data.beforeAmount }}{{ props.data.unit }}，
        {{ props.type }}后剩余{{ props.data.afterAmount }}{{ props.data.unit }}，<span class="print" @click="print">打印单据</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import businessService from "../../api/payment/business";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  data: {
    type: Object,
    default: {}
  }
})

const emit = defineEmits(["falseWatchVisible"]);

let count = ref(300)
let timer = ref(null);
let ownVisible = ref(false)

watch(() => count.value, (newValue) => {
  if (newValue == 0) {
    clearInterval(timer.value)
  }
})

onMounted(() => {
  timer.value = setInterval(() => {
    if (count.value > 0) {
      count.value = count.value - 1;
    }
    if (count.value == 0) {
      ownVisible.value = false;
      emit('falseWatchVisible')
    }
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})

function close () {
  ownVisible.value = false;
}

function openPayBox () {
  ownVisible.value = true;
  count.value = 300;
}

function print () {
  businessService.downloadPdf({ orderNo: props.data.orderNo }).then(res => {
    const blob = new Blob([res], { type: 'application/pdf;charset-UTF-8' });
    const href = URL.createObjectURL(blob)
    window.open(href, "_blank")
  })
}

defineExpose({ close, openPayBox });
</script>

<style lang="scss" scoped>
.main {
  background: #F0F9EB;
  width: 100%;
  height: 80px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-width: 500px;

  .icon {
    color: green;
    font-size: 36px;
    width: 18%;
    height: 100%;
    padding-left: 0px;
    line-height: 90px;
    text-align: center;
  }

  .right {
    padding-left: 10px;
    width: 80%;
    height: 100%;
    padding-right: 5px;
    padding-top: 8px;

    .right-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close {
      font-size: 12px;
      color: #000;
      opacity: 0.5;
    }

    .close-icon {
      padding-left: 8px;
      cursor: pointer;
    }

    .success-title {
      font-size: 16px;
      color: #000;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .print {
      color: #1890ff;
      cursor: pointer;
    }
  }
}
</style>