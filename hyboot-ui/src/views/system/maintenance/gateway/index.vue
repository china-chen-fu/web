<template>
  <div>
    <div class="page-container">
      <div class="content" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中...">
        <div class="search" v-show="showSearch">
          <!-- 查询框及按钮 -->
          <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px" label-position="left">
            <el-form-item label="网关编号" prop="number">
              <el-input v-model="queryParams.number" style="width: 200px;" placeholder="请输入网关编号">
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="Search" @click="getListData" v-hasPermi="['chaoyang:gateway:query']">搜索
              </el-button>
              <el-button icon="Refresh" @click="resetClick" v-hasPermi="['chaoyang:gateway:query']">重置
              </el-button>
            </el-form-item>
          </el-form>

        </div>
        <div class="table" ref="tableWrapper">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="createDialogMethod"
                         v-hasPermi="['chaoyang:gateway:add']">新增
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="info" plain icon="Upload" @click="handleImport('gateway')"
                         v-hasPermi="['chaoyang:gateway:import']">批量导入网关
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="info" plain icon="Upload" @click="handleImport('device')"
                         v-hasPermi="['chaoyang:gateway:device:import']">批量导入表具
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="warning" plain icon="Download" @click="handleExport('gateway')"
                         v-hasPermi="['chaoyang:gateway:export']">导出
              </el-button>
            </el-col>

            <el-col :span="1.5">
              <el-button type="success" plain @click="clockGateway" icon="Loading"
                         v-hasPermi="['chaoyang:gateway:ping']">
                更新在线状态（ping）
              </el-button>
            </el-col>

            <el-col :span="1.5">
              <el-button type="success" plain @click="upgradeGateway" v-loading.fullscreen.lock="fullscreenLoading"
                         icon="Top" v-hasPermi="['chaoyang:gateway:upgrade']">
                升级程序
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="success" plain @click="restartGateway" v-loading.fullscreen.lock="fullscreenLoading"
                         icon="RefreshRight" v-hasPermi="['chaoyang:gateway:restart']">
                重启
              </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getListData"></right-toolbar>
          </el-row>

          <el-table v-loading="loading" :max-height="tableHeight" element-loading-text="加载中..." :data="tableData"
                    style="width: 100%;" border class="customer-table" :header-cell-style="{ 'text-align': 'center' }"
                    name="table" @selection-change="handleSelectionChange" ref="multipleTableRef">

            <el-table-column type="selection" width="40" align="center"/>

            <el-table-column v-for="(item, index) in tableColumn" :key="index" :label="item.label" :prop="item.prop"
                             :align="item.align" :min-width="item.minWidth" :width="item.width">
              <template #default="scope" v-if="item.label == '在线状态'">
                <div style="display: flex; align-items: center;justify-content: center;">
                  <div :class="scope.row.online == '0' ? 'online' : 'offline'">

                  </div>
                  <span>
                    {{ scope.row.online == '0' ? '在线' : '离线' }}
                  </span>
                </div>
              </template>

              <template #default="scope" v-if="item.label == 'IP'">
                <div style="display: flex; align-items: center;justify-content: center;">
                  <a :href="`http://${scope.row.ipr}`" target="_blank" class="ipr">{{
                      scope.row.ipr
                    }}</a>
                </div>
              </template>

            </el-table-column>

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="280">
              <template #default="scope">
                <el-button type="text" icon="Edit" @click="editBtn(scope.row)" v-hasPermi="['chaoyang:gateway:edit']">编辑
                </el-button>
                <el-button type="text" icon="Search" @click="linkDevices(scope.row)"
                           v-hasPermi="['chaoyang:gateway:device:view']">查看表具
                </el-button>
                <el-button type="text" icon="Delete" @click="deleteRow(scope.row)"
                           v-hasPermi="['chaoyang:gateway:remove']">删除
                </el-button>

              </template>
            </el-table-column>

          </el-table>
        </div>
      </div>
    </div>

    <el-dialog title="新增" v-model="visible.createVisible" append-to-body destroy-on-close
               :before-close="handleAreaClose" width="500px">
      <el-form class="area-form" ref="createDialogRef" :model="form.createDialog" :rules="rules.dialogRules"
               label-width="150px">
        <el-form-item label="网关编号" prop="number">
          <el-input v-model="form.createDialog.number" style="width: 250px;" placeholder="请输入网关编号">
          </el-input>
        </el-form-item>
        <el-form-item label="网关IP" prop="ipr">
          <el-input v-model="form.createDialog.ipr" style="width: 250px;" placeholder="请输入网关IP">
          </el-input>
        </el-form-item>
        <el-form-item label="MQTT用户名称" prop="mqttUser">
          <el-input v-model="form.createDialog.mqttUser" style="width: 250px;" placeholder="请输入MQTT用户名称">
          </el-input>
        </el-form-item>
        <el-form-item label="MQTT用户密码" prop="mqttPass">
          <el-input v-model="form.createDialog.mqttPass" style="width: 250px;" placeholder="请输入MQTT用户密码">
          </el-input>
        </el-form-item>
        <el-form-item label="安装地址" prop="address">
          <el-input v-model="form.createDialog.address" style="width: 250px;" placeholder="请输入安装地址">
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
    <el-dialog title="编辑" v-model="visible.editVisible" append-to-body destroy-on-close :before-close="handleAreaClose"
               width="500px">
      <el-form class="area-form" ref="editDialogRef" :model="form.editDialog" :rules="rules.dialogRules"
               label-width="150px">
        <el-form-item label="网关编号" prop="number">
          <el-input v-model="form.editDialog.number" style="width: 250px;" placeholder="请输入网关编号" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="网关IP" prop="ipr">
          <el-input v-model="form.editDialog.ipr" style="width: 250px;" placeholder="请输入网关IP">
          </el-input>
        </el-form-item>
        <el-form-item label="MQTT用户名称" prop="mqttUser">
          <el-input v-model="form.editDialog.mqttUser" style="width: 250px;" placeholder="请输入MQTT用户名称">
          </el-input>
        </el-form-item>
        <el-form-item label="MQTT用户密码" prop="mqttPass">
          <el-input v-model="form.editDialog.mqttPass" style="width: 250px;" placeholder="请输入MQTT用户密码">
          </el-input>
        </el-form-item>
        <el-form-item label="安装地址" prop="address">
          <el-input v-model="form.editDialog.address" style="width: 250px;" placeholder="请输入安装地址">
          </el-input>
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
    <!-- 表具弹框 -->
    <el-dialog :title="devicesDialogTitle" v-model="visible.devicesVisible" append-to-body destroy-on-close
               :before-close="devicesClose" width="860px">
      <el-form class="area-form" ref="devicesDialogRef" :model="form.devicesDialog" :rules="rules.drawerDialogRules"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="表具编号" prop="number">
              <el-input v-model="form.devicesDialog.number" style="width: 250px;" placeholder="请输入表具编号">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表具名称" prop="name">
              <el-input v-model="form.devicesDialog.name" style="width: 250px;" placeholder="请输入表具名称">
              </el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="表具类型" prop="deviceType">
              <el-select v-model="form.devicesDialog.deviceType" class="m-2" placeholder="请输入表具类型" size="default"
                         style="width: 250px;" @change="deviceTypeOptionsChange">
                <el-option v-for="item in deviceTypeOptions" :key="item.deviceType" :label="item.deviceTypeName"
                           :value="item.deviceType"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备型号" prop="deviceModel">
              <el-input v-model="form.devicesDialog.deviceModel" style="width: 250px;" placeholder="请输入设备型号">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模板" prop="templateId" ref="templateIdRef">
              <el-select v-model="form.devicesDialog.templateId" class="m-2" placeholder="请选择模板" size="default"
                         style="width: 250px;" filterable @change="templateOptionsChange" :clearable='true' @clear="clearTemplateId">
                <el-option v-for="item in templateOptions" :key="item.templateId" :label="item.templateName"
                           :value="item.templateId"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价" prop="price">
              <el-input v-model="form.devicesDialog.price" style="width: 250px;" placeholder="请选择模板"
                        oninput="value=value.replace(/[^0-9.]/g,'')" disabled>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="通讯地址" prop="deviceAddr">
              <el-input v-model="form.devicesDialog.deviceAddr" style="width: 250px;" placeholder="请输入通讯地址">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="采集地址" prop="collectName">
              <el-select v-model="form.devicesDialog.collectName" class="m-2" placeholder="请选择采集地址" size="default"
                         style="width: 250px;">
                <el-option v-for="item in [{ collectName: 'RS485-1' }, { collectName: 'RS485-2' }]"
                           :key="item.collectName" :label="item.collectName" :value="item.collectName"/>
              </el-select>
            </el-form-item>
          </el-col>


        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="所属网关" prop="gatewayId">
              <el-select v-model="form.devicesDialog.gatewayId" class="m-2" placeholder="请选择所属网关" size="default"
                         style="width: 250px;">
                <el-option v-for="item in gatewayOptions" :key="item.gatewayId" :label="item.number"
                           :value="item.gatewayId"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装地址" prop="installAddr">
              <el-input v-model="form.devicesDialog.installAddr" style="width: 250px;" placeholder="请输入安装地址">
              </el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="倍率" prop="rate">
              <el-input v-model="form.devicesDialog.rate" style="width: 250px;" placeholder="请输入倍率"
                        oninput="value=value.replace(/[^0-9]/g,'')">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否启用" prop="usable">
              <el-switch v-model="form.devicesDialog.usable" active-value="0" inactive-value="2"/>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>


          <el-col :span="12">
            <el-form-item label="是否总表" prop="mainDevice">
              <el-switch v-model="form.devicesDialog.mainDevice" active-value="0" inactive-value="2"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否充值金额" prop="supAmount">
              <el-switch v-model="form.devicesDialog.supAmount" :active-value="1" :inactive-value="0"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="能源分项" prop="energyTypeId">
              <el-select v-model="form.devicesDialog.energyTypeId" class="m-2" placeholder="请选择能源分项" size="default"
                         style="width: 250px;">
                <el-option v-for="item in energyTypeOptions" :key="item.energyTypeId" :label="item.energyName"
                           :value="item.energyTypeId"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.devicesDialog.remark" style="width: 250px;" placeholder="请输入备注">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用系统" prop="platformId">
              <el-select v-model="form.devicesDialog.platformId" placeholder="请选择应用系统" size="default" style="width: 200px;">
                <el-option v-for="item in platformOptions" :key="item.platformId" :label="item.platformName"
                           :value="item.platformId"/>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="devicesClose">取消</el-button>
          <el-button type="primary" @click="devicesDialogConfirm">确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 表具抽屉  :before-close="handleClose"关闭前是否加确认 -->
    <div>
      <el-drawer v-model="drawer" :title="drawerTitle" direction="rtl" size="85%"  @close="drawerClose"
                 :close-on-click-modal="true" :destroy-on-close="true" :append-to-body="true">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="left-area">
              <div class="left-area-button" style="margin-bottom: 10px;">
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
                    <el-input v-model="drawerQuery.number" placeholder="请输入表具编号"></el-input>
                  </el-col>
                  <el-col :span="1.5">
                    <el-select v-model="drawerQuery.online" placeholder="在线状态">
                      <el-option label="在线" :value="0"></el-option>
                      <el-option label="离线" :value="1"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="1.5">
                    <el-select v-model="drawerQuery.collectName" placeholder="设备型号">
                      <el-option label="RS485-1" :value="'RS485-1'"></el-option>
                      <el-option label="RS485-2" :value="'RS485-2'"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button icon="Refresh" @click="resetDrawerQuery">重置</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button icon="Search" type="primary" @click="getDevicesList">搜索</el-button>
                  </el-col>
                </el-row>
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" @click="createDeviceDialog"
                               v-hasPermi="['chaoyang:gateway:device:add']">
                      新增表具
                    </el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="warning" plain icon="Download" v-hasPermi="['chaoyang:gateway:device:export']"
                               @click="handleExport('device')">
                      导出
                    </el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="success" plain @click="refreshDeviceStatus"
                               v-loading.fullscreen.lock="fullscreenLoading" icon="Loading"
                               v-hasPermi="['chaoyang:gateway:device:refresh']">
                      刷新在线状态
                    </el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button type="danger" plain @click="handleDeleteAllDevices"
                               v-loading.fullscreen.lock="fullscreenLoading" icon="Delete"
                               v-hasPermi="['chaoyang:gateway:device:remove']">
                      一键删除
                    </el-button>
                  </el-col>
                  <!-- <el-button type="primary" plain icon="Plus" @click="handleClockVerify">一键时钟校验</el-button> -->
                </el-row>


              </div>
              <div class="left-area-table">
                <el-table v-loading="leftTableLoading" element-loading-text="加载中..." :max-height="leftTableHeight"
                          :data="deviceData" style="width: 100%;" border class="customer-table"
                          :header-cell-style="{ 'text-align': 'center' }" name="table">

                  <el-table-column type="index" label="序号" width="60" fixed align="center"/>
                  <el-table-column v-for="(item, index) in drawerLeftTableColumn" :key="index" :label="item.label"
                                   :prop="item.prop" :align="item.align" :min-width="item.minWidth" :width="item.width" :fixed="item.fixed">
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

                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
                    <template #default="scope">
                      <el-button type="text" icon="Edit" @click="editDrawerBtn(scope.row)"
                                 v-hasPermi="['chaoyang:gateway:device:edit']">编辑
                      </el-button>
                      <el-button type="text" icon="Delete" @click="deleteDrawerBtn(scope.row)"
                                 v-hasPermi="['chaoyang:gateway:device:remove']">删除
                      </el-button>

                    </template>
                  </el-table-column>

                </el-table>
              </div>

            </div>
          </el-col>


          <el-col :span="8">
            <div class="right-area" style="margin:40px 0 10px 0;">
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                  <el-button type="success" plain icon="TopLeft" @click="handleSyncDevice"
                             v-loading.fullscreen.lock="fullscreenLoading"
                             v-hasPermi="['chaoyang:gateway:device:sync']">
                    同步表具
                  </el-button>
                </el-col>

                <el-col :span="1.5">
                  <el-button type="success" plain icon="BottomRight" @click="handleGetRightTable"
                             v-loading.fullscreen.lock="fullscreenLoading" v-hasPermi="['chaoyang:gateway:device:get']">
                    获取表具
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <div class="right-area-table">
              <el-table v-loading="loading" element-loading-text="加载中..." :data="rightTableData" style="width: 100%;"
                        border class="customer-table" :header-cell-style="{ 'text-align': 'center' }" name="table">
                <el-table-column v-for="(item, index) in drawerRightTableColumn" :key="index" :label="item.label"
                                 :prop="item.prop" :align="item.align" :min-width="item.minWidth" :width="item.width"/>
              </el-table>
            </div>
          </el-col>
        </el-row>


      </el-drawer>
    </div>

  </div>

