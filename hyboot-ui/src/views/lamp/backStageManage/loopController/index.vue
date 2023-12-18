<template>
  <div class="page-container">
    <div class="content" style="padding: 0 16px;">
      <div class="search" v-show="showSearch">
        <!-- 查询框及按钮 -->
        <el-form ref="queryRef" :inline="true" label-width="85px" label-position="left">
          <el-form-item label="在线状态">
            <el-select v-model="queryParams.online" placeholder="请选择在线状态" style="width: 240px" clearable
                       :filterable="true">
              <el-option label="在线" value="0"></el-option>
              <el-option label="离线" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="控制器名称">
            <el-input v-model="queryParams.switchName" style="width: 240px" placeholder="请输入控制器名称">
            </el-input>
          </el-form-item>
          <el-form-item label="控制器编号">
            <el-input v-model="queryParams.switchNumber" style="width: 240px" placeholder="请输入控制器编号">
            </el-input>
          </el-form-item>

          <el-form-item class="button-container">
            <el-button type="primary" icon="Search" v-hasPermi="['chaoyang:lamp:switchRelation:page']"
                       @click="getListData">搜索
            </el-button>
            <el-button icon="Refresh" v-hasPermi="['chaoyang:lamp:switchRelation:page']" @click="resetQuery">重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="table" ref="pageTableWrapper">
        <el-row :gutter="10" class="mb8" style="margin-top: 16px;">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="createDialog"
                       v-hasPermi="['chaoyang:lamp:switchRelation:add']">新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain @click="batchSwitchRelation"
                       v-hasPermi="['chaoyang:lamp:switchRelation:batch']">
              绑表
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" plain icon="Upload" @click="handleImport"
                       v-hasPermi="['chaoyang:lamp:switchRelation:import']">
              导入
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getListData"></right-toolbar>
        </el-row>

        <el-table :data="tableData" border class="customer-table" style="width: 100%"
                  :header-cell-style="{ 'text-align': 'center' }" name="table" v-loading="loading"
                  element-loading-text="加载中..." @selection-change="handleSelectionChange"
                  ref="multipleTableRef" :max-height="pageTableHeight">
          <el-table-column type="selection" width="40" align="center"/>
          <el-table-column type="index" label="序号" width="60" align="center" fixed/>
          <el-table-column v-for="item in columns" :key="item" :prop="item.prop" :label="item.label"
                           :fixed="item.fixed" :min-width="item.minWidth" :width="item.width"
                           :align="item.align">
            <template #default="scope" v-if="item.label == '状态'">
              <div style="display: flex; align-items: center;justify-content: center;">
                <div :class="scope.row.online == '0' ? 'online' : 'offline'">
                  <div>
                  </div>
                  <span>
                      {{ scope.row.online == '0' ? '在线' : '离线' }}
                       </span>
                </div>
              </div>
            </template>

            <template #default="scope" v-if="item.label == '控制器名称'">
              <el-link :underline="false" v-hasPermi="['chaoyang:lamp:switchRelation:edit']"
                       @click="switchNameClick(scope.row)">{{ scope.row.switchName }}
              </el-link>
            </template>

            <template #default="scope" v-if="item.prop == 'loopNum'">
              <div>
                {{ `${scope.row.insertLoopNum}/${scope.row.loopNum}` }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160"
                           fixed="right">
            <template #default="scope">
              <el-button type="text" icon="Edit" @click="editBtn(scope.row)"
                         v-hasPermi="['chaoyang:lamp:switchRelation:edit']">编辑
              </el-button>
              <el-button type="text" icon="Delete" @click="deleteRow(scope.row)"
                         v-hasPermi="['chaoyang:lamp:switchRelation:remove']">删除
              </el-button>

            </template>
          </el-table-column>
        </el-table>
        <pagination class="pagination" v-show="total > 0" :total="total"
                    v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                    @pagination="getListData"/>
      </div>
    </div>

    <!-- 新增弹框 -->
    <el-dialog :title="dialogTitle" v-model="visible.createVisible" append-to-body destroy-on-close
               :before-close="handleAreaClose" width="500px">
      <el-form class="area-form" ref="createDialogRef" :model="form.dialogData" :rules="rules.dialogRules"
               label-width="100px">
        <!--      <el-form-item label="所属区域" prop="regionId">-->
        <!--        <el-tree-select v-model="form.dialogData.regionId" :data="treeData" :props="defaultProps1" value-key="regionId"-->
        <!--                        style="width: 250px;" placeholder="请选择三级区域" node-key="regionId"></el-tree-select>-->
        <!--      </el-form-item>-->

        <template v-if="createOrEdit=='create'">
          <el-form-item label="控制器名称" prop="switchId">
            <el-select v-model="form.dialogData.switchId" placeholder="请选择控制器名称" size="default" style="width: 250px;"
                       @change="switchOptionsChange" :filterable="true">
              <el-option v-for="item in switchOptions" :key="item.switchId" :label="item.switchName"
                         :value="item.switchId"/>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="createOrEdit=='edit'">
          <el-form-item label="控制器名称" prop="switchName">
            <el-input v-model="associateProps.switchName" style="width: 250px;" disabled>
            </el-input>
          </el-form-item>
        </template>
        <el-form-item label="控制器编号" prop="switchNumber">
          <el-input v-model="associateProps.switchNumber" style="width: 250px;" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="引用开关数" prop="loopNum">
          <el-input v-model="associateProps.loopNum" style="width: 250px;" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="关联电表" prop="deviceId">
          <el-select v-model="form.dialogData.deviceId" placeholder="请选择关联电表" size="default" style="width: 250px;"
                     :filterable="true">
            <el-option v-for="(item,index) in deviceOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="安装地址" prop="installAddr">
          <el-input v-model="associateProps.installAddr" style="width: 250px;" disabled>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleAreaClose">取消</el-button>
                    <el-button type="primary" @click="createDialogConfirm">确定
                    </el-button>
                </span>
      </template>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
                 :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
                 :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport"/>
              是否更新已经存在的用户数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                     @click="importTemplate">下载模板
            </el-link>
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

    <!-- 绑表弹框 -->
    <el-dialog title="绑定电表" v-model="visible.batchVisible" append-to-body destroy-on-close
               :before-close="handlebatchDialogClose" width="500px">
      <el-form class="area-form" ref="batchDialogRef" :model="form.batchDialogData" :rules="rules.batchDialogRules"
               label-width="100px">
        <el-form-item label="表具名称" prop="id">
          <el-select v-model="form.batchDialogData.id" placeholder="请选择关联电表" size="default" style="width: 250px;"
                     :filterable="true">
            <el-option v-for="(item,index) in deviceOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handlebatchDialogClose">取消</el-button>
                    <el-button type="primary" @click="batchDialogConfirm">确定
                    </el-button>
                </span>
      </template>
    </el-dialog>

    <!-- 抽屉编辑弹窗-->
    <el-dialog title="编辑" v-model="visible.drawerEditVisible" append-to-body destroy-on-close
               :before-close="handleDrawerEditDialogClose" width="500px">
      <el-form class="area-form" ref="drawerEditDialogRef" :model="form.drawerEditDialogData"
               :rules="rules.drawerEditDialogRules"
               label-width="100px">

        <el-form-item label="所属区域" prop="regionId">
          <el-tree-select v-model="form.drawerEditDialogData.regionId" :data="treeData" :props="defaultProps1"
                          value-key="regionId"
                          style="width: 250px;" placeholder="请选择三级区域" node-key="regionId"></el-tree-select>
        </el-form-item>
        <el-form-item label="回路名称" prop="loopName">
          <el-input v-model="form.drawerEditDialogData.loopName" style="width: 250px;" placeholder="请输入回路名称">
          </el-input>
        </el-form-item>
        <el-form-item label="使用策略" prop="strategyId">
          <el-select v-model="form.drawerEditDialogData.strategyId" placeholder="请选择使用策略" size="default"
                     style="width: 250px;" :filterable="true">
            <el-option v-for="item of strategyOptions" :key="item.strategyId" :label="item.strategyName"
                       :value="item.strategyId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="灯具个数" prop="lampSum">
          <el-input v-model="form.drawerEditDialogData.lampSum" style="width: 250px;" placeholder="请输入灯具个数">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
           <el-input v-model="form.drawerEditDialogData.remark" style="width: 250px;" placeholder="请输入备注">
           </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleDrawerEditDialogClose">取消</el-button>
                    <el-button type="primary" @click="drawerEditDialogConfirm">确定
                    </el-button>
                </span>
      </template>
    </el-dialog>
    <!--下发策略弹窗-->
    <el-dialog title="选择策略" v-model="visible.drawerStrategyVisible" append-to-body destroy-on-close
               :before-close="drawerStrategyDialogClose" width="500px">
      <el-form class="area-form" ref="drawerStrategyDialogRef" :model="form.drawerStrategyDialogData"
               :rules="rules.drawerStrategyDialogRules"
               label-width="100px">
        <el-form-item label="策略名称" prop="id">
          <el-select v-model="form.drawerStrategyDialogData.id" placeholder="请选择策略名称" size="default"
                     style="width: 250px;" :filterable="true">
            <el-option v-for="item of strategyOptions" :key="item.strategyId" :label="item.strategyName"
                       :value="item.strategyId"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="drawerStrategyDialogClose">取消</el-button>
                    <el-button type="primary" @click="drawerStrategyDialogConfirm">确定
                    </el-button>
                </span>
      </template>
    </el-dialog>
    <!--设置区域弹窗-->
    <el-dialog title="选择区域" v-model="visible.drawerSetRegionVisible" append-to-body destroy-on-close
               :before-close="drawerSetRegionDialogClose" width="500px">
      <el-form class="area-form" ref="drawerSetRegionDialogRef" :model="form.drawerSetRegionDialogData"
               :rules="rules.drawerSetRegionDialogRules"
               label-width="100px">
        <el-form-item label="所属区域" prop="id">
          <el-tree-select v-model="form.drawerSetRegionDialogData.id" :data="treeData" :props="defaultProps1"
                          value-key="regionId"
                          style="width: 250px;" placeholder="请选择三级区域" node-key="regionId"></el-tree-select>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="drawerSetRegionDialogClose">取消</el-button>
                    <el-button type="primary" @click="drawerSetRegionDialogConfirm">确定
                    </el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 表具抽屉  :before-close="handleClose"关闭前是否加确认 -->
    <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中...">
      <el-drawer v-model="drawer" :title="drawerTitle" direction="rtl" size="60%" @close="drawerClose"
                 :close-on-click-modal="true">
        <div ref="tableWrapper" style="height: 100%">
          <div style="margin-bottom: 10px;">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="success" plain @click="deliveryStrategy"
                           v-hasPermi="['chaoyang:lamp:loop:batch']">
                  设置策略并下发
                </el-button>

                <el-button type="success" plain @click="setRegion"
                           v-hasPermi="['chaoyang:lamp:loop:batch']">
                  设置区域
                </el-button>

              </el-col>
            </el-row>


          </div>
          <div>
            <el-table v-loading="loading" element-loading-text="加载中..." :data="drawerTableData" style="width: 100%;"
                      border class="customer-table" :header-cell-style="{ 'text-align': 'center' }" name="table"
                      @selection-change="drawerHandleSelectionChange"
                      ref="drawerMultipleTableRef" :max-height="tableHeight">
              <el-table-column type="selection" width="40" align="center"/>
              <el-table-column type="index" label="序号" width="60" fixed align="center"/>
              <el-table-column v-for="(item, index) in drawerTableColumn" :key="index" :label="item.label"
                               :prop="item.prop" :align="item.align" :min-width="item.minWidth" :width="item.width">
                <template #default="scope" v-if="item.label == '是否接线'">
                  <div style="display: flex; align-items: center;justify-content: center;">
                    <el-switch
                        v-model="scope.row.isInsert"
                        inline-prompt
                        active-text="是"
                        inactive-text="否"
                        active-value="0"
                        inactive-value="1"
                        @change="drawerSwitchOptionsChange(scope.row)"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
                <template #default="scope">
                  <el-button type="text" icon="Edit" @click="editDrawerBtn(scope.row)"
                             v-hasPermi="['chaoyang:lamp:loop:edit']">编辑
                  </el-button>
                </template>
              </el-table-column>

            </el-table>
          </div>

        </div>

      </el-drawer>
    </div>

  </div>

</template>

<script setup>
import {ref, watch, nextTick, computed} from "vue";
import {
  listRegionAPI,//列表接口
} from "@/api/lamp/region";

import {
  pageSwitchLoopAPI,//回路控制器分页
  listSwitchAPI,//控制器列表
  nameListAPI,//关联电表下拉
  addSwitchRelationAPI,//回路控制器新增
  delSwitchRelationAPI,//删除控制器关系
  updateSwitchRelationAPI,//修改控制器关系
  batchSwitchRelationAPI,//回路控制器绑表
  loopSearchListAPI,//抽屉 列表接口
  getStrategyOptionsAPI,//策略下拉接口
  updateLoopAPI, //回路控制器编辑
  batchLoopAPI,//批量下发策略
  swtAreaAndLoopAPI, //设置区域
  editsLoopAPI,//编辑状态
} from "@/api/lamp/loopController";

import {ElMessage} from "element-plus";
import {getToken} from "@/utils/auth";

const {proxy} = getCurrentInstance();
//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(true);
const  fullscreenLoading=ref(false)
const treeLoading = ref(true);
let pageLoading = ref(false)
const treeData = ref(undefined);
let defaultTreeKeys = ref(null)
const treeRef = ref()
const defaultProps = {
  label: 'regionName',
  children: 'children',
};

const defaultProps1 = {
  label: 'regionName',
  children: 'children',
  disabled: 'disabled',
}

let columns = ref([
  {prop: "switchName", label: "控制器名称", minWidth: '160', align: 'left', fixed: "left"},
  {prop: "switchNumber", label: "控制器编号", minWidth: '160', align: 'left'},
  {prop: "switchModel", label: "控制器型号", minWidth: '160', align: 'left'},
  {prop: "loopNum", label: "引用开关数", width: '100', align: 'right'},
  {prop: "deviceName", label: "关联电表", minWidth: '160', align: 'left'},
  {prop: "online", label: "状态", width: '100', align: 'center'},
  {prop: "installAddr", label: "安装地址", minWidth: '160', align: 'left'},
  {prop: "indicationTime", label: "通讯时间", width: '160', align: 'center'},
]);

//获取树
function getTreeData() {
  treeLoading.value = true;
  listRegionAPI().then((res) => {
    treeData.value = res.rows;
    getListData();
  }).finally(() => {
    treeLoading.value = false;
  })
}

const handleTreeNodeClick = (currentNode) => {
  queryParams.value.regionId = currentNode.regionId
  getListData();
};

//查询参数
let queryParams = ref({
  online: null,
  switchName: null,
  switchNumber: null,
  pageSize: 10,
  pageNum: 1,
});
const total = ref(0)

//获得列表数据
const tableData = ref([]);
const getListData = () => {
  loading.value = true;
  tableData.value = []
  pageSwitchLoopAPI(queryParams.value)
      .then((res) => {
        tableData.value = res.rows;
        total.value = res.total
      })
      .finally(() => {
        loading.value = false;
        nextTick(() => {
          fetPageTableHeight()
        })
      });
}

//定义一个变量记录当前是编辑还是新增
const createOrEdit = ref('')

//弹窗显示定义
const visible = reactive({
  createVisible: false,
  batchVisible: false,
  drawerEditVisible: false,
  drawerStrategyVisible: false,
  drawerSetRegionVisible:false,
})

//弹窗数据定义
let form = reactive({
  dialogData: {
    switchId: null,
    deviceId: null,
  },
  //绑定弹窗的数据
  batchDialogData: {
    id: null,
  },
  //抽屉编辑弹窗
  drawerEditDialogData: {
    loopName: null,
    strategyId: null,
    lampSum: null,
    regionId:null,
    remark:null,
  },
  //抽屉策略弹窗
  drawerStrategyDialogData: {
    id: null,
  },
  //抽屉设置区域弹窗
  drawerSetRegionDialogData: {
    id: null,
  },

})

let associateProps = ref({
  switchName: null,
  switchNumber: null,
  loopNum: null,
  installAddr: null

})

//弹窗规则定义
const rules = reactive({
  dialogRules: {
    switchId: [{required: true, message: "请选择控制器名称", trigger: "change"}],
  },
  batchDialogRules: {
    id: [{required: true, message: "请选择表具名称", trigger: "change"}],
  },
  drawerEditDialogRules: {
    loopName: [{required: true, message: "请输入回路名称", trigger: "trigger"}],
    strategyId: [{required: true, message: "请选择使用策略", trigger: "change"}],
    regionId: [{required: true, message: "请选择三级区域", trigger: "change"}],
  },
  drawerStrategyDialogRules: {
    id: [{required: true, message: "请选择使用策略", trigger: "change"}],
  },
  drawerSetRegionDialogRules: {
    id: [{required: true, message: "请选择区域", trigger: "change"}],
  }
});

//新增
const createDialog = () => {
  createOrEdit.value = 'create'
  getSwitchOptions()
  getDeviceOptions()
  visible.createVisible = true

}

const dialogTitle = computed(() => {
  return createOrEdit.value == 'create' ? '新增' : '编辑';
})

//控制器下拉
const switchOptions = ref([])
const getSwitchOptions = () => {
  listSwitchAPI().then(res => {
    switchOptions.value = res.rows
  })
}
//控制改变带出其他值
const switchOptionsChange = (value) => {
  for (let i = 0, arr = switchOptions.value; i < arr.length; i++) {
    if (arr[i].switchId == value) {
      associateProps.value.switchName = arr[i].switchName
      associateProps.value.switchNumber = arr[i].switchNumber
      associateProps.value.loopNum = arr[i].loopNum
      break;
    }
  }

}

//点击树的节点 只有末级节点
const treeOptionsClick = (current) => {
  if (current.level !== 3) {
    nextTick(() => {
      form.dialogData.regionId = null
    })
  }
}


//关联电表下拉
const deviceOptions = ref([])
const getDeviceOptions = () => {
  nameListAPI().then(res => {
    deviceOptions.value = res.data
  })
}

//新增弹窗提交
const createDialogConfirm = () => {
  if (createOrEdit.value == 'create') {
    proxy.$refs["createDialogRef"].validate((valid) => {//校验是否通过
      if (valid) {
        addSwitchRelationAPI(form.dialogData).then(res => {
          ElMessage({
            message: '新增数据成功!',
            type: 'success',
          })
          visible.createVisible = false
          getListData()
        }).finally(() => {
          handleAreaClose()
        })
      }
    })
  } else {
    proxy.$refs["createDialogRef"].validate((valid) => {
      if (valid) {
        updateSwitchRelationAPI(form.dialogData).then(res => {
          ElMessage({
            message: '编辑数据成功!',
            type: 'success',
          })
          visible.createVisible = false
          getListData()
        }).finally(() => {
          handleAreaClose()
        })
      }
    });
  }

}

const handleAreaClose = () => {
  //关闭弹窗前清空所有数据
  form.dialogData = {
    switchRelationId: null,
    switchId: null,
    deviceId: null,
  }
  associateProps.value = {
    switchName: null,
    switchNumber: null,
    loopNum: null,
    installAddr: null
  }
  visible.createVisible = false
}


//编辑弹窗
const editBtn = async (row) => {
  createOrEdit.value = 'edit'
  await getDeviceOptions()
  form.dialogData = {
    switchRelationId: row.switchRelationId,
    switchId: row.switchId,
    deviceId: row.deviceId,
  }

  associateProps.value = {
    switchName: row.switchName,
    switchNumber: row.switchNumber,
    loopNum: row.loopNum,
    installAddr: row.installAddr
  }
  visible.createVisible = true
}

//删除
const deleteRow = (row) => {
  proxy.$modal.confirm('是否确认删除？').then(() => delSwitchRelationAPI(row.switchRelationId)).then(() => {
    getListData()
    proxy.$modal.msgSuccess("删除成功");
  })
}

//绑表
const ids = ref([]);  //id集合
const multiple = ref(true); // 没选择按钮置灰
const handleSelectionChange = (selection) => {
  ids.value = selection.map(item => item.switchRelationId);
  multiple.value = !selection.length;
};
const multipleTableRef = ref()
//清空多选列表
const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTableRef.value.clearSelection()
  }
  ids.value = [];
}

