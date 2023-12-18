<template>
  <div>
    <div
      class="has-tree-container"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-text="加载中..."
    >
      <div class="main-background"></div>
      <div
        class="whole-content"
        v-loading.fullscreen.lock="false"
        element-loading-text="加载中..."
      >
        <Split style="height: 100%; width: 100%" ratio="1/5">
          <template #one>
            <div class="tree">
              <div class="title">区域选择</div>
              <el-tree
                :data="treeData"
                ref="treeRef"
                highlight-current
                :expand-on-click-node="true"
                node-key="regionId"
                :props="defaultProps"
                @node-click="handleTreeNodeClick"
                class="my-tree"
                :accordion="true"
                v-loading="treeLoading"
                :default-expanded-keys="defaultExpandNode"
              >
                <template #default="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span v-if="data.disabled" @click.stop></span>
                </template>
              </el-tree>
            </div>
          </template>
          <template #two>
            <div class="page-container">
              <div class="content" style="padding: 0 16px">
                <div class="search" v-show="showSearch">
                  <!-- 查询框及按钮 -->
                  <el-form
                    ref="queryRef"
                    :inline="true"
                    label-width="85px"
                    label-position="left"
                  >
                    <el-form-item label="回路名称">
                      <el-input
                        v-model="queryParams.loopName"
                        style="width: 240px"
                        placeholder="请输入回路名称"
                      >
                      </el-input>
                    </el-form-item>

                    <el-form-item label="在线状态">
                      <el-select
                        v-model="queryParams.online"
                        placeholder="请选择在线状态"
                        style="width: 240px"
                        clearable
                        :filterable="true"
                      >
                        <el-option label="在线" value="0"></el-option>
                        <el-option label="离线" value="1"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="开关状态">
                      <el-select
                        v-model="queryParams.isOn"
                        placeholder="请选择开关状态"
                        style="width: 240px"
                        clearable
                        :filterable="true"
                      >
                        <el-option label="开" value="0"></el-option>
                        <el-option label="关" value="1"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="运行模式">
                      <el-select
                        v-model="queryParams.status"
                        placeholder="请选择运行模式"
                        style="width: 240px"
                        clearable
                        :filterable="true"
                      >
                        <el-option label="自动" value="0"></el-option>
                        <el-option label="手动" value="1"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="策略名称">
                      <el-select
                        v-model="queryParams.strategyId"
                        placeholder="请选择策略名称"
                        size="default"
                        style="width: 240px"
                        :filterable="true"
                        clearable
                      >
                        <el-option
                          v-for="item of strategyOptions"
                          :key="item.strategyId"
                          :label="item.strategyName"
                          :value="item.strategyId"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item class="button-container">
                      <el-button
                        type="primary"
                        icon="Search"
                        v-hasPermi="['chaoyang:lamp:loop:list']"
                        @click="getListData"
                        >搜索
                      </el-button>
                      <el-button
                        icon="Refresh"
                        v-hasPermi="['chaoyang:lamp:switchRelation:page']"
                        @click="resetQuery"
                      >
                        重置
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>

                <div class="table" ref="tableWrapper">
                  <el-row :gutter="10" class="mb8" style="margin-top: 16px">
                    <el-col :span="1.5">
                      <el-button
                        type="success"
                        plain
                        @click="batchRemoteControl"
                        v-hasPermi="['chaoyang:lamp:loop:remote']"
                        >批量远程控制
                      </el-button>
                    </el-col>
                    <el-col :span="1.5">
                      <el-button
                        type="success"
                        plain
                        @click="setStrategy"
                        v-hasPermi="['chaoyang:lamp:loop:batch']"
                      >
                        批量设置策略
                      </el-button>
                    </el-col>
                    <el-col :span="1.5">
                      <el-button type="success" plain @click="checkControlLog">
                        远程控制记录
                      </el-button>
                    </el-col>
                    <right-toolbar
                      v-model:showSearch="showSearch"
                      @queryTable="getListData"
                    ></right-toolbar>
                  </el-row>

                  <el-table
                    :data="tableData"
                    border
                    class="customer-table"
                    style="width: 100%"
                    :header-cell-style="{ 'text-align': 'center' }"
                    name="table"
                    v-loading="loading"
                    element-loading-text="加载中..."
                    @selection-change="handleSelectionChange"
                    ref="multipleTableRef"
                    :max-height="tableHeight"
                  >
                    <el-table-column
                      type="selection"
                      width="40"
                      align="center"
                    />
                    <el-table-column
                      type="index"
                      label="序号"
                      width="60"
                      align="center"
                      fixed
                    />
                    <el-table-column
                      v-for="item in columns"
                      :key="item"
                      :prop="item.prop"
                      :label="item.label"
                      :fixed="item.fixed"
                      :min-width="item.minWidth"
                      :width="item.width"
                      :align="item.align"
                    >
                      <template #default="scope" v-if="item.prop == 'online'">
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                          "
                        >
                          <div
                            :class="
                              scope.row.online == '1'
                                ? 'offline'
                                : scope.row.online == '0'
                                ? 'open'
                                : ''
                            "
                          >
                            <div></div>
                            <span>
                              {{
                                scope.row.online == "1"
                                  ? "离线"
                                  : scope.row.online == "0"
                                  ? "在线"
                                  : ""
                              }}
                            </span>
                          </div>
                        </div>
                      </template>

                      <template #default="scope" v-if="item.prop == 'isOn'">
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                          "
                        >
                          <div
                            :class="
                              scope.row.isOn == '1'
                                ? 'close'
                                : scope.row.isOn == '0'
                                ? 'open'
                                : ''
                            "
                          >
                            <div></div>
                            <span>
                              {{
                                scope.row.isOn == "1"
                                  ? "关"
                                  : scope.row.isOn == "0"
                                  ? "开"
                                  : ""
                              }}
                            </span>
                          </div>
                        </div>
                      </template>

                      <template
                        #default="scope"
                        v-if="item.label == '运行模式'"
                      >
                        <span>
                          {{
                            scope.row.status == "0"
                              ? "自动"
                              : scope.row.status == "1"
                              ? "手动"
                              : ""
                          }}
                        </span>
                        <div class="color-describe">
                          <span></span>
                        </div>
                      </template>

                      <template
                        #default="scope"
                        v-if="item.prop == 'finalStatus'"
                      >
                        <div class="color-progress">
                          <multi-color-progress
                            :progressData="scope.row.lampLoopRecordsList"
                            :progressHour="progressHour"
                          ></multi-color-progress>
                        </div>
                      </template>

                      <template
                        #header="scope"
                        v-if="item.prop == 'finalStatus'"
                      >
                        <div class="header-container">
                          <div class="date">
                            <i
                              v-hasPermi="['chaoyang:lamp:loop:list']"
                              className="iconfont icon-left-circle"
                              @click="preDate"
                            ></i>
                            <span>{{ tableDate }}开关状态</span>
                            <i
                              v-hasPermi="['chaoyang:lamp:loop:list']"
                              className="iconfont icon-right-circle"
                              @click="nextDate"
                            ></i>
                          </div>
                          <div class="color-describe">
                            <div class="color-describe-open">
                              <div class="color"></div>
                              <span class="describe">开启</span>
                            </div>
                            <div class="color-describe-close">
                              <div class="color"></div>
                              <span class="describe">关闭</span>
                            </div>
                            <div class="color-describe-offline">
                              <div class="color"></div>
                              <span class="describe">离线</span>
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="操作"
                      align="center"
                      class-name="small-padding fixed-width"
                      width="260"
                      fixed="right"
                    >
                      <template #default="scope">
                        <el-button
                          type="text"
                          @click="remoteControl(scope.row)"
                          v-hasPermi="['chaoyang:lamp:loop:remote']"
                          >远程控制
                        </el-button>
                        <el-button
                          type="text"
                          @click="runRecord(scope.row)"
                          v-hasPermi="[
                            'chaoyang:lamp:loopRecord:operationRecord',
                          ]"
                          >运行记录
                        </el-button>
                        <el-button
                          type="text"
                          icon="Edit"
                          @click="editBtn(scope.row)"
                          v-hasPermi="['chaoyang:lamp:loop:edit']"
                          >编辑
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <pagination
                    class="pagination"
                    v-show="total > 0"
                    :total="total"
                    v-model:page="queryParams.pageNum"
                    v-model:limit="queryParams.pageSize"
                    @pagination="getListData"
                  />
                </div>
              </div>
            </div>
          </template>
        </Split>
      </div>
    </div>

    <div class="function-container">
      <!-- 編輯弹框 -->
      <el-dialog
        title="編輯"
        v-model="visible.editVisible"
        append-to-body
        destroy-on-close
        :before-close="handleAreaClose"
        width="500px"
      >
        <el-form
          class="area-form"
          ref="editDialogRef"
          :model="form.dialogData"
          :rules="rules.dialogRules"
          label-width="100px"
        >
          <el-form-item label="回路名称" prop="loopName">
            <el-input v-model="form.dialogData.loopName" style="width: 250px">
            </el-input>
          </el-form-item>

          <el-form-item label="使用策略" prop="strategyId">
            <el-select
              v-model="form.dialogData.strategyId"
              placeholder="请选择使用策略"
              size="default"
              style="width: 250px"
              :filterable="true"
            >
              <el-option
                v-for="(item, index) in strategyOptions"
                :key="item.strategyId"
                :label="item.strategyName"
                :value="item.strategyId"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleAreaClose">取消</el-button>
            <el-button type="primary" @click="editDialogConfirm"
              >确定
            </el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 设置策略弹框 -->
      <el-dialog
        title="选择策略"
        v-model="visible.setStrategyVisible"
        append-to-body
        destroy-on-close
        :before-close="cancelSetStrategy"
        width="500px"
      >
        <el-form
          class="area-form"
          ref="setStrategyDialogRef"
          :model="form.setStrategyDialogData"
          :rules="rules.setStrategyDialogRules"
          label-width="100px"
        >
          <el-form-item label="使用策略" prop="id">
            <el-select
              v-model="form.setStrategyDialogData.id"
              placeholder="请选择使用策略"
              size="default"
              style="width: 250px"
              :filterable="true"
            >
              <el-option
                v-for="(item, index) in strategyOptions"
                :key="item.strategyId"
                :label="item.strategyName"
                :value="item.strategyId"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancelSetStrategy">取消</el-button>
            <el-button type="primary" @click="setStrategyDialogConfirm"
              >确定
            </el-button>
          </span>
        </template>
      </el-dialog>

      <!--远程控制弹窗  -->
      <el-dialog
        title="控制方式"
        v-model="visible.remoteControlVisible"
        destroy-on-close
        :before-close="cancelRemoteControl"
        width="500px"
        custom-class="remote-control-dialog"
      >
        <el-form
          class="remote-control"
          ref="remoteControlDialogRef"
          :model="form.remoteControlDialogData"
          :rules="rules.remoteControlDialogRules"
          label-width="100px"
        >
          <el-form-item style="margin: 0">
            <el-radio-group
              v-model="form.remoteControlDialogData.model"
              @change="radioOptionsChange"
            >
              <!--              <el-radio label="0">-->
              <!--                <template #default>-->
              <!--                  自动-->
              <!--                  <span class="describe">-->
              <!--                    将按照已下发策略自动控制-->
              <!--                  </span>-->
              <!--                </template>-->
              <!--              </el-radio>-->
              <el-radio label="1">
                <template #default>
                  手动开
                  <el-input-number
                    v-model="form.remoteControlDialogData.delayOpenTime"
                    :min="0"
                    size="small"
                    controls-position="right"
                    :disabled="!(radioDisabled == '1')"
                  />
                  分钟后恢复自动
                </template>
              </el-radio>
              <el-radio label="2">
                <template #default>
                  手动关
                  <el-input-number
                    v-model="form.remoteControlDialogData.delayCloseTime"
                    :min="0"
                    size="small"
                    controls-position="right"
                    :disabled="!(radioDisabled == '2')"
                  />
                  分钟后恢复自动
                </template>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item style="margin: 0">
            <div class="tip">
              <div class="tip-header">
                <img
                  src="@/assets/images/lamp/loopMonitor/tip.png"
                  alt="提示"
                />
                <div>提示</div>
              </div>
              <div class="tip-content">
                <div>1.手动开——远程开启回路并持续一段时间；</div>
                <div>2.手动关——远程关闭回路并持续一段时间。</div>
                <div style="color: #fa9600">
                  3.操作成功后，当前开关状态将有1分钟延迟更新。
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancelRemoteControl">取消</el-button>
            <el-button type="primary" @click="remoteControlDialogConfirm"
              >确定
            </el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 历史记录抽屉   -->
      <el-drawer
        v-model="drawer"
        :title="drawerTitle"
        direction="rtl"
        size="50%"
        @close="drawerClose"
        :close-on-click-modal="true"
      >
        <div ref="drawerTableWrapper" style="height: 100%">
          <div style="margin-bottom: 10px">
            <el-form
              ref="drawerQueryRef"
              :inline="true"
              label-width="85px"
              label-position="left"
            >
              <el-form-item label="日期">
                <el-date-picker
                  v-model="drawerQueryParams"
                  type="daterange"
                  :clearable="false"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  style="width: 240px"
                  range-separator="~"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>

              <el-form-item class="button-container">
                <el-button
                  type="primary"
                  icon="Search"
                  v-hasPermi="['chaoyang:lamp:loopRecord:operationRecord']"
                  @click="getDrawerData"
                  >搜索
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-table
              v-loading="loading"
              element-loading-text="加载中..."
              :data="drawerTableData"
              style="width: 100%"
              border
              class="customer-table"
              :header-cell-style="{ 'text-align': 'center' }"
              name="table"
              :max-height="tableDrawerHeight"
            >
              <el-table-column
                type="index"
                label="序号"
                width="60"
                fixed
                align="center"
              />
              <el-table-column
                v-for="(item, index) in drawerTableColumn"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :align="item.align"
                :min-width="item.minWidth"
                :width="item.width"
              >
                <template
                  #default="scope"
                  v-if="item.label == '24小时开关状态'"
                >
                  <div
                    class="color-progress"
                    v-if="scope.row.lampLoopRecordVos.length"
                  >
                    <multi-color-progress
                      :progressData="scope.row.lampLoopRecordVos"
                      :progressHour="setProgressHour(scope.row)"
                    ></multi-color-progress>
                  </div>
                </template>
                <template #default="scope" v-if="item.label == '开灯时长'">
                  <span>
                    {{ scope.row.openTime }}
                  </span>
                </template>

                <template #header="scope" v-if="item.label == '24小时开关状态'">
                  <div class="header-container">
                    <div class="date">24小时开关状态</div>
                    <div class="color-describe">
                      <div class="color-describe-open">
                        <div class="color"></div>
                        <span class="describe">开启</span>
                      </div>
                      <div class="color-describe-close">
                        <div class="color"></div>
                        <span class="describe">关闭</span>
                      </div>
                      <div class="color-describe-offline">
                        <div class="color"></div>
                        <span class="describe">离线</span>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-drawer>

      <el-drawer
        v-model="controlLogDrawer"
        title="远程控制记录"
        size="800px"
        @close="handleCloseControlLog"
      >
        <div class="controlLogContainer">
          <div class="controlLogContainer_filterPart">
            <div class="controlLogContainer_filterPart_item">
              <div class="item_label">下发日期：</div>
              <div class="item_form">
                <el-date-picker
                  @change="handleDateChange"
                  v-model="manualTime"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择日期"
                />
              </div>
            </div>
            <div class="controlLogContainer_filterPart_item">
              <div class="item_label">回路名称：</div>
              <el-input
                v-model="LoopName"
                placeholder="请输入回路名称"
                clearable
              >
                <template #append>
                  <el-button :icon="Search" @click="handleNameChange" />
                </template>
              </el-input>
            </div>
            <div class="controlLogContainer_filterPart_item">
              <div class="item_label">控制方式：</div>
              <el-select
                v-model="controlMode"
                @change="handleModeChange"
                placeholder="请选择控制方式"
              >
                <el-option label="全部" value="" />
                <el-option label="手动开" value="1" />
                <el-option label="手动关" value="2" />
              </el-select>
            </div>
            <div class="controlLogContainer_filterPart_item">
              <div class="item_label">下发状态：</div>
              <el-select
                v-model="status"
                @change="handleStatusChange"
                placeholder="请选择下发状态"
              >
                <el-option label="全部" value="" />
                <el-option label="下发成功" value="0" />
                <el-option label="下发中" value="2" />
                <el-option label="下发失败" value="1" />
              </el-select>
            </div>
          </div>
          <div class="controlLogContainer_tablePart">
            <el-table
              :data="controlLogData"
              style="width: 100%"
              height="0"
              border
            >
              <el-table-column label="序号" width="50" align="center">
                <template #default="scope">
                  {{ (pageNum - 1) * pageSize + scope?.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="loopName"
                label="回路名称"
                show-overflow-tooltip
              />
              <el-table-column
                prop="manualContent"
                label="控制方式"
                show-overflow-tooltip
              />
              <el-table-column prop="times" label="下发时间" width="160" />
              <el-table-column prop="statusName" label="下发状态" width="85" />
            </el-table>
          </div>
          <div class="controlLogContainer_paginationPart">
            <el-pagination
              v-model:current-page="pageNum"
              v-model:page-size="pageSize"
              :page-sizes="[10, 15, 30, 50]"
              background
              :small="false"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalLog"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from "vue";
import {
  batchLoopAPI,
  getStrategyOptionsAPI,
  listLoopAPI,
  listRegionAPI, // 查询回路列表
  updateLoopAPI,
  batchRemoteAPI,
  operationRecordAPI, //远程控制
  getControlLogListAPI,
} from "@/api/lamp/loopMonitor";

import multiColorProgress from "./components/multiColorProgress";
import Split from "@/components/Split/index.vue";
import { ElMessage } from "element-plus";
import moment from "moment";

const { proxy } = getCurrentInstance();
//是否有显示搜索框
const showSearch = ref(true);
const loading = ref(false);
const fullscreenLoading = ref(false);
const treeLoading = ref(true);
let pageLoading = ref(false);
const treeData = ref(undefined);
const treeRef = ref();
const defaultProps = {
  label: "regionName",
  children: "children",
  isLeaf: "leaf",
  parentId: "parentId",
};
let columns = ref([
  {
    prop: "loopName",
    label: "回路名称",
    minWidth: "200",
    align: "left",
    fixed: "left",
  },
  { prop: "online", label: "在线状态", minWidth: "120", align: "center" },
  { prop: "isOn", label: "当前开关状态", minWidth: "120", align: "center" },
  { prop: "status", label: "运行模式", minWidth: "120", align: "left" },
  {
    prop: "strategyName",
    label: "当前使用策略",
    minWidth: "200",
    align: "left",
  },
  { prop: "finalStatus", label: "开关状态", width: "410", align: "center" },
  { prop: "indicationTime", label: "最后通讯", width: "160", align: "center" },
]);

//获取树
//默认展开一级和二级节点
let defaultExpandNode = ref([]);

function getTreeData() {
  treeLoading.value = true;
  listRegionAPI()
    .then((res) => {
      treeData.value = res.rows; //recursion(res.data);
      getDefaultExpandNode(res.rows);
      nextTick(() => {
        treeRef.value.setCurrentKey(res.rows[0].regionId);
      });
      queryParams.value.regionId = res.rows[0].regionId;
      getListData();
    })
    .finally(() => {
      treeLoading.value = false;
    });
}

//获得默认展开的节点
const getDefaultExpandNode = (arr) => {
  defaultExpandNode.value = [];
  if (arr.length) {
    defaultExpandNode.value.push(arr[0].regionId);
  }
};

const handleTreeNodeClick = (currentNode) => {
  queryParams.value.regionId = currentNode.regionId;
  getListData();
};

//查询参数
let queryParams = ref({
  regionId: null,
  loopName: null,
  online: null,
  isOn: null,
  status: null,
  strategyId: null,
  dateTime: moment().format("YYYY-MM-DD"),
  pageSize: 10,
  pageNum: 1,
});

const total = ref(0);
//获得列表数据
const tableData = ref([]);
const getListData = () => {
  loading.value = true;

  listLoopAPI(queryParams.value)
    .then((res) => {
      //判断开关状态
      tableData.value = res.rows.map((item) => {
        if (item.online == "1") item.finalStatus = "离线";
        else {
          if (item.isOn == "0") item.finalStatus = "开启";
          else item.finalStatus = "关闭";
        }

        if (item.lampLoopRecordsList.length) {
          item.lampLoopRecordsList.forEach((item2) => {
            if (item2.online == "1") item2.finalStatus = "离线";
            else {
              if (item2.isOn == "0") item2.finalStatus = "开启";
              else item2.finalStatus = "关闭";
            }
          });
        }

        return item;
      });
      total.value = res.total;
    })
    .finally(() => {
      loading.value = false;
      nextTick(() => {
        fetTableHeight();
      });
    });
};

//重置
const resetQuery = () => {
  queryParams.value = Object.assign(queryParams.value, {
    loopName: null,
    online: null,
    isOn: null,
    status: null,
    strategyId: null,
    dateTime: moment().format("YYYY-MM-DD"),
    pageSize: 10,
    pageNum: 1,
  });
  getListData();
};

//弹窗显示定义
const visible = reactive({
  editVisible: false,
  setStrategyVisible: false,
  remoteControlVisible: false,
});

//弹窗数据定义
let form = reactive({
  dialogData: {
    loopName: null,
    loopId: null,
  },
  //绑定弹窗的数据
  setStrategyDialogData: {
    id: null,
  },
  remoteControlDialogData: {
    model: "1",
    delayOpenTime: undefined,
    delayCloseTime: undefined,
  },
});

//弹窗规则定义
const rules = reactive({
  dialogRules: {
    loopName: [
      { required: true, message: "请输入回路名称", trigger: "trigger" },
    ],
  },
  setStrategyDialogRules: {
    id: [{ required: true, message: "请选择策略名称", trigger: "change" }],
  },
  remoteControlDialogRules: {},
});

//点击树的节点 只有末级节点
const treeOptionsClick = (current) => {
  if (current.level !== 3) {
    nextTick(() => {
      form.dialogData.regionId = null;
    });
  }
};

//查询下拉
const strategyOptions = ref([]);
const getStrategyOptions = () => {
  getStrategyOptionsAPI().then((res) => {
    strategyOptions.value = res.rows;
  });
};
getStrategyOptions();

//远程控制按钮
const remoteControl = (row) => {
  form.remoteControlDialogData.loopId = [row.loopId];
  isBatchRemoteControl.value = false;
  visible.remoteControlVisible = true;
};
const radioDisabled = ref("1");
const radioOptionsChange = (payload) => {
  //选项改变 清楚delayTime
  console.log(payload);
  radioDisabled.value = payload;
  form.remoteControlDialogData.delayOpenTime = undefined;
  form.remoteControlDialogData.delayCloseTime = undefined;
};

const remoteControlDialogConfirm = () => {
  //确定提交数据
  if (isBatchRemoteControl.value) {
    form.remoteControlDialogData.loopId = ids.value;
  }

  if (radioDisabled.value == "1") {
    if (
      [undefined, null, "", 0].includes(
        form.remoteControlDialogData.delayOpenTime
      )
    ) {
      ElMessage.error("请输入手动开时间");
      return;
    }
    form.remoteControlDialogData.delayTime =
      form.remoteControlDialogData.delayOpenTime;
  } else {
    if (
      [undefined, null, "", 0].includes(
        form.remoteControlDialogData.delayCloseTime
      )
    ) {
      ElMessage.error("请输入手动关时间");
      return;
    }
    form.remoteControlDialogData.delayTime =
      form.remoteControlDialogData.delayCloseTime;
  }

  fullscreenLoading.value = true;
  batchRemoteAPI(form.remoteControlDialogData)
    .then((res) => {
      ElMessage({
        message: "远程控制成功!",
        type: "success",
      });
      visible.remoteControlVisible = false;
    })
    .finally(() => {
      if (isBatchRemoteControl.value) {
        toggleSelection();
      }
      cancelRemoteControl();
      fullscreenLoading.value = false;
    });
};

const cancelRemoteControl = () => {
  form.remoteControlDialogData = {
    model: "1",
    delayOpenTime: undefined,
    delayCloseTime: undefined,
    loopId: [],
  };
  visible.remoteControlVisible = false;
};

//编辑弹窗
const editBtn = async (row) => {
  getStrategyOptions();
  form.dialogData = {
    loopId: row.loopId,
    loopName: row.loopName,
    strategyId: row.strategyId,
  };
  visible.editVisible = true;
};
//编辑弹窗提交
const editDialogConfirm = () => {
  proxy.$refs["editDialogRef"].validate((valid) => {
    if (valid) {
      proxy.$modal
        .confirm("策略将直接下发到回路，原有策略将会被覆盖，是否确认下发？")
        .then(() => {
          fullscreenLoading.value = true;
          updateLoopAPI(form.dialogData)
            .then((res) => {
              ElMessage({
                message: "编辑数据成功!",
                type: "success",
              });
              visible.editVisible = false;
              getListData();
            })
            .finally(() => {
              handleAreaClose();
              fullscreenLoading.value = false;
            });
        });
    }
  });
};

const handleAreaClose = () => {
  //关闭弹窗前清空所有数据
  form.dialogData = {
    loopId: null,
    loopName: null,
    strategyId: null,
  };
  visible.editVisible = false;
};

//批量下发
const ids = ref([]); //id集合
//批量下发策略的时候是否显示 提示
const showMessage = ref(false);
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => {
    if (item.strategyId) showMessage.value = true;
    return item.loopId;
  });
};
const multipleTableRef = ref();
//清空多选列表
const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value.toggleRowSelection(row, undefined);
    });
  } else {
    multipleTableRef.value.clearSelection();
  }
  ids.value = [];
};