</template>
<script setup>
import {reactive, ref, onMounted, nextTick} from "vue";
import {getToken} from "@/utils/auth";
import {ElMessage} from 'element-plus'
import {
  createGatewayAPI,
  getPlatformOptionsAPI,
  deleteGatewayAPI,
  updateGatewayAPI,
  pingGatewayAPI,
  upgradeGatewayAPI,
  restartGatewayAPI,
  syncDeviceAPI,
  getRightTableDevicesAPI,
  deleteAllDevicesAPI,
  getDevicesAPI,
  switchClockAPI,
  refreshDeviceStatusAPI,
  findGatewayListAPI,
  createDeviceAPI,//创建网关下表具
  getEnergyTypeOptionsAPI,//能源分项下拉
  deleteDeviceAPI,//删除表具
  updateDeviceAPI,//编辑表具
  getTemplateOptionsAPI,//模板下拉
  getDeviceTypeEnumsAPI,//表据类型下拉
} from "@/api/system/maintenance/gateway";

const {proxy} = getCurrentInstance();

const loading = ref(true);
//是否有显示搜索框
const showSearch = ref(true);

//保存点开的网关Id
const gatewayId = ref()

const fullscreenLoading = ref(false)

let drawerQuery = reactive({
  online: null,
  collectName: null,
  number: null
})

