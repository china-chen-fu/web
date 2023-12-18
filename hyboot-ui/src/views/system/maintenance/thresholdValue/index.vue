<template>
    <div class="page-container">
        <div class="content">
            <div class="search" v-show="showSearch">

                <div class="tab-bar">
                    <!-- tab 切换 -->
                    <el-tabs v-model="activeName" class="tabs" @tab-change="tabChange">
                        <el-tab-pane label="用电模板" name="power"></el-tab-pane>
                        <el-tab-pane label="用水模板" name="water"></el-tab-pane>
                    </el-tabs>
                </div>
                <!-- 查询框及按钮 -->
                <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px" >
                    <el-form-item label="表具型号">
                        <el-select v-model="queryParams.deviceModelId" class="m-2" placeholder="请选择表具型号" size="default"
                            style="width: 240px;" clearable>
                            <el-option v-for="item in options" :key="item.deviceModelId" :label="item.modelName"
                                :value="item.deviceModelId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="模板名称" prop="templateName">
                        <el-input v-model="queryParams.templateName" style="width: 240px;" placeholder="请输入模板名称">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="button-container">
                        <el-button type="primary" icon="Search" @click="getListData"
                            v-hasPermi="['chaoyang:template:list']">搜索</el-button>
                        <el-button icon="Refresh" @click="resetClick"
                            v-hasPermi="['chaoyang:template:list']">重置</el-button>
                    </el-form-item>
                </el-form>

            </div>
            <div class="table">
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="Plus" @click="createDialog"
                            v-hasPermi="['chaoyang:template:add']">新增
                        </el-button>
                    </el-col>
                    <right-toolbar v-model:showSearch="showSearch" @queryTable="getListData"></right-toolbar>
                </el-row>

                <el-table v-loading="loading" element-loading-text="加载中..." :data="tableData" style="width: 100%;" border class="customer-table"
                    :header-cell-style="{ 'text-align': 'center' }" name="table">

                    <el-table-column type="index" label="序号" width="60" fixed align="center" />
                    <el-table-column v-for="(item, index) in tableColumn" :key="index" :label="item.label"
                        :prop="item.prop" :align="item.align" :min-width="item.minWidth" :width="item.width" />

                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
                        <template #default="scope">
                            <el-button type="text" icon="Edit" @click="editBtn(scope.row)"
                                v-hasPermi="['chaoyang:template:edit']">编辑</el-button>
                            <el-button type="text" icon="Delete" @click="deleteRow(scope.row)"
                                v-hasPermi="['chaoyang:template:remove']">删除</el-button>

                        </template>
                    </el-table-column>

                </el-table>
                <pagination class="pagination" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                    v-model:limit="queryParams.pageSize" @pagination="getListData" />

            </div>
        </div>

        <!-- 新增弹框 -->
        <el-dialog title="新增" v-model="visible.createVisible" append-to-body destroy-on-close
            :before-close="handleAreaClose" width="500px">
            <el-form class="area-form" ref="createDialogRef" :model="form.createDialog" :rules="rules.createDialogRules"
                label-width="100px">
                <el-form-item label="模板名称" prop="templateName">
                    <el-input v-model="form.createDialog.templateName" style="width: 250px;" placeholder="请选择模板名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="表具型号" prop="deviceModelId">
                    <el-select v-model="form.createDialog.deviceModelId" class="m-2" placeholder="请选择表具型号"
                        size="default" style="width: 250px;">
                        <el-option v-for="item in options" :key="item.deviceModelId" :label="item.modelName"
                            :value="item.deviceModelId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="单价" prop="price">
                    <el-input v-model="form.createDialog.price" style="width: 250px;"     oninput="value=value.replace(/[^0-9.]/g,'')">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="下限阈值" prop="threshold">
                    <el-input v-model="form.createDialog.threshold" style="width: 250px;" placeholder="请输入下限阈值"
                        oninput="value=value.replace(/[^0-9.]/g,'')">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.createDialog.remark" style="width: 250px;" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleAreaClose">取消</el-button>
                    <el-button type="primary" @click="createDialogConfirm(form)">确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 编辑弹窗 -->
        <el-dialog title="编辑" v-model="visible.editVisible" append-to-body destroy-on-close
            :before-close="handleAreaClose" width="500px">
            <el-form class="area-form" ref="editDialogRef" :model="form.editDialog" :rules="rules.editDialogRules"
                label-width="100px">
                <el-form-item label="模板名称" prop="templateName">
                    <el-input v-model="form.editDialog.templateName" style="width: 250px;" placeholder="请选择模板名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="表具型号" prop="deviceModelId">
                    <el-select v-model="form.editDialog.deviceModelId" class="m-2" placeholder="请选择表具型号" size="default"
                        style="width: 250px;" disabled>
                        <el-option v-for="item in options" :key="item.deviceModelId" :label="item.modelName"
                            :value="item.deviceModelId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="单价" prop="price">
                    <el-input v-model="form.editDialog.price" style="width: 250px;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="下限阈值" prop="threshold">
                    <el-input v-model="form.editDialog.threshold" style="width: 250px;" placeholder="请输入下限阈值"
                        oninput="value=value.replace(/[^0-9.]/g,'')">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.editDialog.remark" style="width: 250px;" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleAreaClose">取消</el-button>
                    <el-button type="primary" @click="editDialogConfirm(form)">确定
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
                    <upload-filled />
                </el-icon>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <template #tip>
                    <div class="el-upload__tip text-center">
                        <div class="el-upload__tip">
                            <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                        </div>
                        <span>仅允许导入xls、xlsx格式文件。</span>
                        <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                            @click="importTemplate">下载模板</el-link>
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