const setStrategy = () => {
  if (ids.value.length) {
    getStrategyOptions();
    visible.setStrategyVisible = true;
  } else {
    ElMessage({
      message: "未选择回路!",
      type: "warning",
    });
  }
};
/**
 * 打开抽屉弹窗，查看远程控制记录
 */
import { Search } from "@element-plus/icons-vue";

const controlLogDrawer = ref(false);
const manualTime = ref("");
const LoopName = ref("");
const controlMode = ref("");
const status = ref("");
const totalLog = ref(0);
const pageSize = ref(10);
const pageNum = ref(1);

const controlLogData = ref([
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
]);
const checkControlLog = async () => {
  await getControlLogList();
  controlLogDrawer.value = true;
};
const handleSizeChange = (val) => {
  // console.log(`${val} items per page`)
  pageNum.value = 1;
  pageSize.value = val;
  getControlLogList();
};
const handleCurrentChange = (val) => {
  // console.log(`current page: ${val}`)
  pageNum.value = val;
  getControlLogList();
};
const handleNameChange = () => {
  // console.log(LoopName.value)
  getControlLogList();
};
const handleDateChange = () => {
  // console.log(manualTime.value)
  getControlLogList();
};
const handleModeChange = () => {
  getControlLogList();
};
const handleStatusChange = () => {
  getControlLogList();
};
const handleCloseControlLog = () => {
  // controlLogDrawer.value = false
  manualTime.value = "";
  LoopName.value = "";
  controlMode.value = "";
  status.value = "";
  totalLog.value = 0;
  pageSize.value = 10;
  pageNum.value = 1;
};
const getControlLogList = async () => {
  const params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    manualTime: manualTime.value,
    status: status.value,
    LoopName: LoopName.value,
    regionId: queryParams.value.regionId,
    controlMode: controlMode.value,
  };
  if (manualTime.value === "") {
    delete params.manualTime;
  }
  if (LoopName.value === "") {
    delete params.LoopName;
  }
  if (controlMode.value === "") {
    delete params.controlMode;
  }
  if (status.value === "") {
    delete params.status;
  }
  const res = await getControlLogListAPI(params);
  // console.log(res)
  const { code, rows, msg, total } = res;
  if (code === 0) {
    totalLog.value = total;
    controlLogData.value = [...rows];
  } else {
    ElMessage.error(msg);
  }
};

