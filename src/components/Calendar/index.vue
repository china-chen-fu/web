<template>
<div class="box_top_right">
  <div class="box_top_right_title">
    江南大学用电{{ showCalendarType === '0' ? '日' : '校' }}历

    <el-tooltip
        v-if=" showCalendarType === '0'"
        effect="light"
        content="切换校历"
        placement="top-start"
    >
      <el-icon @click="changeType('1')"><Switch /></el-icon>
    </el-tooltip>
    <el-tooltip
        v-if=" showCalendarType === '1'"
        effect="light"
        content="切换日历"
        placement="top-start"
    >
      <el-icon @click="changeType('0')"><Switch /></el-icon>
    </el-tooltip>

  </div>
  <div class="box_top_right_top" v-if="showCalendarType === '0'">
    <el-calendar v-model="dataValue" ref="calendar">
      <template #header="{ date }">
        <div class="calendarHeader">
          <div class="calendarHeaderButton" @click="selectDate('prev-month')">
            <el-icon><ArrowLeft /></el-icon>
          </div>
          <span>{{ date.replace(/\s*/g, "") }}</span>
          <div class="calendarHeaderButton" @click="selectDate('next-month')">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </template>
      <template #date-cell="{ data }">
        <el-popover placement="top-start" :width="200" trigger="hover" :hide-after="0">
          <template #reference>
            <div>
                  <span :class="data.isSelected ? 'is-selected' : ''">
                    {{ data.day.split("-")[2] }}
                  </span>
              <b class="highTag" v-if="tagStatus(dataList,data.day) === 1"></b>
              <b class="lowTag" v-if="tagStatus(dataList,data.day) === 2"></b>
            </div>
          </template>
          <div style="color:#4AA5A6">{{data.day}} {{calendarItemTxt(dataList,data.day,2)}}</div>
          <div style="color:#4AA5A6">当日用量：{{dayUsage(dataList,data.day)}}kW·h</div>
        </el-popover>
      </template>
    </el-calendar>
  </div>
  <div class="box_top_right_top_school"  v-if="showCalendarType === '1'">
    <Weekly :timeList="weeklyList"></Weekly>
    <el-calendar v-model="dataValue" ref="calendar">
      <template #header="{ date }">
        <div class="calendarHeader">
          <div class="calendarHeaderButton" @click="selectDate('prev-month')">
            <el-icon><ArrowLeft /></el-icon>
          </div>
          <span>{{ date.replace(/\s*/g, "") }}</span>
          <div class="calendarHeaderButton" @click="selectDate('next-month')">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </template>
      <template #date-cell="{ data }">
        <el-popover placement="top-start" :width="200" trigger="hover" :hide-after="0">
          <template #reference>
            <div>
                  <span :class="{'is-selected':data.isSelected ,firstSemester:calendarSemester(dataList,data.day) === '第一学期',secondSemester:calendarSemester(dataList,data.day) === '第二学期'}" style="display: block;border-radius: 8px;">
                    <span>{{calendarItemTxt(dataList,data.day,1)}}</span>
                  </span>
              <b class="highTag" v-if="tagStatus(dataList,data.day) === 1"></b>
              <b class="lowTag" v-if="tagStatus(dataList,data.day) === 2"></b>
            </div>
          </template>
          <div style="color:#4AA5A6">{{calendarSemester(dataList,data.day)}}</div>
          <div style="color:#4AA5A6">{{data.day}} {{calendarItemTxt(dataList,data.day,2)}}</div>
          <div style="color:#4AA5A6">当日用量：{{dayUsage(dataList,data.day)}}kW·h</div>
          <div></div>
        </el-popover>
      </template>
    </el-calendar>
  </div>
  <div class="box_top_right_bottom">
    <div class="box_top_right_bottom_list">
      <div class="box_top_right_bottom_list_item">
        <div class="box_top_right_bottom_list_item_time">00:00</div>
        <div class="box_top_right_bottom_list_item_data">
          <useEnergyTag :timeList="dayEnergyDetail.time1"></useEnergyTag>
        </div>
        <div class="box_top_right_bottom_list_item_time">04:00</div>
      </div>
      <div class="box_top_right_bottom_list_item">
        <div class="box_top_right_bottom_list_item_time">04:00</div>
        <div class="box_top_right_bottom_list_item_data">
          <useEnergyTag :timeList="dayEnergyDetail.time2"></useEnergyTag>
        </div>
        <div class="box_top_right_bottom_list_item_time">08:00</div>
      </div>
      <div class="box_top_right_bottom_list_item">
        <div class="box_top_right_bottom_list_item_time">08:00</div>
        <div class="box_top_right_bottom_list_item_data">
          <useEnergyTag :timeList="dayEnergyDetail.time3"></useEnergyTag>
        </div>
        <div class="box_top_right_bottom_list_item_time">12:00</div>
      </div>
      <div class="box_top_right_bottom_list_item">
        <div class="box_top_right_bottom_list_item_time">12:00</div>
        <div class="box_top_right_bottom_list_item_data">
          <useEnergyTag :timeList="dayEnergyDetail.time4"></useEnergyTag>
        </div>
        <div class="box_top_right_bottom_list_item_time">16:00</div>
      </div>
      <div class="box_top_right_bottom_list_item">
        <div class="box_top_right_bottom_list_item_time">16:00</div>
        <div class="box_top_right_bottom_list_item_data">
          <useEnergyTag :timeList="dayEnergyDetail.time5"></useEnergyTag>
        </div>
        <div class="box_top_right_bottom_list_item_time">20:00</div>
      </div>
      <div class="box_top_right_bottom_list_item">
        <div class="box_top_right_bottom_list_item_time">20:00</div>
        <div class="box_top_right_bottom_list_item_data">
          <useEnergyTag :timeList="dayEnergyDetail.time6"></useEnergyTag>
        </div>
        <div class="box_top_right_bottom_list_item_time">24:00</div>
      </div>
    </div>
  </div>
  <div class="box_top_right_tips">
    <div class="box_top_right_tips_title">
      <div class="box_top_right_tips_title_left">相关说明：</div>
      <div class="box_top_right_tips_title_right">
        <img :src="imgUrl('energyMonitor/energyMonitor_tips.png')" alt="" />
        <div class="box_top_right_tips_content" style="background-color: #ffffff; box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.08)">
          <div class="box_top_right_tips_content_header">
            <img :src="imgUrl('energyMonitor/energyMonitor_tips.png')" alt="" />
            详细说明
          </div>
          <div class="box_top_right_tips_content_body">
            <div class="box_top_right_tips_content_item">
              <b style="background-color: #7353D6"></b>
              <span>当月工作日高峰用电：高于当月工作日平均用电150%</span>
            </div>
            <div class="box_top_right_tips_content_item">
              <b style="background-color: #4AA5A6"></b>
              <span>当月工作日低谷用电：低于当月工作日平均用电50%，且大于0kW·h</span>
            </div>
            <div class="box_top_right_tips_content_item">
              <b style="background-color: #7353D6"></b>
              <span>当月节假日高峰用电：高于当月节假日平均用电150%</span>
            </div>
            <div class="box_top_right_tips_content_item">
              <b style="background-color: #4AA5A6"></b>
              <span>当月节假日低谷用电：低于当月节假日平均用电50%，且大于0kW·h</span>
            </div>
            <div class="box_top_right_tips_content_item">
              <i style="border: 1px solid #7353D6"></i>
              <span>当日高峰用电：高于当日平均用电150%</span>
            </div>
            <div class="box_top_right_tips_content_item">
              <i style="border: 1px solid #4AA5A6"></i>
              <span>当日低谷用电：低于当日平均用电50%，且大于0kW·h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box_top_right_tips_content">
      <div class="box_top_right_tips_content_item">
        <b style="background-color: #7353D6"></b>
        <span>当月工作日高峰用电：{{ tipData.highMonth_work }}kW·h</span>
      </div>
      <div class="box_top_right_tips_content_item">
        <b style="background-color: #4AA5A6"></b>
        <span>当月工作日低谷用电：{{ tipData.lowMonth_work }}kW·h</span>
      </div>
      <div class="box_top_right_tips_content_item">
        <b style="background-color: #7353D6"></b>
        <span>当月节假日高峰用电：{{ tipData.highMonth }}kW·h</span>
      </div>
      <div class="box_top_right_tips_content_item">
        <b style="background-color: #4AA5A6"></b>
        <span>当月节假日低谷用电：{{ tipData.lowMonth }}kW·h</span>
      </div>
      <div class="box_top_right_tips_content_item">
        <i style="border: 1px solid #7353D6"></i>
        <span>当日高峰阈值：{{ tipData.highDay }}kW·h</span>
      </div>
      <div class="box_top_right_tips_content_item">
        <i style="border: 1px solid #4AA5A6"></i>
        <span>当日低谷阈值：{{ tipData.lowDay }}kW·h</span>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import useEnergyTag from './useEnergyTag.vue'