const batchSwitchRelation = () => {
  if (ids.value.length) {
    getDeviceOptions()
    visible.batchVisible = true
  } else {
    ElMessage({
      message: '未选择回路控制器!',
      type: 'warning',
    })
  }
}

const batchDialogConfirm = () => {
  proxy.$refs["batchDialogRef"].validate((valid) => {//校验是否通过
    if (valid) {
      loading.value = true
      form.batchDialogData = Object.assign(form.batchDialogData, {ids: ids.value})
      batchSwitchRelationAPI(form.batchDialogData).then(res => {
        ElMessage({
          message: '绑表成功!',
          type: 'success',
        })
        getListData()
      }).finally(() => {
        handlebatchDialogClose()
        toggleSelection();
        loading.value = false
      })
    }
  })

}

const handlebatchDialogClose = () => {
  form.batchDialogData = {
    id: null,
  }
  visible.batchVisible = false
}


//文件上传
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/lamp/switchRelation/import"
});

/** 导入按钮操作 */
function handleImport() {
  upload.title = "回路控制器导入";
  upload.open = true;
};

/** 下载模板操作 */
function importTemplate() {
  proxy.download("lamp/switchRelation/importTemplate", {}, `回路控制器导入模板_${new Date().getTime()}.xlsx`);
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getListData();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};

