<template>

  <div class="page-container">
    <div class="content">
      <div class="search" v-show="showSearch">
        <!-- label-width="80px" -->
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px" label-position="left">
          <el-form-item label="编码" prop="code">
            <el-input v-model="queryParams.code" style="width: 240px" placeholder="请输入编码">
            </el-input>
          </el-form-item>
          <el-form-item label="名称" prop="platformName">
            <el-input v-model="queryParams.platformName" style="width: 240px" placeholder="请输入名称">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getListData" v-hasPermi="['chaoyang:application:query']">搜索</el-button>
            <el-button icon="Refresh" @click="resetClick" v-hasPermi="['chaoyang:application:query']">重置</el-button>
          </el-form-item>
        </el-form>

      </div>


      <div class="table">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="visible.createVisible = true" v-hasPermi="['chaoyang:application:add']">新增</el-button>
          </el-col>

          <!-- <el-col :span="1.5">
                        <el-button type="info" plain icon="Upload" @click="handleImport"
                            v-hasPermi="['chaoyang:application:import']">
                            导入
                        </el-button>
                    </el-col> -->


          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['chaoyang:application:export']">导出</el-button> </el-col>

          <right-toolbar v-model:showSearch="showSearch" @queryTable="getListData"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="tableData" style="width: 100%;" border class="customer-table" :header-cell-style="{ 'text-align': 'center' }" name="table" element-loading-text="加载中...">
          <el-table-column type="selection" width="40" align="center" />

<!--          <el-table-column type="index" label="序号" width="80" fixed align="center" />-->
          <el-table-column v-for="(item, index) in tableColumn" :key="index" :label="item.label" :prop="item.prop" :align="item.align" :min-width="item.minWidth" :width="item.width" >
            <template #default="scope" v-if="item.prop == 'status'">
              <div style="display: flex; align-items: center;justify-content: center;">
                <div
                    :class="scope.row.status=='0'?'open':'close'">
                  <div>
                  </div>
                  <span>
                                {{ scope.row.status=='0'?'启用':'停用' }}
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"  width="200">
            <template #default="scope">
              <el-button type="text" icon="Edit" @click="editBtn(scope.row)" v-hasPermi="['monitor:online:forceLogout']">编辑</el-button>
              <el-button type="text" icon="Delete" @click="deleteRow(scope.row)" v-hasPermi="['monitor:online:forceLogout']">删除</el-button>

            </template>
          </el-table-column>
        </el-table>
        <pagination class="pagination" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getListData" />
      </div>

    </div>

    <!-- 新增弹框 -->
    <el-dialog title="新增" v-model="visible.createVisible" append-to-body destroy-on-close :before-close="handleAreaClose" width="500px">
      <el-form class="area-form" ref="createDialog" :model="form.dialogData" :rules="rules.dialogRules" label-width="100px">
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.dialogData.code" style="width: 250px;" placeholder="请输入编码">
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="platformName">
          <el-input v-model="form.dialogData.platformName" style="width: 250px;" placeholder="请输入名称">
          </el-input>
        </el-form-item>
        <el-form-item label="things账号" prop="thingsUser">
          <el-input v-model="form.dialogData.thingsUser" style="width: 250px;" placeholder="请输入things账号">
          </el-input>
        </el-form-item>
        <el-form-item label="things密码" prop="thingsPass">
          <el-input v-model="form.dialogData.thingsPass" style="width: 250px;" placeholder="请输入things密码">
          </el-input>
        </el-form-item>
        <el-form-item label="ProfileId" prop="deviceProfileId">
          <el-input v-model="form.dialogData.deviceProfileId" style="width: 250px;" placeholder="请输入ProfileId">
          </el-input>
        </el-form-item>
        <el-form-item label="prefix" prop="prefix">
          <el-input v-model="form.dialogData.prefix" style="width: 250px;" placeholder="请输入prefix">
          </el-input>
        </el-form-item>
        <el-form-item label="icon" prop="icon">
          <el-input v-model="form.dialogData.icon" style="width: 250px;" placeholder="请输入icon">
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

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑" v-model="visible.editVisible" append-to-body destroy-on-close :before-close="handleAreaClose" width="500px">
      <el-form class="area-form" ref="editDialog" :model="form.dialogData" :rules="rules.dialogRules" label-width="100px">
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.dialogData.code" style="width: 250px;" placeholder="请输入编码">
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="platformName">
          <el-input v-model="form.dialogData.platformName" style="width: 250px;" placeholder="请输入名称">
          </el-input>
        </el-form-item>
        <el-form-item label="things账号" prop="thingsUser">
          <el-input v-model="form.dialogData.thingsUser" style="width: 250px;" placeholder="请输入things账号">
          </el-input>
        </el-form-item>
        <el-form-item label="things密码" prop="thingsPass">
          <el-input v-model="form.dialogData.thingsPass" style="width: 250px;" placeholder="请输入things密码">
          </el-input>
        </el-form-item>
        <el-form-item label="ProfileId" prop="deviceProfileId">
          <el-input v-model="form.dialogData.deviceProfileId" style="width: 250px;" placeholder="请输入ProfileId">
          </el-input>
        </el-form-item>
        <el-form-item label="prefix" prop="prefix">
          <el-input v-model="form.dialogData.prefix" style="width: 250px;" placeholder="请输入prefix">
          </el-input>
        </el-form-item>
        <el-form-item label="icon" prop="icon">
          <el-input v-model="form.dialogData.icon" style="width: 250px;" placeholder="请输入icon">
          </el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="form.dialogData.status" active-text="是"
                     inactive-text="否" active-value="0" inactive-value="1" inline-prompt class="ml-2"/>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleAreaClose">取消</el-button>
          <el-button type="primary" @click="editDialogConfirm">确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
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
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
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

