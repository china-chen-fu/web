<template>
  <div class="pdc-main">
    <div class="main-background"></div>
    <div class="pdc-content" v-loading.fullscreen.lock="pageLoading" element-loading-text="加载中...">
      <Split style="height: 100%;width: 100%;" ratio="1/5">
        <template #one>
          <div class="tree-box">
            <el-tree :data="treeData" ref="treeRef" :props="treeProps" node-key="id" :current-node-key="currentTreeNodeKey" :expand-on-click-node="false" @node-click="nodeClick" default-expand-all highlight-current></el-tree>
          </div>
        </template>
        <template #two>
          <div class="page-container" v-loading="rightLoading" element-loading-text="加载中...">
            <div class="content" style="padding: 0 24px;padding-right: 0px;">
              <div class="search" v-show="showSearch">
                <!-- 查询框及按钮 -->
                <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="90px">
                  <el-form-item label="回路名称" prop="name">
                    <el-input v-model="queryParams.name" placeholder="请输入回路名称" clearable style="width: 240px" @keyup.enter="getTableData" />
                  </el-form-item>
                  <el-form-item class="button-container">
                    <el-button type="primary" icon="Search" :loading="searchLoading" v-hasPermi="['fire:loop:list']" @click="getTableData">搜索</el-button>
                    <el-button icon="Refresh" v-hasPermi="['fire:loop:list']" @click="resetQuery">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="table" ref="pageTableWrapper">
                <el-row :gutter="10" class="mb8" style="margin-top: 16px;">
                  <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" v-hasPermi="['fire:loop:add']" @click="addLoop">新增回路</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="info" plain icon="Sort" v-hasPermi="['fire:loop:dispatch']" @click="batchDispatchParams">批量参数下发</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="info" plain icon="Upload" v-hasPermi="['fire:loop:import']" @click="handleImport">导入</el-button>
                  </el-col>
                  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData"></right-toolbar>
                </el-row>

                <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%; margin-top: 20px;" :max-height="pageTableHeight" @selection-change="handleSelectionChange" :header-cell-style="{ 'text-align': 'center' }">
                  <el-table-column type="selection" width="55" align="center" />
                  <el-table-column type="index" label="序号" width="60" align="center" />
                  <el-table-column label="回路名称" prop="loopName" align="left"></el-table-column>
                  <el-table-column label="回路类型" prop="loopType" align="left"></el-table-column>
                  <el-table-column label="所属配电柜" prop="cabinetName" align="left"></el-table-column>
                  <el-table-column label="所属区域" prop="regionName" align="left"></el-table-column>
                  <el-table-column label="设备名称" prop="deviceName" align="left"></el-table-column>
                  <el-table-column label="操作" align="center" width="280">
                    <template #default="scope">
                      <el-button type="text" icon="Connection" v-hasPermi="['fire:loop:dispatch']" @click="dispatchParams(scope.row)">参数下发</el-button>
                      <el-button type="text" icon="Edit" v-hasPermi="['fire:loop:edit']" @click="editLoop(scope.row)">编辑</el-button>
                      <el-popconfirm @confirm="deleteRow(scope.row)" confirm-button-text="确定" cancel-button-text="取消" :title="'确定删除' + scope.row.loopName + '吗?'">
                        <template #reference>
                          <el-button v-hasPermi="['fire:loop:remove']" type="text" icon="Delete">删除</el-button>
                        </template>
                      </el-popconfirm>
                    </template>
                  </el-table-column>
                </el-table>
                <pagination class="pagination" v-show="queryParams.total > 0" :total="queryParams.total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getTableData" />
                <br />
              </div>
            </div>
          </div>
        </template>
      </Split>
    </div>

    <el-dialog :title="loopTitle" v-model="visible" append-to-body destroy-on-close :before-close="loopClose" width="500px">
      <el-form ref="loopRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="回路名称" prop="name">
          <el-input v-model="form.name" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="回路类型" prop="type">
          <el-select v-model="form.type" style="width: 250px;">
            <el-option label="三相四线" :value="'0'"></el-option>
            <el-option label="三相三线" :value="'1'"></el-option>
            <el-option label="单相" :value="'2'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属配电柜" prop="pdcId">
          <el-tree-select style="width: 250px;" v-model="form.pdcId" :data="pdcTreeData" :node-key="'id'" @node-click="dialogNodeClick" :props="pdcTreeProps"></el-tree-select>
        </el-form-item>
        <el-form-item label="设备" prop="deviceName">
          <div style="display: flex;justify-content: space-between;align-items: center;">
            <el-input v-model="form.deviceName" disabled style="width: 180px;"></el-input>
            <div style="color: #1890ff;cursor: pointer;margin-left: 10px;" @click="bindDevice"><span v-if="form.isEdit">重新</span>绑定设备</div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="loopClose">取消</el-button>
          <el-button type="primary" @click="loopConfirm(loopRef)" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="回路导入" v-model="upload.open" width="400px" append-to-body>
      <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.action" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">下载模板</el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="参数下发" v-model="dispatchVisible" append-to-body destroy-on-close :before-close="dispatchDialogClose" width="500px">
      <el-form :model="dispatchFrom" ref="dispatchRef" label-width="130px">
        <el-form-item label="剩余电流警告阈值:">
          <el-input v-model="dispatchFrom.remainElectricThreshold" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>mA</template>
          </el-input>
        </el-form-item>
        <el-form-item label="漏电延时:">
          <el-input v-model="dispatchFrom.electricLeakageDelay" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="A相温度告警阈值:">
          <el-input v-model="dispatchFrom.atemperatureThreshold" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>℃</template>
          </el-input>
        </el-form-item>
        <el-form-item label="A相温度延时:">
          <el-input v-model="dispatchFrom.atemperatureDelay" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="B相温度告警阈值:">
          <el-input v-model="dispatchFrom.btemperatureThreshold" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>℃</template>
          </el-input>
        </el-form-item>
        <el-form-item label="B相温度延时:">
          <el-input v-model="dispatchFrom.btemperatureDelay" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="C相温度告警阈值:">
          <el-input v-model="dispatchFrom.ctemperatureThreshold" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>℃</template>
          </el-input>
        </el-form-item>
        <el-form-item label="C相温度延时:">
          <el-input v-model="dispatchFrom.ctemperatureDelay" oninput="value=value.replace(/[^\d]/g,'')" style="width: 250px;">
            <template #append>秒</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dispatchDialogClose">取消</el-button>
          <el-button type="primary" @click="dispatchDialogConfirm(dispatchRef)" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="绑定设备" v-model="deviceVisible" append-to-body destroy-on-close :before-close="bindDialogClose" width="80%">
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <div></div>
        <div>
          <el-input v-model="deviceInput" placeholder="请输入" class="input-with-select" @keyup.enter="getDevice">
            <template #prepend>
              <el-select v-model="deviceSelect" placeholder="请选择" style="width: 115px">
                <el-option label="设备名称" :value="'name'" />
                <el-option label="设备编号" :value="'number'" />
              </el-select>
            </template>
          </el-input>
        </div>
      </div>
      <el-table :data="deviceTableData" border style="width: 100%; margin-top: 20px;" v-loading="tableLoading" :header-cell-style="{ 'text-align': 'center' }">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="设备名称" prop="name" align="left"></el-table-column>
        <el-table-column label="设备编号" prop="number" align="left"></el-table-column>
        <el-table-column label="设备型号" prop="deviceModel" align="left"></el-table-column>
        <el-table-column label="在线状态" prop="online" align="center" width="90">
          <template #default="scope">
            <div style="display: flex;justify-content: space-around;align-items: center;">
              <div class="status-circle" :class="{ 'online': scope.row.online, 'offline': !scope.row.online }"></div>
              <div>{{ scope.row.online ? '在线' : '离线' }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template #default="scope">
            <!-- <el-button type="text" :disabled="bindDisabled(scope.row)" @click="bindDeviceConfirm(row)">绑定</el-button> -->
            <el-button type="text" @click="bindDeviceConfirm(scope.row)">绑定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination class="dialog-pagination" v-show="deviceQueryParams.total > 0" :total="deviceQueryParams.total" v-model:page="deviceQueryParams.pageNum" v-model:limit="deviceQueryParams.pageSize" @pagination="getDevice(false)" />
      <br />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="bindDialogClose">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Split from '@/components/Split/index.vue'
import { getToken } from "@/utils/auth";
import pdcService from "../../../../api/fire/pdc";
import loopService from '../../../../api/fire/loop'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance();
let pageLoading = ref(false)
let treeData = ref(null)

const treeProps = {
  label: 'regionName',
  children: 'children',
  isLeaf: 'leaf',
  id: 'regionId',
  parentId: 'parentId',
}
const pdcTreeProps = {
  label: 'name',
  children: 'children',
  id: 'id',
  value: 'id',
  disabled: disabledFn
}

function disabledFn (node) {
  if (node.level == 2 || node.level == 1) {
    return true
  } else {
    return false
  }
}

let queryParams = reactive({
  total: 0,
  pageSize: 10,
  pageNum: 1,
  name: '',
})

let deviceQueryParams = reactive({
  total: 0,
  pageSize: 10,
  pageNum: 1,
  name: '',
  number: ''
})


let visible = ref(false)
let deviceVisible = ref(false)
let searchLoading = ref(false)

let form = reactive({
  name: null,
  type: null,
  pdcId: null,
  electricCabinetId: null,
  deviceName: null,
  deviceId: null,
  editId: null,
  isEdit: false
})
let pdcTreeData = ref(null)
let loopRef = ref();
const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择回路类型', trigger: 'change' },
  ],
  pdcId: [
    { required: true, message: '请选择配电柜', trigger: 'blur' },
  ],
}

