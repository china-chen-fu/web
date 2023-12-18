<template>
  <div class="booth-main">
    <div class="main-background"></div>
    <div class="booth-content" v-loading.fullscreen.lock="pageLoading" element-loading-text="加载中...">
      <Split style="height: 100%;width: 100%;" ratio="1/5">
        <template #one>
          <div class="tree-title">
            <div class="tree-title-text">区域管理</div>
            <div class="tree-title-img">
              <img src="@/assets/images/drag-region.svg" v-hasPermi="['chaoyang:region:move']" @click="openDrag" width="33" height="33" style="margin-right: 10px;cursor: pointer;" alt="">
              <img src="@/assets/images/add-region.svg" v-hasPermi="['chaoyang:region:add']" @click="addArea" width="33" height="33" style="cursor: pointer;" alt="">
            </div>
          </div>
          <div class="tree-box">
            <el-tree :data="treeData" ref="treeRef" :props="treeProps" node-key="regionId" :current-node-key="currentTreeNodeKey" :expand-on-click-node="false" @node-click="nodeClick" default-expand-all highlight-current>
              <template #default="{ node, data }">
                <span class="custom-tree-node show-hide show-hide1">
                  <span v-if="!node.isEdit">{{ node.label }}</span>
                  <span v-else>
                    <el-input v-model="newTreeLabel" size="small" style="width: 150px;" @keyup.enter="nodeEdit('close', node)"></el-input>
                  </span>
                  <span v-if="!node.isEdit" v-hasPermi="['chaoyang:region:edit']" @click="nodeEdit('open', node)" style="padding-left: 20px;vertical-align: bottom; visibility:hidden;">
                    <el-icon>
                      <EditPen />
                    </el-icon>
                  </span>
                  <span v-else @click="nodeEdit('close', node)" v-hasPermi="['chaoyang:region:edit']" style="padding-left: 20px;vertical-align: bottom;">
                    <el-icon><Select /></el-icon>
                  </span>
                  <span v-if="node.isEdit" @click="notEditNode(node)" v-hasPermi="['chaoyang:region:remove']" style="padding-left: 8px;vertical-align: bottom;">
                    <el-icon>
                      <CloseBold />
                    </el-icon>
                  </span>
                  <span v-if="!node.isEdit" style="padding-left: 8px;vertical-align: bottom;visibility:hidden;">
                    <el-popconfirm title='确定删除该区域吗?' @confirm="deleteRegion(node)">
                      <template #reference>
                        <el-icon v-hasPermi="['chaoyang:region:remove']">
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
                <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
                  <el-form-item label="摊位名称" prop="stallName">
                    <el-input v-model="queryParams.stallName" placeholder="请输入摊位名称" clearable style="width: 240px" @keyup.enter="getBoothList" />
                  </el-form-item>
                  <el-form-item label="摊位编号" prop="stallCode">
                    <el-input v-model="queryParams.stallCode" placeholder="请输入摊位编号" clearable style="width: 240px" @keyup.enter="getBoothList" />
                  </el-form-item>
                  <el-form-item label="手机号" prop="phonenumber">
                    <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号" clearable style="width: 240px" @keyup.enter="getBoothList" />
                  </el-form-item>
                  <el-form-item label="联系人" prop="contacts" style="width: 308px;">
                    <el-input v-model="queryParams.contacts" placeholder="请输入联系人" clearable style="width: 240px" @keyup.enter="getBoothList" />
                  </el-form-item>
                  <el-form-item class="button-container">
                    <el-button type="primary" icon="Search" v-hasPermi="['chaoyang:stall:query']" @click="getBoothList">搜索</el-button>
                    <el-button icon="Refresh" v-hasPermi="['chaoyang:stall:query']" @click="resetQuery">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="table">
                <el-row :gutter="10" class="mb8" style="margin-top: 16px;">
                  <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" v-hasPermi="['chaoyang:stall:add']" @click="addBooth">新增摊位</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="info" plain icon="Upload" v-hasPermi="['chaoyang:stall:import']" @click="handleImport(1)">导入</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="info" plain icon="Upload" v-hasPermi="['chaoyang:stall:device:import']" @click="handleImport(2)">摊位绑表导入</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="info" plain icon="Upload" v-hasPermi="['chaoyang:stall:business:import']" @click="handleImport(3)">商户入驻导入</el-button>
                  </el-col>
                  <right-toolbar v-model:showSearch="showSearch" @queryTable="getBoothList"></right-toolbar>
                </el-row>

                <el-table :data="tableData" border style="width: 100%; margin-top: 20px;" :header-cell-style="{ 'text-align': 'center' }" :cell-style="setSellStyle">
                  <el-table-column type="index" label="序号" width="60" />
                  <el-table-column v-for="(item, index) in tableColumn" :key="index" :label="item.label" :width="item.width" :prop="item.prop" :minWidth="item.minWidth" />
                  <el-table-column prop="stallRemark" label="备注">
                    <template #default="scope">
                      <span v-if="scope.row.stallRemark && scope.row.stallRemark.length <= 15" style="">{{ scope.row.stallRemark }}</span>
                      <el-tooltip v-else class="box-item" effect="dark" :content="scope.row.stallRemark" placement="top">
                        {{ scope.row.stallRemark ? scope.row.stallRemark.substring(0, 15) : '' }}
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="420">
                    <template #default="scope">
                      <el-button type="text" icon="Lock" v-hasPermi="['chaoyang:stall:device:bound']" @click="bind(scope.row)">绑表</el-button>
                      <el-button v-if="scope.row.deviceXos.length > 0" v-hasPermi="['chaoyang:stall:device:unbound']" type="text" icon="Unlock" @click="unbind(scope.row)">解绑</el-button>
                      <el-button v-if="scope.row.deviceXos.length > 0" v-hasPermi="['chaoyang:stall:device:change']" type="text" icon="Position" @click="changeBind(scope.row)">换表</el-button>
                      <el-button type="text" icon="Notebook" v-hasPermi="['chaoyang:stall:history:query']" @click="history(scope.row)">历史记录</el-button>
                      <el-button type="text" icon="Edit" v-hasPermi="['chaoyang:stall:edit']" @click="edit(scope.row)">编辑</el-button>
                      <el-popconfirm @confirm="deleteRow(scope.row)" confirm-button-text="确定" cancel-button-text="取消" :title="'确定删除' + scope.row.stallName + '吗?'">
                        <template #reference>
                          <el-button v-hasPermi="['chaoyang:stall:remove']" type="text" icon="Delete">删除</el-button>
                        </template>
                      </el-popconfirm>
                    </template>
                  </el-table-column>
                </el-table>

                <pagination class="pagination" v-show="queryParams.total > 0" :total="queryParams.total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getBoothList" />
                <br />
              </div>
            </div>
          </div>
        </template>
      </Split>
    </div>

    <el-dialog title="新增区域" v-model="visible.areaVisible" append-to-body destroy-on-close :before-close="handleAreaClose" width="500px">
      <el-form class="area-form" ref="areaRef" :model="form.areaForm" :rules="rules.areaRules" label-width="100px">
        <el-form-item label="上级区域" prop="parentId">
          <el-tree-select v-model="form.areaForm.parentId" :data="treeData" :props="treeProps" :check-strictly="true" value-key="regionId" style="width: 250px;"></el-tree-select>
        </el-form-item>
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="form.areaForm.name" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.areaForm.remark" style="width: 250px;"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleAreaClose">取消</el-button>
          <el-button type="primary" @click="areaDialogConfirm(areaRef)" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog :title="boothTitle" v-model="visible.boothVisible" append-to-body destroy-on-close :before-close="handleBoothClose" width="500px">
      <el-form class="area-form" ref="boothRef" :model="form.boothForm" :rules="rules.boothRules" label-width="100px">
        <el-form-item label="所属区域" prop="parentId">
          <el-tree-select v-model="form.boothForm.parentId" :data="treeData" value-key="regionId" :props="treeProps" style="width: 250px;"></el-tree-select>
        </el-form-item>
        <el-form-item label="摊位编号" prop="number">
          <el-input v-model="form.boothForm.number" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="摊位名称" prop="name">
          <el-input v-model="form.boothForm.name" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.boothForm.remark" style="width: 250px;"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleBoothClose">取消</el-button>
          <el-button type="primary" @click="boothDialogConfirm(boothRef)" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog :title="bindTitle" v-model="visible.bindVisible" append-to-body destroy-on-close :before-close="handleBindClose" width="500px">
      <el-form class="ding-form" ref="bindRef" :model="form.bindForm" :rules="rules.bindRules" label-width="100px">
        <el-form-item label="摊位名称" prop="name">
          <el-input v-model="form.bindForm.name" disabled style="width: 250px;"></el-input>
        </el-form-item>
        <div v-for="(domain, index) in form.bindForm.domains" :key="index">
          <el-form-item :label="'表具名称' + (index + 1)" :prop="'domains.' + index + '.value'" :rules="{
            required: true,
            message: '表具名不能为空',
            trigger: 'blur',
          }">
            <div style="display: flex;justify-content: space-between;align-items: center;">
              <el-select @change="remoteOptionChange(index)" v-model="domain.value" filterable remote reserve-keyword :disabled="domain.disabled" :remote-method="remoteMethod" style="width: 250px;" :loading="remoteLoading">
                <el-option v-for="(item, idx) in remoteOption" :key="idx" :label="item.name" :value="item.deviceId" :disabled="item.disabled" />
              </el-select>
              <div>
                <el-icon style="color: #5E73EB;" @click="addDomain" v-if="(index == 0 && bindTitle == '绑表')" class="bind-dialog-icon">
                  <CirclePlusFilled />
                </el-icon>
                <el-icon style="color: #FBAB33;" @click="removeDomain(domain)" v-if="bindTitle == '解绑' || (bindTitle == '绑表' && !domain.disabled && index !== 0)" class="bind-dialog-icon">
                  <RemoveFilled />
                </el-icon>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="'表具编号' + (index + 1)" :prop="'domains.' + index + '.number'">
            <el-input v-model="domain.number" disabled style="width: 250px;"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleBindClose">取消</el-button>
          <el-button type="primary" @click="bindDialogConfirm(bindRef)" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="历史记录" v-model="visible.historyVisible" append-to-body destroy-on-close :before-close="handleHistoryClose">
      <el-tabs v-model="activeHistory" class="demo-tabs" @tab-click="clickHistoryTab">
        <el-tab-pane label="进场记录" :name="1">
          <el-table style="margin-top: 24px;" :data="mobilizationData" border :header-cell-style="{ textAlign: 'center' }" :cell-style="setInCellStyle">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column v-for="(item, index) in mobilizationColumn" :key="index" :label="item.label" :prop="item.prop" />
          </el-table>
          <pagination style="margin-bottom: 24px;" class="booth-pagination" v-show="mobilizationPagination.total > 0" :total="mobilizationPagination.total" v-model:page="mobilizationPagination.pageNum" v-model:limit="mobilizationPagination.pageSize" @pagination="getHistory" />
        </el-tab-pane>
        <el-tab-pane label="绑表记录" :name="2">
          <el-table style="margin-top: 24px;" :data="bindData" border :header-cell-style="{ textAlign: 'center' }" :cell-style="setBindCellStyle">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column v-for="(item, index) in bindColumn" :key="index" :label="item.label" :prop="item.prop" :width="item.width" />
          </el-table>
          <pagination style="margin-bottom: 24px;" class="booth-pagination" v-show="bindPagination.total > 0" :total="bindPagination.total" v-model:page="bindPagination.pageNum" v-model:limit="bindPagination.pageSize" @pagination="getHistory" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
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

    <el-dialog title="区域排序" v-model="visible.sortVisible" append-to-body destroy-on-close :before-close="handleSortClose" width="500px">
      <el-tree :data="treeData" draggable :props="treeProps" :expand-on-click-node="false" :allow-drop="allowDrop" :allow-drag="allowDrag" default-expand-all node-key="regionId" @node-drop="handleDrop"></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleSortClose">取消</el-button>
          <el-button type="primary" @click="dragConfirm" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from "vue"
