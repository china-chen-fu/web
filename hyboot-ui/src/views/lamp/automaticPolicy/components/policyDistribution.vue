<template>
  <el-dialog
    v-model="showDialog"
    title="选择回路"
    :width="960"
    :custom-class="'policyDistributionDialog'"
    @close="closeDialog"
  >
    <div class="dialogContent">
      <div class="dialogContent_tree">
        <el-scrollbar>
          <el-tree
              ref="navigationTree"
              :data="areaData"
              :props="defaultProps"
              :expand-on-click-node="false"
              node-key="regionId"
              :default-expand-all="true"
              :highlight-current="true"
              @node-click.native="handleNodeClick" />
        </el-scrollbar>
      </div>
      <div class="dialogContent_data">
        <div class="dialogContent_data_filter">
          使用策略状态:
          <el-select style="width: 180px;margin-right: 5px;" size="small" v-model="status" @change="getLoopList">
            <el-option label="全部" value=""/>
            <el-option label="已使用策略" value="1"/>
            <el-option label="未使用策略" value="0"/>
          </el-select>
          回路名称：
          <el-input style="width: 180px;margin-right: 5px;" size="small" placeholder="请输入回路名称" v-model="loopName"></el-input>
          <el-button type="primary" size="small" @click="getLoopList">查询</el-button>
        </div>
        <div class="dialogContent_data_table">
          <el-table
              :data="tableData"
              style="width: 100%" height="420px"
              ref="tableRef"
              @selection-change="handleSelectionChange"
          >
            <el-table-column :selectable="selectable" type="selection" width="55" />
            <el-table-column label="序号" width="50">
              <template #default="scope">{{scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column label="回路名称" prop="loop_name" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="当前使用策略" prop="strategy_name" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="下发时间" prop="time" width="180"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="distributionPolicy" :loading="confirmLoading">确认下发</el-button>
        <el-button @click="closeDialog">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "policyDistribution"
}
</script>
<script setup>
import {ref, onMounted, nextTick} from 'vue'
import {
  getMarketMapListApi,
} from '@/api/lamp/lightMonitor'
import {
  getPolicyDistributionLoopListApi,
  distributionPolicyApi
} from '@/api/lamp/automaticPolicy'
import {ElMessage, ElMessageBox} from "element-plus";
const props = defineProps({
  strategyId:{
    type:String,
    default:() => ''
  },
  showDialog:{
    type:Boolean,
    default:() => false
  },
})
const emits = defineEmits(['closeDialog','reloadPolicyAndLog'])
const closeDialog = () => {
  emits('closeDialog')
}
const regionId = ref('')//区域id
const status = ref('')//使用策略状态
const loopName = ref('')//回路名称
const navigationTree = ref(null)
onMounted(()=>{
  getMarketMapList()
})
const getMarketMapList = async () => {
  const res = await getMarketMapListApi()
  const {code, rows, msg} = res
  if(code === 200){
    areaData.value = [...rows]
    if(areaData.value.length > 0 ){
      regionId.value = areaData.value[0].regionId
      await nextTick(()=>{
        navigationTree.value.setCurrentKey(regionId.value, true)
      })
     await getLoopList()
    }
  }else{
    ElMessage.error(msg)
  }
}
const defaultProps = {
  children: 'children',
  label: 'regionName',
}
const areaData = ref([])//区域信息列表
const handleNodeClick = (data) => {
  regionId.value = data.regionId
  getLoopList()
}
const tableRef = ref()
const multipleSelection = ref([])
const tableData = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const getLoopList = async () => {
  tableData.value = []
  let params = {
    regionId: regionId.value,
    loopName: loopName.value
  }
  if(status.value !== '') params.status = status.value
  console.log(params)
  const res = await getPolicyDistributionLoopListApi(params)
  console.log(res)
  const {code, data, msg} = res
  if(code === 200){
    const arr1 = data.filter(d => d.strategy_id === props.strategyId)
    const arr2 = data.filter(d => d.strategy_id !== props.strategyId)
    console.log(arr1,arr2)
    tableData.value = [...arr1,...arr2]
    // tableData.value = [...data]
    await nextTick(()=> {
      tableData.value.forEach(d => {
        if(d.strategy_id === props.strategyId) {
          tableRef.value.toggleRowSelection(d, true)
        }
      })
    })
  }else{
    ElMessage.error(msg)
  }
}
const confirmLoading = ref(false)
const distributionPolicy = async () => {
  const loops = [...multipleSelection.value]
  if(loops.length === 0){
    ElMessage.error('请先勾选回路')
    return
  }
  const flag = loops.some(d => d.strategy_id && (d.strategy_id !== props.strategyId))
  if(flag){
    ElMessageBox.confirm('策略将直接下发到回路，原有策略将会被覆盖，是否确认下发？','提示',{
      type:"warning",
      confirmButtonText:'确定',
      cancelButtonText:'取消'
    }).then(async () => {
      const ids = loops.map(d => d.loop_id)
      const params = {
        id: props.strategyId,
        ids
      }
      console.log(params)
      confirmLoading.value = true
      const res = await distributionPolicyApi(params).catch(()=>{ confirmLoading.value = false})
      confirmLoading.value = false
      console.log(res)
      const {code, msg} = res
      if(code === 200){
        ElMessage.success('下发成功')
        closeDialog()
        emits('reloadPolicyAndLog')
      }else{
        ElMessage.error(msg)
      }
    }).catch(()=>{})
  }else{
    const ids = loops.map(d => d.loop_id)
    const params = {
      id: props.strategyId,
      ids
    }
    confirmLoading.value = true
    const res = await distributionPolicyApi(params).catch(()=>{ confirmLoading.value = false})
    confirmLoading.value = false
    console.log(res)
    const {code, msg} = res
    if(code === 200){
      ElMessage.success('下发成功')
      closeDialog()
      emits('reloadPolicyAndLog')
    }else{
      ElMessage.error(msg)
    }
  }
}
//
const selectable = (row, index) => {
  return !(row.strategy_id === props.strategyId)
}
</script>
<style lang="scss">
.policyDistributionDialog{
  .el-dialog__body{
    padding: 0;
  }
  .el-dialog__footer{
    box-shadow: inset 0 1px 0 0 #F0F0F0;
  }
}
</style>
<style scoped lang="scss">
.dialogContent{
  //max-height: 400px;
  height:480px;
  display: flex;
  flex-wrap: nowrap;
  &_tree{
    flex: 0 0 250px;
    width:250px;
    border-right: 1px solid #f0f0f0;
    padding:15px;
    box-sizing: border-box;
  }
  &_data{
    flex:1;
    width:100%;
    padding:15px;
    box-sizing: border-box;
    &_filter{
      height:30px;
    }
  }
}
</style>