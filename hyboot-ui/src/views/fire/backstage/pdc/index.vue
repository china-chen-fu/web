<template>
  <div class="pdc-main">
    <div class="main-background"></div>
    <div class="pdc-content" v-loading.fullscreen.lock="pageLoading" element-loading-text="加载中...">
      <Split style="height: 100%;width: 100%;" ratio="1/5">
        <template #one>
          <div class="tree-title">
            <div class="tree-title-text">区域管理</div>
            <div class="tree-title-img">
              <img src="@/assets/images/drag-region.svg" v-hasPermi="['fire:region:move']" @click="openRegionDrag" width="33" height="33" style="margin-right: 10px;cursor: pointer;" alt="">
              <img src="@/assets/images/add-region.svg" v-hasPermi="['fire:region:add']" @click="addRegion" width="33" height="33" style="cursor: pointer;" alt="">
            </div>
          </div>
          <div class="tree-box" v-if="treeData.length">
            <el-tree :data="treeData" ref="treeRef" :props="treeProps" node-key="id" :current-node-key="currentTreeNodeKey" :expand-on-click-node="false" @node-click="nodeClick" default-expand-all highlight-current>
              <template #default="{ node, data }">
                <span class="custom-tree-node show-hide show-hide1">
                  <span v-if="!node.isEdit">{{ node.label }}</span>
                  <span v-else>
                    <el-input v-model="newTreeLabel" size="small" style="width: 150px;" @keyup.enter="nodeEdit('close', node)"></el-input>
                  </span>
                  <span v-if="!node.isEdit" v-hasPermi="['fire:region:edit']" @click="nodeEdit('open', node)" style="padding-left: 20px;vertical-align: bottom; visibility:hidden;">
                    <el-icon>
                      <EditPen />
                    </el-icon>
                  </span>
                  <span v-else @click="nodeEdit('close', node)" style="padding-left: 20px;vertical-align: bottom;">
                    <el-icon><Select /></el-icon>
                  </span>
                  <span v-if="node.isEdit" @click="notEditNode(node)" style="padding-left: 8px;vertical-align: bottom;">
                    <el-icon>
                      <CloseBold />
                    </el-icon>
                  </span>
                  <span v-if="!node.isEdit" style="padding-left: 8px;vertical-align: bottom;visibility:hidden;">
                    <el-popconfirm title='确定删除该区域吗?' @confirm="deleteRegion(node)">
                      <template #reference>
                        <el-icon v-hasPermi="['fire:region:remove']">
                          <Delete />
                        </el-icon>
                      </template>
                    </el-popconfirm>
                  </span>
                </span>
              </template>
            </el-tree>
          </div>
        </template>
        <template #two>
          <div class="page-container" v-loading="rightLoading" element-loading-text="加载中...">
            <div class="content" style="padding: 0 24px;padding-right: 0px;">
              <div class="search" v-show="showSearch">
                <!-- 查询框及按钮 -->
                <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="90px">
                  <el-form-item label="配电柜名称" prop="name">
                    <el-input v-model="queryParams.name" placeholder="请输入配电柜名称" clearable style="width: 240px" @keyup.enter="getTableData" />
                  </el-form-item>
                  <el-form-item class="button-container">
                    <el-button type="primary" icon="Search" :loading="searchLoading" v-hasPermi="['fire:electricCabinet:list']" @click="getTableData">搜索</el-button>
                    <el-button icon="Refresh" v-hasPermi="['fire:electricCabinet:list']" @click="resetQuery">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="table" ref="pageTableWrapper">
                <el-row :gutter="10" class="mb8" style="margin-top: 16px;">
                  <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" v-hasPermi="['fire:electricCabinet:add']" @click="addPDC">新增配电柜</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="info" :disabled="sortPDCDisabled" v-hasPermi="['fire:electricCabinet:move']" plain icon="Sort" @click="sortTable">排序</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="info" plain icon="Upload" @click="handleImport" v-hasPermi="['fire:electricCabinet:import']">导入</el-button>
                  </el-col>
                  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData"></right-toolbar>
                </el-row>

                <el-table :data="tableData" v-loading="tableLoading" :max-height="pageTableHeight" border style="width: 100%; margin-top: 20px;" :header-cell-style="{ 'text-align': 'center' }">
                  <el-table-column type="index" label="序号" width="60" align="center" />
                  <el-table-column label="配电柜名称" prop="cabinetName" align="left"></el-table-column>
                  <el-table-column label="所属区域" prop="regionName" align="left"></el-table-column>
                  <el-table-column label="操作" align="center">
                    <template #default="scope">
                      <el-button type="text" icon="Edit" v-hasPermi="['fire:electricCabinet:edit']" @click="editPdc(scope.row)">编辑</el-button>
                      <el-popconfirm @confirm="deleteRow(scope.row)" confirm-button-text="确定" cancel-button-text="取消" :title="'确定删除' + scope.row.cabinetName + '吗?'">
                        <template #reference>
                          <el-button v-hasPermi="['fire:electricCabinet:remove']" type="text" icon="Delete">删除</el-button>
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

    <el-dialog :title="title.regionTitle" v-model="visible.regionVisible" append-to-body destroy-on-close :before-close="regionClose" width="500px">
      <el-form class="region-form" ref="regionRef" :model="form.regionForm" :rules="rules" label-width="100px">
        <el-form-item label="上级区域" prop="parentName">
          <el-input v-model="form.regionForm.parentName" disabled style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="form.regionForm.name" style="width: 250px;"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="regionClose">取消</el-button>
          <el-button type="primary" @click="regionConfirm(regionRef)" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog :title="title.pdcTitle" v-model="visible.pdcVisible" append-to-body destroy-on-close :before-close="pdcClose" width="500px">
      <el-form ref="pdcRef" :model="form.pdcForm" :rules="rules1" label-width="100px">
        <el-form-item label="配电柜名称" prop="cabinetName">
          <el-input v-model="form.pdcForm.cabinetName" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="所属区域" prop="regionId">
          <el-tree-select style="width: 250px;" v-model="form.pdcForm.regionId" :data="treeData" node-key="id" :props="treeProps" value-key="id">
          </el-tree-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="pdcClose">取消</el-button>
          <el-button type="primary" @click="pdcConfirm(pdcRef)" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="区域排序" v-model="visible.sortRegionVisible" append-to-body destroy-on-close :before-close="sortRegionClose" width="500px">
      <el-tree :data="treeData" draggable :props="treeProps" :expand-on-click-node="false" :allow-drop="allowDrop" :allow-drag="allowDrag" default-expand-all node-key="id" @node-drop="handleDrop"></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sortRegionClose">取消</el-button>
          <el-button type="primary" @click="dragConfirm" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="配电柜排序" v-model="visible.sortPdcVisible" append-to-body destroy-on-close :before-close="sortPdcClose" width="500px">
      <el-tree :data="pdcTreeData" :props="pdcTreeProps" draggable :expand-on-click-node="false" :allow-drop="pdcAllowDrop" :allow-drag="pdcAllowDrag" default-expand-all node-key="id" @node-drop="handlePdcDrop"></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sortPdcClose">取消</el-button>
          <el-button type="primary" @click="sortPdcConfirm" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="配电柜导入" v-model="upload.open" width="400px" append-to-body>
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
  </div>