import { Search } from '@element-plus/icons-vue'
import { getToken } from "@/utils/auth";
import boothService from '../../../../api/payment/booth'
import { ElMessage } from 'element-plus'
import Split from '../../../../components/Split/index.vue'

const { proxy } = getCurrentInstance();
let pageLoading = ref(false)
const treeProps = {
  label: 'regionName',
  children: 'children',
  isLeaf: 'leaf',
  id: 'regionId',
  parentId: 'parentId',
  isEdit: false
}

//是否有显示搜索框
const showSearch = ref(true);

let currentTreeNode = ref(null)
let currentTreeNodeKey = ref(null)
let treeRef = ref(null)
let rightLoading = ref(false)

let tableData = ref(null)
const tableColumn = [
  {
    label: '摊位编号',
    prop: 'stallCode',
    width: ''
  },
  {
    label: '摊位名称',
    prop: 'stallName',
    minWidth: '160'
  },
  {
    label: '联系人',
    prop: 'contacts',
    width: '110'
  },
  {
    label: '手机号',
    prop: 'phonenumber',
    width: '110'
  },
  {
    label: '进场日期',
    prop: 'inTime',
    width: '160'
  },
  // {
  //   label: '备注',
  //   prop: 'stallRemark',
  //   width: ''
  // },
]

