<template>
  <div class="container">
    <div class="dialogHeader">
      <div class="dialogHeader_left"><b :style="{background:loopColor}"></b>【{{ loopOn }}】{{ loopName }} （{{ loopStatus }}）</div>
      <div class="dialogHeader_right"><el-icon @click="closeLoopDetail"><Close /></el-icon></div>
    </div>
    <div class="dialogBody">
      <div class="chartPart">
        <div id="lineChart" ref="lineChart"></div>
      </div>
      <div class="chartLegend">
        <div class="chartLegend_item">
          <span></span>
          <b>开启</b>
        </div>
        <div class="chartLegend_item">
          <span></span>
          <b>关闭</b>
        </div>
      </div>
      <div class="settingModule">
        <div class="modelList">
<!--          <div class="modelList_item">-->
<!--            <el-radio :label="0" v-model="model"><span>自动</span> <i>将按照已下发策略自动控制</i></el-radio>-->
<!--          </div>-->
          <div class="modelList_item">
            <el-radio :label="1" v-model="model">
              <span>手动开</span>
              <el-input-number
                  :disabled="model !== 1"
                  v-model="delayTimeOn"
                  :min="0"
                  :max="1440"
                  controls-position="right"
                  size="small"
                  placeholder="请输入"
              />
              <span>分钟后恢复自动</span>
            </el-radio>
          </div>
          <div class="modelList_item">
            <el-radio :label="2" v-model="model">
              <span>手动关</span>
              <el-input-number
                  :disabled="model !== 2"
                  v-model="delayTimeOff"
                  :min="0"
                  :max="1440"
                  controls-position="right"
                  size="small"
                  placeholder="请输入"
              />
              <span>分钟后恢复自动</span>
            </el-radio>
          </div>
        </div>
        <div class="btnList">
          <div class="btnList_item">
            <el-button type="primary" v-if="!dataFetch" @click="doRemoteControl" :loading='remoteLoading'>确 认</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loopDetail"
}
</script>
<script setup>
import {onMounted, ref, watch} from "vue";
import * as echarts from 'echarts'
import moment from "moment";
const emits = defineEmits(['closeLoopDetail'])
const closeLoopDetail = ()=> {
  emits('closeLoopDetail')
}
const props = defineProps({
  loopId:{//当前回路id
    type:String,
    default:() => ''
  }
})
watch(() => props.loopId,(newVal)=>{
  getLoopDetail(newVal)
})

import {getLoopDetailByIdApi} from '@/api/lamp/lightMonitor'
import {stepLineOption} from '../utils/echarts_demo'
import {ElMessage} from "element-plus";
const lineChart = ref()
let myLineChart = null
const drawLineCharts = (secondsList,markArea,nowTime,policyLineData) => {
  if(myLineChart !== null && myLineChart !== '' && myLineChart !== undefined){
    myLineChart.dispose()
  }
  myLineChart = echarts.init(lineChart.value);
  myLineChart.setOption(stepLineOption(secondsList,markArea,nowTime,policyLineData))
}
const loopName = ref('')
const loopStatus = ref('')
const loopOn = ref('')
const loopColor = ref('')//弹窗顶部运行状态颜色标志
import {dataFactory} from "../utils/dataFactory";
const getLoopDetail = async (loopId)=> {
  const res = await getLoopDetailByIdApi(loopId)
  // console.log(res)
  const {code, data, msg} = res
  if(code === 200){
    loopName.value = data.loopName
    loopStatus.value = data.loopStatus === '1' ? '手动' : '自动'  //0自动，1手动
    if([null,'1'].includes(data.online)){
      loopOn.value = '离线'
    }else{
      loopOn.value = data.isOn === '0' ? '开启' : '关闭' //0开，1关
    }
    loopColor.value = data.isOn === '0' ? '#19B21E' : '#FA9600' //0开，1关

    //传入离线数组和策略数组，返回折线图横坐标数组，离线区域数组，当前时间点，全时策略数据数组
    const {secondsList,markArea,nowTime,policyLineData} = dataFactory(data.recordList,data.lampStrategyDetailsList)
    drawLineCharts(secondsList,markArea,nowTime,policyLineData)
  }else{
    ElMessage.error(msg)
  }

}
onMounted(()=>{
  getLoopDetail(props.loopId)
})