//列表 列头
const tableColumn = [
  {
    label: '网关编号',
    prop: 'number',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: 'IP',
    prop: 'ipr',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '安装地址',
    prop: 'address',
    align: 'left',
    width: '',
    minWidth: '100'

  },
  {
    label: '在线状态',
    prop: 'online',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '用户名',
    prop: 'mqttUser',
    align: 'left',
    width: '100',
    minWidth: ''
  },
  {
    label: '密码',
    prop: 'mqttPass',
    align: 'left',
    width: '',
    minWidth: '100'
  },
]

//查询条件
let queryParams = ref({
  templateName: null,
  deviceTypeId: null
});

//查询重置
const resetClick = () => {
  queryParams.value = {
    templateName: null,
  }
  getListData()
}

//动态表格高度
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
    tableHeight.value = tableWrapper.value.getBoundingClientRect().height - 72
  })
}
onMounted(() => {
  fetTableHeight()
})

watch(showSearch, (newValue) => {
  fetTableHeight()
})


//获得列表数据
/** 选择条数
 */
const multiple = ref(true); // 没选择按钮置灰
const ids = ref([]);  //id集合
const handleSelectionChange = (selection) => {
  ids.value = selection.map(item => item.gatewayId);
  multiple.value = !selection.length;
};

const multipleTableRef = ref()
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


