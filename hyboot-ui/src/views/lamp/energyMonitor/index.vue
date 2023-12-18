<template>
<div class="container">
  <div class="topPart">
    <div class="topPart_item">
      <div class="topPart_item_left">
        <img src="../../../assets/images/energyMonitor/energyMonitor01.png" alt="">
      </div>
      <div class="topPart_item_right">
        <div class="topPart_item_right_title">今日用电量</div>
        <div class="topPart_item_right_data"><CountTo :startVal='startVal' :endVal='dayVal' :decimals="2" :duration='countToDuration'></CountTo><i>kwh</i></div>
      </div>
    </div>
    <div class="topPart_item">
      <div class="topPart_item_left">
        <img src="../../../assets/images/energyMonitor/energyMonitor02.png" alt="">
      </div>
      <div class="topPart_item_right">
        <div class="topPart_item_right_title">本周用电量</div>
        <div class="topPart_item_right_data"><CountTo :startVal='startVal' :endVal='weekVal' :decimals="2" :duration='countToDuration'></CountTo><i>kwh</i></div>
      </div>
    </div>
    <div class="topPart_item">
      <div class="topPart_item_left">
        <img src="../../../assets/images/energyMonitor/energyMonitor03.png" alt="">
      </div>
      <div class="topPart_item_right">
        <div class="topPart_item_right_title">本月用电量</div>
        <div class="topPart_item_right_data"><CountTo :startVal='startVal' :endVal='monthVal' :decimals="2" :duration='countToDuration'></CountTo><i>kwh</i></div>
      </div>
    </div>
    <div class="topPart_item">
      <div class="topPart_item_left">
        <img src="../../../assets/images/energyMonitor/energyMonitor04.png" alt="">
      </div>
      <div class="topPart_item_right">
        <div class="topPart_item_right_title">年度用电量</div>
        <div class="topPart_item_right_data"><CountTo :startVal='startVal' :endVal='yearVal' :decimals="2" :duration='countToDuration'></CountTo><i>kwh</i></div>
      </div>
    </div>
  </div>
  <div class="middlePart">
    <div class="middlePart_left">
      <div class="baseTitle">
        <div class="baseTitle_txt">今日用能趋势</div>
        <div class="baseTitle_timeSelect">
          <el-date-picker
              v-model="selectDate"
              type="date"
              value-format="YYYY-MM-DD"
              clearable
              placeholder="请选择日期"
              size="small"
              @change="changeDate"
          />
        </div>
      </div>
      <div class="middlePart_left_content">
        <div class="middlePart_left_content_barChart">
          <div id="barChart" ref="barChart"></div>
        </div>
        <div class="middlePart_left_content_table">
          <div class="middlePart_left_content_table_title">
            用能排名
            <img src="../../../assets/images/energyMonitor/energyMonitor_star.png" alt="">
            <img src="../../../assets/images/energyMonitor/energyMonitor_star.png" alt="">
            <img src="../../../assets/images/energyMonitor/energyMonitor_star.png" alt="">
          </div>
          <div class="middlePart_left_content_table_list">
            <div class="middlePart_left_content_table_list_item" v-for="(item,index) in rangeList" :key="index">
              <div class="item_rangeIndex">
                <template v-if="[0,1,2].includes(index)">
                  <img v-if="index === 0" src="../../../assets/images/energyMonitor/energyMonitor_range01.png" alt="">
                  <img v-if="index === 1" src="../../../assets/images/energyMonitor/energyMonitor_range02.png" alt="">
                  <img v-if="index === 2" src="../../../assets/images/energyMonitor/energyMonitor_range03.png" alt="">
                </template>
                <template v-else>
                  <span>{{index + 1}}</span>
                </template>
              </div>
              <div class="item_name">{{item.name}}</div>
              <div class="item_data">{{item.power}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="middlePart_right">
      <div class="baseTitle">
        <div class="baseTitle_txt">区域用能占比</div>
        <div class="baseTitle_dateSelect">
          <div
              class="baseTitle_dateSelect_item"
              :class="{baseTitle_dateSelect_active: areaEnergyShowType === 'day'}"
              @click="changeEnergyShowType('day')"
          >日</div>
          <div
              class="baseTitle_dateSelect_item"
              :class="{baseTitle_dateSelect_active: areaEnergyShowType === 'month'}"
              @click="changeEnergyShowType('month')"
          >月</div>
          <div
              class="baseTitle_dateSelect_item"
              :class="{baseTitle_dateSelect_active: areaEnergyShowType === 'year'}"
              @click="changeEnergyShowType('year')"
          >年</div>
        </div>
      </div>
      <div class="middlePart_right_pieChart">
        <div id="pieChart" ref="pieChart"></div>
      </div>
    </div>
  </div>
  <div class="bottomPart">
    <div class="bottomPart_left bottomPart_item">
      <div class="baseTitle">
        <div class="baseTitle_txt">近30天用能趋势</div>
      </div>
      <div class="bottomPart_item_data">
        <div id="lineChart_month" class="bottomPart_item_data_lineChart"  ref="lineChart_month"></div>
      </div>
    </div>
    <div class="bottomPart_right bottomPart_item">
      <div class="baseTitle">
        <div class="baseTitle_txt">近12月用能趋势</div>
      </div>
      <div class="bottomPart_item_data">
        <div id="lineChart_year" class="bottomPart_item_data_lineChart" ref="lineChart_year"></div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: "pieChartIndex",
};
</script>
<script setup>
import {nextTick, onBeforeUnmount, onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import moment from "moment";
import * as echarts from 'echarts'
/**
 * 用电量分时统计模块
 */
import {getDateTypeUsageApi} from '@/api/lamp/energyMonitor'
import { CountTo } from 'vue3-count-to';
const countToDuration = ref(3000)
const startVal = ref(0)
const dayVal = ref(0)
const weekVal = ref(0)
const monthVal = ref(0)
const yearVal = ref(0)
const getDateTypeUsage =  async () => {
  const res = await getDateTypeUsageApi()
  const {code, data, msg} = res
  if(code === 200){
    dayVal.value = data.day ? Number(data.day) : 0
    weekVal.value = data.week ? Number(data.week) : 0
    monthVal.value = data.month ? Number(data.month) : 0
    yearVal.value = data.year ? Number(data.year) : 0
  }else{
    ElMessage.error(msg)
  }
}
onMounted(()=>{
  getDateTypeUsage()
})
/**
 * 今日用能趋势
 */
const selectDate = ref(moment(new Date()).format('yyyy-MM-DD'))
const changeDate = (e) => {
  selectDate.value = e
  getSelectDayUsage()
  getSelectDayRankList()
}
let rangeList = ref([])
const barChart = ref()
import {middlePartLeftChartOption} from './chartOptions/index'
import {getSelectDayUsageApi, getSelectDayRankListApi} from '@/api/lamp/energyMonitor'
let myBarChart = null
const drawBarCharts = (date = '',xData = [],yData = []) => {
  if(myBarChart !== null && myBarChart !== '' && myBarChart !== undefined){
    myBarChart.dispose()
  }
  myBarChart = echarts.init(barChart.value);
  myBarChart.setOption(middlePartLeftChartOption(date,xData,yData))
  window.addEventListener("resize", () => {
    if(myBarChart){
      myBarChart.resize()
    }
  })
}
const getSelectDayUsage = async () => {
  const params = {
    time: selectDate.value
  }
  const res = await getSelectDayUsageApi(params)
  const {code, data, msg} = res
  if(code === 200){
    const xData = []
    const yData = []
    data.forEach(d => {
      xData.push(moment(d.time).format('HH'))
      yData.push(d.power)
    })
    drawBarCharts(selectDate.value,xData,yData)
  }else{
    ElMessage.error(msg)
  }
}
const getSelectDayRankList = async () => {
  const params = {
    time: selectDate.value
  }
  const res = await getSelectDayRankListApi(params)
  const {code, data, msg} = res
  if(code === 200){
    rangeList.value = [...data]
  }else{
    ElMessage.error(msg)
  }
}
onMounted(()=>{
  getSelectDayUsage()
  getSelectDayRankList()
})
onBeforeUnmount(()=>{
  window.removeEventListener('resize',()=>{})
})
/**
 * 区域用能占比
 */
import {middlePartRightChartOption} from './chartOptions/index'
import {getAreaEnergyApi} from '@/api/lamp/energyMonitor'
const pieChart = ref()
let myPieChart = null
const drawPieCharts = (total,data) => {
  if(myPieChart !== null && myPieChart !== '' && myPieChart !== undefined){
    myPieChart.dispose()
  }
  myPieChart = echarts.init(pieChart.value);
  myPieChart.setOption(middlePartRightChartOption(total,data))
}
const areaEnergyShowType = ref('day')
const getAreaEnergy = async () => {
  const params = {
    type: areaEnergyShowType.value
  }
  const res = await  getAreaEnergyApi(params)
  const {code, data, msg} = res
  if(code === 200){
    if(data.length === 0){
      drawPieCharts(0,[])
    }else{
      let total = 0
      const pageData = data.map(d => {
        total += Number(d.power)
        return {
          name: d.name,
          value: Number(d.power)
        }
      })
      drawPieCharts(total,pageData)
    }
  }else{
    ElMessage.error(msg)
  }
}
const changeEnergyShowType = (type) => {
  areaEnergyShowType.value = type
  getAreaEnergy()
}
onMounted(()=>{
  getAreaEnergy()
})
/**
 * 近30日/12月用能趋势
 */
import {bottomPartChartOption} from './chartOptions/index'
import {getNearMonthListApi, getNearYearListApi} from '@/api/lamp/energyMonitor'
const lineChart_month = ref()
const lineChart_year = ref()
const drawLineCharts_month = (xData,yData) => {
  let chart = echarts.init(lineChart_month.value);
  chart.setOption(bottomPartChartOption(xData,yData))
  window.addEventListener("resize", () => {
    if(chart){
      chart.resize()
    }
  })
}
const drawLineCharts_year = (xData,yData) => {
  let chart = echarts.init(lineChart_year.value);
  chart.setOption(bottomPartChartOption(xData,yData))
  window.addEventListener("resize", () => {
    if(chart){
      chart.resize()
    }
  })
}
const getNearData = async () => {
  const monthRes = await getNearMonthListApi()
  const yearRes = await getNearYearListApi()
  console.log(monthRes,yearRes)
  const {code:monthCode, data:monthData, msg:monthMsg} = monthRes
  const {code:yearCode, data:yearData, msg:yearMsg} = yearRes
  console.log()
  if(monthCode === 200){
    let xData = []
    let yData = []
    monthData.forEach(d => {
      xData.push(d.time)
      yData.push(Number(d.power))
    })
    drawLineCharts_month(xData,yData)
  }else{
    ElMessage.error(monthMsg)
  }
  if(yearCode === 200){
    let xData = []
    let yData = []
    yearData.forEach(d => {
      xData.push(d.time)
      yData.push(Number(d.power))
    })
    drawLineCharts_year(xData,yData)
  }else{
    ElMessage.error(yearMsg)
  }
}
onMounted(()=>{
  getNearData()
})

</script>

<style scoped lang='scss'>
//页面元素间距
$baseMargin: 16px;
.container{
  min-width: 1240px;
  background: #F8F8F8;
  height:calc(100vh - 70px);
  overflow: auto;
  padding:24px;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    width: 4px;
    background: #bbb;
    border-radius: 2px;
  }
  .topPart{
    display: flex;
    height:144px;
    flex-wrap: nowrap;
    margin-bottom: $baseMargin;
    &_item{
      width:calc(25% - 12px);
      background: #ffffff;
      border-radius: 4px;
      padding:24px;
      box-sizing: border-box;
      display: flex;
      &:not(:nth-last-child(1)){
        margin-right:  $baseMargin;
      }
      &_left{
        flex: 0 0 96px;
        width:96px;
        height:96px;
      }
      &_right{
        flex: 1;
        padding: 6px 6px 6px  10%;
        box-sizing: border-box;
        &_title{
          font-size: 20px;
          font-weight: 400;
          color: #8E92BC;
          margin-bottom: 16px;
        }
        &_data{
          font-size: 30px;
          font-weight: bold;
          color: #3B82F6;
          i{
            font-style: normal;
            font-size:18px;
            margin-left: 8px;
          }
        }
      }
    }
  }
  .middlePart{
    display: flex;
    flex-wrap: nowrap;
    height:328px;
    margin-bottom: $baseMargin;
    &_left{
      flex: 1;
      margin-right: $baseMargin;
      height:328px;
      background: #ffffff;
      &_content{
        width:100%;
        padding:0 24px;
        box-sizing: border-box;
        height:272px;
        display: flex;
        flex-wrap: nowrap;
        &_barChart{
          flex:1;
          #barChart{
            width: 100%;
            height:272px;
          }
        }
        &_table{
          flex: 0 0 280px;
          width:280px;
          height:272px;
          &_title{
            font-size: 14px;
            font-weight: 600;
            color: #2F3133;
            margin-bottom: 16px;
            img{
              display: inline-block;
              width:12px;
              height:12px;
              margin-left: 10px;
            }
          }
          &_list{
            &_item{
              display: flex;
              overflow: hidden;
              height:22px;
              line-height: 22px;
              margin-bottom: 18px;
              .item{
                &_rangeIndex{
                  flex: 0 0 20px;
                  width:20px;
                  height:22px;
                  margin-right:16px ;
                  position: relative;
                  img{
                    width:20px;
                    height:20px;
                    display: block;
                    position: absolute;
                    top:50%;
                    left:50%;
                    transform: translate(-50%,-50%);
                  }
                  span{
                    width:20px;
                    height:20px;
                    display: block;
                    position: absolute;
                    top:50%;
                    left:50%;
                    transform: translate(-50%,-50%);
                    border-radius: 50%;
                    background: rgba(59, 130, 246, 0.20);
                    color:#ffffff;
                    text-align: center;
                    line-height: 20px;
                    font-size: 12px;
                  }
                }
                &_name{
                  flex:1;
                  font-size: 14px;
                  font-weight: 600;
                  color: #2F3133;
                  overflow:hidden;
                  text-overflow:ellipsis;
                  white-space:nowrap;
                }
                &_data{
                  flex: 0 0 100px;
                  width:100px;
                  font-size: 14px;
                  font-weight: 400;
                  color: #8D9094;
                  text-align: right;
                }
              }
            }
          }
        }
      }
    }
    &_right{
      flex: 0 0 600px;
      width:600px;
      background: #ffffff;
      height:328px;
      &_pieChart{
        width: 100%;
        height: 272px;
        overflow: hidden;
      }
      #pieChart{
        width:800px;
        height:272px;
        position: relative;
        left:-260px;
      }
    }
  }
  .bottomPart{
    height:380px;
    display: flex;
    flex-wrap: nowrap;
    &_item{
      width: calc(50% - 8px);
      background:#ffffff;
      &:not(:nth-last-child(1)){
        margin-right: 16px;
      }
      &_data{
        &_lineChart{
          height:324px;
          width:100%;
        }
      }
    }
  }
}
.baseTitle{
  display: flex;
  height:56px;
  padding:16px 24px;
  box-sizing: border-box;
  justify-content: space-between;
  &_txt{
    font-size: 16px;
    font-weight: 500;
    color: #1A1919;
    line-height: 24px;
  }
  &_dateSelect{
    width: 188px;
    padding:2px 12px;
    box-sizing: border-box;
    display: flex;
    background:#F8F8FF ;
    height:24px;
    border-radius: 24px;
    overflow: hidden;
    &_item{
      user-select: none;
      width:48px;
      text-align: center;
      font-size: 12px;
      font-weight: 500;
      color: #9291A5;
      cursor: pointer;
      border-radius: 7px;
      transition: all .1s linear;
    }
    &_active{
      background: #2563EB;
      color:#ffffff;
    }
  }
}
@media screen and ( max-width:1500px )  {
  .topPart_item_right_data{
    font-size: 22px !important;
  }
}
@media screen and ( max-width:1400px )  {
  .topPart_item_right{
    padding: 6px 6px 6px  5% !important;
  }
  .topPart_item_right_data{
    font-size: 18px !important;
  }
}
</style>