const mobilizationColumn = [
  {
    label: '联系人',
    prop: 'contacts',
  },
  {
    label: '手机号',
    prop: 'phonenumber'
  },
  {
    label: '操作人',
    prop: 'businessUpdateUser'
  },
  {
    label: '进场日期',
    prop: 'inTime',
    width: 160
  },
  {
    label: '离场日期',
    prop: 'outTime',
    width: 160
  },
]

let mobilizationPagination = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0
})
let mobilizationData = ref(null)

let bindPagination = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0
})

const bindColumn = [
  {
    label: '表具名称',
    prop: 'name',
  },
  {
    label: '表具编号',
    prop: 'deviceNumber'
  },
  {
    label: '最后示数',
    prop: 'indication'
  },
  {
    label: '剩余金额',
    prop: 'amount'
  },
  {
    label: '开始时间',
    prop: 'startTime',
    width: 160
  },
  {
    label: '结束时间',
    prop: 'endTime',
    width: 160
  },
]
let bindData = ref(null)

let isEditTree = ref(false)
let newTreeLabel = ref('')

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

let dialogLoading = ref(false)

let visible = reactive({
  areaVisible: false,
  boothVisible: false,
  bindVisible: false,
  historyVisible: false,
  sortVisible: false,
  changeVisible: false
})