const tableData = ref([]);
const getListData = () => {
  loading.value = true;
  tableData.value = []
  findGatewayListAPI(queryParams.value)
      .then((res) => {
        loading.value = false;
        tableData.value = res;
      })
      .finally(() => {
        loading.value = false;
      });
}

//弹窗显示定义

const visible = reactive({
  createVisible: false,
  editVisible: false,
  devicesVisible: false
})

//弹窗数据定义
let form = reactive({
  createDialog: {number: null, ipr: null, mqttUser: null, mqttPass: null, address: null},
  editDialog: {number: null, ipr: null, mqttUser: null, mqttPass: null, address: null},
  devicesDialog: {
    number: null,
    name: null,
    gatewayId: gatewayId.value,
    deviceModel: null,
    deviceType: null,
    deviceAddr: null,
    templateId: null,
    collectName: null,
    templateName: null,
    energyTypeId: null,
    installAddr: null,
    rate: null,
    price: null,
    usable: '0',
    mainDevice: '2',
    supAmount: '1',
    remark: null,
    platformId:null,
  }
})

const handleAreaClose = () => {
  form.createDialog = {number: null, ipr: null, mqttUser: null, mqttPass: null, address: null}
  form.editDialog = {number: null, ipr: null, mqttUser: null, mqttPass: null, address: null}
  visible.createVisible = false
  visible.editVisible = false
}