const setStrategyDialogConfirm = () => {
  //确定前再给用户确认是否更换策略

  proxy.$refs["setStrategyDialogRef"].validate((valid) => {
    //校验是否通过
    if (valid) {
      proxy.$modal
        .confirm("策略将直接下发到回路，原有策略将会被覆盖，是否确认下发？")
        .then(() => {
          fullscreenLoading.value = true;
          form.setStrategyDialogData = Object.assign(
            form.setStrategyDialogData,
            { ids: ids.value }
          );
          batchLoopAPI(form.setStrategyDialogData)
            .then((res) => {
              ElMessage({
                message: "批量下发策略成功!",
                type: "success",
              });
              getListData();
            })
            .finally(() => {
              cancelSetStrategy();
              toggleSelection();
              fullscreenLoading.value = false;
            });
        });
    }
  });
};

const cancelSetStrategy = () => {
  form.setStrategyDialogData = {
    id: null,
  };
  visible.setStrategyVisible = false;
};

//批量远程控制
const isBatchRemoteControl = ref(false);
const batchRemoteControl = () => {
  if (ids.value.length) {
    isBatchRemoteControl.value = true;
    visible.remoteControlVisible = true;
  } else {
    ElMessage({
      message: "未选择回路!",
      type: "warning",
    });
  }
};