let dialogLoading = ref(false)
let tableLoading = ref(false)


//是否有显示搜索框
const showSearch = ref(true);

let currentTreeNode = ref(null)
let currentTreeNodeKey = ref(null)
let treeRef = ref(null)
let rightLoading = ref(false)

let tableData = ref(null)
let selectedRows = ref([])

let upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: '',
  action: ''
});

let deviceTableData = ref([])
let deviceInput = ref(null);
let deviceSelect = ref('name')
let loopTitle = ref('')

let dispatchVisible = ref(false);
let dispatchRef = ref()
let dispatchFrom = reactive({
  remainElectricThreshold: null,
  electricLeakageDelay: null,
  atemperatureThreshold: null,
  atemperatureDelay: null,
  btemperatureThreshold: null,
  btemperatureDelay: null,
  ctemperatureThreshold: null,
  ctemperatureDelay: null,
  loopRecordBos: []
})

onBeforeMount(() => {
  getTree()
})

function getTree () {
  pdcService.getRegion().then(res => {
    treeData.value = res.data;
    if (currentTreeNode.value == null) {
      currentTreeNode.value = res.data[0];
      nextTick(() => {
        currentTreeNodeKey.value = currentTreeNode.value.id;
        treeRef.value.setCurrentKey(currentTreeNodeKey.value);
      })
    }
    getTableData();
  })
}