let form = reactive({
  areaForm: {
    parentId: null,
    name: null,
    remark: null
  },
  boothForm: {
    parentId: null,
    name: null,
    remark: null,
    number: null
  },
  bindForm: {
    name: null,
    stallId: null,
    domains: [
      {
        key: 1,
        value: '',
        number: '',
        disabled: false
      }
    ]
  },
  historyForm: {

  },
})

const rules = reactive({
  areaRules: {
    parentId: [
      { required: true, message: '请选择上级区域', trigger: 'change' },
    ],
    name: [
      { required: true, message: '请输入区域名称', trigger: 'blur' },
    ],
  },
  boothRules: {
    parentId: [
      { required: true, message: '请选择所属区域', trigger: 'blur' },
    ],
    name: [
      { required: true, message: '请输入摊位名称', trigger: 'blur' },
    ],
    number: [
      { required: true, message: '请输入摊位编号', trigger: 'blur' },
    ],
  }
})

const areaRef = ref();
const boothRef = ref();
const bindRef = ref();
const historyRef = ref();

let boothTitle = ref('')
let bindTitle = ref('')
let isEditBooth = ref(false)

let treeData = ref(null);

let remoteLoading = ref(false)
let remoteOption = ref(null)
let activeHistory = ref(1)

let queryParams = reactive({
  total: 0,
  pageSize: 10,
  pageNum: 1,
  stallName: '',
  stallCode: '',
  phonenumber: '',
  contacts: ''
})

