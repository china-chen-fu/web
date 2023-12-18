<template>
  <div v-if="props.status">
    <div class="table-status" :style="{ 'background-color': filterStatus(props.status).bgc, 'color': filterStatus(props.status).color }">{{ filterStatus(props.status).label }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: ''
  }
})

const statusTabs = ref([
  {
    label: '全部',
    color: '',
    bgc: '',
    key: -1
  },
  {
    label: '正常',
    color: '#19B21E',
    bgc: '#E8F7E8',
    key: 0,
  },
  {
    label: '离线',
    color: '#8D9094',
    bgc: '#EEF1F5',
    key: 1,
  },
  {
    label: '告警',
    color: '#FA9600',
    bgc: '#FAF2E6',
    key: 2,
  },
])

function filterStatus (status) {
  let obj = statusTabs.value.filter(item => {
    return item.label == status
  })[0];
  return obj;
}
</script>

<style scoped lang="scss">
.table-status {
  width: 72px;
  height: 28px;
  line-height: 28px;
  border-radius: 65px 65px 65px 65px;
  text-align: center;
}
</style>