<template>
  <div class="container">
    <div class="dialogHeader">
      <div class="dialogHeader_left">{{ currentNodeName }}</div>
      <div class="dialogHeader_right"><el-icon @click="closeControlCabinet"><Close /></el-icon></div>
    </div>
    <div class="dialogBody">
      <div class="dialogBody_left">
        <el-tabs
            @tab-click="handleClick"
            tab-position="left"
            style="height: 100%"
            v-model="tabValue">
          <el-tab-pane name="all">
            <template #label>
              <span>总控开关</span>
            </template>
          </el-tab-pane>
          <el-tab-pane :name="item.id" v-for="item in tabData" :key="item.id">
            <template #label>
              <span :title="item.name">{{ item.name }}</span>
            </template>
          </el-tab-pane>
        </el-tabs>

      </div>
      <div class="dialogBody_right">
        <div class="settingModule" v-if="pageFlag === 'setting'">
          <div class="modelList">
<!--            <div class="modelList_item">-->
<!--              <el-radio :label="0" v-model="model"><span>自动</span> <i>将按照已下发策略自动控制</i></el-radio>-->
<!--            </div>-->
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
              <el-button type="primary" @click="doRemoteControl" v-if="!dataFetch">确 认</el-button>
              <el-button type="primary" loading v-else></el-button>
            </div>
            <div class="btnList_item" v-if="showBackBtn">
              <el-button @click="backToTable">返 回</el-button>
            </div>
          </div>
        </div>
        <div class="tableModule" v-if="pageFlag === 'tableData'">
          <el-table :data="tableData" style="width: 100%" max-height="325">
            <el-table-column label="序号" width="50">
              <template #default="scope">{{scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column prop="loopName" label="回路名称" />
            <el-table-column label="状态" width="120">
              <template #default="scope">
                <div class="tableStatus" style="color:#19B21E;"  v-if="scope.row.isOn === '0'">
                  <b style="background: #19B21E;"></b>
                  <span v-if="scope.row.isOn === '0'">开启</span>
                  <span v-if="scope.row.isOn === '1'">关闭</span>
                  <span v-if="scope.row.status === '0'">（自动）</span>
                  <span v-if="scope.row.status === '1'">（手动）</span>
                </div>
                <div class="tableStatus" style="color:#FA9600;"  v-if="scope.row.isOn === '1'">
                  <b style="background: #FA9600;"></b>
                  <span v-if="scope.row.isOn === '0'">开启</span>
                  <span v-if="scope.row.isOn === '1'">关闭</span>
                  <span v-if="scope.row.status === '0'">（自动）</span>
                  <span v-if="scope.row.status === '1'">（手动）</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="100">
              <template #header>
                <el-button type="text" @click="batchControl">批量控制</el-button>
              </template>
              <template #default="scope">
                <el-button type="text" @click="remoteControl(scope.row.loopId)">远程控制</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "controlCabinet"
}
</script>
<script setup>
import {computed, onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import moment from "moment";

const pageFlag = ref('setting')//setting设置，tableData展示数据
const tabValue = ref('all')
const showBackBtn = computed(() => {
  return tabValue.value !== 'all'
})
//远程控制所需变量
let loopId = ''//存放回路id集合，用于用户点击确定
const model = ref(0)//模式
const delayTimeOn = ref(undefined)
const delayTimeOff = ref(undefined)

const tableData = ref([])//表格
const tabData = ref([])//导航
const emits = defineEmits(['closeControlCabinet'])
const closeControlCabinet = () => {
  emits('closeControlCabinet')
}
const props = defineProps({
  currentNodeId:{
    type:String,
    default:() => ''
  },
  currentNodeName:{
    type:String,
    default:() => ''
  }
})
const getLoopIds = (arr) => {
  let str = []
  arr.forEach(d => {
    if(d.loopList){
      d.loopList.forEach(d => {
        str.push(d.loopId)
      })
    }else {
      str.push(d.loopId)
    }
  })
  return str.join(',')
}
const handleClick = () => {
  resSetting()
  if(tabValue.value === 'all'){
    pageFlag.value = 'setting'
    loopId = getLoopIds(tabData.value)
  }else{
    pageFlag.value = 'tableData'
    const obj = tabData.value.find(d => d.id === tabValue.value)
    tableData.value = [...obj.loopList]
    loopId = getLoopIds(tableData.value)
  }
}
//批量控制
const batchControl = () => {
  pageFlag.value = 'setting'
}
//远程控制
const remoteControl = (id) => {
  loopId = id
  pageFlag.value = 'setting'
}
//取消设置，返回列表
const backToTable = () => {
  resSetting()
  pageFlag.value = 'tableData'
}
//初始化设置页面数据
const resSetting = () => {
  model.value = 1
  model.delayTimeOn = undefined
  model.delayTimeOff = undefined
}
import {doRemoteControlApi} from '@/api/lamp/lightMonitor'
//执行远程控制
const dataFetch = ref(false)// 是否正在执行交互
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
  params.loopId = loopId.split(',')
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
  const res = await doRemoteControlApi(params)
  dataFetch.value = false
  const {code, msg} = res
  if(code === 200){
    ElMessage.success('设置成功')
  }else{
    ElMessage.error(msg)
  }
}
import {getLoopSwitchListApi} from '@/api/lamp/lightMonitor'
const getLoopSwitchList = async () => {
  const params = {
    regionId: props.currentNodeId
  }
  const res = await getLoopSwitchListApi(params)
  const {code, data, msg} = res
  if(code === 200){
    tabData.value = [...data]
    loopId = getLoopIds(tabData.value)
  }else{
    ElMessage.error(msg)
  }
}
onMounted(()=>{
  getLoopSwitchList()
})
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
  }
  .dialogBody{
    display: flex;
    padding:8px 24px;
    box-sizing: border-box;
    height:375px;
    &_left{
      flex: 0 0 120px;
      width: 120px;
      overflow: hidden;
      ::v-deep(.el-tabs__item){
        width: 110px;
        font-size: 12px;
        padding:0 10px 0 0 ;
        box-sizing: border-box;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        user-select: none;
      }
    }
    &_right{
      flex: 1;
      .settingModule{
        padding-left:16px;
        box-sizing: border-box;
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
      .tableModule{
        font-size: 14px;
        ::v-deep(.el-table){
          font-size: 14px;
        }
        .tableStatus{
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
  }
}
</style>