const resetQuery = () => {
  queryParams.value = Object.assign(queryParams.value, {
    online: null,
    switchName: null,
    switchNumber: null,
    pageSize: 10,
    pageNum: 1,
  })
  getListData()
}

//控制器抽屉
const drawer = ref(false)
const drawerTitle = ref()
const switchId = ref('')
const switchNameClick = (row) => {
  drawerTitle.value = `控制器名称： ${row.switchName}`
  switchId.value = row.switchId
  //请求数据
  getDrawerData()
  drawer.value = true
  fetTableHeight()
}

//抽屉动态表格高度
const tableHeight = ref(0)
const resetHeight = () => {
  return new Promise((resolve, reject) => {
    tableHeight.value = 0
    resolve()
  })
}
// 设置table高度
const tableWrapper = ref()
const fetTableHeight = () => {
  resetHeight().then(res => {
    tableHeight.value = tableWrapper.value.getBoundingClientRect().height - 60
  })
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
    pageTableHeight.value = pageTableWrapper.value.getBoundingClientRect().height - 165
  })
}

watch(showSearch, (newValue) => {
  fetPageTableHeight()
})

//抽屉关闭清空数据
const drawerClose = () => {
  drawerTableData.value = []
}

const drawerTableColumn = [
  {
    label: '回路名称',
    prop: 'loopName',
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    label: '所属区域',
    prop: 'regionName',
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    label: '所属策略',
    prop: 'strategyName',
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    label: '灯具个数',
    prop: 'lampSum',
    align: 'right',
    width: '',
    minWidth: '100'
  },
  {
    label: '是否接线',
    prop: 'isInsert',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '备注',
    prop: 'remark',
    align: 'left',
    width: '',
    minWidth: '100'
  }
]

