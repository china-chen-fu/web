<template>

  <div class="page-container">
    <div class="content" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中...">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="true">
          <el-form-item label="在线状态">
            <el-select v-model="queryParams.online" placeholder="请选择在线状态" size="default" style="width: 200px;">
              <el-option v-for="item in onlineOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="表具类型">
            <el-select v-model="queryParams.deviceType" placeholder="请选择表具类型" size="default" style="width: 200px;">
              <el-option v-for="item in deviceTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="表具型号" prop="deviceModel">
            <el-input v-model="queryParams.deviceModel" style="width: 240px" placeholder="请输入表具型号">
            </el-input>
          </el-form-item>

          <!-- <el-form-item label="表具型号">
                        <el-select v-model="queryParams.deviceModel" placeholder="请选择表具型号" size="default"
                            style="width: 200px;">
                            <el-option v-for="item in deviceModelIdOptions" :key="item.deviceModel"
                                :label="item.deviceModel" :value="item.deviceModel" />
                        </el-select>
                    </el-form-item> -->

          <el-form-item label="表具编号" prop="number">
            <el-input v-model="queryParams.number" style="width: 200px;" placeholder="请输入表具编号">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getListData" v-hasPermi="['chaoyang:device:sync:query']">搜索</el-button>
            <el-button icon="Refresh" @click="resetClick" v-hasPermi="['chaoyang:device:sync:query']">重置</el-button>
          </el-form-item>
        </el-form>


      </div>
      <div class="table">
        <el-row :gutter="10" class="mb8">
          <!--                    <el-button type="success" plain icon="TopLeft" @click="syncInfo"-->
          <!--                        v-loading.fullscreen.lock="fullscreenLoading" v-hasPermi="['chaoyang:device:sync']">-->
          <!--                        同步-->
          <!--                    </el-button>-->

          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['chaoyang:device:sync:export']">导出</el-button>
          </el-col>

          <right-toolbar v-model:showSearch="showSearch" @queryTable="getListData"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="tableData" style="width: 100%;" border class="customer-table" :header-cell-style="{ 'text-align': 'center' }" name="table" element-loading-text="加载中...">

          <el-table-column type="index" label="序号" width="60" fixed align="center" />
          <el-table-column v-for="(item, index) in tableColumn" :key="index" :label="item.label" :prop="item.prop" :align="item.align" :min-width="item.minWidth" :width="item.width">
            <template #default="scope" v-if="item.label == '在线状态'">
              <div style="display: flex; align-items: center;justify-content: center;">

                <div :class="scope.row.online == '在线' ? 'online' : 'offline'">


                </div>
                <span>
                  {{ scope.row.online == '在线' ? '在线' : '离线' }}
                </span>
              </div>
            </template>
          </el-table-column>

        </el-table>
        <pagination class="pagination" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getListData" />
      </div>
    </div>

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

import { getListDevice, createDevice, updateDevice, syncDeviceInfo, getDeviceModelIdOptions } from "@/api/system/maintenance/deviceManage";
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance();
//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(true);
let fullscreenLoading = ref(false)
//搜索框 下拉选项
const onlineOptions = reactive(
  [
    { label: '全部', value: '' },
    { label: '在线', value: 0 },
    { label: '离线', value: 1 }
  ]);
const deviceTypeOptions = reactive(
  [
    { label: '全部', value: '' },
    { label: '电表', value: '0' },
    { label: '水表', value: '1' },
    { label: '灯光控制器', value: '2' },
    { label: '火警控制器', value: '3' }
  ]);
const deviceModelIdOptions = ref([])
//表具型号请求
async function getTableTypeOptions () {
  await getDeviceModelIdOptions().then(res => {
    deviceModelIdOptions.value = deviceModelIdOptions.value.concat(res.rows)
    //第一项前面加空值方便全局查询

  })
}
getTableTypeOptions()
//列表 列头
const tableColumn = [
  {
    label: '表具名称',
    prop: 'name',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '表具编号',
    prop: 'number',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '表具型号',
    prop: 'deviceModel',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '关联摊位',
    prop: 'stallName',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '表具类型',
    prop: 'deviceType',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '在线状态',
    prop: 'online',
    align: 'center',
    width: '',
    minWidth: '100'
  },
  {
    label: '用能模版',
    prop: 'templateName',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '单价',
    prop: 'price',
    align: 'right',
    width: '',
    minWidth: '100'
  },
  {
    label: '最后示数',
    prop: 'indication',
    align: 'right',
    width: '',
    minWidth: '100'
  },
  {
    label: '采集时间',
    prop: 'indicationTime',
    align: 'center',
    width: '160',
    minWidth: '100'
  },
  {
    label: '网关编号',
    prop: 'wayNumber',
    align: 'left',
    width: '',
    minWidth: '100'
  },
]


//查询参数
const total = ref(0)
let queryParams = ref({
  online: null,
  deviceType: null,
  templateName: null,
  deviceModel: null,

  pageSize: 10,
  pageNum: 1,
});