import {doRemoteControlApi} from '@/api/lamp/lightMonitor'
const model = ref(1)//模式
const delayTimeOn = ref(undefined)
const delayTimeOff = ref(undefined)
const dataFetch = ref(false)// 是否正在执行交互
const remoteLoading = ref(false)
const doRemoteControl = async () => {
  if(model.value !== 0){
    const tomorrow = moment(new Date()).add(1, 'days').format('YYYY-MM-DD 00:00:00')
    const now = moment(new Date)
    const t1 = moment(now, 'YYYY-MM-DD HH:mm:ss');
    const t2 = moment(tomorrow, 'YYYY-MM-DD HH:mm:ss');
    const toLeaveMinutes = t2.diff(t1,'minutes')
    if((model.value === 1 && toLeaveMinutes < delayTimeOn.value) || (model.value === 2 && toLeaveMinutes < delayTimeOff.value)){
      ElMessage.error('手动控制时间请勿超过当天24点')
      return
    }
  }
  const params = {}
  params.loopId = [props.loopId]
  params.model = model.value
  if(model.value === 1 ){
    if(!delayTimeOn.value){
      ElMessage.error('请输入手动开延迟分钟')
      return
    }else{
      params.delayTime = delayTimeOn.value
    }
  }else if(model.value === 2){
    if(!delayTimeOff.value){
      ElMessage.error('请输入手动关延迟分钟')
      return
    }else{
      params.delayTime = delayTimeOff.value
    }
  }
  dataFetch.value = true
  remoteLoading.value = true
  const res = await doRemoteControlApi(params).catch(() => {remoteLoading.value=false})
  remoteLoading.value=false
  dataFetch.value = false
  const {code, msg} = res
  if(code === 200){
    ElMessage.success('设置成功')
  }else{
    ElMessage.error(msg)
  }
}

</script>
<style scoped lang="scss">
.container{
  position: absolute;
  width:640px;
  background: #ffffff;
  right:16px;
  top:16px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow:  0 0 15px 1px rgba(0, 0, 0, 0.12);
  .dialogHeader{
    height:56px;
    display: flex;
    justify-content: space-between;
    line-height: 56px;
    padding: 0 24px;
    box-sizing: border-box;
    box-shadow: inset 0 -1px 0 0 #F0F0F0;
    &_left{
      b{
        display: inline-block;
        width:8px;
        height:8px;
        border-radius: 50%;
        position: relative;
        top:-2px;
      }
    }
  }
  .dialogBody{
    padding:8px 24px;
    box-sizing: border-box;
    height:455px;
    .chartPart{
      width: 100%;
      height:200px;
      margin: 20px 0;
      #lineChart{
        width: 100%;
        height:200px;
      }
    }
    .chartLegend{
      width:200px;
      margin: 0 auto 20px;
      display: flex;
      justify-content: space-between;
      &_item{
        position: relative;
        width:100px;
        height:20px;
        line-height: 20px;
        padding-left: 30px;
        box-sizing: border-box;
        font-size: 12px;
        font-weight: 400;
        color: #8D9094;
        span{
          display: block;
          position: absolute;
          left:0;
          top:50%;
          transform: translateY(-50%);
          width:20px;
          height:8px;
          background: #19B21E;
        }
        &:nth-last-child(1){
          span{
            background: #FA9600;
          }
        }
      }
    }
    .settingModule{
      .modelList{
        &_item{
          margin-bottom: 10px;
          ::v-deep(.el-input-number){
            width:100px;
            margin-right: 5px;
          }
          span{
            font-size: 14px;
            font-weight: 400;
            color: #2F3133;
            margin-right: 5px;
          }
          i{
            font-style: normal;
            font-size: 14px;
            font-weight: 400;
            color: #B4B9BF;
          }
        }
      }
      .btnList{
        &_item{
          height:32px;
          line-height: 32px;
          margin-bottom: 10px;
          ::v-deep(.el-button){
            width: 270px;
          }
        }
      }
    }
  }
}
</style>