import { reactive, ref } from "vue";
import { getToken } from "@/utils/auth";


import { createApplicationAPI, updateApplicationAPI, deleteApplicationAPI, findApplicationListAPI } from "@/api/system/maintenance/application";



import { ElMessage } from 'element-plus'
//是否有显示搜索框
const showSearch = ref(true);

const { proxy } = getCurrentInstance();

const loading = ref(true);
//搜索框 下拉选项

//列表 
//列头
const tableColumn = [
  {
    label: '编码',
    prop: 'code',
    align: 'left',
    width: '',
    minWidth: '60'
  },
  {
    label: '名称',
    prop: 'platformName',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: 'things账号',
    prop: 'thingsUser',
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    label: 'things密码',
    prop: 'thingsPass',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: 'ProfileId',
    prop: 'deviceProfileId',
    align: 'left',
    width: '',
    minWidth: '200'
  },
  {
    label: '是否启用',
    prop: 'status',
    align: 'center',
    width: '',
    minWidth: '80'
  },
  {
    label: 'prefix',
    prop: 'prefix',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: 'icon',
    prop: 'icon',
    align: 'left',
    width: '',
    minWidth: '80'
  },
]


//查询参数
let queryParams = ref({
  code: null,
  platformName: null,
  thingsUser: null,
  thingsPass: null,
  deviceProfileId: null,
  pageSize: 10,
  pageNum: 1,
});

//查询重置  
const resetClick = () => {
  queryParams.value = {
    code: null,
    platformName: null,
    thingsUser: null,
    thingsPass: null,
    deviceProfileId: null,
    pageSize: 10,
    pageNum: 1,
  }
  getListData()
}

const total = ref(0)

//获得列表数据
const tableData = ref([]);
const getListData = () => {
  loading.value = true;
  tableData.value = []
  findApplicationListAPI(queryParams.value)
    .then((res) => {
      loading.value = false;
      tableData.value = res.rows;
      total.value = res.total
    })
    .finally(() => {
      loading.value = false;
    });
}

//弹窗显示定义
const visible = reactive({
  createVisible: false,
  editVisible: false
})