function getTableData () {
  let params = {
    pageSize: queryParams.pageSize,
    pageNum: queryParams.pageNum,
    regionId: currentTreeNode.value.level == 1 ? null : currentTreeNode.value.id,
    loopName: queryParams.name
  }
  searchLoading.value = true;
  tableLoading.value = true;
  loopService.loopList(params).then(res => {
    queryParams.total = res.total;
    tableData.value = res.rows;
  }).finally(() => {
    searchLoading.value = false;
    tableLoading.value = false;
    fetPageTableHeight()
  })
}

const resetQuery = () => {
  queryParams.name = '';
  getTableData()
}

function nodeClick (current, node, treeNode, e) {
  currentTreeNode.value = current;
  currentTreeNodeKey.value = current.regionId;
  getTableData();
}

function addLoop () {
  pdcService.getCabinetTree().then(res => {
    pdcTreeData.value = [
      {
        children: res.data,
        name: treeData.value[0].regionName,
        id: treeData.value[0].id,
        level: 1
      }
    ];
    visible.value = true;
    loopTitle.value = '新增回路'
  })
}

function bindDevice () {
  getDevice(true)
}

function bindDeviceConfirm (row) {
  // form.deviceName = row.name + '-' + row.number;
  form.deviceName = row.name;
  form.deviceId = row.deviceId;
  deviceInput.value = "";
  deviceSelect.value = "";
  deviceVisible.value = false;
}

function getDevice (isDialog) {
  let params = {
    pageSize: deviceQueryParams.pageSize,
    pageNum: deviceQueryParams.pageNum,
  }
  if (deviceSelect.value == 'name') {
    params['name'] = deviceInput.value;
  }
  if (deviceSelect.value == 'number') {
    params['number'] = deviceInput.value;
  }
  loopService.getDevice(params).then(res => {
    deviceTableData.value = res.rows;
    deviceQueryParams.total = res.total;
    if (isDialog) {
      deviceVisible.value = true;
    }
  })
}