//弹窗 系统下拉
const platformOptions = ref([])
const getPlatformOptions = () => {
  getPlatformOptionsAPI().then(res => {
    platformOptions.value = res.rows
  })
}

//新增
const createDialogMethod = () => {
  getPlatformOptions()
  visible.createVisible = true
}


//新增弹窗提交
const createDialogConfirm = () => {
  proxy.$refs["createDialogRef"].validate((valid) => {//校验是否通过
    if (valid) {
      createGatewayAPI(form.createDialog).then(res => {
        ElMessage({
          message: '新增数据成功!',
          type: 'success',
        })
        handleAreaClose()
        getListData()
      })
    }
  })
}

//编辑弹窗数据回显
const editBtn = async (row) => {
  //加载下拉数据
  getPlatformOptions()
  form.editDialog = {
    number: row.number,
    ipr: row.ipr,
    mqttUser: row.mqttUser,
    mqttPass: row.mqttPass,
    address: row.address,
    gatewayId: row.gatewayId,
  }
  visible.editVisible = true
}

//编辑弹窗提交
const editDialogConfirm = async (payload) => {
  proxy.$refs["editDialogRef"].validate((valid) => {
    if (valid) {
      updateGatewayAPI(form.editDialog).then(res => {
        ElMessage({
          message: '编辑数据成功!',
          type: 'success',
        })
        handleAreaClose()
        getListData()
      })
    }
  });
}

//删除按钮
const deleteRow = (row) => {
  proxy.$modal.confirm('是否确认删除网关编号为"' + row.number + '"的数据项？').then(() => deleteGatewayAPI(row.gatewayId)).then(() => {
    getListData()
    proxy.$modal.msgSuccess("删除成功");
  })
}

//弹窗规则
let rules = reactive({
  dialogRules: {
    number: [{required: true, message: "请输入网关编号", trigger: "blur"}],
    ipr: [
      {required: true, message: "请输入网关IP", trigger: "blur"},
      {validator: validateIP, trigger: "blur"}
    ],
    mqttUser: [{required: true, message: "请输入MQTT用户名称", trigger: "blur"}],
    mqttPass: [{required: true, message: "请输入MQTT用户密码", trigger: "blur"}],
    address: [{required: true, message: "请输入安装地址", trigger: "blur"}],
  },
  drawerDialogRules: {
    number: [{required: true, message: "请输入表具编号", trigger: "blur"}],
    name: [{required: true, message: "请输入表具名称", trigger: "blur"}],
    gatewayId: [{required: true, message: "请选择所属网关", trigger: "change"}],
    deviceType: [{required: true, message: "请选择表具类型", trigger: "change"}],
    deviceModel: [{required: true, message: "请输入设备型号", trigger: "blur"}],
    deviceAddr: [{required: true, message: "请输入通讯地址", trigger: "blur"}],
    collectName: [{required: true, message: "请输入采集地址", trigger: "change"}],
    templateId: [{required: true, message: "请选择模板", trigger: "change"}],
    platformId: [{required: true, message: "请选择应用系统", trigger: "change"}]
  }
});

//输入规则校验
/**
 * 是否合法IP地址
 * @param value
 * @param callback
 */
function validateIP(rule, value, callback) {
  if (!value)
    callback(new Error('请输入IP地址'))
  else {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的IP地址'))
    } else {
      callback()
    }
  }
}