import { reactive, ref ,watch } from "vue";
import { getToken } from "@/utils/auth";
import { createThresholdValue, updateThresholdValue, deleteThresholdValue, getListTableType, getList } from '@/api/payment/thresholdValue'
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance();
//判断是哪个模板
//定义个全局的templateType

const activeName = ref('power')
//空值模板类型
let templateType =0
const tabChange = (name) => {
    templateType = name == 'power' ? 0 : 1
    queryParams.value = {
        templateType,
        templateName: null,
        deviceModelId: null,
        pageSize: 10,
        pageNum: 1,
    }
    getTableTypeOptions()
    getListData()
}


//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(true);

//列表 列头
const tableColumn = [
    {
        label: '模板名称',
        prop: 'templateName',
        align: 'left',
        width: '',
        minWidth: '100'
    },
    {
        label: '表具型号',
        prop: 'modelName',
        align: 'left',
        width: '',
        minWidth: '200'
    },
    {
        label: '单价(元)',
        prop: 'price',
        align: 'right',
        width: '',
        minWidth: '60'
    },
    {
        label: '下限阈值(元)',
        prop: 'threshold',
        align: 'right',
        width: '',
        minWidth: '60'
    },
    {
        label: '关联表具(个)',
        prop: 'deviceNumber',
        align: 'right',
        width: '',
        minWidth: '60'
    },
    {
        label: '备注',
        prop: 'remark',
        align: 'left',
        width: '',
        minWidth: '100'
    },
]
const total = ref(0)

//查询条件
let queryParams = ref({
    templateType,
    templateName: null,
    deviceModelId: null,
    pageSize: 10,
    pageNum: 1,
});

//查询重置
const resetClick = () => {
    queryParams.value = {
        templateType,
        templateName: null,
        deviceModelId: null,
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
    getList(queryParams.value)
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
        templateType
    },
    editDialog: {
        templateName: null,
        deviceModelId: null,
        price: "0.75",
        threshold: null,
        remark: null,
        templateType
    },

})

const handleAreaClose = () => {
    form.createDialog.templateName = null
    form.createDialog.deviceModelId = null
    form.createDialog.threshold = null
    form.createDialog.remark = null
    visible.createVisible = false
    visible.editVisible = false

}

const createDialog=()=>{
    getTableTypeOptions()
    visible.createVisible = true
}


//新增弹窗提交
const createDialogConfirm = async (payload) => {
    proxy.$refs["createDialogRef"].validate((valid) => {
        if (valid) {
            let params = {
                templateName: form.createDialog.templateName,
                deviceModelId: form.createDialog.deviceModelId,
                templateType,
                price: form.createDialog.price,
                threshold: form.createDialog.threshold,
                remark: form.createDialog.remark,

            }
     
            createThresholdValue(params).then(res => {
                ElMessage({
                    message: '用电模板添加成功!',
                    type: 'success',
                })
                getListData()
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
    proxy.$refs["editDialogRef"].validate((valid) => {
        if (valid) {
            let params = {
                templateName: form.editDialog.templateName,
                deviceModelId: form.editDialog.deviceModelId,
                templateType,
                price: form.editDialog.price,
                threshold: form.editDialog.threshold,
                remark: form.editDialog.remark,
                templateId: form.editDialog.templateId,
            }
            updateThresholdValue(params).then(res => {
                ElMessage({
                    message: '用电模板编辑成功!',
                    type: 'success',
                })
              getListData()
            }).catch(err => { }).finally(() => {
                handleAreaClose()
            })
        }
    });
}

//删除按钮
const deleteRow = (row) => {
    proxy.$modal.confirm('确定是否进行删除操作？').then(() => deleteThresholdValue(row.templateId)).then(() => {
        getListData()
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => { });

}


//弹窗规则
const rules = reactive({
    createDialogRules: {
        templateName: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        deviceModelId: [{ required: true, message: "请输入表具型号", trigger: "change" }],
        price: [{ required: true,message: "请输入单价", trigger: "blur" }],
        threshold: [{ required: true, message: "请输入下限阈值", trigger: "blur" }],
        remark: [{}],
    },
    editDialogRules: {
        templateName: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        deviceModelId: [{ required: true, message: "请输入表具型号", trigger: "change" }],
        price: [{ required: true,message: "请输入单价", trigger: "blur" }],
        threshold: [{ required: true, message: "请输入下限阈值", trigger: "blur" }],
        remark: [{}],
    },
});



//下拉
let options = ref([])
async function getTableTypeOptions() {
    await getListTableType({ modelType: templateType }).then(res => {
        options.value = res.rows
    })
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
function handleImport() {
    upload.title = "用户导入";
    upload.open = true;
};
/** 下载模板操作 */
function importTemplate() {
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
function submitFileForm() {
    proxy.$refs["uploadRef"].submit();
};

/** 导出按钮操作 */
function handleExport() {
    proxy.download("system/template/export", {
        ...queryParams.value,
    }, `user_${new Date().getTime()}.xlsx`);
};
getTableTypeOptions()
getListData()
</script>
<style lang="scss" scoped>

    $bar--active--color: #546fff;
.tab-bar {

    .el-tabs__nav-wrap::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: transparent !important;
        height: 2px;
        z-index: var(--el-index-normal);
    }

    .el-tabs__item:hover {
        color:  $bar--active--color !important;
    }

    .el-tabs__active-bar {
        background-color:  $bar--active--color !important;
    }

    .el-tabs__item.is-active {
    color: $bar--active--color;
}
}
</style>