</template>
  
<script setup>
import { ref, reactive, nextTick } from "vue";
import Split from '@/components/Split/index.vue'
import { getToken } from "@/utils/auth";
import pdcService from "../../../../api/fire/pdc";
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance();
let pageLoading = ref(false)
let treeData = ref([])
let pdcTreeData = ref([])
const treeProps = {
  label: 'regionName',
  children: 'children',
  id: 'id',
  parentId: 'parentId',
  value: 'id'
}
const pdcTreeProps = {
  label: 'name',
  children: 'children',
  id: 'id',
}
let newTreeLabel = ref('')

let queryParams = reactive({
  total: 0,
  pageSize: 10,
  pageNum: 1,
  name: ''
})


let visible = reactive({
  sortRegionVisible: false,
  sortPdcVisible: false,
  regionVisible: false,
  pdcVisible: false
})
let title = reactive({
  regionTitle: '',
  pdcTitle: ''
})
let form = reactive({
  regionForm: {
    parentName: '',
    parentId: '',
    name: ''
  },
  pdcForm: {
    regionId: '',
    cabinetName: '',
    editId: '',
    isEdit: false
  }
})
let regionRef = ref();
let pdcRef = ref();
const rules = {
  parentName: [
    { required: true, message: '请选择上级区域', trigger: 'change' },
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
}

const rules1 = {
  regionId: [
    { required: true, message: '请选择区域', trigger: 'blur' },
  ],
  cabinetName: [
    { required: true, message: '请输入配电柜名称', trigger: 'blur' },
  ],
}

let dialogLoading = ref(false)
let sortPDCDisabled = computed(() => {
  let flag = false;
  if (currentTreeNode.value) {
    currentTreeNode.value.level == 1 ? flag = true : false;
  }
  return flag;
})


//是否有显示搜索框
const showSearch = ref(true);
let searchLoading = ref(false);
let tableLoading = ref(false);

let currentTreeNode = ref(null)
let currentTreeNodeKey = ref(null)
let treeRef = ref(null)
let rightLoading = ref(false)

let tableData = ref(null)
const tableColumn = [
  {
    label: '配电柜名称',
    prop: 'name',
    width: ''
  },
  {
    label: '所属区域',
    prop: 'region',
    minWidth: ''
  },
]

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

onBeforeMount(() => {
  getRegionTree();
})

function getRegionTree () {
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
    cabinetName: queryParams.name
  }
  searchLoading.value = true;
  tableLoading.value = true;
  pdcService.getPdcByRegion(params).then(res => {
    tableData.value = res.rows;
    queryParams.total = res.total;
  }).finally(() => {
    searchLoading.value = false;
    tableLoading.value = false;
    nextTick(() => {
      fetPageTableHeight()
    })
  })
}