// 更新在线状态
const clockGateway = () => {
  if (ids.value.length) {
    loading.value = true
    pingGatewayAPI(ids.value).then(res => {
      ElMessage({
        message: '更新在线状态成功!',
        type: 'success',
      })
      getListData()
    }).finally(() => {
      loading.value = false
    })
  } else {
    ElMessage({
      message: '未选择网关!',
      type: 'warning',
    })
  }
  toggleSelection()
}

// 升级程序
const upgradeGateway = () => {
  if (ids.value.length) {
    fullscreenLoading.value = true
    upgradeGatewayAPI(ids.value)
        .then(res => {
              fullscreenLoading.value = false
              ElMessage({
                message: '升级程序指令下发成功!',
                type: 'success',
              })
            }
        ).catch(() => {
      fullscreenLoading.value = false
    })
    toggleSelection()
  } else {
    ElMessage({
      message: '未选择网关!',
      type: 'warning',
    })
  }


}

//重启
const restartGateway = async () => {
  if (ids.value.length) {
    await proxy.$modal.confirm('是否确认重启所选网关？').then(
        () => {
          fullscreenLoading.value = true
          restartGatewayAPI(ids.value)
              .then(res => {
                    fullscreenLoading.value = false
                    ElMessage({
                      message: '重启指令下发成功!',
                      type: 'success',
                    })
                    toggleSelection()
                  }
              ).catch(() => {
            fullscreenLoading.value = false
          })
        }
    )
  } else {
    ElMessage({
      message: '未选择网关!',
      type: 'warning',
    })
  }
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
  url: import.meta.env.VITE_APP_BASE_API + "/system/gateway/import"
});

/** 导入按钮操作 */
function handleImport(payload) {
  if (payload == 'gateway') {
    upload.title = "网关导入"
    upload.url = import.meta.env.VITE_APP_BASE_API + "/system/gateway/import"
  } else if (payload == 'device') {
    upload.title = "表具导入"
    upload.url = import.meta.env.VITE_APP_BASE_API + "/system/gateway/devices/import"
  }
  upload.open = true;
};