let originDeviceList = ref(null);

let showImportButton = computed(() => {
  if (currentTreeNode.value) {
    if (currentTreeNode.value.children.length == 0) {
      return true;
    } else {
      return false;
    }
  }
})

onBeforeMount(() => {
  getTreeDataRequest(true)
})

function setSellStyle ({ row, column, rowIndex, columnIndex }) {
  let textAlign = {};
  //数值型
  if (columnIndex == 7) {
    textAlign = { 'text-align': 'right' }
  }
  //字符串类型
  if (columnIndex == 1 || columnIndex == 2 || columnIndex == 3 || columnIndex == 6 || columnIndex == 4) {
    textAlign = { 'text-align': 'left' }
  }
  //日期类型
  if (columnIndex == 5 || columnIndex == 0) {
    textAlign = { 'text-align': 'center' }
  }
  return textAlign;
}

function setInCellStyle ({ row, column, rowIndex, columnIndex }) {
  let textAlign = {};
  //数值型
  // if (columnIndex == 2) {
  //   textAlign = { 'text-align': 'right' }
  // }
  //字符串类型
  if (columnIndex == 1 || columnIndex == 3 || columnIndex == 2) {
    textAlign = { 'text-align': 'left' }
  }
  //日期类型
  if (columnIndex == 5 || columnIndex == 0 || columnIndex == 4) {
    textAlign = { 'text-align': 'center' }
  }
  return textAlign;
}

function setBindCellStyle ({ row, column, rowIndex, columnIndex }) {
  let textAlign = {};
  //数值型
  if (columnIndex == 4 || columnIndex == 3) {
    textAlign = { 'text-align': 'right' }
  }
  //字符串类型
  if (columnIndex == 1 || columnIndex == 2) {
    textAlign = { 'text-align': 'left' }
  }
  //日期类型
  if (columnIndex == 5 || columnIndex == 0 || columnIndex == 6) {
    textAlign = { 'text-align': 'center' }
  }
  return textAlign;
}

const getTreeDataRequest = (isFirst) => {
  pageLoading.value = true;
  currentTreeNodeKey.value = 1;
  boothService.getRegionTree().then(res => {
    if (isFirst) {
      currentTreeNode.value = res.data[0];
    }
    treeData.value = res.data;
    getBoothList(currentTreeNode.value.regionId);
  }).catch(e => { }).finally(() => {
    pageLoading.value = false;
  })
}

const getBoothList = () => {
  let params = {
    pageSize: queryParams.pageSize,
    pageNum: queryParams.pageNum,
    regionId: currentTreeNode.value.regionId,
    stallName: queryParams.stallName,
    stallCode: queryParams.stallCode,
    phonenumber: queryParams.phonenumber,
    contacts: queryParams.contacts
  }
  rightLoading.value = true;
  boothService.getBoothList(params).then(res => {
    tableData.value = res.rows;
    queryParams.total = res.total;
  }).catch(err => { }).finally(() => {
    rightLoading.value = false;
  })
}

const resetQuery = () => {
  queryParams.contacts = '';
  queryParams.phonenumber = '';
  queryParams.stallCode = '';
  queryParams.stallName = '';
  getBoothList(currentTreeNode.value.regionId)
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
      regionId: node.data.regionId,
      remark: node.data.remark,
      regionName: newTreeLabel.value == "" ? node.data.regionName : newTreeLabel.value
    }
    boothService.editRegion(params).then(res => {
      ElMessage({
        message: '区域名称修改成功!',
        type: 'success',
      })
      getTreeDataRequest();
    })
  }
}

const deleteRegion = (node) => {
  boothService.deleteRegion(node.data.regionId).then(res => {
    getTreeDataRequest();
    ElMessage({
      message: '区域删除成功!',
      type: 'success',
    })
  })
}