function bindDialogClose () {
  deviceVisible.value = false;
}

function editLoop (row) {
  pdcService.getCabinetTree().then(res => {
    pdcTreeData.value = [
      {
        children: res.data,
        name: treeData.value[0].regionName,
        id: treeData.value[0].id,
        level: 1
      }
    ];
    form.name = row.loopName;
    form.deviceName = row.deviceName;
    loopTitle.value = '编辑回路';
    form.type = row.loopType == '三相四线' ? '0' : row.loopType == '三相三线' ? '1' : row.loopType == '单线' ? '2' : '';
    form.pdcId = row.cabinetName;
    form.electricCabinetId = row.electricCabinetId;
    form.deviceId = row.deviceId;
    form.editId = row.id;
    form.isEdit = true;
    visible.value = true;
  })
}

function batchDispatchParams () {
  if (selectedRows.value.length) {
    dispatchVisible.value = true;
  } else {
    ElMessage({ type: 'warning', message: '请至少选择一个回路!' })
  }
}

function dispatchParams (row) {
  let params = {
    deviceId: row.deviceId,
    loopId: row.id
  }
  loopService.getDispatchedParams(params).then(res => {
    if (JSON.stringify(res.data) != '{}') {
      dispatchFrom.atemperatureDelay = res.data.atemperatureDelay;
      dispatchFrom.atemperatureThreshold = res.data.atemperatureThreshold;
      dispatchFrom.btemperatureDelay = res.data.btemperatureDelay;
      dispatchFrom.btemperatureThreshold = res.data.btemperatureThreshold
      dispatchFrom.ctemperatureDelay = res.data.ctemperatureDelay;
      dispatchFrom.ctemperatureThreshold = res.data.ctemperatureThreshold;
      dispatchFrom.remainElectricThreshold = res.data.remainElectricThreshold;
      dispatchFrom.electricLeakageDelay = res.data.electricLeakageDelay;
    }
    dispatchFrom.loopRecordBos = [];
    dispatchFrom.loopRecordBos.push({
      loopId: row.id,
      deviceId: row.deviceId
    })
    dispatchVisible.value = true;
  })
}


function deleteRow (row) {
  tableLoading.value = true;
  loopService.deleteLoop(row.id).then(res => {
    ElMessage({ type: 'success', message: '删除成功!' })
  }).finally(() => {
    tableLoading.value = false;
    getTableData();
  })
}

function loopClose () {
  form.deviceId = null;
  form.deviceName = null;
  form.name = null;
  form.pdcId = null;
  form.type = null;
  form.editId = null;
  form.isEdit = false;
  form.electricCabinetId = null;
  visible.value = false;
}

async function loopConfirm (formEl) {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      dialogLoading.value = true;
      if (!form.isEdit) {
        let params = {
          regionId: currentTreeNode.value.id,
          loopName: form.name,
          loopType: form.type,
          electricCabinetId: form.pdcId,
          deviceId: form.deviceId
        }
        loopService.addLoop(params).then(res => {
          ElMessage({ type: 'success', message: '新增成功！' })
        }).finally(() => {
          dialogLoading.value = false;
          loopClose();
          getTableData();
        })
      } else {
        let params = {
          regionId: currentTreeNode.value.id,
          loopName: form.name,
          loopType: form.type,
          electricCabinetId: form.electricCabinetId,
          deviceId: form.deviceId,
          id: form.editId
        }
        loopService.editLoop(params).then(res => {
          ElMessage({ type: 'success', message: '编辑成功！' })
        }).finally(() => {
          dialogLoading.value = false;
          loopClose();
          getTableData();
        })
      }
    }
  })
}

function dialogNodeClick (currentNode) {
  if (currentNode.level != 2 && currentNode.level != 1) {
    form.electricCabinetId = currentNode.id;
  }
}

function handleSelectionChange (selection) {
  selectedRows.value = selection;
  dispatchFrom.loopRecordBos = [];
  selection.forEach(item => {
    let obj = {
      loopId: item.id,
      deviceId: item.deviceId
    }
    dispatchFrom.loopRecordBos.push(obj)
  })
}