/** 下载模板操作 */
function importTemplate() {
  if (upload.title == '网关导入')
    proxy.download("system/gateway/exportGatewaysTemple", {}, `网关导入模板_${new Date().getTime()}.xlsx`);
  else if (upload.title == '表具导入')
    proxy.download("system/gateway/devicesTemple/export", {}, `表具导入_${new Date().getTime()}.xlsx`);
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


/**网关 导出按钮操作 */
function handleExport(payload) {
  if (payload == 'gateway') {
    proxy.download("system/gateway/export", {
      ...queryParams.value,
    }, `网关导出表_${new Date().getTime()}.xlsx`);
  } else if (payload == 'device') {
    proxy.download(`system/gateway/devices/export?gatewayId=${gatewayId.value}`, {}, `表具导出表_${new Date().getTime()}.xlsx`);
  }
};


//表具抽屉
const drawerTitle = ref()
const drawer = ref(false)

const linkDevices = async (playload) => {
  drawerTitle.value = `网关编号： ${playload.number}`
  gatewayId.value = playload.gatewayId;
  //查询左侧表的数据
  getDevicesList()
  drawer.value = true
  fetDrawerTableHeight()
}

//监听数据的变化动态给高度

//请求下拉数据
const getListOptions = () => {
  getGatewayOptions()
  getTemplateOptions()
  getEnergyTypeOptions()
  getDeviceTypeOptions()
}

//新增表具
const createDeviceDialog = async () => {
  devicesDialogTitle.value = '新增表具'
  form.devicesDialog.gatewayId = gatewayId.value
  await getListOptions()
  await getPlatformOptions()
  rules.drawerDialogRules.templateId=[];
  visible.devicesVisible = true
}

//请求网关列表
const gatewayOptions = ref([])
const getGatewayOptions = () => {
  findGatewayListAPI().then((res) => {
    gatewayOptions.value = res
  })
}

//下拉模板列表
let templateOptions = ref([])
const getTemplateOptions = () => {
  getTemplateOptionsAPI().then(res => {
    templateOptions.value = res.rows
  })

}

//下拉类型列表
let deviceTypeOptions = ref([])
const getDeviceTypeOptions = () => {
  getDeviceTypeEnumsAPI().then(res => {
    deviceTypeOptions.value = res.data
  })

}

//表具类型变化
const templateIdRef=ref()
const deviceTypeOptionsChange=(val)=>{
  //电表  水表 改变模板是否必选

  if(val=='0'||val=='1'){
    rules.drawerDialogRules.templateId=[{required: true, message: "请选择模板", trigger: "change"}];
  }else{
    rules.drawerDialogRules.templateId=[];
  }

  nextTick(()=>{
    proxy.$refs["devicesDialogRef"].clearValidate()
  })
  templateIdRef.value.resetField()
}


const energyTypeOptions = ref([])
const getEnergyTypeOptions = () => {
  getEnergyTypeOptionsAPI().then((res) => {
    energyTypeOptions.value = res.data
    if (res?.data.length)
      energyTypeOptions.value = res.data.map(item => {
        item.energyTypeId = item.energyTypeId + ''
        return item
      })
  })
}


//模板改变  找到对应单价
const templateOptionsChange = (value) => {
  let price = 0.75
  templateOptions.value.forEach(item => {
    if (item.templateId == value)
      price = item.price
  })

  form.devicesDialog.price = price

}

// 清空price
const clearTemplateId=()=>{
  form.devicesDialog.price=null
}


//抽屉左边的表头
const drawerLeftTableColumn = [
  {
    label: '表具编号',
    prop: 'number',
    align: 'left',
    width: '',
    minWidth: '120',
    fixed:true,
  },
  {
    label: '表具名称',
    prop: 'name',
    align: 'left',
    width: '',
    minWidth: '140'
  },
  {
    label: '通讯地址',
    prop: 'deviceAddr',
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    label: '采集接口',
    prop: 'collectName',
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    label: '驱动类型',
    prop: 'deviceModel',
    align: 'left',
    width: '',
    minWidth: '120'
  },
  {
    label: '在线状态',
    prop: 'online',
    align: 'center',
    width: '',
    minWidth: '100'
  },
  {
    label: '模版名称',
    prop: 'templateName',
    align: 'center',
    width: '',
    minWidth: '140'
  },
  {
    label: '应用系统',
    prop: 'platformName',
    align: 'center',
    width: '',
    minWidth: '140'
  }
]

const deviceData = ref([]) //抽屉左边表具数据
//请求抽屉左边表具数据
const leftTableLoading=ref(false)
const getDevicesList = () => {

  leftTableLoading.value = true
  let params = {
    gatewayId: gatewayId.value,
    number: drawerQuery.number,
    online: drawerQuery.online,
    collectName: drawerQuery.collectName
  }
  getDevicesAPI(params).then(res => {
    deviceData.value = res.data;
  }).finally(() => {
        leftTableLoading.value = false;
      }
  );
}

const resetDrawerQuery = () => {
  drawerQuery.collectName = null;
  drawerQuery.online = null;
  drawerQuery.number = null;
  getDevicesList();
}

//表具弹窗关闭前
const devicesClose = () => {
  //清空所有数据
  form.devicesDialog = {
    number: null,
    name: null,
    gatewayId: gatewayId.value,
    deviceType: null,
    deviceAddr: null,
    templateId: null,
    collectName: null,
    energyTypeId: null,
    installAddr: null,
    rate: null,
    price: null,
    usable: '2',
    mainDevice: '2',
    supAmount: '1',
    remark: null,
    deviceId: null,
    platformId:null,
  }
  visible.devicesVisible = false
}

//表具弹窗提交
const devicesDialogConfirm = () => {
  proxy.$refs["devicesDialogRef"].validate(valid => {
    if (valid) {
      if (form.devicesDialog.deviceId != undefined || form.devicesDialog.deviceId != null) {
        updateDeviceAPI(form.devicesDialog).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          devicesClose()
          getDevicesList()
        });

      } else {
        createDeviceAPI(form.devicesDialog).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          devicesClose()
          getDevicesList()
        });
      }
    }
  });
}


//抽屉左边表格编辑按钮
const editDrawerBtn = async (row) => {
  devicesDialogTitle.value = '编辑表具'
  await getListOptions()
  await getPlatformOptions()
  form.devicesDialog = {
    number: row.number,
    name: row.name,
    deviceModel: row.deviceModel,
    gatewayId: row.gatewayId,
    deviceType: row.deviceType,
    deviceAddr: row.deviceAddr,
    templateId: row.templateId,
    collectName: row.collectName,
    energyTypeId: row.energyTypeId,
    installAddr: row.installAddr,
    rate: row.rate,
    price: row.price,
    usable: row.usable,
    mainDevice: row.mainDevice,
    supAmount: row.supAmount,
    remark: row.remark,
    deviceId: row.deviceId,
    platformId:row.platformId,
  }
  //编辑根据表具类型控制是否必填模板
  if(row.deviceType=='0'||row.deviceType=='1'){
    rules.drawerDialogRules.templateId=[{required: true, message: "请选择模板", trigger: "change"}];
  }else{
    rules.drawerDialogRules.templateId=[];
  }

  //回显编辑数据
  visible.devicesVisible = true
}