//查询重置
const resetClick = () => {
  queryParams.value = {
    online: null,
    deviceType: null,
    templateName: null,
    deviceModel: null,
    pageSize: 10,
    pageNum: 1,
  }
  getListData()
}


//获得列表数据
const tableData = ref([]);
const getListData = () => {
  loading.value = true;
  tableData.value = []
  getListDevice(queryParams.value)
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
  createDialog: {
    templateName: null,
    deviceModelId: null,
    price: "0.75",
    threshold: null,
    remark: null,
  },
  editDialog: {
    templateName: null,
    deviceModelId: null,
    price: "0.75",
    threshold: null,
    remark: null,
  },

})


//弹窗显示改变
const createDialog = () => {
  visible.createVisible = true
}

const handleAreaClose = () => {

  form.createDialog.templateName = null,
    form.createDialog.deviceModelId = null,
    form.createDialog.threshold = null,
    form.createDialog.remark = null,
    visible.createVisible = false
  visible.editVisible = false

}


//新增弹窗提交
const createDialogConfirm = async (payload) => {
  proxy.$refs["createDialog"].validate((valid) => {
    if (valid) {
      let params = {
        templateName: form.createDialog.templateName,
        deviceModelId: form.createDialog.deviceModelId,
        price: form.createDialog.price,
        threshold: form.createDialog.threshold,
        remark: form.createDialog.remark,

      }
      getListData()
      createDevice(params).then(res => {
        ElMessage({
          message: '用电模板添加成功!',
          type: 'success',
        })
      }).catch(err => { }).finally(() => {
        handleAreaClose()
      })
    }
  });
}

//编辑弹窗数据回显
const editBtn = (row) => {
  form.editDialog.templateName = row.templateName;
  form.editDialog.deviceModelId = row.deviceModelId;
  form.editDialog.price = row.price;
  form.editDialog.threshold = row.threshold;
  form.editDialog.remark = row.remark;
  form.editDialog['templateId'] = row.templateId;
  visible.editVisible = true
}

//编辑弹窗提交
const editDialogConfirm = async (payload) => {
  proxy.$refs["editDialog"].validate((valid) => {
    if (valid) {
      let params = {
        templateName: form.editDialog.templateName,
        deviceModelId: form.editDialog.deviceModelId,
        price: form.editDialog.price,
        threshold: form.editDialog.threshold,
        remark: form.editDialog.remark,
        templateId: form.editDialog.templateId,
      }
      getListData()
      updateDevice(params).then(res => {
        ElMessage({
          message: '用电模板编辑成功!',
          type: 'success',
        })
      }).catch(err => { }).finally(() => {
        handleAreaClose()
      })
    }
  });
}

//删除按钮
const deleteRow = (row) => {
  deleteDevice(row.templateId).then(res => {
    ElMessage({
      message: '删除模板成功!',
      type: 'success',
    })
  }).finally(() => {
    getListData()
  })
}


//弹窗规则
const rules = reactive({
  createDialogRules: {
    templateName: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
    deviceModelId: [{ required: true, message: "请输入表具型号", trigger: "change" }],
    price: [{ disabled: true, trigger: "blur" }],
    threshold: [{ required: true, message: "请输入下限阈值", trigger: "blur" }],
    remark: [{}],
  },
  editDialogRules: {
    templateName: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
    deviceModelId: [{ required: true, disabled: true, message: "请输入表具型号", trigger: "change" }],
    price: [{ disabled: true, message: "请输入手机号码", trigger: "blur" }],
    threshold: [{ required: true, message: "请输入下限阈值", trigger: "blur" }],
    remark: [{}],
  },
});


//数据同步

const syncInfo = () => {
  fullscreenLoading.value = true;
  syncDeviceInfo().then(res => {
    ElMessage({
      type: 'success',
      message: '表具数据同步成功!'
    })
  }).finally(() => {
    fullscreenLoading.value = false;
  });
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
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/template/importData"
});

/** 导入按钮操作 */
function handleImport () {
  upload.title = "用户导入";
  upload.open = true;
};
/** 下载模板操作 */
function importTemplate () {
  proxy.download("system/template/importData", {
  }, `user_template_${new Date().getTime()}.xlsx`);
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
  proxy.download("system/device/export", {
    ...queryParams.value,
  }, `表具管理导出_${new Date().getTime()}.xlsx`);
};

getListData()
</script>
<style lang="scss" scoped>
.offline {
  background: red;
  border-radius: 50%;
  -webkit-box-shadow: 0 4px 4px rgb(255 0 0 / 33%);
  box-shadow: 0 4px 4px rgb(255 0 0 / 33%);
  height: 13px;
  margin-right: 10px;
  width: 13px;
}

.online {
  background: #0ddf54;
  border-radius: 50%;
  -webkit-box-shadow: 0 4px 4px rgb(13 223 84 / 33%);
  box-shadow: 0 4px 4px rgb(13 223 84 / 33%);
  height: 13px;
  margin-right: 10px;
  width: 13px;
}
</style>


