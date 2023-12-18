<template>
<div class="container">
  <div class="container_list">
    <div class="baseTitle">
      <div class="baseTitle_left">策略列表</div>
      <div class="baseTitle_right"><el-button type="primary" @click="addPolicy">新增策略</el-button></div>
    </div>
    <div class="searchPart">
      <div class="searchPart_left">
        <el-input
            v-model="searchPolicyName"
            placeholder="请输入策略名称"
            style="width: 280px;"
            clearable
            :prefix-icon="Search"
        >
          <template #append>
            <el-button @click="getAllPolicyList">搜索</el-button>
          </template>
        </el-input>
      </div>
      <div class="searchPart_right">
        <el-popover placement="bottom" :visible="visible" :width="350" trigger="click" :teleported="false" @show="showPopper">
          <template #reference>
            <span @click="visible = true"><i class="iconfont icon-sidebar"></i> 排序</span>
          </template>
          <div class="policyListSortPart">
            <div class="policyListSortPart_header">排序</div>
            <div class="policyListSortPart_body">
              <div class="policyListSortPart_body_tips">
                <el-icon><WarningFilled /></el-icon>
                <span>拖动可进行排序</span>
              </div>
              <div class="policyListSortPart_body_list" v-loading="popperLoading" v-if="popperData.length !== 0">
                <draggable
                    v-model="popperData"
                    group="people"
                    v-bind="dragOptions"
                    item-key="strategyId">
                  <template #item="{element}">
                    <div class="draggableItem">
                      <div class="draggableItem_left">{{element.strategyName}}</div>
                      <div class="draggableItem_right"><i class="iconfont icon-move"></i></div>
                    </div>
                  </template>
                </draggable>
              </div>
              <div class="noneData" style="text-align: center;color:#999;margin-bottom: 10px;" v-else>暂无数据</div>
            </div>
            <div class="policyListSortPart_footer">
              <el-button size="small" @click="closePopper">取消</el-button>
              <el-button size="small" type="primary" @click="savePolicySort">保存</el-button>
            </div>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="container_list_table">
      <el-table
          ref="policyTableRef"
          :data="tableData"
          style="width: 100%"
          height="0"
          highlight-current-row
          @current-change="handleCurrentChange"
      >
        <el-table-column label="序号" width="50">
          <template #default="scope">{{scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column prop="strategyName" label="策略名称" :show-overflow-tooltip="true" />
        <el-table-column label="状态" width="90">
          <template #default="scope">
            <span class="policyUseStatus" style="color:#19B21E" v-if="scope.row.isUse === '0'"><b style="background: #19B21E"></b>使用中</span>
            <span class="policyUseStatus" style="color:#FA9600" v-if="scope.row.isUse === '1'"><b style="background: #FA9600"></b>未使用</span>
          </template>
        </el-table-column>
        <el-table-column width="60" label="操作">
          <template #default="scope">
            <el-button type="text" @click.stop="deletePolicy(scope.row,scope.$index)"  v-if="scope.row.isUse === '1'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="container_detail">
    <div class="baseTitle">
      <div class="baseTitle_left">策略详情</div>
      <div class="baseTitle_right">
        <el-button type="primary" @click="addOrSave" :loading="saveLoading">保存</el-button>
        <el-button @click="openDialog" :loading="dispatchLoading">下发</el-button>
      </div>
    </div>
    <div class="searchPart">
      <div class="searchPart_left">
        策略名称:
        <el-input
            v-model="showPolicyName"
            placeholder="请输入名称"
            style="width: 280px;"
        >
        </el-input>
      </div>
    </div>
    <div class="lineChart">
      <div id="lineChart" ref="lineChart"></div>
    </div>
    <div class="settingPart">
      <div class="settingPart_left">
        <el-radio :label="'1'" v-model="isSunshine" @change="changeMethods">
          <span>定时开关</span>
        </el-radio>
        <div class="settingPart_left_list">
          <div class="settingPart_left_list_item" v-for="(item,index) in timingList" :key="index">
            时间:
            <el-select v-model="item.hour" :disabled="isSunshine === '0'">
              <el-option
                  v-for="item in hourOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
            <el-select v-model="item.minute" :disabled="isSunshine === '0'">
              <el-option
                  v-for="item in minuteOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
            <el-select v-model="item.isOn" :disabled="isSunshine === '0'">
              <el-option label="开" value="0" />
              <el-option label="关" value="1" />
            </el-select>
            <el-button type="primary" plain @click="deleteTimingItem(index)"  :disabled="isSunshine === '0'">删除</el-button>
          </div>
          <div class="settingPart_left_list_add" :class="{btnDisabled : isSunshine === '0'}" @click="addTimingItem">
            <el-icon><Plus /></el-icon>
            <span>新增时间点</span>
          </div>
        </div>
      </div>
      <div class="settingPart_right">
        <el-radio :label="'0'" v-model="isSunshine" @change="changeMethods">
          <span>日出日落开关</span>
        </el-radio>
        <div class="settingPart_right_list">
          <div class="settingPart_right_list_item">
            <span class="settingPart_right_list_item_label">日出开灯</span>
            <span class="settingPart_right_list_item_time">日出时间({{ sunriseTime }})</span>
            <span class="settingPart_right_list_item_delay">
              偏移时间
              <el-input v-model="sunriseDelay" type="number" @blur="sunriseDelayNumberToInteger" placeholder="请输入" :disabled="isSunshine === '1'">
                <template #append>分钟</template>
              </el-input>
            </span>
          </div>
          <div class="settingPart_right_list_item">
            <span class="settingPart_right_list_item_label">日落关灯</span>
            <span class="settingPart_right_list_item_time">日落时间({{ sunsetTime }})</span>
            <span class="settingPart_right_list_item_delay">
              偏移时间
              <el-input v-model="sunsetDelay" type="number" @blur="sunsetDelayNumberToInteger" placeholder="请输入" :disabled="isSunshine === '1'">
                <template #append>分钟</template>
              </el-input>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container_log">
    <div class="baseTitle">
      <div class="baseTitle_left">策略下发日志</div>
    </div>
    <div class="searchPart">
      <div class="searchPart_left">
        <el-date-picker
            v-model="searchLogDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            @change="changeDate"
        />
      </div>
    </div>
    <el-empty description="暂无下发日志" v-if="logList.length === 0" />
    <el-scrollbar v-else >
        <div class="logList" v-infinite-scroll="load" :infinite-scroll-immediate="false">
          <div class="logList_item" v-for="(item,index) in logList" :key="index">
            <div class="logList_item_header">
              <div class="logList_item_header_time">
                {{moment(item.time).format('yyyy-MM-DD')}} <span>{{moment(item.time).format('HH:mm:ss')}}</span>
              </div>
              <div class="logList_item_header_user">
                {{item.createBy}}
              </div>
            </div>
            <div class="logList_item_body">
              <div class="logList_item_body_left" :title="item.recordContent">
                {{item.recordContent}}
              </div>
              <div class="logList_item_body_right">
                <el-popover
                    placement="left"
                    :width="200"
                    trigger="click"
                    :teleported="true"
                    :hide-after="0"
                    popper-class="max-h-300px overflow-auto"
                    @show="showLogDetail(item)"
                    @before-enter="clearDistributionList"
                >
                  <template #reference>
                    <span>{{item.failCount}}/{{ item.count }}</span>
                  </template>
                  <div class="logDetail">
                    <div class="logDetail_item"
                         v-for="item in distributionList"
                         style="
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          margin-bottom: 10px;
                        "
                    >
                      <div class="logDetail_item_name" style="
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        line-clamp: 2;
                        -webkit-box-orient: vertical;
                      ">{{item.loopName}}</div>
                      <div class="logDetail_item_status" v-if="item.status === '0'" style="color:#00CC00;width:56px;flex: 0 0 56px;">下发成功</div>
                      <div class="logDetail_item_status" v-if="item.status === '1'" style="color:#e60012;width:56px;flex: 0 0 56px;">下发失败</div>
                      <div class="logDetail_item_status" v-if="item.status === '2'" style="color:#00CC00;width:56px;flex: 0 0 56px;">进行中</div>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
    </el-scrollbar>
  </div>
  <div class="container_dialog">
    <policyDistribution
        v-if="showDialog"
        :strategyId="strategyId"
        :showDialog="showDialog"
        @closeDialog="handleCloseDialog"
        @reloadPolicyAndLog="handleReload"
    />
  </div>