//弹窗数据定义
let form = reactive({
  dialogData: {
    code: null,
    platformName: null,
    thingsUser: null,
    thingsPass: null,
    deviceProfileId: null,
    platformId: null,
    prefix:null,
    icon:null,
    status:null,
  }
})


const handleAreaClose = () => {
  //关闭弹窗前清空所有数据
  form.dialogData = {
    code: null,
    platformName: null,
    thingsUser: null,
    thingsPass: null,
    deviceProfileId: null,
  }
  visible.createVisible = false
  visible.editVisible = false
}

//新增弹窗提交
const createDialogConfirm = () => {
  proxy.$refs["createDialog"].validate((valid) => {//校验是否通过
    if (valid) {
      createApplicationAPI(form.dialogData).then(res => {
        ElMessage({
          message: '新增数据成功!',
          type: 'success',
        })
        visible.createVisible = false
        getListData()
      }).catch(err => {
        ElMessage({
          message: '服务器异常',
          type: 'error',
        })
      }).finally(() =>{
        handleAreaClose()
      })
    }
  })
}

//编辑弹窗数据回显
const editBtn = (row) => {
  form.dialogData = {
    code: row.code,
    platformName: row.platformName,
    thingsUser: row.thingsUser,
    thingsPass: row.thingsPass,
    deviceProfileId: row.deviceProfileId,
    prefix: row.prefix,
    icon: row.icon,
    status: row.status,
  }
  form.dialogData['platformId'] = row.platformId;
  visible.editVisible = true
}

//编辑弹窗提交
const editDialogConfirm = async () => {
  proxy.$refs["editDialog"].validate((valid) => {
    if (valid) {
      updateApplicationAPI(form.dialogData).then(res => {
        ElMessage({
          message: '编辑数据成功!',
          type: 'success',
        })
        visible.editVisible = false
        getListData()
      }).catch(err => {
        ElMessage({
          message: '服务器异常',
          type: 'error',
        })
      }).finally(() =>{
        handleAreaClose()
      })
    }
  });
}

//删除按钮
const deleteRow = (row) => {
  proxy.$modal.confirm('是否确认删除编码为"' + row.code + '"的数据项？').then(() => deleteApplicationAPI(row.platformId)).then(() => {
    getListData()
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });

}

//弹窗规则
const rules = reactive({
  dialogRules: {
    code: [{ required: true, message: "请输入编码", trigger: "blur" }],
    platformName: [{ required: true, message: "请输入名称", trigger: "blur" }],
    thingsUser: [{ required: true, message: "请输入things账号", trigger: "blur" }],
    thingsPass: [{ required: true, message: "请输入things密码", trigger: "blur" }],
    deviceProfileId: [{ required: true, message: "请输入ProfileId", trigger: "blur" }],
    prefix: [{ required: true, message: "请输入prefix", trigger: "blur" }],
    icon: [{ required: true, message: "请输入icon", trigger: "blur" }],
  },
});

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
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/platform/importData"
});

/** 导入按钮操作 */
function handleImport () {
  upload.title = "应用管理导入";
  upload.open = true;
};
/** 下载模板操作 */
function importTemplate () {
  proxy.download("system/platform/exportTemple", {
  }, `应用管理导入模板_${new Date().getTime()}.xlsx`);
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
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  getListData();
};
/** 提交上传文件 */
function submitFileForm () {
  proxy.$refs["uploadRef"].submit();
};

/** 导出按钮操作 */
function handleExport () {
  proxy.download("system/platform/export",
    queryParams.value
    , `应用管理导出_${new Date().getTime()}.xlsx`);
};


getListData()
</script>
<style lang="scss" scoped>
$open: #19B21E;
$close: #FA9600;
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
.open {
  @extend .status;
  color: $open;

  div {
    background: $open;
  }
}

.close {
  @extend .status;
  color: $close;

  div {
    background: $close;
  }
}
</style>