const openDrag = () => {
  visible.sortVisible = true;
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
    delete obj.busRegionVoList;
    delete obj.deviceType;
    delete obj.deviceVos;
    delete obj.level;
    delete obj.orderNum;
    delete obj.remark;
    delete obj.reportTime;
    delete obj.status;
    delete obj.time;
    delete obj.usageSum;
    delete obj.regionName;
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
  if ((draggingNode.data.level == dropNode.data.level) && type !== 'inner') {
    return true;
  } else {
    return false;
  }
}

//判断节点能否被拖拽
const allowDrag = (draggingNode, dropNode) => {
  return true;
}

const nodeClick = (current, node, treeNode, e) => {
  currentTreeNode.value = current;
  currentTreeNodeKey.value = current.regionId;
  getBoothList(currentTreeNode.value.regionId);
}

const handleSortClose = () => {
  getTreeDataRequest();
  visible.sortVisible = false;
  dragTreeParams.value = null;
}

const dragConfirm = () => {
  if (dragTreeParams.value) {
    dialogLoading.value = true;
    boothService.dropRegion(dragTreeParams.value).then(res => {
      ElMessage({
        message: '区域位置修改成功!',
        type: 'success',
      })
    }).catch(err => { }).finally(() => {
      dialogLoading.value = false;
      visible.sortVisible = false;
      getTreeDataRequest();
    })
  } else {
    visible.sortVisible = false;
  }
}