const drawerTableData = ref([])
//请求抽屉列表数据
const getDrawerData = () => {
  loopSearchListAPI({switchId: switchId.value}).then(res => {
    drawerTableData.value = res.data;
  });
}

//抽屉数据编辑
const editDrawerBtn = (row) => {
  //编辑数据回显
  //请求策略下拉
  getStrategyOptions()
  getTreeOptions()

  form.drawerEditDialogData = {
    loopName: row.loopName,
    strategyId: row.strategyId,
    lampSum: row.lampSum,
    regionId:row.regionId,
    remark:row.remark
  }
  //编辑的Id
  form.drawerEditDialogData['loopId'] = row.loopId
  visible.drawerEditVisible = true
}

const strategyOptions = ref([])
const getStrategyOptions = () => {
  getStrategyOptionsAPI().then((res) => {
    strategyOptions.value = res.rows
  })
}

//抽屉编辑确认
const drawerEditDialogConfirm = () => {
  proxy.$refs["drawerEditDialogRef"].validate((valid) => {
    if (valid) {
      proxy.$modal.confirm('策略将直接下发到回路，原有策略将会被覆盖，是否确认下发？').then(() => {
        fullscreenLoading.value=true
        updateLoopAPI(form.drawerEditDialogData).then(res => {
          ElMessage({
            message: '编辑数据成功!',
            type: 'success',
          })
          visible.drawerEditVisible = false
          getDrawerData()
        }).finally(() => {
          handleDrawerEditDialogClose()
          fullscreenLoading.value=false
        })
      })
    }
  });

}