//抽屉左边表格删除按钮
const deleteDrawerBtn = (row) => {
  proxy.$modal.confirm('是否确认删除表具编号为"' + row.number + '"的数据项？').then(() => deleteDeviceAPI(row.deviceId)).then(() => {
    getDevicesList()
    proxy.$modal.msgSuccess("删除成功");
  })
}

//抽屉关闭
const drawerClose = () => {
  drawerQuery.collectName = null;
  drawerQuery.online = null;
  drawerQuery.number = null;
  rightTableData.value = []
}

//抽屉左边表格动态表格高度
const leftTableHeight = ref(0)
const resetDrawerHeight = () => {
  return new Promise((resolve, reject) => {
    leftTableHeight.value = 0
    resolve()
  })
}
// 设置table高度
const fetDrawerTableHeight = () => {
  resetDrawerHeight().then(res => {
    leftTableHeight.value = document.body.clientHeight - 205
  })
}
/**
 * 左侧按钮功能
 */

//表具弹窗标题
const devicesDialogTitle = ref('新增表具')

// 刷新表具在线状态
const refreshDeviceStatus = () => {
  fullscreenLoading.value = true
  refreshDeviceStatusAPI(gatewayId.value).then(res => {
    fullscreenLoading.value = false
    ElMessage({
      message: '刷新状态完成!',
      type: 'success',
    })
    getDevicesList(gatewayId.value)
  }).catch(() => {
    fullscreenLoading.value = false
  })
}

/** 导出表具 */
function handleDeviceExport() {
  proxy.download("system/gateway/export", {
    ...queryParams.value,
  }, `表具导出表_${new Date().getTime()}.xlsx`);
};


//一键时钟校验
const handleClockVerify = () => {
  const result = [];
  // 这里遍历 controllers
  deviceData.value.forEach(item => {
    result.push(item.deviceId);
  });

  // 发送请求
  switchClockAPI(result)
      .then(res => {
        // res 的格式是 {4: false, 5: true, 7 :false}
        const keys = Object.keys(res);
        for (let key of keys) {
          // const item = this.controllerData.find(item => item.id == key);
          if (!res[key]) {
            ElMessage({
              message: `${key} 校验失败`,
              type: 'error',
            })
          } else {
            ElMessage({
              message: `${key} 校验成功`,
              type: 'success',
            })
          }
        }
      });
}


// 一键删除所有表
const handleDeleteAllDevices = () => {
  proxy.$modal.confirm('是否确认删除该网关下所有表具？').then(() => deleteAllDevicesAPI(gatewayId.value)).then(() => {
    getDevicesAPI({gatewayId: gatewayId.value})
        .then(res => {
          deviceData.value = res;
        });
    proxy.$modal.msgSuccess("删除成功");
  })
}


//抽屉右边的表头
const drawerRightTableColumn = [
  {
    label: '表具编号',
    prop: 'name',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '通讯地址',
    prop: 'addr',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '采集接口',
    prop: 'collectName',
    align: 'left',
    width: '',
    minWidth: '100'
  },
  {
    label: '驱动类型',
    prop: 'type',
    align: 'left',
    width: '',
    minWidth: '100'
  }
]

/**
 * 右侧按钮功能
 */

const rightTableData = ref([])

//获取表具
const handleGetRightTable = () => {
  getRightTableData(true);
}
const getRightTableData = (payload) => {
  fullscreenLoading.value = true
  getRightTableDevicesAPI(gatewayId.value)
      .then(res => {
        rightTableData.value = res.data;
        fullscreenLoading.value = false
        if (payload) {
          ElMessage({
            message: '获取表具成功!',
            type: 'success',
          })
        }
      }).catch(() => {
    fullscreenLoading.value = false
  })

}

//同步表具
const handleSyncDevice = () => {

  proxy.$modal.confirm('是否确认同步该网关下的表具？').then(
      () => {
        fullscreenLoading.value = true
        syncDeviceAPI(gatewayId.value)
            .then(res => {
              // 重新获取右侧 table 数据
              fullscreenLoading.value = false
              if (res.code == 200) {
                ElMessage({
                  message: '同步成功',
                  type: 'success',
                })
                getRightTableData()

              } else {
                ElMessage({
                  message: '同步失败',
                  type: 'error',
                })
              }
            }).catch(() => {
          fullscreenLoading.value = false
        })
      }
  )

}


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