const tableDate = ref(moment().format("YYYY-MM-DD"));
const progressHour = ref(new Date().getHours());

watch(tableDate, (newValue) => {
  if (newValue == moment().format("YYYY-MM-DD")) {
    progressHour.value = new Date().getHours();
  } else {
    progressHour.value = 24;
  }
});

//日期往前
const preDate = () => {
  tableDate.value = moment(tableDate.value)
    .subtract(1, "days")
    .startOf("days")
    .format("YYYY-MM-DD");
  queryParams.value.dateTime = tableDate.value;
  getListData();
};
//日期往后
const nextDate = () => {
  tableDate.value = moment(tableDate.value)
    .add(1, "days")
    .startOf("days")
    .format("YYYY-MM-DD");
  queryParams.value.dateTime = tableDate.value;
  getListData();
};

//抽屉
const drawer = ref(false);
const drawerTitle = ref();
const drawerTableColumn = ref([
  { prop: "dateTime", label: "日期", width: "160", align: "center" },
  {
    prop: "loopNum",
    label: "24小时开关状态",
    minWidth: "300",
    align: "center",
  },
  { prop: "openTime", label: "开灯时长", minWidth: "110", align: "right" },
]);
const drawerTableData = ref([]);
//请求抽屉列表数据
const drawerQueryParams = ref([]);
const getDrawerData = () => {
  let params = { loopId: loopId.value };
  if (drawerQueryParams.value.length) {
    params.startTime = drawerQueryParams.value[0];
    params.endTime = drawerQueryParams.value[1];
  }
  loading.value = true;
  operationRecordAPI(params)
    .then((res) => {
      drawerTableData.value = res.data.map((item) => {
        if (item.lampLoopRecordVos.length) {
          item.lampLoopRecordVos.forEach((item2) => {
            if (item2.online == "1") item2.finalStatus = "离线";
            else {
              if (item2.isOn == "0") item2.finalStatus = "开启";
              else item2.finalStatus = "关闭";
            }
          });
        }

        return item;
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

//抽屉内部进度条
const setProgressHour = (row) => {
  let propsHour = 24;
  if (row.dateTime == moment().format("YYYY-MM-DD")) {
    propsHour = new Date().getHours();
  }
  return propsHour;
};

//请求抽屉数据
const loopId = ref();
const runRecord = (row) => {
  drawerTitle.value = `回路名称： ${row.loopName}`;
  loopId.value = row.loopId;
  //请求数据
  getDrawerData();
  drawer.value = true;
  fetDrawerTableHeight();
};

//抽屉关闭清空数据
const drawerClose = () => {
  drawerTableData.value = [];
  drawerQueryParams.value = [];
};

//动态抽屉表格高度
const tableDrawerHeight = ref(0);
const resetDrawerHeight = () => {
  return new Promise((resolve, reject) => {
    tableDrawerHeight.value = 0;
    resolve();
  });
};

// 设置table高度
const drawerTableWrapper = ref();
const fetDrawerTableHeight = () => {
  resetDrawerHeight().then((res) => {
    tableDrawerHeight.value =
      drawerTableWrapper.value.getBoundingClientRect().height - 60;
  });
};

//带分页的表格高度
const tableHeight = ref(0);
const resetHeight = () => {
  return new Promise((resolve, reject) => {
    tableHeight.value = 0;
    resolve();
  });
};

const tableWrapper = ref();
const fetTableHeight = () => {
  resetHeight().then((res) => {
    console.log(tableWrapper.value.getBoundingClientRect());
    tableHeight.value = tableWrapper.value.getBoundingClientRect().height - 165;
  });
};

watch(showSearch, (newValue) => {
  fetTableHeight();
});

getTreeData();
</script>

<style lang="scss" scoped>
$open: #19b21e;
$close: #fa9600;
$offline: #8d9094;

.has-tree-container {
  background-color: #f8f8f8;
  //width: calc(100vw - 240px);
  height: calc(100vh - 70px);
  position: relative;

  .main-background {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: calc(100vh - 70px);
    background: #f3f3f3;
    // border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0px 8px 12px 0px rgba(0, 0, 0, 0.1);
    opacity: 0.5;
  }

  .whole-content {
    width: 100%;
    height: 100%;
    background-color: #f8f8f8;
    padding: 24px 24px 0 24px;
    position: absolute;
  }

  :deep(.sub:first-of-type) {
    box-shadow: 0px 6px 12px 0px rgb(0 0 0 / 8%);
    background: #f5f6f7 !important;
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
      background-color: #f5f6f7;
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

  .offline {
    @extend .status;
    color: $offline;

    div {
      background: $offline;
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

  .color-describe-container {
    display: flex;
    justify-content: center;
    align-items: center;

    .color {
      width: 14px;
      height: 7px;
      border-radius: 1px 1px 1px 1px;
      opacity: 1;
    }

    .describe {
      margin: 0 3px;
    }
  }

  .header-container {
    display: flex;

    .date {
      display: flex;

      justify-content: center;
      align-items: center;
      margin-right: 70px;

      i {
        padding: 0 2px;
        cursor: pointer;
        margin-top: 2px;
      }

      i:hover {
        color: #409eff;
      }
    }

    .color-describe {
      display: flex;

      .color-describe-open {
        @extend .color-describe-container;

        .color {
          background: $open;
        }
      }

      .color-describe-close {
        @extend .color-describe-container;

        .color {
          background: $close;
        }
      }

      .color-describe-offline {
        @extend .color-describe-container;

        .color {
          background: $offline;
        }
      }
    }
  }

  .color-progress {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.function-container {
  .color-describe-container {
    display: flex;
    justify-content: center;
    align-items: center;

    .color {
      width: 14px;
      height: 7px;
      border-radius: 1px 1px 1px 1px;
      opacity: 1;
    }

    .describe {
      margin: 0 3px;
    }
  }

  .header-container {
    display: flex;

    .date {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 70px;
      margin-left: 50px;
    }

    .color-describe {
      display: flex;

      .color-describe-open {
        @extend .color-describe-container;

        .color {
          background: $open;
        }
      }

      .color-describe-close {
        @extend .color-describe-container;

        .color {
          background: $close;
        }
      }

      .color-describe-offline {
        @extend .color-describe-container;

        .color {
          background: $offline;
        }
      }
    }
  }

  .color-progress {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.remote-control {
  :deep(.el-form-item__content) {
    margin: 0 !important;
  }

  :deep(.el-radio-group) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .el-radio {
      margin-bottom: 5px;

      .el-radio__inner {
        width: 18px;
        height: 18px;
      }

      .el-radio__label {
        font-size: 12px;

        .describe {
          margin-left: 7px;
          height: 19px;
          font-size: 12px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #b4b9bf;
          line-height: 19px;
        }
      }
    }
  }

  .tip {
    width: 460px;
    margin-top: 9px;
    background: #eff6ff;
    border-radius: 4px 4px 4px 4px;

    .tip-header {
      display: flex;
      align-items: center;
      height: 19px;
      margin-top: 14px;
      margin-left: 21px;

      img {
        width: 15px;
        height: 15px;
        opacity: 1;
        margin-right: 8px;
      }

      div {
        font-size: 12px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 400;
        color: #2f3133;
        line-height: 19px;
      }
    }

    .tip-content {
      display: flex;
      flex-direction: column;
      margin-left: 46px;
      margin-top: 14px;
      margin-bottom: 7px;

      div {
        height: 21px;
        margin-bottom: 7px;
        font-size: 12px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 400;
        color: #2f3133;
        line-height: 21px;
      }
    }
  }
}

:deep(.remote-control-dialog) {
  .el-dialog__header {
    padding: 14px 21px;

    .el-dialog__title {
      height: 21px;
      font-size: 14px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: bold;
      color: #18191a;
      line-height: 21px;
    }
  }

  .el-dialog__headerbtn {
    top: 0;
    height: 52px;
  }
}

.controlLogContainer {
  height: 100%;
  display: flex;
  flex-direction: column;

  &_filterPart {
    display: flex;
    flex: 0 0 84px;
    flex-wrap: wrap;

    &_item {
      width: 350px;
      display: flex;
      flex-wrap: nowrap;
      margin-bottom: 10px;

      .item_label {
        flex: 0 0 80px;
        width: 80px;
        text-align: right;
      }

      ::v-deep(.el-select, .el-input) {
        width: 220px;
      }

      ::v-deep(.el-input) {
        width: 220px;
      }
    }
  }

  &_tablePart {
    flex: 1;
    height: calc(100% - 134px);
    box-sizing: border-box;

    ::v-deep(.el-table) {
      height: 100% !important;
    }
  }

  &_paginationPart {
    height: 50px;
    flex: 0 0 50px;
    position: relative;

    ::v-deep(.el-pagination) {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