</div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import * as echarts from "echarts";
import moment from "moment";
import {Search} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
import draggable from 'vuedraggable'
const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
}
import {
  getLogListApi,
  getPolicyDistributionDetailApi,
  getAllPolicyListApi,
  getPolicyDetailByIdApi,
  getSunMsgApi,
  addOrSavePolicyApi,
  deletePolicyByIdApi,
  sortPolicyListApi
} from "../../../api/lamp/automaticPolicy";
import {policyChartOption} from './utils/echarts_line_markPoint'
import {hourOptions, minuteOptions} from "./utils/selectOptions";

//计算偏移后的小时和分钟
const timeCalculate = (sourceTime, deviationTime = 0) => {
  const time = moment(new Date()).format('yyyy-MM-DD ') + sourceTime
  return moment(time).add(deviationTime, 'minutes').format('HH:mm')
}
//计算偏移后的年月日+小时和分钟
const timeCalculateAll= (sourceTime, deviationTime = 0) => {
  const time = moment(new Date()).format('yyyy-MM-DD ') + sourceTime
  return moment(time).add(deviationTime, 'minutes').format('yyyy-MM-DD HH:mm')
}

//日出日落绘制折线图
const drawSunCharts = () => {
  const onTime = timeCalculate(sunriseTime.value,sunriseDelay.value)
  const offTime = timeCalculate(sunsetTime.value,sunsetDelay.value)
  const newLineData = [
    {
      xAxis:'00:00',
      isOn:-1
    },
    {
      xAxis:onTime,
      isOn:1
    },
    {
      xAxis:offTime,
      isOn:-1
    },
    {
      xAxis:'24:00',
      isOn:-1
    }
  ]
  const markPoint = [
    {
      value:onTime,
      xAxis:onTime,
      yAxis:1,
      isOn:0 //0开，1关
    }, {
      value:offTime,
      xAxis:offTime,
      yAxis:1,
      isOn:1  //0开，1关
    },
  ]
  // console.log(newLineData)
  const arr = [];
  for (let i = 0; i <= 1440; i++) {
    let time = moment(new Date()).format("yyyy-MM-DD 00:00:00");
    let time2 = moment(time).add(i, "minutes").format("HH:mm");
    arr.push(time2);
  }
  arr[arr.length - 1] = "24:00";
  const policyLineData = []; //定义数组，根据横坐标数量及添头加尾后的策略列表补全折线图所有时间点值
  arr.forEach((d) => {
    const flag = newLineData.some((item) => item.xAxis === d);
    if (flag) {
      policyLineData.push(newLineData.find((item) => item.xAxis === d).isOn);
    } else {
      policyLineData.push(policyLineData[policyLineData.length - 1]);
    }
  });
  // console.log(markPoint)
  markPointList.value = [...markPoint]
  drawLineCharts(arr,policyLineData,markPoint)
}
//定时计划绘制折线图
const drawTimingCharts = (data = []) => {
  const baseData = data.map(d => {
    return {
      xAxis: d.hour + ':' + d.minute,
      isOn: d.isOn === '1' ? -1 : 1
    }
  })
  const dataArr = arrayUnique(baseData, 'xAxis')
  // console.log(dataArr)
  dataArr.sort(function (a,b){
    const x = `2020-01-01 ${a.xAxis}`
    const y = `2020-01-01 ${b.xAxis}`
    return moment(x) -moment(y)
  })
  const xArr = dataArr.map(d => d.xAxis)
  const yArr = dataArr.map(d => d.isOn)
  if(!xArr.includes('24:00')){
    xArr.push('24:00')
    const num = yArr[yArr.length -1]
    yArr.push(num)
  }
  if(!xArr.includes('00:00')){
    xArr.unshift('00:00')
    const num = yArr[yArr.length -1]
    yArr.unshift(num)
  }


  const len = xArr.length
  const newLineData = []
  for(let i = 0; i<len;i++){
    const obj = {
      xAxis: xArr[i],
      isOn:yArr[i]
    }
    newLineData.push(obj)
  }
  // console.log(newLineData)
  const arr = [];
  for (let i = 0; i <= 1440; i++) {
    let time = moment(new Date()).format("yyyy-MM-DD 00:00:00");
    let time2 = moment(time).add(i, "minutes").format("HH:mm");
    arr.push(time2);
  }
  arr[arr.length - 1] = "24:00";
  const policyLineData = []; //定义数组，根据横坐标数量及添头加尾后的策略列表补全折线图所有时间点值
  arr.forEach((d) => {
    const flag = newLineData.some((item) => item.xAxis === d);
    if (flag) {
      policyLineData.push(newLineData.find((item) => item.xAxis === d).isOn);
    } else {
      policyLineData.push(policyLineData[policyLineData.length - 1]);
    }
  });
  // console.log(policyLineData)



  // console.log(xArr,yArr)
  let markPoint = []
  const length = yArr.length
  for(let i = 0; i < length; i++){
    let obj = {}
    // if(i === 0 && (dataArr[i].isOn !== dataArr[length-1].isOn)){
    if(i === 0 && (yArr[i] !== yArr[length-1])){
      // obj = {
      //   value:dataArr[i].xAxis,
      //   xAxis: dataArr[i].xAxis,
      //   yAxis: 1
      // }
      // markPoint.push(obj)
    // }else if(i === 0 && (dataArr[i].isOn === dataArr[length-1].isOn)){
    }else if(i === 0 && (yArr[i] === yArr[length-1])){

    }else{
      // if(dataArr[i].isOn !== dataArr[i-1].isOn){
      if(yArr[i] !== yArr[i-1]){
        obj = {
          value:xArr[i],
          xAxis: xArr[i],
          yAxis: 1,
          isOn:yArr[i] === 1 ? 0 : 1 //0开，1关
        }
        markPoint.push(obj)
      }
    }
  }
  markPointList.value = [...markPoint]
  drawLineCharts(arr,policyLineData,markPoint)
  // console.log(markPoint)
}
//定时计划去除重复时间点，保留最后一项
const arrayUnique = (arr,  name) => {
  let hash = {}
  return arr.reduce( (acc, cru, index) => {
    if ( !hash[cru[name]] ) {
      hash[cru[name]] = {index:acc.length}
      acc.push(cru)
    }else{
      acc.splice( hash[cru[name]]['index'], 1, cru)
    }
    return acc;
  }, [])
}