const resetQuery = () => {
  queryParams.name = '';
  getTableData()
}

function nodeClick (current, node, treeNode, e) {
  currentTreeNode.value = current;
  currentTreeNodeKey.value = current.id;
  getTableData(currentTreeNode.value.id);
}

const notEditNode = (node) => {
  let temp = document.getElementsByClassName('show-hide');
  for (let i = 0; i < temp.length; i++) {
    if (temp[i].children[0].innerHTML != node.data.regionName) {
      temp[i].children[1].style.position = 'static';
      temp[i].children[2].style.position = 'static';
    }
  }
  node.isEdit = false;
}

const nodeEdit = (operate, node) => {
  let temp = document.getElementsByClassName('show-hide');
  if (operate == 'open') {
    node.isEdit = true;
    newTreeLabel.value = node.data.regionName;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].children[0].innerHTML != node.data.regionName) {
        temp[i].children[1].style.position = 'absolute';
        temp[i].children[1].style.top = '-1000%';
        temp[i].children[1].style.left = '-1000%';
        temp[i].children[2].style.position = 'absolute';
        temp[i].children[2].style.top = '-1000%';
        temp[i].children[2].style.left = '-1000%';
      }
    }
  } else {
    notEditNode(node);
    node.isEdit = false;
    let params = {
      id: node.data.id,
      parentId: node.data.parentId,
      regionName: newTreeLabel.value == "" ? node.data.regionName : newTreeLabel.value
    }
    pdcService.editRegion(params).then(res => {
      ElMessage({
        message: '区域名称修改成功!',
        type: 'success',
      })
      getRegionTree();
    })
  }
}

function openRegionDrag () {
  visible.sortRegionVisible = true;
}

function changeTreeNode (arr, key, parentId) {
  arr.forEach((item, index) => {
    if (item.regionId == key) {
      arr[index].parentId = parentId
    } else {
      if (item.children.length) {
        changeTreeNode(item.children, key, parentId);
      }
    }
  })
}

let dragTreeParams = ref(null);

//拖拽完成
const handleDrop = (draggingNode, dropNode, dropType, ev) => {
  let copyTreeData = JSON.parse(JSON.stringify(treeData.value));
  changeTreeNode(copyTreeData, draggingNode.data.regionId, dropNode.data.parentId);
  const deleteObjAttr = (obj) => {
    delete obj.level;
    delete obj.orderNum;
    delete obj.remark;
    delete obj.regionName;
    delete obj.status;
    delete obj.fullName;
  }
  const deleteTreeProp = (arr) => {
    arr.forEach((item, index) => {
      if (item.children.length == 0) {
        deleteObjAttr(arr[index])
      } else {
        deleteObjAttr(arr[index]);
        deleteTreeProp(item.children);
      }
    })
  }
  deleteTreeProp(copyTreeData);
  dragTreeParams.value = copyTreeData;
}

//判定节点能不能拖到目标位置
const allowDrop = (draggingNode, dropNode, type) => {
  if ((draggingNode.data.parentId == dropNode.data.parentId) && type !== 'inner') {
    return true;
  } else {
    return false;
  }
}

//判断节点能否被拖拽
const allowDrag = (draggingNode, dropNode) => {
  return true;
}

function sortRegionClose () {
  getRegionTree();
  visible.sortRegionVisible = false;
  dragTreeParams.value = null;
}

function dragConfirm () {
  if (dragTreeParams.value) {
    dialogLoading.value = true;
    pdcService.sortRegion(dragTreeParams.value).then(res => {
      ElMessage({
        message: '区域位置修改成功!',
        type: 'success',
      })
    }).catch(err => { }).finally(() => {
      dialogLoading.value = false;
      visible.sortRegionVisible = false;
      getRegionTree();
    })
  } else {
    visible.sortRegionVisible = false;
  }
}

function addRegion () {
  title.regionTitle = '新增区域';
  form.regionForm.parentName = treeData.value[0].regionName;
  form.regionForm.parentId = treeData.value[0].id;
  visible.regionVisible = true;
}

function deleteRegion (node) {
  pdcService.deleteRegion(node.data.id).then(res => {
    ElMessage({ type: 'success', message: '删除成功！' })
  }).finally(() => {
    getRegionTree();
  })
}

function addPDC () {
  title.pdcTitle = '新增配电柜';
  visible.pdcVisible = true;
}

