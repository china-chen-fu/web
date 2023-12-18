<template>
  <div class="device-hole" :style="{ 'width': data.width, 'height': data.height }">
    <div class="status">
      <div style="display: flex;justify-content: flex-start;align-items: center;">
        <div class="out-circle" :style="{ 'backgroundColor': filterStyle(data.status).outRingColor }">
          <div class="inner-circle" :style="{ 'backgroundColor': filterStyle(data.status).innerRingColor }"></div>
        </div>
        <div style="font-size: 14px;padding-left: 5px;" :style="{ 'color': filterStyle(data.status).color }">{{ data.status }}</div>
      </div>
    </div>
    <div class="indication">
      <span class="number">{{ toThousand(data.indication) }}</span>
      <span class="unit">{{ data.unit }}</span>
    </div>
    <div class="date">
      {{ data.date }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import toThousand from '../../../../utils/thousand'

const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
  isDevice: {
    type: Boolean,
    default: false
  }
})

const statusArr = [
  {
    label: '正常',
    color: '#141522',
    bgc: '#FBFAFF',
    key: 1,
    outRingColor: 'rgba(59,189,64, 0.5)',
    innerRingColor: 'rgba(59,189,64, 1)'
  },
  {
    label: '空置',
    color: '#141522',
    bgc: '#E6EFFA',
    key: 2,
    outRingColor: 'rgba(61,137,233, 0.5)',
    innerRingColor: '#0D6CE4'
  },
  {
    label: '离线',
    color: '#F0880A',
    bgc: '#FAF2E6',
    key: 3,
    outRingColor: 'rgba(243,160,59,0.5)',
    innerRingColor: '#F0880A'
  },
  {
    label: '报警',
    color: '#E54045',
    bgc: '#FAEBEB',
    key: 4,
    outRingColor: 'rgba(235,89,94,0.5)',
    innerRingColor: '#E54045'
  },
  {
    label: '暂无',
    color: '#141522',
    bgc: '#E6EFFA',
    key: 5,
    outRingColor: 'rgba(61,137,233, 0.5)',
    innerRingColor: '#0D6CE4'
  },
]

const deviceStatusArr = [
  {
    label: '正常',
    color: '#141522',
    bgc: '#FBFAFF',
    key: 0,
    outRingColor: 'rgba(59,189,64, 0.5)',
    innerRingColor: 'rgba(59,189,64, 1)'
  },
  {
    label: '低量报警',
    color: '#E54045',
    bgc: '#FAEBEB',
    key: 1,
    outRingColor: 'rgba(235,89,94,0.5)',
    innerRingColor: '#E54045'
  },
  {
    label: '欠费报警',
    color: '#E54045',
    bgc: '#FAEBEB',
    key: 2,
    outRingColor: 'rgba(235,89,94,0.5)',
    innerRingColor: '#E54045'
  },
  {
    label: '强制关断',
    color: '#E54045',
    bgc: '#FAEBEB',
    key: 3,
    outRingColor: 'rgba(235,89,94,0.5)',
    innerRingColor: '#E54045'
  },
  {
    label: '强制合闸',
    color: '#E54045',
    bgc: '#FAEBEB',
    key: 4,
    outRingColor: 'rgba(235,89,94,0.5)',
    innerRingColor: '#E54045'
  },
  {
    label: '暂无',
    color: '#141522',
    bgc: '#E6EFFA',
    key: 5,
    outRingColor: 'rgba(61,137,233, 0.5)',
    innerRingColor: '#0D6CE4'
  },
  {
    label: '在线',
    color: '#141522',
    bgc: '#FBFAFF',
    key: 6,
    outRingColor: 'rgba(59,189,64, 0.5)',
    innerRingColor: 'rgba(59,189,64, 1)'
  },
  {
    label: '离线',
    color: '#F0880A',
    bgc: '#FAF2E6',
    key: 7,
    outRingColor: 'rgba(243,160,59,0.5)',
    innerRingColor: '#F0880A'
  },
]

const filterStyle = (status) => {
  let obj = {};
  if (props.isDevice) {
    obj = deviceStatusArr.filter(item => {
      return item.label == status
    })[0];
  } else {
    obj = statusArr.filter(item => {
      return item.label == status
    })[0];
  }
  return obj
}
</script>

<style lang="scss" scoped>
.device-hole {
  background-image: url(@/assets/images/screen.png);
  padding: 20px 20px 20px 20px;

  .status {
    margin-top: 3%;
    margin-left: 3%;
  }

  .indication {
    margin-top: 4.5%;
    text-align: center;

    .number {
      font-family: Digital;
      font-size: 30px;
      font-weight: 500;
    }

    .unit {
      font-weight: bold;
      vertical-align: bottom;
    }
  }

  .date {
    margin-top: 6%;
    text-align: right;
    font-size: 14px;
    padding-right: 2%;
    color: rgba(0, 0, 0, 0.6);
  }
}

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
</style>