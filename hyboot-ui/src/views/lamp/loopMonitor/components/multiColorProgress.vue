<template>
  <div v-show="true">
    <div class="process-content">
      <div>
        <!--外部进度条，灰色的总量为底-->
        <div class="progress-bar__outer">
          <div class="progress-bar__inner">
            <template v-for="(item, index) in progressData" :key="index">
              <el-tooltip class="box-item" effect="dark" content="Top Center prompts info"
                          placement="top">
                <template #content>
                  <div>
                    <span>{{item.timeRange}}</span>
                  </div>
                  <div>
                    <span>{{item.finalStatus}}</span>
                  </div>
                </template>


                <div class="progress-bar__inner--item" :style="{ background: item.background, width: item.width }"
                     :class="{ first: index == 0, final: index == progressData.length - 1 }">
                </div>
              </el-tooltip>
            </template>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import  {toRefs} from 'vue'
import moment from 'moment'
const props = defineProps({
  //包括颜色及宽度数据
  progressData: {
    type: Array,
    default: ()=>[]
  },
  progressHour: {
    type: Number,
    default: 24
  }
})


const { progressData, progressHour } = toRefs(props)

const initData=()=>{

  progressData.value.forEach((item,index,arr)=>{
    // 如果数组里面只有一条数据
    if (item.finalStatus == '开启') {
      item.background = '#19B21E'
    } else if (item.finalStatus == '关闭') {
      item.background = '#FA9600'
    } else if (item.finalStatus == '离线') {
      item.background = '#8D9094'
    }

    if (progressData.value.length == 1) {
      item.width = `${(progressHour.value - 0) / 24 * 100}%`
      if(progressHour.value==24)
        item.timeRange=`${item.recordTime.slice(-8)}-24:00:00`
      else{
        item.timeRange=`${item.recordTime.slice(-8)}-${moment().format("HH:mm:ss")}`
      }
    } else if (progressData.value.length > 1) {
      if (index < progressData.value.length-1)
      {
        item.width = `${(Number(arr[index + 1].recordTime.slice(-8, -6)) - Number(item.recordTime.slice(-8, -6))) / 24 * 100}%`
        item.timeRange=`${item.recordTime.slice(-8)}-${arr[index + 1].recordTime.slice(-8)}`
      }
      else {
        item.width =  `${(progressHour.value - Number(item.recordTime.slice(-8, -6))) / 24 * 100}%`
        if(progressHour.value==24)
          item.timeRange=`${item.recordTime.slice(-8)}-24:00:00`
        else{
          item.timeRange=`${item.recordTime.slice(-8)}-${moment().format("HH:mm:ss")}`
        }
      }
    }
  })
}


initData()

watch(progressData, (newValue) => {
  initData()
})

</script>

<style lang="scss" scoped>
.process-content {
  width: 400px;
  height: 10px;

  .progress-bar__outer {
    height: 10px;
    border-radius: 100px;
    background-color: #ebeef5;
    overflow: hidden;
    position: relative;
    vertical-align: middle;

    .progress-bar__inner {
      width: 100%;
      height: 10px;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      text-align: right;
      border-radius: 100px;
      line-height: 1;
      white-space: nowrap;
      transition: width .6s ease;
      animation: progress-bar__inner 2s ease-out;
      .progress-bar__inner--item {
        float: left;
        height: 10px;
        animation-duration: 3s;
      }

      .first {
        border-radius: 4px 0px 0px 4px;

        &.final {
          border-radius: 4px 4px 4px 4px;
        }
      }

      .final {
        border-radius: 0px 4px 4px 0px;
      }
    }
  }

}

@keyframes progress-bar__inner {
  0% {
    width: 0px;
  }

  100% {
    width: 100%;
  }
}
</style>