/** 导入按钮操作 */
function handleImport (type) {
  if (type == 1) {
    upload.title = "摊位导入";
    upload.url = import.meta.env.VITE_APP_BASE_API + "/payment/stall/import";
    upload.action = (upload.url + '?updateSupport=' + upload.updateSupport + '&' + 'regionId=' + currentTreeNode.value.regionId)
  } else if (type == 2) {
    upload.title = "摊位绑表导入";
    upload.url = import.meta.env.VITE_APP_BASE_API + "/payment/stall/device/import";
    upload.action = (upload.url + '?updateSupport=' + upload.updateSupport);
  } else if (type == 3) {
    upload.title = "商户导入";
    upload.url = import.meta.env.VITE_APP_BASE_API + "/payment/stall/business/import";
    upload.action = (upload.url + '?updateSupport=' + upload.updateSupport);
  }
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate () {
  if (upload.title.includes('摊位')) {
    proxy.download(
      "payment/stall/importTemplate",
      {},
      `摊位模板${new Date().getTime()}.xlsx`
    );
  } else if (upload.title.includes('摊位绑表')) {
    proxy.download(
      "payment/stall/device/importTemplate",
      {},
      `绑表设备导入模板${new Date().getTime()}.xlsx`
    );
  } else if (upload.title.includes('商户')) {
    proxy.download(
      "payment/stall/business/importTemplate",
      {},
      `商户导入模板${new Date().getTime()}.xlsx`
    );
  }
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
  getBoothList();
};
/** 提交上传文件 */
function submitFileForm () {
  proxy.$refs["uploadRef"].submit();
}

/** 导出按钮操作 */
function handleExport () {
  // proxy.download(
  //   "system/user/export",
  //   {
  //     ...queryParams.value,
  //   },
  //   `user_${new Date().getTime()}.xlsx`
  // );
}

const addBooth = () => {
  boothTitle.value = '新增摊位';
  visible.boothVisible = true;
}

const addArea = () => {
  visible.areaVisible = true;
}

const bind = (row) => {
  bindTitle.value = "绑表";
  operateDevice(row, '绑表')
}

const unbind = (row) => {
  bindTitle.value = "解绑";
  operateDevice(row, '解绑')
}

const changeBind = (row) => {
  bindTitle.value = "换表";
  operateDevice(row, '换表')
}

function operateDevice (row, type) {
  form.bindForm.stallId = row.stallId;
  form.bindForm.name = row.stallName;
  form.bindForm.domains = [];
  row.deviceXos.forEach((item, index) => {
    form.bindForm.domains.push({
      value: item.deviceId,
      number: item.deviceNumber,
      key: index,
      disabled: (type == '绑表' || type == '解绑') ? true : false
    })
  })
  if (form.bindForm.domains.length == 0 && type == '绑表') {
    form.bindForm.domains.push({
      key: 1,
      value: '',
      number: '',
      disabled: false
    })
  }
  remoteOption.value = row.deviceXos;
  remoteOption.value.forEach((item, index) => {
    remoteOption.value[index]['disabled'] = true;
  });
  originDeviceList.value = JSON.parse(JSON.stringify(remoteOption.value));
  visible.bindVisible = true;
}

let historyStallId = ref('')
const history = (row) => {
  getHistory(row.stallId);
  historyStallId.value = row.stallId;
}

const getHistory = (stallId) => {
  if (activeHistory.value == 1) {
    let params = {
      pageSize: mobilizationPagination.pageSize,
      pageNum: mobilizationPagination.pageNum,
      stallId: stallId
    }
    boothService.recordIn(params).then(res => {
      mobilizationData.value = res.rows;
      mobilizationPagination.total = res.total;
      visible.historyVisible = true;
    })
  } else {
    let params = {
      pageSize: bindPagination.pageSize,
      pageNum: bindPagination.pageNum,
      stallId: stallId
    }
    boothService.recordOut(params).then(res => {
      bindData.value = res.rows;
      bindPagination.total = res.total;
      visible.historyVisible = true;
    })
  }
}

const edit = (row) => {
  boothTitle.value = '编辑摊位';
  form.boothForm.name = row.stallName;
  form.boothForm.number = row.stallCode;
  form.boothForm.remark = row.stallRemark;
  form.boothForm.parentId = row.regionId;
  form.boothForm['stallId'] = row.stallId;
  isEditBooth.value = true;
  visible.boothVisible = true;
}

const deleteRow = (row) => {
  if (row.status == '1') {
    boothService.deleteBooth(row.stallId).then(res => {
      ElMessage({
        message: '摊位删除成功!',
        type: 'success',
      })
    }).finally(() => {
      getBoothList(currentTreeNode.value.regionId);
    })
  } else {
    ElMessage({
      message: '该摊位已有商户入驻，暂时无法删除！',
      type: 'warning',
    })
  }
}

const handleAreaClose = () => {
  form.areaForm.name = null;
  form.areaForm.parentId = null;
  form.areaForm.remark = null;
  visible.areaVisible = false;
}

const areaDialogConfirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let params = {
        parentId: form.areaForm.parentId,
        regionName: form.areaForm.name,
        remark: form.areaForm.remark
      }
      dialogLoading.value = true;
      boothService.newRegion(params).then(res => {
        ElMessage({
          message: '区域添加成功!',
          type: 'success',
        })
      }).catch(err => { }).finally(() => {
        dialogLoading.value = false;
        getTreeDataRequest();
        handleAreaClose()
      })
    }
  })
}

const handleBoothClose = () => {
  form.boothForm.name = null;
  form.boothForm.number = null;
  form.boothForm.parentId = null;
  form.boothForm.remark = null;
  visible.boothVisible = false;
  isEditBooth.value = false;
}

const boothDialogConfirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let params = {
        regionId: form.boothForm.parentId,
        stallName: form.boothForm.name,
        stallCode: form.boothForm.number,
        stallRemark: form.boothForm.remark
      }
      if (!isEditBooth.value) {
        dialogLoading.value = true;
        boothService.newBooth(params).then(res => {
          ElMessage({
            message: '摊位添加成功!',
            type: 'success',
          })
        }).catch(err => { }).finally(() => {
          dialogLoading.value = false;
          getBoothList(currentTreeNode.value.regionId);
          handleBoothClose()
        })
      } else {
        dialogLoading.value = true;
        params['stallId'] = form.boothForm.stallId;
        boothService.editBooth(params).then(res => {
          ElMessage({
            message: '摊位编辑成功!',
            type: 'success',
          })
        }).catch(err => { }).finally(() => {
          dialogLoading.value = false;
          isEditBooth.value = false;
          getBoothList(currentTreeNode.value.regionId);
          handleBoothClose()
        })
      }
    }
  })
}