//列表点击开关同样发送请求
const drawerSwitchOptionsChange = (row) => {
  const params = {
    isInsert: row.isInsert,
    loopId: row.loopId
  }
  editsLoopAPI(params).then(() => {
    proxy.$modal.msgSuccess("编辑成功");
    getListData()
  })

}

//关闭
const handleDrawerEditDialogClose = () => {
  form.drawerEditDialogData = {
    loopName: null,
    strategyId: null,
    lampSum: null,
    regionId:null
  }
  visible.drawerEditVisible = false
}

//下发策略按钮
const deliveryStrategy = () => {
  if (drawerIds.value.length) {
    getStrategyOptions()
    visible.drawerStrategyVisible = true
  } else {
    ElMessage({
      message: '未选择回路!',
      type: 'warning',
    })
  }
}

//设置区域获取树状图
const getTreeOptions = () => {
  listRegionAPI().then((res) => {
    treeData.value = res.rows;
    //给所有一级和二级树状图加上 disable属性
    treeData.value.forEach((item) => {
      item.disabled = true
      if (item.children.length) {
        item.children.forEach(item1 => {
          item1.disabled = true
        })
      }
    })

  }).finally(() => {
  })
}

//设置区域
const setRegion = () => {
  if (drawerIds.value.length) {
    getTreeOptions()
    visible.drawerSetRegionVisible = true
  } else {
    ElMessage({
      message: '未选择回路!',
      type: 'warning',
    })
  }
}