function sortTable () {
  let regionId = currentTreeNode.value.id;
  pdcService.getCabinetTree(regionId).then(res => {
    if (res.data.length) {
      let result = JSON.parse(JSON.stringify(res.data))
      result[0].children.forEach((item, index) => {
        item['level'] = 3
      })
      pdcTreeData.value = [
        {
          children: result,
          name: treeData.value[0].regionName,
          id: treeData.value[0].id,
          level: 1
        }
      ]
      visible.sortPdcVisible = true;
    }
  })
}

function pdcAllowDrop (draggingNode, dropNode, type) {
  if (type !== 'inner' && draggingNode.data.level == 3 && dropNode.data.level == 3) {
    return true
  }
}

function pdcAllowDrag (draggingNode, dropNode) {
  if (draggingNode.data.level == 3) {
    return true
  }
}

let pacDragTreeParams = ref(null)
function handlePdcDrop (draggingNode, dropNode, dropType, ev) {
  pacDragTreeParams.value = pdcTreeData.value[0].children;
}

function sortPdcClose () {
  pacDragTreeParams.value = null;
  visible.sortPdcVisible = false;
}

function sortPdcConfirm () {
  dialogLoading.value = true;
  pdcService.sortCabinet(pacDragTreeParams.value).then(res => {
    ElMessage({ type: 'success', message: '排序成功!' })
  }).finally(() => {
    dialogLoading.value = false;
    sortPdcClose();
    getTableData();
  })
}

function deleteRow (row) {
  pdcService.deletePDC(row.id).then(() => {
    ElMessage({ type: 'success', message: '删除成功!' })
  }).finally(() => {
    getTableData();
  })
}

function regionClose () {
  form.regionForm.parentName = "";
  form.regionForm.parentId = "";
  form.regionForm.name = "";
  visible.regionVisible = false;
}

async function regionConfirm (formEl) {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let params = {
        parentId: form.regionForm.parentId,
        regionName: form.regionForm.name
      }
      dialogLoading.value = true;
      pdcService.addRegion(params).then(res => {
        ElMessage({ type: 'success', message: '添加成功!' })
      }).finally(() => {
        dialogLoading.value = false;
        regionClose();
        getRegionTree();
      })
    }
  })
}

function editPdc (row) {
  form.pdcForm.cabinetName = row.cabinetName;
  form.pdcForm.regionId = row.regionId;
  form.pdcForm.editId = row.id;
  form.pdcForm.isEdit = true;
  title.pdcTitle = '编辑';
  visible.pdcVisible = true;
}

function pdcClose () {
  form.pdcForm.regionId = "";
  form.pdcForm.cabinetName = "";
  form.pdcForm.isEdit = false;
  form.pdcForm.editId = "";
  visible.pdcVisible = false;
}

async function pdcConfirm (formEl) {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let params = {
        regionId: form.pdcForm.regionId,
        cabinetName: form.pdcForm.cabinetName
      }
      dialogLoading.value = true;
      if (!form.pdcForm.isEdit) {
        pdcService.addPDC(params).then(res => {
          ElMessage({ type: 'success', message: '新增配电柜成功!' })
        }).finally(() => {
          dialogLoading.value = false;
          getTableData();
          pdcClose();
        })
      } else {
        params['id'] = form.pdcForm.editId;
        pdcService.editPDC(params).then(res => {
          ElMessage({ type: 'success', message: '编辑配电柜成功!' })
        }).finally(() => {
          dialogLoading.value = false;
          getTableData();
          pdcClose();
        })
      }
    }
  })
}

/** 导入按钮操作 */
function handleImport () {
  upload.title = "配电柜导入";
  upload.url = import.meta.env.VITE_APP_BASE_API + "/fire/electricCabinet/import";
  // upload.action = (upload.url + '?updateSupport=' + upload.updateSupport + '&' + 'regionId=' + currentTreeNode.value.regionId)
  upload.action = upload.url + '?updateSupport=' + upload.updateSupport
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate () {
  proxy.download(
    "fire/electricCabinet/importTemplate",
    {},
    `配电柜导入模板${new Date().getTime()}.xlsx`
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
      padding-top: 16px;
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
  font-size: 14px !important;
}

:deep(.sub) {
  box-shadow: 0px 6px 12px 0px rgb(0 0 0 / 8%);
  background: #F5F6F7 !important;
  border-radius: 4px 4px 4px 4px;
}

:deep(.el-tree-node.is-expanded>.el-tree-node__children) {
  padding-bottom: 1px;
}

.booth-pagination :deep(.el-pagination) {
  // right: 40px;
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

:deep(.el-tree-node__content) {
  margin: 4px 0;
  padding-right: 16px;
  position: relative;

  // span {
  //   overflow: hidden;
  //   white-space: nowrap;
  //   text-overflow: ellipsis;
  // }
}
</style>