function dispatchDialogClose () {
  dispatchFrom.remainElectricThreshold = "";
  dispatchFrom.electricLeakageDelay = "";
  dispatchFrom.atemperatureThreshold = "";
  dispatchFrom.atemperatureDelay = "";
  dispatchFrom.btemperatureThreshold = "";
  dispatchFrom.btemperatureDelay = "";
  dispatchFrom.ctemperatureThreshold = "";
  dispatchFrom.ctemperatureDelay = "";
  dispatchFrom.loopRecordBos = [];
  dispatchVisible.value = false;
}

async function dispatchDialogConfirm (formEl) {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (dispatchFrom.loopRecordBos.length) {
        dialogLoading.value = true;
        loopService.dispatchParams(dispatchFrom).then(res => {
          ElMessage({ type: 'success', message: '下发成功！' })
        }).finally(() => {
          getTableData();
          dialogLoading.value = false;
          dispatchDialogClose()
        })
      } else {
        ElMessage({ type: 'warning', message: '出现位置问题，请刷新后重试！' })
      }
    }
  })
}


/** 导入按钮操作 */
function handleImport () {
  upload.title = "回路导入";
  upload.url = import.meta.env.VITE_APP_BASE_API + "/fire/loop/import";
  // upload.action = (upload.url + '?updateSupport=' + upload.updateSupport + '&' + 'regionId=' + currentTreeNode.value.regionId)
  upload.action = upload.url + '?updateSupport=' + upload.updateSupport
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate () {
  proxy.download(
    "fire/loop/importTemplate",
    {},
    `回路导入模板${new Date().getTime()}.xlsx`
  );
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
    response.msg +
    "</div>",
    "导入结果",
    { dangerouslyUseHTMLString: true }
  );
  getTableData();
};
/** 提交上传文件 */
function submitFileForm () {
  proxy.$refs["uploadRef"].submit();
}

//带分页的表格高度
const pageTableHeight = ref(0)
const resetPageTableHeight = () => {
  return new Promise((resolve, reject) => {
    pageTableHeight.value = 0
    resolve()
  })
}

const pageTableWrapper = ref()
const fetPageTableHeight = () => {
  resetPageTableHeight().then(res => {
    pageTableHeight.value = pageTableWrapper.value.getBoundingClientRect().height - 200
  })
}

watch(showSearch, (newValue) => {
  fetPageTableHeight()
})


</script>

<style scoped lang="scss">
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pdc-main {
  background-color: #F8F8F8;
  width: calc(100vw - 240px);
  height: calc(100vh - 70px);
  position: relative;

  .main-background {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: calc(100vh - 70px);
    background: #F3F3F3;
    // border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0px 8px 12px 0px rgba(0, 0, 0, 0.1);
    opacity: 0.5;
    z-index: -1;
  }

  .pdc-content {
    width: 100%;
    height: 100%;
    background-color: #F8F8F8;
    padding: 24px 24px 0 24px;
    position: absolute;

    .tree-title {
      padding: 24px 14px 20px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #E6EBF0;

      .tree-title-text {
        font-size: 18px;
        font-weight: 500;
        color: #262E4A;
        font-family: BlackBody Medium;
      }
    }

    .tree-box {
      padding-left: 14px;
      padding-top: 24px;
      height: calc(100vh - 180px);
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .right-node-label {
      font-family: BlackBody Medium;
      font-weight: 500;
      color: #262E4A;
      font-size: 16px;
    }

    .operate-box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
}

:deep(.el-tree) {
  background: #F5F6F7;
}

:deep(.el-tree-node.is-expanded>.el-tree-node__children) {
  padding-bottom: 1px;
}

.dialog-pagination :deep(.el-pagination) {
  right: 10px;
}

.bind-dialog-icon {
  margin-left: 10px;
  cursor: pointer;
  font-size: 16px;
}

.show-hide1:hover :nth-child(2) {
  // display: inline-block !important;
  visibility: visible !important;
}

.show-hide:hover :nth-child(3) {
  visibility: visible !important;
  // display: inline-block !important;
}

.search-button {
  border: 1px solid #546fff;
  background: #eef1ff;
  color: #546fff;
}

.status-circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.online {
  background-color: green;
}

.offline {
  background-color: red;
}

:deep(.sub) {
  box-shadow: 0px 6px 12px 0px rgb(0 0 0 / 8%);
  background: #F5F6F7 !important;
  border-radius: 4px 4px 4px 4px;
}
</style>