/*
  页面左侧逻辑，-策略列表
 */
const searchPolicyName = ref('')
const tableData = ref([])
const policyTableRef = ref()
const currentRow = ref()
//排序弹窗显示时获取最新策略数据
const visible = ref(false)
const popperLoading = ref(false)
const popperData = ref([])
//点击排序按钮获取全部策略
const showPopper = () => {
  getPopperDateList()
}
//关闭弹窗
const closePopper = () => {
  visible.value = false
  popperData.value = []
}
//保存排序结果
const savePolicySort = async () => {
  const ids = popperData.value.map(d => d.strategyId)
  if(ids.length === 0){
    ElMessage.info('暂无数据，请添加策略后再排序')
  }else{
    const res = await sortPolicyListApi(ids)
    // console.log(res)
    const {code, msg} = res
    if(code === 200){
      ElMessage.success('排序成功')
      closePopper()
      await getAllPolicyList()
    }
  }
}
const getPopperDateList = async () => {
  popperLoading.value = true
  const res = await getAllPolicyListApi()
  popperLoading.value = false
  const {code, rows, msg} = res
  if(code === 200){
    popperData.value = [...rows]
  }else{
    ElMessage.error(msg)
  }
}
//根据页面逻辑刷新左侧列表
const reloadAllPolicyList = async () => {
  const params = {
    strategyName: searchPolicyName.value
  }
  const res = await getAllPolicyListApi(params)
  const {code, rows, msg} = res
  if(code === 200){
    tableData.value = [...rows]
    const index = tableData.value.findIndex(d => d.strategyId === strategyId.value)
    policyTableRef.value.setCurrentRow(tableData.value[index])
    await getPolicyDetailById(strategyId.value)
  }else{
    ElMessage.error(msg)
  }
}
//获取策略列表
const getAllPolicyList = async () => {
  const params = {
    strategyName: searchPolicyName.value
  }
  const res = await getAllPolicyListApi(params)
  const {code, rows, msg} = res
  if(code === 200){
    tableData.value = [...rows]
    if(tableData.value.length > 0){
        policyTableRef.value.setCurrentRow(tableData.value[0])
        // await getPolicyDetailById(rows[0].strategyId)
    }else{
      strategyId.value = ''
      showPolicyName.value = ''
      isSunshine.value = '1'
      sunriseDelay.value = null
      sunsetDelay.value = null
      sunriseTime.value = ''
      sunsetTime.value = ''
      timingList.value = []
      await getSunMsg()
      drawTimingCharts()
    }
  }else{
    ElMessage.error(msg)
  }
}
const getPolicyDetailById = async (policyId) => {
  const res = await getPolicyDetailByIdApi(policyId)
  // console.log(res)
  const {code, data, msg} = res
  if(code === 200){
    strategyId.value = data.strategyId
    showPolicyName.value = data.strategyName
    isSunshine.value = data.isSunshine
    sunriseDelay.value = data.sunriseDelay
    sunsetDelay.value = data.sunsetDelay
    sunriseTime.value = data.sunriseTime
    sunsetTime.value = data.sunsetTime
    timingList.value = [...data.list]
    if(isSunshine.value === '0'){
      console.log('日出日落')
      drawSunCharts()
    }else if(isSunshine.value === '1'){
      console.log('定时开关')
      drawTimingCharts(data.list)
    }
    logList.value = []
    await getLogList()
  }else{
    ElMessage.error(msg)
  }
}
//表格项被点击
const handleCurrentChange = (val) => {
  currentRow.value = val
  if(val){
    getPolicyDetailById(currentRow.value.strategyId)
  }
}
onMounted(()=>{
  // console.log(1)
  getAllPolicyList()
})