const drawerSetRegionDialogClose = () => {
  form.drawerStrategyDialogData = {
    id: null
  }
  visible.drawerSetRegionVisible = false
}
//多选
const drawerIds = ref([])
const drawerHandleSelectionChange = (selection) => {
  drawerIds.value = selection.map(item => item.loopId);
}

const drawerMultipleTableRef = ref()
//清空多选列表
const drawerToggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      drawerMultipleTableRef.value.toggleRowSelection(row, undefined)
    })
  } else {
    drawerMultipleTableRef.value.clearSelection()
  }
  drawerIds.value = [];
}
const drawerStrategyDialogClose = () => {
  form.drawerStrategyDialogData = {
    id: null
  }
  visible.drawerStrategyVisible = false
}

const drawerStrategyDialogConfirm = () => {
  proxy.$refs["drawerStrategyDialogRef"].validate((valid) => {//校验是否通过
    if (valid) {
      proxy.$modal.confirm('策略将直接下发到回路，原有策略将会被覆盖，是否确认下发？').then(() => {
        fullscreenLoading.value = true
        form.drawerStrategyDialogData = Object.assign(form.drawerStrategyDialogData, {ids: drawerIds.value})
        batchLoopAPI(form.drawerStrategyDialogData).then(res => {
          ElMessage({
            message: '批量下发策略成功!',
            type: 'success',
          })
          getDrawerData()
        }).finally(() => {
          drawerStrategyDialogClose()
          drawerToggleSelection()
          fullscreenLoading.value = false
        })
      })
    }
  })

}