const handleBindClose = () => {
  form.bindForm = {
    name: null,
    stallId: null,
    domains: [
      {
        key: 1,
        value: '',
        number: '',
        disabled: false
      }
    ]
  }
  remoteOption.value = [];
  originDeviceList.value = null;
  visible.bindVisible = false;
}

const addDomain = () => {
  form.bindForm.domains.push({
    key: Date.now(),
    value: '',
    number: '',
    disabled: false
  })
}

const removeDomain = (item) => {
  const index = form.bindForm.domains.indexOf(item)
  if (index !== -1) {
    form.bindForm.domains.splice(index, 1)
  }
}

const remoteMethod = (query) => {
  if (query) {
    remoteLoading.value = true;
    let params = {
      name: query
    }
    boothService.getDeviceList(params).then(res => {
      remoteLoading.value = false;
      remoteOption.value = res;
    })
  } else {
    remoteOption.value = []
  }
}

const remoteOptionChange = (index) => {
  let selectedItem = remoteOption.value.filter(item => {
    return item.deviceId == form.bindForm.domains[index].value
  })
  form.bindForm.domains[index].number = selectedItem[0].number;
}

const bindDialogConfirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (bindTitle.value == "绑表") {
        let filtered_data = form.bindForm.domains.filter(item => {
          return item.disabled == false;
        })
        let params_bind = []
        filtered_data.forEach(item => {
          params_bind.push({
            stallId: form.bindForm.stallId,
            deviceId: item.value,
            deviceNumber: item.number
          })
        })
        dialogLoading.value = true;
        boothService.bindDevice(params_bind).then(res => {
          ElMessage({
            message: '绑表成功!',
            type: 'success',
          })
        }).catch(err => { }).finally(() => {
          dialogLoading.value = false;
          getBoothList();
          handleBindClose();
        })
      } else if (bindTitle.value == "换表") {
        dialogLoading.value = true;
        let changeList = []
        originDeviceList.value.forEach((item, index) => {
          if (form.bindForm.domains[index]) {
            let obj = {
              oldDeviceId: item.deviceId,
              newDeviceId: form.bindForm.domains[index].value
            }
            changeList.push(obj)
          }
        })
        let new_params = {
          stallId: form.bindForm.stallId,
          changeList: changeList
        }
        if (new_params.changeList.length == 1 && (new_params.changeList[0].newDeviceId == new_params.changeList[0].oldDeviceId)) {
          dialogLoading.value = false;
          handleBindClose();
        } else {
          boothService.changeBindDevice(new_params).then(res => {
            ElMessage({
              message: '换表成功!',
              type: 'success',
            })
          }).catch(err => { }).finally(() => {
            dialogLoading.value = false;
            getBoothList();
            handleBindClose();
          })
        }
      } else if (bindTitle.value == "解绑") {
        let deviceIds = [];
        originDeviceList.value.forEach((item, index) => {
          if (form.bindForm.domains[index]) { } else {
            deviceIds.push(item.deviceId)
          }
        })
        if (deviceIds.length) {
          boothService.unbindDevice(deviceIds).then(res => {
            ElMessage({
              message: '解绑成功!',
              type: 'success',
            })
          }).finally(() => {
            getBoothList();
            handleBindClose();
          })
        } else {
          getBoothList();
          handleBindClose();
        }
      }
    }
  })
}

const handleHistoryClose = () => {
  historyStallId.value = "";
  activeHistory.value = 1;
  visible.historyVisible = false;
}

const clickHistoryTab = (tab, e) => {
  getHistory(historyStallId.value)
}

</script>

<style scoped lang="scss">
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.booth-main {
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
  }

  .booth-content {
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
      border-bottom: 1px solid #F2F3F5;

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
  background: #FAFBFC;
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
</style>