//新增策略，初始化详情区所有数据
const addPolicy = () => {
  strategyId.value = ''
  showPolicyName.value = ''
  isSunshine.value = '1'
  sunriseDelay.value = null
  sunsetDelay.value = null
  sunriseTime.value = ''
  sunsetTime.value = ''
  timingList.value = []
  getSunMsg()
  drawTimingCharts()
  logList.value = []
  getLogList()
}
//删除策略
const deletePolicy = (item,idx) => {
  // console.log(idx)
  const deleteId = item.strategyId
  // console.log(strategyId.value,deleteId)
  ElMessageBox.confirm('删除操作无法恢复，是否继续？','提示',{
    type:"warning",
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async () => {
    const res = await deletePolicyByIdApi(deleteId)
    // console.log(res)
    const {code, msg} = res
    if(code === 200){
      ElMessage.success('删除成功')
      if(strategyId.value === deleteId){
        await getAllPolicyList()
      }else{
        tableData.value.splice(idx,1)
      }
    }else{
      ElMessage.error(msg)
    }
  }).catch(()=>{
    console.log('用户取消删除')
  })

}
const getSunMsg = async () => {
  const res = await getSunMsgApi()
  const {code, data, msg} = res
  if(code === 200){
    sunriseTime.value = data.sunriseTime
    sunsetTime.value = data.sunsetTime
    policyTableRef.value.setCurrentRow()
  }else{
    ElMessage.error(msg)
  }
}


/*
  页面中间逻辑，-策略详情
 */
const strategyId = ref('')//被编辑策略id
const markPointList = ref([])
const showPolicyName = ref('')//被编辑策略名称
const lineChart = ref()
let myLineChart = null
const drawLineCharts = (aArr,yArr,markPoint) => {
  if(myLineChart !== null && myLineChart !== '' && myLineChart !== undefined){
    myLineChart.dispose()
  }
  myLineChart = echarts.init(lineChart.value);
  const elWidth = lineChart.value.offsetWidth
  myLineChart.setOption(policyChartOption(aArr,yArr,markPoint,elWidth))
  window.addEventListener("resize", () => {
    if(myLineChart){
      myLineChart.resize()
    }
  })
}

const isSunshine = ref('1')
const sunriseDelay = ref(-1)//日出偏移
const sunsetDelay = ref(1)//日落偏移
const sunriseTime = ref('')//日出时间
const sunsetTime = ref('')//日落时间
const policySettingDetails = ref([])//保存时间设置，用于1最后提交，2添加监听，渲染折线图
//日出开灯时间范围判断
const sunriseDelayNumberToInteger = () => {
  sunriseDelay.value = Math.floor(sunriseDelay.value)
  const startDate = timeCalculateAll('00:00')
  const nowDate = timeCalculateAll(sunriseTime.value,sunriseDelay.value)
  const endDate = timeCalculateAll(sunsetTime.value,sunsetDelay.value)
  // console.log(startDate < nowDate && nowDate < endDate)
  const flag = startDate < nowDate && nowDate < endDate
  if(!flag){
    ElMessage.error('日出时间不能早于00:00且不能晚于日落时间')
    sunriseDelay.value = 0
  }
  drawSunCharts()
}
//日落关灯时间范围判断
const sunsetDelayNumberToInteger = () => {
  sunsetDelay.value = Math.floor(sunsetDelay.value)
  const startDate = timeCalculateAll(sunriseTime.value,sunriseDelay.value)
  const nowDate = timeCalculateAll(sunsetTime.value,sunsetDelay.value)
  const endDate = timeCalculateAll('24:00')
  // console.log(startDate < nowDate && nowDate < endDate)
  const flag = startDate < nowDate && nowDate < endDate
  if(!flag){
    ElMessage.error('日落时间不能早于日出时间且不能晚于24:00')
    sunsetDelay.value = 0
  }
  drawSunCharts()
}
//策略选择
const changeMethods = () => {
  if(isSunshine.value === '0'){
    console.log('日出日落')
    drawSunCharts()
  }else if(isSunshine.value === '1'){
    console.log('定时开关')
    drawTimingCharts(timingList.value)
  }
}
const timingList = ref([
  // {
  //   "hour": 12,
  //   "minute": 30,
  //   "isOn": "0"
  // }
])
//新增定时开关时间点 不能超过10行
const addTimingItem = () => {
  //如果当前选择为日出日落，则点击新增时间点无效
  if(isSunshine.value === '0') return
  if(timingList.value.length === 8){
    ElMessage.info('新增的时间点不超过8行')
    return;
  }
  timingList.value.push({
    "hour": '00',
    "minute": '00',
    "isOn": "1"
  })
  // console.log(timingList.value)
}
//监听时间点数组变化，重新绘制折线图
watch(timingList,()=>{
  if(isSunshine.value === '1'){
    drawTimingCharts(timingList.value)
  }
  //
},{
  deep:true
})
//删除时间点
const deleteTimingItem = (idx) => {
  timingList.value.splice(idx,1)
}
//新增或编辑策略
const saveLoading = ref(false)
const addOrSave = async () => {
  // console.log( markPointList.value)
  if(showPolicyName.value === ''){
    ElMessage.error('请输入策略名称')
    return
  }
  const params = {}
  if(isSunshine.value === '1'){
    if(timingList.value.length === 0){
      ElMessage.error('请添加时间点')
      return
    }
    const baseData = timingList.value.map(d => {
      return {
        xAxis: d.hour + ':' + d.minute
      }
    })
    const dataArr = arrayUnique(baseData, 'xAxis')
    //数组去重后长度与原数组一致-无重复数据，不一致-有重复数据
    if(dataArr.length === timingList.value.length){
      params.strategyName = showPolicyName.value
      params.isSunshine = '1'
      params.details = timingList.value.map(d => {
        delete d.strategyDetailsId
        delete d.strategyId
        return d
      })
    }else{
      ElMessage.error('定时开关有重复时间点，请修改后重试')
    }
  }else{
    params.strategyName = showPolicyName.value
    params.isSunshine = '0'
    params.sunriseDelay = sunriseDelay.value
    params.sunsetDelay = sunsetDelay.value
    const sunriseStr = timeCalculate(sunriseTime.value,sunriseDelay.value)
    const sunsetStr = timeCalculate(sunsetTime.value,sunsetDelay.value)
    params.details = [
      {
        hour:sunriseStr.split(':')[0],
        minute:sunriseStr.split(':')[1],
        isOn:'0'
      },
      {
        hour:sunsetStr.split(':')[0],
        minute:sunsetStr.split(':')[1],
        isOn:'1'
      }
    ]
  }
  params.list = markPointList.value
  if(strategyId.value !== '') params.strategyId = strategyId.value
  // console.log(params)
  saveLoading.value = true
  const res = strategyId.value === '' ? await addOrSavePolicyApi(params,'post') : await addOrSavePolicyApi(params,'put')
  saveLoading.value = false
  // console.log(res)
  const {code, msg} = res
  if(code === 200){
    ElMessage.success('保存成功')
    if(strategyId.value === ''){
      await getAllPolicyList()
    }else{
      await reloadAllPolicyList()
    }
  }else{
    ElMessage.error(msg)
  }
}

/*
  页面右侧逻辑，-策略下发日志
 */
const searchLogDate = ref('')//日志搜索日期
const logCount = ref(0)//日志总数
const pageNum = ref(1)//日志页
const pageSize = ref(15)//日志页数目
const logList = ref([])//日志列表
const distributionList = ref([])
//获取日志列表
const getLogList = async () => {
  const params = {
    strategyId:strategyId.value,
    time:searchLogDate.value,
    pageNum:pageNum.value,
    pageSize:pageSize.value,
  }
  const res = await getLogListApi(params)
  const {code, rows, msg, total} = res
  if(code === 200){
    logList.value = [...logList.value,...rows]
    logCount.value = total
  }else{
    ElMessage.error(msg)
  }
}
// onMounted(()=>{
//   getLogList()
// })
const load = () => {
  if(logList.value.length < logCount.value){
    pageNum.value ++
    getLogList()
  }
}
const changeDate = () => {
  logList.value.length = 0
  logCount.value = 0
  pageNum.value = 1
  getLogList()
}
const showLogDetail = async (item) => {
  const params = {
    strategyId: item.strategyId,
    time: item.time
  }
  const res = await getPolicyDistributionDetailApi(params)
  // console.log(res)
  const {code, data, msg} = res
  if(code === 200){
    distributionList.value = [...data]
  }else{
    ElMessage.error(msg)
  }
}
const clearDistributionList = () => {
  distributionList.value = []
}


/*
 *策略下发逻辑
 */
const showDialog = ref(false)
const dispatchLoading = ref(false)
import policyDistribution from "./components/policyDistribution";
const openDialog = async () => {
  if(strategyId.value === ''){
    if(showPolicyName.value === ''){
      ElMessage.error('请输入策略名称')
      return
    }
    const params = {}
    if(isSunshine.value === '1'){
      if(timingList.value.length === 0){
        ElMessage.error('请添加时间点')
        return
      }
      const baseData = timingList.value.map(d => {
        return {
          xAxis: d.hour + ':' + d.minute
        }
      })
      const dataArr = arrayUnique(baseData, 'xAxis')
      //数组去重后长度与原数组一致-无重复数据，不一致-有重复数据
      if(dataArr.length === timingList.value.length){
        params.strategyName = showPolicyName.value
        params.isSunshine = '1'
        params.details = timingList.value.map(d => {
          delete d.strategyDetailsId
          delete d.strategyId
          return d
        })
      }else{
        ElMessage.error('定时开关有重复时间点，请修改后重试')
      }
    }else{
      params.strategyName = showPolicyName.value
      params.isSunshine = '0'
      params.sunriseDelay = sunriseDelay.value
      params.sunsetDelay = sunsetDelay.value
      const sunriseStr = timeCalculate(sunriseTime.value,sunriseDelay.value)
      const sunsetStr = timeCalculate(sunsetTime.value,sunsetDelay.value)
      params.details = [
        {
          hour:sunriseStr.split(':')[0],
          minute:sunriseStr.split(':')[1],
          isOn:'0'
        },
        {
          hour:sunsetStr.split(':')[0],
          minute:sunsetStr.split(':')[1],
          isOn:'1'
        }
      ]
    }
    params.list = markPointList.value
    dispatchLoading.value = true
    const res = await addOrSavePolicyApi(params,'post').catch(()=>{dispatchLoading.value = false})
    dispatchLoading.value = false
    const {code, msg} = res
    if(code === 200){
      await getAllPolicyList()
    }else{
      ElMessage.error(msg)
      return;
    }
  }
  showDialog.value = true
}
const handleCloseDialog = () => {
  showDialog.value = false
}
const handleReload = () => {
  logList.value.length = 0
  logCount.value = 0
  pageNum.value = 1
  reloadAllPolicyList()
  // getLogList()
}
</script>

<style scoped lang='scss'>
.container{
  width:100%;
  padding-top:16px;
  box-sizing:border-box ;
  height: calc(100vh - 70px);
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  &_list{
    flex: 0 0 450px;
    width:450px;
    height:100%;
    padding:15px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 0 15px 1px rgba(0,0,0,0.08);
    &_table{
      height:calc(100% - 120px);
      ::v-deep(.el-table){
        height:100% !important;
      }
      .policyUseStatus{
        padding-left:10px;
        position: relative;
        b{
          position: absolute;
          width:5px;
          height:5px;
          border-radius: 50%;
          left:0;
          top:50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  &_detail{
    flex:1;
    width:100%;
    height:100%;
    padding:15px;
    box-sizing: border-box;
    margin: 0 16px;
    background: #ffffff;
    box-shadow: 0 0 15px 1px rgba(0,0,0,0.08);
    .lineChart{
      margin:20px 0 50px;
      #lineChart{
        width:100%;
        height:200px;
      }
    }
    .settingPart{
      display: flex;
      ::v-deep(.el-radio){
        margin-bottom: 16px;
      }
      &_left{
        flex: 0 0 375px;
        width:375px;
        margin-right: 60px;
        &_list{
          &_item{
            margin-bottom: 16px;
          }
          &_add{
            cursor: pointer;
            user-select: none;
            width:calc(100% - 25px);
            height:48px;
            line-height: 48px;
            background: #F5F7FA;
            border-radius: 4px 4px 4px 4px;
            opacity: 1;
            border: 1px solid #CED4DB;
            font-size: 12px;
            font-weight: 400;
            color: #8D9094;
            padding-left:16px;
            ::v-deep(.el-icon){
              font-size: 20px;
              color:#000;
              margin-right: 16px;
              position: relative;
              top:4px;
            }
          }
        }
        ::v-deep(.el-select){
          width:80px;
          &:nth-last-child(2){
            margin-right: 10px;
          }
        }
      }
      &_right{
        &_list{
          &_item{
            font-size: 16px;
            font-weight: 400;
            color: #8D9094;
            margin-bottom: 16px;
            &_label{
              color: #2F3133;
              margin-right: 5px;
            }
            &_time{
              margin-right: 5px;
            }
            &_delay{
              ::v-deep(.el-input){
                width:140px;
              }
            }
          }
        }
      }
    }
  }
  &_log{
    flex: 0 0 270px;
    width:270px;
    height:100%;
    padding:15px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 0 15px 1px rgba(0,0,0,0.08);
    .logList{
      &_item{
        padding:0 10px 15px 0;
        box-sizing: border-box;
        border-bottom: 1px solid #F2F2F2;
        &_header{
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 600;
          color: #2F3133;
          margin-bottom: 10px;
          &_time{
            span{
              font-size: 12px;
              font-weight: 400;
              color: #8D9094;
            }
          }
        }
        &_body{
          display: flex;
          flex-wrap: nowrap;
          &_left{
            flex:1;
            height:30px;
            line-height: 15px;
            font-size: 12px;
            font-weight: 400;
            color: #2F3133;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          &_right{
            flex: 0 0 60px;
            width: 60px;
            height:30px;
            position: relative;
            span{
              position: absolute;
              top:50%;
              right:0;
              transform: translateY(-50%);
              cursor: pointer;
              user-select: none;
              color:#3B82F6;
              font-size: 14px;
            }
            .logDetail{
              &_item{
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
              }
            }
          }
        }
      }
    }
    ::v-deep(.el-scrollbar){
      //height:calc(100% - 80px);
      height:calc(100% - 120px);
    }
  }
}
.baseTitle{
  display: flex;
  height: 32px;
  line-height: 32px;
  align-items: center;
  justify-content: space-between;
  margin-bottom:32px ;
  &_left{
    font-size: 20px;
    font-weight: 400;
    color: #18191A;
    //border-left:4px solid #3B82F6;
    padding-left:15px;
    position: relative;
    &:before{
      display: block;
      width:4px;
      height:20px;
      background: #3B82F6;
      content: '';
      position: absolute;
      left:0;
      top:50%;
      transform: translateY(-50%);
    }
  }
}
.searchPart{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height:32px;
  margin-bottom:24px ;
  &_right{
    color:#3B82F6;
    cursor: pointer;
    font-size: 16px;
    ::v-deep(.el-popper){
      cursor: auto;
    }
    i{
      font-size: 20px;
      position: relative;
      top:1px;
    }
    .policyListSortPart{
      &_header{
        padding-bottom: 5px;
        margin-bottom: 10px;
        border-bottom: 1px solid #ddd;
      }
      &_body{
        &_tips{
          border: 1px solid #d2eafb;
          background-color: #ecf6fd;
          border-radius: 4px;
          color: #000000;
          font-size: 12px;
          line-height:36px;
          box-sizing: border-box;
          padding: 0 0 0 15px;
          margin-bottom: 10px;
          i{
            font-size: 16px;
            vertical-align: text-bottom;
            margin-right: 5px;
            color:#108ee9;
          }
        }
        &_list{
          max-height: 300px;
          overflow-y: auto;
          padding-right: 5px;
          box-sizing: border-box;
          margin-bottom: 10px;
          &::-webkit-scrollbar {
            width: 4px;
          }
          &::-webkit-scrollbar-thumb {
            width: 4px;
            background: #bbb;
            border-radius: 2px;
          }
          .draggableItem{
            display: flex;
            width:100%;
            overflow: hidden;
            justify-content: space-between;
            align-items: center;
            height:30px;
            line-height: 30px;
            cursor: pointer;
            &_left{
              width: 100%;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
            }
            &_right{
              flex: 0 0 20px;
              width: 20px;
              text-align: right;
              i{
                font-size: 14px;
              }
            }
          }
        }
      }
      &_footer{
        text-align: right;
      }
    }
  }
}

.btnDisabled{
  cursor: not-allowed !important;
}
::v-deep input[type='number']::-webkit-outer-spin-button,
::v-deep input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

</style>
<style lang="scss">
.max-h-300px{
  max-height: 400px;
  &::-webkit-scrollbar {
     width: 4px;
   }
  &::-webkit-scrollbar-thumb {
     width: 4px;
     background: #bbb;
     border-radius: 2px;
   }
}
.overflow-auto{
  overflow-y: auto;
  overflow-x: hidden;
}
</style>