import Weekly from './weekly.vue'
import {
  tagStatus,
  calendarItemTxt,
  calendarSemester,
  dayUsage
} from './hooks/echoData'
import imgUrl from "@/utils/loadImg";
const calendar = ref();
const selectDate = (val) => {
  calendar.value.selectDate(val);
};

const props = defineProps({
  showCalendarType:{
    type:String,
    default:() => '0'
  },
  dataValue:{
    type:Date,
    default:() => ''
  },
  dataList:{
    type:Array,
    default:() => []
  },
  weeklyList:{
    type:Array,
    default:() => []
  },
  tipData:{
    type:Object,
    default:() => {
      return {
        highDay: 0,
        lowDay: 0,
        highMonth: 0,
        highMonth_work: 0,
        lowMonth: 0,
        lowMonth_work: 0
      }
    }
  },
  dayEnergyDetail:{
    type:Object,
    default:() => {
      return {
        time1: [], //00-04
        time2: [], //04-08
        time3: [], //08-12
        time4: [], //12-16
        time5: [], //16-20
        time6: [] //20-24
      }
    }
  },
})
const showCalendarType = computed(() => props.showCalendarType)
const dataValue = computed({
  get(){
    return props.dataValue
  },
  set(val){
    //点击左右切换月份按钮和点击日历日期都会触发此函数
    emits('changeCalendarValue',val)
  }
})
const dataList = computed(() => props.dataList)
const tipData = computed(() => props.tipData)
const dayEnergyDetail = computed(() => props.dayEnergyDetail);
const emits = defineEmits(['changeShowCalendarType','changeCalendarValue'])
const changeType = (type) => {
  emits('changeShowCalendarType',type)
}