const drawerSetRegionDialogConfirm = () => {
  proxy.$refs["drawerSetRegionDialogRef"].validate((valid) => {//校验是否通过
    if (valid) {
      loading.value = true
      form.drawerSetRegionDialogData = Object.assign(form.drawerSetRegionDialogData, {ids: drawerIds.value})
      swtAreaAndLoopAPI(form.drawerSetRegionDialogData).then(res => {
        ElMessage({
          message: '批量设置区域成功!',
          type: 'success',
        })
        getDrawerData()
      }).finally(() => {
        drawerSetRegionDialogClose()
        drawerToggleSelection()
        loading.value = false
      })
    }
  })
}

getTreeData();
</script>

<style lang="scss" scoped>
$online: #19B21E;
$offline: #8D9094;

.status {
  display: flex;
  justify-content: left;
  align-content: center;
  align-items: center;

  div {

    width: 5px;
    height: 5px;
    border-radius: 3px 3px 3px 3px;
    opacity: 1;
  }

  span {
    padding-left: 5px;
  }
}


.has-tree-container {
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

  .whole-content {
    width: 100%;
    height: 100%;
    background-color: #F8F8F8;
    padding: 24px 24px 0 24px;
    position: absolute;

    .offline {
      @extend .status;
      color: $offline;

      div {
        background: $offline;
      }
    }

    .online {
      @extend .status;
      color: $online;

      div {
        background: $online;
      }
    }
  }

}

:deep(.sub:first-of-type) {
  box-shadow: 0px 6px 12px 0px rgb(0 0 0 / 8%);
  background: #F5F6F7 !important;
  border-radius: 4px 4px 4px 4px;
}

.tree {
  height: 100%;
  padding-left: 20px;
  border-bottom: 1px solid #f3f5f7;
  background: transparent !important;


  .title {
    font-size: 18px;
    font-family: BlackBody Medium;
    font-weight: bold;
    line-height: 70px;
    color: #262e4a;
  }

  :deep(.el-tree) {
    height: 100%;
    overflow: auto;
    background-color: #F5F6F7;
    font-size: 14px !important;

    // &::-webkit-scrollbar {
    //   display: none;
    // }
  }

  :deep(.el-tree-node__content) {
    margin: 4px 0;
    padding-right: 16px;
    position: relative;

    span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}


a,
a:hover,
a:active,
a:visited,
a:link,
a:focus {
  background-color: transparent;
  color: #1890ff;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  -webkit-transition: color .3s;
  transition: color .3s;
}
</style>