</script>

<style scoped lang="scss">
.box_top_right{
  padding:16px 10px 0 10px;
  &_title{
    text-align: center;
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    .el-icon{
      margin-left: 10px;
      font-size: 14px;
      color: #4AA5A6;
      cursor: pointer;
    }
  }
  ::v-deep(.el-calendar__header) {
    padding: 20px 0 10px 0;
    border-bottom: none;
    border-top:var(--el-calendar-header-border-bottom);
  }
  ::v-deep(.el-calendar-table:not(.is-range) td.next){
    visibility:hidden;
  }
  ::v-deep(.el-calendar-table:not(.is-range) td.prev){
    visibility:hidden;
  }
  .calendarHeader {
    width: 100%;
    padding: 0 5px;
    height: 32px;
    line-height: 32px;
    align-items: center;
    display: flex;
    text-align: center;
    justify-content: center;
    span {
      font-size: 15px;
      font-weight: 600;
      color: #4AA5A6;
      margin:0 18px;
    }
    .calendarHeaderButton {
      width: 32px;
      text-align: center;
      font-size: 15px;
      color:#9FADBB;
      cursor: pointer;
      user-select: none;
      position: relative;
      top:2px;
    }
  }
  ::v-deep(.el-calendar) {
    background: transparent;
  }
  ::v-deep(.el-calendar-table thead th) {
    font-size: 12px;
    padding: 10px 0 5px;
    color: #9c9d9f;
  }
  ::v-deep(.el-calendar__body) {
    padding: 0;
  }
  ::v-deep(.el-calendar-day) {
    width: 34px;
    height: 30px;
    line-height: 24px;
    padding: 0;
    border-radius: 8px;
    border: 1px solid transparent;
  }
  ::v-deep(.el-calendar-table td) {
    position: relative;
    border: none;
    width: 42px;
    height: 42px;
    font-size: 12px;
    text-align: center;
    line-height: 32px;
    padding: 6px;
    b {
      display: inline-block;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 5px;
      height: 5px;
      border-radius: 50%;
      top: 28px;
      &.highTag {
        background: #7353D6;
      }
      &.lowTag {
        background: #4AA5A6;
      }
    }
  }
  ::v-deep(.el-calendar-table td.is-today) {
    .el-calendar-day {
      background: #4AA5A6;
      border-color: #4AA5A6;
    }
    background: transparent;
    color: #ffffff;
    .firstSemester{
      background: transparent !important;
    }
    .secondSemester{
      background: transparent !important;
    }
  }
  ::v-deep(.el-calendar-table td.is-selected) {
    .el-calendar-day {
      background: rgba(74, 165, 166, 0.15);
      border-color: #4AA5A6;
    }
    background: transparent;
    color: #2f3133;
    .firstSemester{
      background: transparent !important;
    }
    .secondSemester{
      background: transparent !important;
    }
  }
  .firstSemester{
    width: 34px;
    height: 30px;
    background: rgb(254 235 224);
  }
  .secondSemester{
    width: 34px;
    height: 30px;
    background: rgb(227 242 255);
  }
  ::v-deep(.el-calendar-table .el-calendar-day:hover) {
    background: rgba(74, 165, 166, 0.15);
  }
  &_top_school{
    position: relative;
    ::v-deep(.el-calendar__body) {
      padding-left: 28px;
    }
  }
  &_bottom {
    margin-top: 30px;
    margin-bottom: 45px;
    &_list {
      &_item {
        height: 54px;
        display: flex;
        &_time {
          flex: 0 0 40px;
          width: 40px;
          font-size: 14px;
          font-weight: 500;
          color: #8d9094;
          position: relative;
          top: -2px;
          line-height: 48px;
        }
        &_data {
          width: 100%;
          margin: 0 10px;
          position: relative;
          padding-bottom: 12px;
          &:before {
            display: block;
            content: "";
            width: 100%;
            height: 1px;
            background: #ced4db;
            position: absolute;
            bottom: 5px;
            left: 0;
          }
        }
      }
    }
  }
  &_tips {
    &_title {
      font-size: 14px;
      font-weight: 400;
      color: #2f3133;
      margin-bottom: 18px;
      display: flex;
      &_right {
        position: relative;
        img {
          width: 20px;
          cursor: pointer;
        }
        img:hover + .box_top_right_tips_content {
          display: block;
        }
        .box_top_right_tips_content {
          display: none;
          position: absolute;
          width: 365px;
          height: 265px;
          left: -100px;
          bottom:40px;
          padding: 0;
          &_header {
            border-bottom: 1px solid #ddd;
            height: 56px;
            line-height: 56px;
            margin-bottom: 16px;
            padding: 0 24px;
            img {
              width: 20px;
              vertical-align: middle;
            }
          }
          &_body {
            padding: 0 24px 24px;
          }
        }
      }
    }
    &_content {
      padding: 18px 0 0 12px;
      background-color: #f2f9ff;
      border-radius: 8px;
      height: 180px;
      position: relative;
      &_item {
        padding-left: 24px;
        margin-bottom: 10px;
        position: relative;
        span {
          font-size: 12px;
          font-weight: 400;
          color: #6e7073;
          display: block;
        }
        b {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
        i {
          position: absolute;
          width: 16px;
          height: 10px;
          border-radius: 2px;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
      .bottomBg {
        width: 96px;
        height: 65px;
        position: absolute;
        bottom: -24px;
        right: -18px;
      }
    }
  }
}
</style>