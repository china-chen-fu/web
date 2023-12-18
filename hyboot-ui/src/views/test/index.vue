<template>
  <div class="stall-container" v-loading="pageLoading" element-loading-text="加载中...">
    <Split v-if="pageStep == 1" style="height: 100%;width: 100%;" ratio="1/6">
      <template #one>
        <div class="stall-left">
          <div class="stall-tree">
            <el-tree :data="treeData" :props="treeProps" :expand-on-click-node="false" @node-click="nodeClick" default-expand-all node-key="regionId" :current-node-key="currentTreeNodeKey" highlight-current></el-tree>
          </div>
        </div>
      </template>
      <template #two>
        <div class="stall-right">
          <div v-loading="stallDataLoading" element-loading-text="加载中..." class="stall-content">
            <div class="status-top">
              <div class="status-tab" v-if="countNumber.total">
                <div class="tab-item" v-for="(item, index) in statusTabs" :key="index" :class="{ 'tab-item-active': currentActiveTab == index }" @click="tabChange(index, item.key)">
                  {{ item.label }} {{ getTabNum(item.key) }}
                </div>
              </div>
              <div>
                <el-input v-model="searchText" v-hasPermi="['chaoyang:stall:info:query']" @keyup.enter="getList" placeholder="请输入关键字" clearable @clear="getList" :suffix-icon="Search" style="width: 280px;"></el-input>
              </div>
            </div>
            <div id="stall-box" class="stall-list" v-if="(regionStallData && regionStallData.length)">
              <div v-for="(item, index) in regionStallData" :key="index" style="margin-bottom: 20px;">
                <div v-if="item.stallList.length">
                  <div class="region-name">{{ item.regionName }}</div>
                  <div class="stall-box">
                    <div class="stall-item" @click="detail(it)" v-for="(it, idx) in item.stallList" :key="idx" :style="{ 'backgroundColor': filterStyle(it.status).bgc }">
                      <div class="item-top">
                        <div style="display: flex;justify-content: space-between;align-items: center;">
                          <div class="out-circle" :style="{ 'backgroundColor': filterStyle(it.status).outRingColor }">
                            <div class="inner-circle" :style="{ 'backgroundColor': filterStyle(it.status).innerRingColor }"></div>
                          </div>
                          <!-- <div class="out-circle" :style="{ 'backgroundColor': handleStallStatus(it).outRingColor }">
                            <div class="inner-circle" :style="{ 'backgroundColor': handleStallStatus(it).outRingColor }"></div>
                          </div> -->
                          <div style="font-size: 14px;padding-left: 10px;" :style="{ 'color': filterStyle(it.status).color }">
                            {{ it.status == 0 ? '正常' : it.status == '1' ? '空置' : it.status == '2' ? '离线' : '报警' }}
                            <!-- {{ handleStallStatus(it).label }} -->
                          </div>
                        </div>
                        <div style="cursor: pointer;">
                          <img :ref="ref => (refImgMap[`${index}${idx}refImg`] = ref)" @mouseenter="handleImgRef(refImgMap[`${index}${idx}refImg`], item, it)" v-hasPermi="['chaoyang:stall:info:charge' || 'chaoyang:stall:info:refund' || 'chaoyang:stall:info:checkin' || 'chaoyang:stall:info:leave']" src="@/assets/images/stall-drop-icon.png" alt="">
                        </div>
                      </div>
                      <div class="item-center" style="font-size: 14px;">
                        <div class="center-stall-name" :ref="ref => (refMap[`${index}${idx}ref`] = ref)" @mouseenter="handleRef(refMap[`${index}${idx}ref`], item, it)">{{ it.stallName }}</div>
                      </div>
                      <div class="item-bottom">
                        <div class="bottom-icon" v-for="(i, ix) in it.minAmountDeviceVos" :key="ix">
                          <img v-if="(i.deviceType.includes('电') && i.online == '1')" src="@/assets/images/ele-icon.png" alt="">
                          <img v-if="(i.deviceType.includes('电') && i.online == '0')" src="@/assets/images/ele-icon-active.png" alt="">
                          <span v-if="i.deviceType.includes('电')" style="padding-left: 5px;">电:</span>
                          <img v-if="(i.deviceType.includes('水') && i.online == '1')" src="@/assets/images/water-icon.png" alt="">
                          <img v-if="(i.deviceType.includes('水') && i.online == '0')" src="@/assets/images/water-icon-active.png" alt="">
                          <span v-if="i.deviceType.includes('水')" style="padding-left: 5px;">水:</span>
                          <span style="padding-left: 10px;">{{ toThousand(Number(i.indicationAmount)) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="stall-list" style="text-align: center;padding-top: 10%;">
              <img src="@/assets/images/search-no-result.png" width="300" height="312" alt="">
            </div>
          </div>
        </div>
      </template>
    </Split>

    <div v-if="pageStep == 2" class="step2" style="height: 100vw;width: 100%;">
      <div style="height: 100%;background-color: #fff;">
        <el-row class="step-second">
          <el-col :span="3" :xs="16" :sm="12" :md="4" class="hidden-md-and-down second-left">
            <div class="step2-text" style="display: flex;align-items: center;margin-bottom: 32px;">
              <el-icon>
                <ArrowLeft />
              </el-icon>
              <span class="step2-back" @click="back">返回</span>
            </div>
            <!-- <div style="text-align: center;"><img src="../../../assets/images/shop-big.png" alt=""></div> -->
            <div class="stall-name-pen">
              <div>【{{ transStatus(stallDetailInfo.status) }}】{{ stallDetailInfo.stallName }}</div>
              <div class="edit-icon" v-hasPermi="['chaoyang:stall:info:edit']" @click="editStallName"><img src="@/assets/images/stall-edit.png" alt=""></div>
            </div>
            <div class="step-left-info">
              <el-row>
                <el-col class="left-info-key" :span="9">进场日期：</el-col>
                <el-col class="left-info-value" :span="15">{{ stallDetailInfo.inTime ? stallDetailInfo.inTime.substring(0, 10) : '' }}</el-col>
              </el-row>
              <el-row>
                <el-col class="left-info-key" :span="9">联系人：</el-col>
                <el-col class="left-info-value" :span="15">{{ stallDetailInfo.contacts ? stallDetailInfo.contacts : '' }}</el-col>
              </el-row>
              <el-row>
                <el-col class="left-info-key" :span="9">联系方式</el-col>
                <el-col class="left-info-value" :span="15">{{ stallDetailInfo.phonenumber ? stallDetailInfo.phonenumber : '' }}</el-col>
              </el-row>
              <el-row>
                <el-col class="left-info-key" :span="9">备注：</el-col>
                <el-col class="left-info-value" :span="15">{{ stallDetailInfo.remark ? stallDetailInfo.remark : '' }}</el-col>
              </el-row>
            </div>
            <div class="leave-button">
              <el-button v-hasPermi="['chaoyang:stall:info:leave']" v-if="stallDetailInfo.businessId" @click="step2InOut(2)">离场</el-button>
              <el-button v-hasPermi="['chaoyang:stall:info:checkin']" v-else @click="step2InOut(1)">进场</el-button>
            </div>
          </el-col>
          <el-col :span="20" :xs="24" :sm="12" :md="20" style="height: 100%;overflow: auto;">
            <div class="step2-right" style="min-width: 1014px;">
              <div v-show="stallDetailInfo != null && stallDetailInfo.deviceVos.length > 0">
                <div v-for="(device, index) in stallDetailInfo.deviceVos" :key="index" class="display-pic" style="width: 100%;display: flex;justify-content: space-between;">
                  <div class="device-pic" style="width: 55%;">
                    <div style="display: flex;justify-content: flex-start;">
                      <div class="device-test-box">
                        <deviceComponent :data="{
                          width: '296px',
                          height: '179px',
                          status: device.online == 0 ? (device.status ? transStatus(device.status, true) : '暂无') : '离线',
                          indication: (device.indication ? device.indication : 0),
                          unit: (device.deviceType.includes('电') ? 'kwh' : 't'),
                          date: (device.indicationTime ? device.indicationTime : '')
                        }" :is-device="true">
                        </deviceComponent>
                      </div>
                      <div class="device-info" style="margin-left: 8%;min-width: 234px;">
                        <el-row class="device-pic-title">
                          <el-col>{{ device.name }}</el-col>
                        </el-row>
                        <el-row class="device-pic-common-box">
                          <el-col class="device-pic-common-key" :span="12">表具编号：</el-col>
                          <el-col class="device-pic-common-value" :span="10" :offset="2">{{ device.number }}</el-col>
                        </el-row>
                        <el-row class="device-pic-common-box">
                          <el-col class="device-pic-common-key" :span="12">结算方式：</el-col>
                          <el-col class="device-pic-common-value" :span="10" :offset="2">{{ (device.supAmount == 0 ? '充用量' : device.supAmount == 1 ? '充金额' : '') }}</el-col>
                        </el-row>
                        <el-row class="device-pic-common-box">
                          <el-col class="device-pic-common-key" :span="12">剩余{{ (device.supAmount == 0 ? '用量' : device.supAmount == 1 ? '金额' : '') }}：</el-col>
                          <el-col class="device-pic-common-value" :span="10" :offset="2">
                            {{ toThousand(Number(device.indicationAmount)) }}
                            {{ getDeviceUnit(device) }}
                          </el-col>
                        </el-row>
                        <el-row style="margin-top: 30px;" :gutter="20">
                          <el-col :span="5">
                            <el-button class="payment-button" v-hasPermi="['chaoyang:stall:info:charge']" @click="step2charge(device)">充值</el-button>
                          </el-col>
                          <el-col :span="5">
                            <el-button class="payment-button" v-hasPermi="['chaoyang:stall:info:refund']" @click="step2refund(device)">退费</el-button>
                          </el-col>
                          <el-col :span="5">
                            <el-button class="ele-button" v-hasPermi="['chaoyang:stall:info:open']" @click="forceSwitch(1, device)">送{{ device.deviceType.includes('电') ? '电' : '水' }}</el-button>
                          </el-col>
                          <el-col :span="5">
                            <el-button class="ele-button" v-hasPermi="['chaoyang:stall:info:close']" @click="forceSwitch(6, device)">断{{ device.deviceType.includes('电') ? '电' : '水' }}</el-button>
                          </el-col>
                          <el-col :span="4">
                            <el-button class="ele-button" v-hasPermi="['chaoyang:stall:info:prepay']" @click="openPrePay(device)">开启预付费</el-button>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                  <div class="echarts-pic" style="width: 45%;min-width: 400px;">
                    <chart :data="{ id: device.deviceId, number: device.number, deviceType: device.deviceType }"></chart>
                  </div>
                </div>
              </div>
              <div v-show="stallDetailInfo == null || stallDetailInfo.deviceVos.length == 0">
                <div class="display-pic" style="width: 100%;display: flex;justify-content: space-between;">
                  <div class="device-pic" style="width: 55%;">
                    <div style="display: flex;justify-content: flex-start;">
                      <div>
                        <deviceComponent :data="{ width: '296px', height: '179px', status: '暂无', indication: 0, unit: '', date: '' }"></deviceComponent>
                      </div>
                      <div class="device-info" style="margin-left: 10%;min-width: 234px;">
                        <el-row class="device-pic-title">
                          <el-col>暂无表具</el-col>
                        </el-row>
                        <el-row class="device-pic-common-box">
                          <el-col class="device-pic-common-key" :span="12">表具编号：</el-col>
                          <el-col class="device-pic-common-value" :span="10" :offset="2">暂无</el-col>
                        </el-row>
                        <el-row class="device-pic-common-box">
                          <el-col class="device-pic-common-key" :span="12">结算方式：</el-col>
                          <el-col class="device-pic-common-value" :span="10" :offset="2">暂无</el-col>
                        </el-row>
                        <el-row class="device-pic-common-box">
                          <el-col class="device-pic-common-key" :span="12">剩余金额：</el-col>
                          <el-col class="device-pic-common-value" :span="10" :offset="2">暂无</el-col>
                        </el-row>
                        <el-row style="margin-top: 30px;" :gutter="36">
                          <el-col :span="6">
                            <el-button class="payment-button" disabled @click="step2charge">充值</el-button>
                          </el-col>
                          <el-col :span="6">
                            <el-button class="payment-button" disabled @click="step2refund">退费</el-button>
                          </el-col>
                          <el-col :span="6">
                            <el-button class="ele-button" disabled @click="forceSwitch(1)">送电</el-button>
                          </el-col>
                          <el-col :span="6">
                            <el-button class="ele-button" disabled @click="forceSwitch(0)">断电</el-button>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                  <div class="echarts-pic" style="width: 45%;min-width: 400px;">
                    <chart></chart>
                  </div>
                </div>
              </div>
              <div class="record">
                <div class="record-title">充值记录</div>
                <div class="record-option">
                  <el-date-picker style="margin-right: 24px;width: 200px;" v-model="record.searchTime" value-format="YYYY-MM-DD" type="date" placeholder="选择日期" @change="getRecordData" />
                  <el-select class="record-distance" style="width: 120px;" clearable v-model="record.orderType" placeholder="类型" @change="getRecordData">
                    <el-option label="表具充值" :value="0"></el-option>
                    <el-option label="表具退费" :value="1"></el-option>
                  </el-select>
                  <el-select class="record-distance" style="width: 130px;" clearable v-model="record.orderPlatform" placeholder="操作人" @change="getRecordData">
                    <el-option label="朝阳到家" :value="0"></el-option>
                    <el-option label="朝阳微服务" :value="1"></el-option>
                    <el-option label="系统" :value="2"></el-option>
                  </el-select>
                  <el-input class="record-distance" v-model="record.notes" @keyup.enter="getRecordData" :suffix-icon="Search" style="width: 220px;" placeholder="请输入描述关键字"></el-input>
                </div>
                <div class="record-table">
                  <el-table :data="recordTableData" border style="width: 100%" :header-cell-style="{ textAlign: 'center' }" :cell-style="setSellStyle">
                    <el-table-column type="index" label="序号" width="60" />
                    <el-table-column prop="orderTime" label="日期" width="160" />
                    <el-table-column prop="orderType" label="类型" width="120" />
                    <el-table-column prop="orderPlatform" label="操作人" width="120" />
                    <el-table-column prop="notes" label="描述" />
                  </el-table>
                  <pagination style="position: relative;" v-show="recordPagination.total > 0" :total="recordPagination.total" v-model:page="recordPagination.pageNum" v-model:limit="recordPagination.pageSize" @pagination="getRecordData" />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog :title="paymentTitle" v-model="visible.paymentVisible" append-to-body destroy-on-close :before-close="handlePaymentClose" width="500px">
      <div class="payment-dialog-top">{{ form.payment.stallName }}</div>
      <el-form ref="paymentRef" :model="form.payment" :rules="rules.paymentRules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="表具名称:" prop="deviceId">
          <el-select v-model="form.payment.deviceId" style="width: 250px;" :disabled="popoverDisabled" @change="payDeviceSelectChange">
            <el-option v-for="(item, index) in deviceListOption" :key="index" :label="item.name" :value="item.deviceId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'剩余' + payDialog.label" prop="restMoney">
          <div class="rest-money-box">
            <div class="rest-inner-box">
              <div class="rest-money-out-circle">
                <div class="rest-money-inner-circle"></div>
              </div>
              <div class="rest-money-text">剩余{{ payDialog.label }} {{ form.payment.restAmount }} {{ payDialog.unit }}</div>
            </div>
            <div class="rest-inner-box">
              <div class="rest-money-out-circle">
                <div class="rest-money-inner-circle"></div>
              </div>
              <div class="rest-money-text">单价：{{ form.payment.perPrice }}</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="form.payment.type == 1 ? '充值金额' : '退费金额'" prop="amount">
          <el-input v-model="form.payment.amount" oninput="value=value.replace(/[^\d.]/g,'')" style="width: 250px;" placeholder="">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="  " prop="">
          <div class="mony-option-box" style="max-width: 260px;">
            <div class="option-item" v-for="(item, index) in form.payment.moneyOption" @click="clickMoneyOption(index, item)" :key="item" :class="{ 'option-item-active': form.payment.moneyItem == index }">{{ item }}</div>
          </div>
        </el-form-item>
        <el-form-item label="交易单号:" prop="number">
          <el-input v-model="form.payment.number" placeholder="请输入交易单号" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="form.payment.remark" placeholder="请输入备注" style="width: 250px;"></el-input>
        </el-form-item>
        <!-- <el-radio v-model="form.payment.isPrint" label="1" style="margin-left: 26%;">是否打印</el-radio> -->
        <div v-show="payBoxVisible">
          <PayBox :key="payBoxKey" ref="payBoxRef" :type="paymentTitle" :data="payBoxData" @falseWatchVisible="falseWatchVisible"></PayBox>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handlePaymentClose">取消</el-button>
          <el-button type="primary" @click="paymentConfirm(paymentRef)" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog :title="stallStatusTitle" v-model="visible.stallStatusVisible" append-to-body destroy-on-close :before-close="handleStallStatusClose" width="500px">
      <el-form ref="mobilizationRef" :model="form.merchant" :rules="rules.merchantRules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="摊位名称" prop="stallName">
          <el-input v-model="form.merchant.stallName" style="width: 250px;" :disabled="form.merchant.type == 2" placeholder="请输入摊位名称"></el-input>
        </el-form-item>
        <el-form-item :label="form.merchant.type == 1 ? '进场日期' : '离场日期'" prop="time">
          <el-date-picker v-model="form.merchant.time" style="width: 250px;" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact" v-if="form.merchant.type == 1">
          <el-input v-model="form.merchant.contact" style="width: 250px;" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" v-if="form.merchant.type == 1">
          <el-input v-model="form.merchant.phone" style="width: 250px;" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard" v-if="form.merchant.type == 1">
          <el-input v-model="form.merchant.idCard" style="width: 250px;" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" v-if="form.merchant.type == 1">
          <el-input v-model="form.merchant.remark" style="width: 250px;" placeholder="请输入备注"></el-input>
        </el-form-item>
        <div style="margin-left: 11%;width: 340px;;display: flex;justify-content: space-between;">
          <el-icon style="color: rgba(250,150,0);padding-top: 4px;">
            <Warning />
          </el-icon>
          <span style="color: #8E92BC;padding-left: 8px;line-height: 1.5">
            商户{{ stallStatusTitle }}后会重置当前摊位交易记录等信息，并将历史数据进行存档，请谨慎操作！
          </span>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleStallStatusClose">取消</el-button>
          <el-button type="primary" @click="stallStatusConfirm(mobilizationRef)" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="编辑" v-model="visible.modifyInfoVisible" append-to-body destroy-on-close :before-close="handleModifyClose" width="500px">
      <el-form ref="modifyRef" :model="form.modify" :rules="rules.modifyRules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="摊位名称" prop="stallName">
          <el-input v-model="form.modify.stallName" style="width: 250px;" :disabled="form.merchant.type == 2" placeholder="请输入摊位名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.modify.contacts" style="width: 250px;" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input v-model="form.modify.phonenumber" style="width: 250px;" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.modify.idCard" style="width: 250px;" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.modify.remark" style="width: 250px;" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleModifyClose">取消</el-button>
          <el-button type="primary" @click="modifyConfirm(modifyRef)" :loading="dialogLoading">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- @mouseleave="visiblePopover = false; inPopover = false" -->
    <el-popover v-if="visiblePopover" v-model:visible="visiblePopover" placement="right" popper-class="stall-popper" trigger="hover" :virtual-ref="tempRef" virtual-triggering :width="400">
      <div @mouseover="inPopover = true" @mouseleave="visiblePopover = false; inPopover = false" style="padding: 12px;">
        <div class="stall-name-popover">
          <div class="out-circle" :style="{ 'backgroundColor': filterStyle(pop2It.status).outRingColor }">
            <div class="inner-circle" :style="{ 'backgroundColor': filterStyle(pop2It.status).innerRingColor }"></div>
          </div>
          <div class="center-stall-name">{{ pop2It.stallName }}</div>
        </div>
        <div class="stall-name-popover-info" v-if="pop2It.inTime || pop2It.phonenumber || pop2It.contacts">
          <div style="margin-top: 4px;margin-bottom: 5px;">
            <span class="info-key">进场日期:</span> {{ pop2It.inTime ? pop2It.inTime.substring(0, 10) : '' }}
          </div>
          <div style="margin-top: 4px;margin-bottom: 5px;">
            <span class="info-key">手机号:</span> {{ pop2It.phonenumber }}
          </div>
          <div style="margin-top: 4px;margin-bottom: 5px;">
            <span class="info-key">联系人:</span> {{ pop2It.contacts }}
          </div>
        </div>
        <div v-else class="stall-name-popover-info">暂无商户</div>
        <div class="device-popover-box" v-if="pop2It.deviceVos.length">
          <div class="pop-device-item" v-for="(i, ix) in pop2It.deviceVos" :key="ix">
            <div style="display: flex;justify-content: flex-start;align-items: center;">
              <div style="position: relative;padding-top: 10px;">
                <div style="width: 36px;height: 36px;text-align: center;line-height: 36px;border-radius: 50%;background-color: #EEF3FF;color: #4960E5;">
                  {{ i.deviceType ? i.deviceType[0] : '' }}
                </div>
                <span class="top-status" style="position: absolute;top: 7px;right: -7px;" :class="{ 'status-online': i.online == '0' }"></span>
              </div>
              <div style="margin-left: 10px;width: 87%;">
                <div class="item-top" style="padding-left: 10px;font-size: 14px;">
                  <span>【{{ i.online == '0' ? '正常' : '离线' }}】</span>
                  <span style="padding-left: 10px;">{{ i.name }}</span>
                </div>
                <div class="item-bot">
                  <div>{{ i.indicationAmount ? i.indicationAmount : 0 }}元</div>
                  <div>
                    <el-button size="small" v-hasPermi="['chaoyang:stall:info:charge']" class="bot-button" @click="popoverRecharge(pop2It, i)">充值</el-button>
                    <el-button size="small" v-hasPermi="['chaoyang:stall:info:refund']" class="bot-button" @click="popoverRefund(pop2It, i)">退费</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="device-popover-box" style="padding-left: 20px;padding-top: 20px;color: #8E92BC;" v-else>
          暂未绑表
        </div>
      </div>
    </el-popover>

    <el-popover v-if="visibleImgPopover" v-model:visible="visibleImgPopover" placement="bottom" popper-class="stall-popper" trigger="hover" :virtual-ref="tempImgRef" virtual-triggering :width="110">
      <div @mouseleave="visibleImgPopover = false; inImgPopover = false" @mouseover="inImgPopover = true" style="padding: 12px;">
        <div style="padding: 16px 0px 0px 26px;">
          <div class="popover-item" v-hasPermi="['chaoyang:stall:info:charge']" @click="stallOperate(1, pop2ImgIt, pop2ImgItem)">
            <img src="@/assets/images/money.png" alt="">
            <span style="padding-left: 16px;">缴费</span>
          </div>
          <div class="popover-item" v-hasPermi="['chaoyang:stall:info:refund']" @click="stallOperate(2, pop2ImgIt, pop2ImgItem,)">
            <img src="@/assets/images/stallInfoTui.png" alt="">
            <span style="padding-left: 16px;">退费</span>
          </div>
          <div v-if="pop2ImgIt.businessId == null" class="popover-item" v-hasPermi="['chaoyang:stall:info:checkin']" @click="stallOperate(3, pop2ImgIt, pop2ImgItem)">
            <img src="@/assets/images/stallInfoIn.png" alt="">
            <span style="padding-left: 16px;">入场</span>
          </div>
          <div v-else class="popover-item" v-hasPermi="['chaoyang:stall:info:leave']" @click="stallOperate(3, pop2ImgIt, pop2ImgItem)">
            <img src="@/assets/images/stallInfoIn.png" alt="">
            <span style="padding-left: 16px;">离场</span>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, reactive, onMounted } from "vue";
import boothService from '@/api/payment/booth';
import { Search } from '@element-plus/icons-vue';
import deviceComponent from './child/device.vue';
import chart from './child/chart.vue';
import toThousand from '@/utils/thousand';
import Split from '@/components/Split/index.vue';
import stallService from '@/api/payment/stall'
import businessService from '@/api/payment/business'
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import { checkPhonenumber } from '@/utils/validate'
import PayBox from '@/components/PayBox/index.vue'

const router = useRouter()

let payBoxVisible = ref(false)
let payBoxData = ref(null)
let watchVisible = ref(false)
let payBoxKey = ref(null);
let payBoxRef = ref()

const refMap = ref({})
const refImgMap = ref({})
let visiblePopover = ref(false)
let visibleImgPopover = ref(false)
let tempRef = ref()
let tempImgRef = ref()
let pop2Item = ref(null);
let pop2It = ref(null);
let pop2ImgItem = ref(null);
let pop2ImgIt = ref(null);
let inPopover = ref(false);
let inImgPopover = ref(false);
let timer = null;
let timer1 = null;
watch(() => visiblePopover.value, (newValue) => {
  if (newValue) {
    timer = setTimeout(() => {
      visiblePopover.value = false;
    }, 2000)
  }
})
watch(() => inPopover.value, (newValue) => {
  if (newValue) {
    clearTimeout(timer)
  }
})

watch(() => visibleImgPopover.value, (newValue) => {
  if (newValue) {
    timer1 = setTimeout(() => {
      visibleImgPopover.value = false;
    }, 2000)
  }
})
watch(() => inImgPopover.value, (newValue) => {
  if (newValue) {
    clearTimeout(timer1)
  }
})
function handleRef (ref, item, it) {
  tempRef.value = ref;
  pop2Item.value = item;
  pop2It.value = it;
  visiblePopover.value = true;
  visibleImgPopover.value = false;
}
function handleImgRef (ref, item, it) {
  tempImgRef.value = ref;
  pop2ImgItem.value = item;
  pop2ImgIt.value = it;
  visibleImgPopover.value = true;
  visiblePopover.value = false;
}

function handleStallStatus (it) {
  let obj = {};
  if (it.status == '1') {
    obj = filterStyle(it.status)
  } else {
    let hasOffline = false;
    let otherStatus = '';
    it.deviceVos.forEach(device => {
      if (device.online == '1') {
        hasOffline = true;
        otherStatus = '2'
      }
    })
    if (hasOffline) {
      obj = filterStyle(otherStatus)
    } else {
      obj = filterStyle(it.status)
    }
  }
  return obj;
}

function getDeviceUnit (device) {
  let unit = "";
  if (device.supAmount == 0) {
    unit = device.deviceType.includes('电') ? 'kwh' : device.deviceType.includes('水') ? 't' : ''
  } else if (device.supAmount == 1) {
    unit = '元'
  }
  return unit
}

let pageStep = ref(1);
let countNumber = reactive({
  total: null,
  kz: null,
  lx: null,
  bj: null
})
function getTabNum (index) {
  let result = "";
  if (index == -1) {
    result = '(' + countNumber.total + ')'
  } else if (index == 0) {
    result = '(' + countNumber.zc + ')'
  } else if (index == 1) {
    result = '(' + countNumber.kz + ')'
  } else if (index == 2) {
    result = '(' + countNumber.lx + ')'
  } else if (index == 3) {
    result = '(' + countNumber.bj + ')'
  }
  return result;
}

let treeData = ref(null);
let currentTreeNodeKey = ref(null)
let currentNode = ref(null)
const treeProps = {
  label: 'regionName',
  children: 'children',
  isLeaf: 'leaf',
  id: 'regionId',
  parentId: 'parentId',
  isEdit: false
}
let pageLoading = ref(false)
const statusTabs = [
  {
    label: '全部',
    color: '',
    bgc: '',
    key: -1
  },
  {
    label: '正常',
    color: '#141522',
    bgc: '#FBFAFF',
    key: '0',
    outRingColor: 'rgba(59,189,64, 0.5)',
    innerRingColor: 'rgba(59,189,64, 1)'
  },
  {
    label: '空置',
    color: '#141522',
    bgc: '#E6EFFA',
    key: '1',
    outRingColor: 'rgba(61,137,233, 0.5)',
    innerRingColor: '#0D6CE4'
  },
  {
    label: '离线',
    color: '#F0880A',
    bgc: '#FAF2E6',
    key: '2',
    outRingColor: 'rgba(243,160,59,0.5)',
    innerRingColor: '#F0880A'
  },
  {
    label: '报警',
    color: '#E54045',
    bgc: '#FAEBEB',
    key: '3',
    outRingColor: 'rgba(235,89,94,0.5)',
    innerRingColor: '#E54045'
  },
]

let popoverDisabled = ref(false)

let currentActiveTab = ref(0)
let searchText = ref("")

let stallDetailInfo = ref(null)

const originRegionStallData = reactive({
  data: []
})
const regionStallData = ref([])

let record = reactive({
  searchTime: moment().format('YYYY-MM-DD'),
  orderType: null,
  orderPlatform: null,
  notes: null,
})

let recordTableData = ref(null)
let recordPagination = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0,
})

const paymentRef = ref();
const mobilizationRef = ref();
const modifyRef = ref();

const deviceListOption = ref(null)

let dialogLoading = ref(false)
let paymentTitle = ref('')
let stallStatusTitle = ref('')
let visible = reactive({
  paymentVisible: false,
  stallStatusVisible: false,
  modifyInfoVisible: false
})
let form = reactive({
  payment: {
    deviceId: null,
    amount: null,
    restAmount: null,
    number: null,
    remark: null,
    isPrint: null,
    perPrice: '',
    type: 1,  //1 充值  2 退费
    moneyOption: [50, 100, 200, 500, 1000],
    moneyItem: null,
    stallName: null,
    businessId: null,
    stallId: null,
    deviceName: ""
  },
  merchant: {
    stallName: null,
    time: moment().format('YYYY-MM-DD'),
    contact: null,
    phone: null,
    idCard: null,
    remark: null,
    stallId: null,
    businessId: null,
    type: 1,  //1 进场  2 离场
  },
  modify: {
    stallName: null,
    contacts: null,
    phonenumber: null,
    idCard: null,
    remark: null
  }
})

const phonenumberRule = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号！'))
  } else {
    if (checkPhonenumber(value)) {
      callback()
    } else {
      callback(new Error('该手机号格式不规范！'))
    }
  }
}

const rules = reactive({
  paymentRules: {
    deviceId: [
      { required: true, message: '请选择表具', trigger: 'change' },
    ],
    amount: [
      { required: true, message: '输入框不可为空', trigger: 'blur' },
    ]
  },
  merchantRules: {
    stallName: [
      { required: true, message: '请输入摊位名称', trigger: 'blur' },
    ],
    time: [
      { required: true, message: '请选择日期', trigger: 'blur' },
    ],
    contact: [
      { required: true, message: '请输入联系人', trigger: 'blur' },
    ],
    phone: [
      { validator: phonenumberRule, trigger: 'blur', required: true, },
    ],
  },
  modifyRules: {
    stallName: [
      { required: true, message: '请输入摊位名称', trigger: 'blur' },
    ],
    contacts: [
      { required: true, message: '请输入联系人', trigger: 'blur' },
    ],
    phonenumber: [
      { validator: phonenumberRule, trigger: 'blur', required: true, },
    ],
  }
})

let payDialog = reactive({
  label: "金额：",
  unit: "元",
  amountLabel: form.payment.type == 1 ? '充值金额:' : '退费金额:',
  inputUnit: '元'
})

onBeforeMount(() => {
  getTree();
  if (router.currentRoute.value.query.stallId) {
    stallService.getBusinessDetailInfo(router.currentRoute.value.query.stallId).then(res => {
      stallDetailInfo.value = res.data;
      getRecordData();
      pageStep.value = 2;
    });
  }
  if (sessionStorage.getItem('stallPage')) {
    detail(JSON.parse(sessionStorage.getItem('stallPage')))
  }
})

onMounted(() => {
  window.addEventListener('resize', () => {
    if (document.getElementsByClassName('chart-box').length > 0) {
      let chart_box = document.getElementsByClassName('chart-box')[0].offsetWidth;
      let device_info_arr = document.getElementsByClassName('device-info');
      let chart_box_arr = document.getElementsByClassName('chart-box');
      if (chart_box <= 450) {
        for (let i = 0; i < device_info_arr.length; i++) {
          device_info_arr[i].style.visibility = 'hidden';
        }
      } else {
        for (let i = 0; i < device_info_arr.length; i++) {
          device_info_arr[i].style.visibility = 'visible';
        }
      }
      if (chart_box <= 338) {
        for (let i = 0; i < chart_box_arr.length; i++) {
          chart_box_arr[i].style.visibility = 'hidden';
        }
      } else {
        for (let i = 0; i < chart_box_arr.length; i++) {
          chart_box_arr[i].style.visibility = 'visible';
        }
      }
    }
  })
})

function setSellStyle ({ row, column, rowIndex, columnIndex }) {
  let textAlign = {};
  //数值型
  // if (columnIndex == 4) {
  //   textAlign = { 'text-align': 'right' }
  // }
  //字符串类型
  if (columnIndex == 2 || columnIndex == 3 || columnIndex == 4) {
    textAlign = { 'text-align': 'left' }
  }
  //日期类型
  if (columnIndex == 1 || columnIndex == 0) {
    textAlign = { 'text-align': 'center' }
  }
  return textAlign;
}

const getTree = () => {
  currentTreeNodeKey.value = 1;
  boothService.getRegionTree().then(res => {
    treeData.value = res.data;
    if (currentNode.value == null) {
      currentNode.value = res.data[0];
    }
    getList();
  })
}

let stallDataLoading = ref(false)
const getList = () => {
  let params = {
    regionId: currentNode.value.regionId,
    stallName: searchText.value
  }
  stallDataLoading.value = true;
  stallService.getRegionTreeTile2(params).then(res => {
    countNumber.total = res.data.total;
    countNumber.zc = res.data.zc;
    countNumber.kz = res.data.kz;
    countNumber.lx = res.data.lx;
    countNumber.bj = res.data.bj;
    regionStallData.value = res.data.regionData;
    originRegionStallData.data = JSON.parse(JSON.stringify(res.data.regionData));
    if (sessionStorage.getItem('stallStatusInfo')) {
      const { index, key } = JSON.parse(sessionStorage.getItem('stallStatusInfo'));
      tabChange(index, key);
    }
  }).finally(() => {
    stallDataLoading.value = false;
  })
}

const nodeClick = (current) => {
  currentNode.value = current;
  currentTreeNodeKey.value = current.regionId;
  getList()
}

const tabChange = (index, key) => {
  currentActiveTab.value = index;
  stallDataLoading.value = true;
  if (key == -1) {
    nextTick(() => {
      regionStallData.value = JSON.parse(JSON.stringify(originRegionStallData.data));
    })
  } else {
    nextTick(() => {
      originRegionStallData.data.forEach((it, idx) => {
        let temp = it.stallList.filter(i => {
          return i.status == key;
        })
        regionStallData.value[idx].stallList = JSON.parse(JSON.stringify(temp))
      })
    })
  }
  sessionStorage.setItem('stallStatusInfo', JSON.stringify({ index: index, key: key }));
  stallDataLoading.value = false;
}

const filterStyle = (status) => {
  let obj = statusTabs.filter(item => {
    return item.key == status
  })[0];
  return obj
}

const detail = (it) => {
  recordPagination.total = 0;
  pageLoading.value = true;
  stallService.getBusinessDetailInfo(it.stallId).then(res => {
    stallDetailInfo.value = res.data;
    getRecordData();
    pageStep.value = 2;
    sessionStorage.setItem('stallPage', JSON.stringify({ status: it.status, stallId: it.stallId }));
  }).catch(err => { }).finally(() => {
    pageLoading.value = false;
  })
}

const getStallInfo = (stallId) => {
  let id = stallId ? stallId : stallDetailInfo.value.stallId;
  stallService.getBusinessDetailInfo(id).then(res => {
    stallDetailInfo.value = res.data;
  });
}

const back = () => {
  if (router.currentRoute.value.query.stallId) {
    let url = getNewUrl('stallId');
    window.history.replaceState(null, null, url);
  }
  sessionStorage.removeItem('stallPage')
  getList();
  pageStep.value = 1;
}

const editStallName = () => {
  form.modify.stallName = stallDetailInfo.value.stallName;
  form.modify.contacts = stallDetailInfo.value.contacts;
  form.modify.phonenumber = stallDetailInfo.value.phonenumber;
  form.modify.idCard = stallDetailInfo.value.idCard;
  form.modify.remark = stallDetailInfo.value.remark;
  visible.modifyInfoVisible = true;
}

const stallOperate = (type, stall, region) => {
  switch (type) {
    case 1: {
      paymentTitle.value = '缴费';
      form.payment.type = 1;
      form.payment.stallName = stall.stallName;
      deviceListOption.value = stall.deviceVos;
      form.payment.businessId = stall.businessId;
      form.payment.stallId = stall.stallId;
      visible.paymentVisible = true;
      break;
    }
    case 2: {
      paymentTitle.value = '退费';
      form.payment.type = 2;
      form.payment.stallName = stall.stallName;
      deviceListOption.value = stall.deviceVos;
      form.payment.businessId = stall.businessId;
      form.payment.stallId = stall.stallId;
      visible.paymentVisible = true;
      break;
    }
    case 3: {
      stallStatusTitle.value = stall.businessId == null ? '进场' : '离场';
      form.merchant.type = stall.businessId == null ? 1 : 2;
      form.merchant.stallName = stall.stallName;
      form.merchant.stallId = stall.stallId;
      form.merchant.businessId = stall.businessId;
      visible.stallStatusVisible = true;
      break;
    }
  }
}

const handlePaymentClose = () => {
  payBoxRef.value.close();
  payBoxData.value = null;
  visible.paymentVisible = false;
  form.payment.stallId = null;
  form.payment.type = 1;
  form.payment.businessId = null;
  form.payment.deviceId = null;
  form.payment.restAmount = null;
  form.payment.perPrice = null;
  resetPayData();
  payDialog.label = "金额：";
  payDialog.unit = "元";
  payDialog.amountLabel = form.payment.type == 1 ? '充值金额:' : '退费金额:';
  payDialog.inputUnit = '元';
  if (stallDetailInfo.value) {
    stallService.getBusinessDetailInfo(stallDetailInfo.value.stallId).then(res => {
      nextTick(() => {
        stallDetailInfo.value = res.data;
      })
      getRecordData();
    }).catch(err => { }).finally(() => {
      pageLoading.value = false;
    })
  } else {
    getList();
  }
}

const resetPayData = () => {
  form.payment.amount = null;
  form.payment.number = null;
  form.payment.isPrint = null;
  form.payment.moneyItem = null;
  form.payment.remark = null;
  form.payment.stallName = null;
  form.payment.deviceName = "";
  popoverDisabled.value = null;
}

const payDeviceSelectChange = () => {
  let temp = deviceListOption.value.filter(item => {
    return item.deviceId == form.payment.deviceId
  })[0];
  form.payment.restAmount = temp.indicationAmount;
  form.payment.perPrice = temp.price + (temp.deviceType.includes('电') ? ' 元/kwh' : ' 元/t');
  form.payment.deviceName = temp.name;
  payDialog.label = temp.supAmount == 0 ? '用量:' : temp.supAmount == 1 ? '金额:' : '';
  payDialog.unit = getDeviceUnit(temp);
  payDialog.amountLabel = getDialogAmountLabel(temp);
}

const falseWatchVisible = () => {
  watchVisible.value = false;
}

const paymentConfirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let params = {
        deviceId: form.payment.deviceId,
        money: form.payment.amount,
        orderNumber: form.payment.number,
        remark: form.payment.remark,
        stallId: form.payment.stallId || stallDetailInfo.value.stallId,
        businessId: form.payment.businessId || stallDetailInfo.value.businessId,
      }
      if (form.payment.type == 1) {
        dialogLoading.value = true;
        businessService.businessRecharge(params).then(res => {
          ElMessage({
            type: 'success',
            message: '正在充值中，请耐心等待充值成功'
          })
          payBoxData.value = {
            orderNo: res.data.orderNo,
            beforeAmount: res.data.beforeAmount,
            afterAmount: res.data.afterAmount,
            deviceName: form.payment.deviceName,
            money: form.payment.amount,
            unit: payDialog.inputUnit
          }
          payBoxVisible.value = true;
          payBoxRef.value.openPayBox();
          payment.restAmount = res.data.afterAmount;
        }).catch(err => { }).finally(() => {
          dialogLoading.value = false;
          // handlePaymentClose();
          resetPayData();
        })
      } else {
        dialogLoading.value = true;
        businessService.businessRefund(params).then(res => {
          ElMessage({
            type: 'success',
            message: '正在退费中，请耐心等待退费成功'
          })
          payBoxData.value = {
            orderNo: res.data.orderNo,
            beforeAmount: res.data.beforeAmount,
            afterAmount: res.data.afterAmount,
            deviceName: form.payment.deviceName,
            money: form.payment.amount,
            unit: payDialog.inputUnit
          }
          payBoxVisible.value = true;
          payBoxRef.value.openPayBox();
          payment.restAmount = res.data.afterAmount;
        }).catch(err => { }).finally(() => {
          dialogLoading.value = false;
          resetPayData();
          // handlePaymentClose();
          // if (stallDetailInfo.value) {
          //   stallService.getBusinessDetailInfo(stallDetailInfo.value.stallId).then(res => {
          //     nextTick(() => {
          //       stallDetailInfo.value = res.data;
          //     })
          //     getRecordData();
          //   }).catch(err => { }).finally(() => {
          //     pageLoading.value = false;
          //   })
          // }
          // getList();
        })
      }
    }
  })
}

const clickMoneyOption = (index, money) => {
  form.payment.moneyItem = index;
  form.payment.amount = money;
}

const handleStallStatusClose = () => {
  visible.stallStatusVisible = false;
  form.merchant.contact = null;
  form.merchant.idCard = null;
  form.merchant.phone = null;
  form.merchant.remark = null;
  form.merchant.stallName = null;
  form.merchant.time = moment().format('YYYY-MM-DD');
  form.merchant.type = null;
  form.merchant.stallId = null;
  form.merchant.businessId = null;
}

const stallStatusConfirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (form.merchant.type == 1) {
        let params = {
          stallName: form.merchant.stallName,
          contacts: form.merchant.contact,
          idCard: form.merchant.idCard,
          inTime: form.merchant.time + ' ' + '00:00:00',
          phonenumber: form.merchant.phone,
          remark: form.merchant.remark,
          stallId: form.merchant.stallId
        }
        dialogLoading.value = true;
        businessService.businessIn(params).then(res => {
          ElMessage({
            message: '进场成功!',
            type: 'success',
          })
        }).catch(err => { }).finally(() => {
          dialogLoading.value = false;
          getStallInfo(form.merchant.stallId);
          handleStallStatusClose();
          getList();
          getRecordData();
        })
      } else if (form.merchant.type == 2) {
        let params = {
          businessId: form.merchant.businessId,
          outTime: form.merchant.time + ' ' + '00:00:00',
          stallId: form.merchant.stallId
        }
        dialogLoading.value = true;
        businessService.businessOut(params).then(res => {
          ElMessage({
            message: '离场成功!',
            type: 'success',
          })
        }).catch(err => { }).finally(() => {
          dialogLoading.value = false;
          getList();
          handleStallStatusClose();
          getStallInfo();
          getRecordData();
        })
      }
    }
  })
}

const handleModifyClose = () => {
  form.modify.contacts = null;
  form.modify.idCard = null;
  form.modify.phonenumber = null;
  form.modify.remark = null;
  form.modify.stallName = null;
  visible.modifyInfoVisible = false;
}

const modifyConfirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let params = {
        businessId: stallDetailInfo.value.businessId,
        phonenumber: form.modify.phonenumber,
        contacts: form.modify.contacts,
        idCard: form.modify.idCard,
        remark: form.modify.remark,
        stallName: form.modify.stallName,
        stallId: stallDetailInfo.value.stallId
      }
      dialogLoading.value = true;
      businessService.businessModify(params).then(res => {
        ElMessage({
          message: '修改成功!',
          type: 'success',
        })
      }).catch(err => { }).finally(() => {
        dialogLoading.value = false;
        getStallInfo(stallDetailInfo.value.stallId);
        handleModifyClose();
      })
    }
  })
}

const getRecordData = () => {
  let params = {
    pageSize: recordPagination.pageSize,
    pageNum: recordPagination.pageNum,
    searchTime: record.searchTime,
    orderPlatform: record.orderPlatform,
    orderType: record.orderType,
    notes: record.notes,
    stallId: stallDetailInfo.value.stallId,
    businessId: stallDetailInfo.value.businessId
  }
  if (params.businessId) {
    businessService.businessRecord(params).then(res => {
      recordTableData.value = res.rows;
      recordPagination.total = res.total;
    })
  } else {
    recordTableData.value = [];
    recordPagination.total = 0;
  }
}

const transStatus = (type, isDevice) => {
  let result = "";
  if (isDevice) {
    switch (type) {
      case '0': {
        result = '正常'
        break;
      }
      case '1': {
        result = '低量报警'
        break;
      }
      case '2': {
        result = '欠费报警'
        break;
      }
      case '3': {
        result = '强制关断'
        break;
      }
      case '4': {
        result = '强制合闸'
        break;
      }
      default: {
        result = '暂无'
      }
    }
  } else {
    switch (type) {
      case '0': {
        result = '正常'
        break;
      }
      case '1': {
        result = '空置'
        break;
      }
      case '2': {
        result = '离线'
        break;
      }
      case '3': {
        result = '报警'
        break;
      }
      default: {
        result = '暂无'
      }
    }
  }
  return result
}

const step2charge = (device) => {
  if (stallDetailInfo.value.businessId) {
    stallOperate(1, stallDetailInfo.value);
    payDialog.label = device.supAmount == 0 ? '用量:' : device.supAmount == 1 ? '金额:' : '';
    payDialog.unit = getDeviceUnit(device);
    payDialog.amountLabel = getDialogAmountLabel(device);
    form.payment.deviceId = device.deviceId;
    form.payment.restAmount = device.indicationAmount;
    form.payment.perPrice = device.price + (device.deviceType.includes('电') ? ' 元/kwh' : ' 元/t');
    paymentTitle.value = '充值';
    popoverDisabled.value = true;
  } else {
    ElMessage({
      type: 'warning',
      message: '请先入驻商户，再进行充值'
    })
  }
}

const step2refund = (device) => {
  if (stallDetailInfo.value.businessId) {
    stallOperate(2, stallDetailInfo.value);
    payDialog.label = device.supAmount == 0 ? '用量:' : device.supAmount == 1 ? '金额:' : '';
    payDialog.unit = getDeviceUnit(device);
    payDialog.amountLabel = getDialogAmountLabel(device);
    form.payment.deviceId = device.deviceId;
    form.payment.restAmount = device.indicationAmount;
    form.payment.perPrice = device.price + (device.deviceType.includes('电') ? ' 元/kwh' : ' 元/t');
    paymentTitle.value = '退费';
    popoverDisabled.value = true;
  } else {
    ElMessage({
      type: 'warning',
      message: '请先入驻商户，再进行退费'
    })
  }
}

const forceSwitch = (type, device) => {
  let msg = type == 1 ? '送' : '断';
  let message = device.deviceType.includes('电') ? (msg + '电') : (msg + '水');
  ElMessageBox.confirm('是否强制' + message + '?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let params = {
      deviceId: device.deviceId,
      switchNo: type
    }
    pageLoading.value = true;
    businessService.forceSwitch(params).then(res => {
      ElMessage({
        type: 'success',
        message: '已连接至物联平台，请耐心等待' + msg
      })
    }).catch(err => { }).finally(() => {
      pageLoading.value = false;
    })
  }).catch(err => { })
}

const openPrePay = (device) => {
  ElMessageBox.confirm(
    '该操作将开启表具的预付费功能，是否确定开启?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      pageLoading.value = true;
      stallService.openPrepayment({ deviceId: device.deviceId }).then(res => {
        ElMessage({ type: 'success', message: '开启成功!' })
      }).finally(() => {
        pageLoading.value = false;
      })
    }).catch(() => { })
}

const step2InOut = (num) => {
  stallStatusTitle.value = num == 1 ? '进场' : '离场';
  form.merchant.type = num;
  form.merchant.stallName = stallDetailInfo.value.stallName;
  form.merchant.businessId = stallDetailInfo.value.businessId;
  form.merchant.stallId = stallDetailInfo.value.stallId;
  visible.stallStatusVisible = true;
}

const getNewUrl = (name) => {
  let loca = window.location;
  // let baseUrl = loca.origin + loca.pathname + "?";
  let baseUrl = loca.origin + loca.pathname;
  let query = loca.search.substr(1);
  if (query.indexOf(name) > -1) {
    let obj = {}
    let arr = query.split("&");
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split("=");
      obj[arr[i][0]] = arr[i][1];
    };
    delete obj[name];
    let url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
    return url
  };
}

const getDialogAmountLabel = (device) => {
  let result = "";
  if (device.supAmount == 0) {
    if (form.payment.type == 1) {
      result = "充用量:"
    } else {
      result = "退用量:"
    }
    payDialog.inputUnit = device.deviceType.includes('电') ? ' kwh' : 't';
  } else if (device.supAmount == 1) {
    if (form.payment.type == 1) {
      result = "充值金额:"
    } else {
      result = "退费金额:"
    }
    payDialog.inputUnit = "元"
  }
  return result;
}

const popoverRecharge = (stall, device) => {
  stallOperate(1, stall);
  payDialog.label = device.supAmount == 0 ? '用量:' : device.supAmount == 1 ? '金额:' : '';
  payDialog.unit = getDeviceUnit(device);
  payDialog.amountLabel = getDialogAmountLabel(device);
  form.payment.deviceId = device.deviceId;
  form.payment.restAmount = device.indicationAmount;
  form.payment.perPrice = device.price + (device.deviceType.includes('电') ? ' 元/kwh' : ' 元/t');
  paymentTitle.value = '充值';
  popoverDisabled.value = true;
}

const popoverRefund = (stall, device) => {
  stallOperate(2, stall);
  payDialog.label = device.supAmount == 0 ? '用量:' : device.supAmount == 1 ? '金额:' : '';
  payDialog.unit = getDeviceUnit(device);
  payDialog.amountLabel = getDialogAmountLabel(device);
  form.payment.deviceId = device.deviceId;
  form.payment.restAmount = device.indicationAmount;
  form.payment.perPrice = device.price + (device.deviceType.includes('电') ? ' 元/kwh' : ' 元/t');
  paymentTitle.value = '退费';
  popoverDisabled.value = true;
}

</script>

<style lang="scss" scoped>
.stall-container {
  width: 100vw;
  height: calc(100vh - 72px);
  background-color: #F8F8F8;

  .stall-left {
    height: 100%;
    background-color: #fff;
    box-shadow: 4px 0px 8px 0px rgba(0, 0, 0, 0.08);
    // max-width: 280px;
  }

  .stall-tree {
    padding: 32px 20px 20px 20px;
    height: 100%;
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .stall-right {
    // min-width: calc(100% - 304px);
    height: 100%;
    padding: 24px 24px 0 24px;

    .stall-content {
      height: 100%;
      background-color: #fff;
      padding: 16px 24px 0 24px;

      .status-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .status-tab {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        min-width: 900px;

        .tab-item {
          width: 100px;
          height: 35px;
          margin-right: 24px;
          line-height: 35px;
          text-align: center;
          font-size: 16px;
          color: #8E92BC;
          font-weight: 400;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          cursor: pointer;
        }

        .tab-item-active {
          border-bottom: 2px solid #546FFF;
          font-weight: 500;
          color: #141522;
        }
      }

      .stall-list {
        margin-top: 30px;
        height: calc(100% - 63px);
        overflow: auto;
        margin-bottom: 24px;

        .region-name {
          font-size: 14px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #8E92BC;
          margin-bottom: 15px;
        }

        .stall-box {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;

          .stall-item {
            max-width: 200px;
            // max-height: 138px;
            width: 200px;
            min-height: 138px;
            box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
            border-radius: 8px 8px 8px 8px;
            margin-right: 24px;
            margin-bottom: 16px;
            padding: 12px 16px 10px 16px;

            .item-top {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .out-circle {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                position: relative;

                .inner-circle {
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                  position: absolute;
                  top: 3px;
                  left: 3px;
                }
              }

            }

            .item-center {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              margin-top: 16px;
              margin-bottom: 8px;

              .center-stall-name {
                // padding-left: 16px;
                font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                font-weight: 400;
                color: #141522;
                word-break: break-all;
              }
            }

            .item-bottom {
              font-size: 14px;
              color: #141522;
              font-family: Source Han Sans CN-Regular, Source Han Sans CN;
              font-weight: 400;

              .bottom-icon {
                margin-bottom: 4px;
              }
            }
          }
        }
      }
    }
  }

  .popper-style {
    border-radius: 10px !important;
  }

  :deep(.el-popover) {
    border-radius: 10px !important;
  }

  :deep(.el-popper) {
    border-radius: 10px !important;
  }

}

.step2 {
  width: 100%;
  height: 100%;
  padding-top: 24px;

  .step2-text {
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #4960E5;
    padding-right: 8px;
  }

  .step2-back {
    padding-left: 5px;
    cursor: pointer;
  }

  .step-second {
    // margin-top: 24px;
    width: 100%;
    height: 100%;
    // height: calc(100% - 56px);

    .second-left {
      background: #FFFFFF;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.12);
      border-radius: 4px 4px 4px 4px;
      height: 100%;
      padding: 24px 24px 0px 24px;
      position: relative;

      .stall-name-pen {
        margin-top: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #141522;

        .edit-icon {
          cursor: pointer;
          margin-left: 24px;
          padding-top: 5px;
        }
      }

      .step-left-info {
        margin-top: 50px;
        font-size: 14px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #141522;

        .el-row {
          margin-bottom: 8px;
        }

        .left-info-key {
          text-align: left;
        }

        .left-info-value {
          text-align: right;
        }
      }

      .leave-button {
        position: absolute;
        bottom: 60%;
        left: 11%;
        width: 100%;

        button {
          width: 80%;
          height: 42px;
          border-radius: 54px 54px 54px 54px;
          border: 1px solid #4960E5;
          font-size: 16px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #4960E5;
        }
      }
    }
  }

  .step2-right {
    height: calc(100vh - 24px);
    padding-left: 24px;
    padding-right: 24px;
    overflow: auto;

    .display-pic {
      width: 100%;
      background-image: url(@/assets/images/screen-bg.png);
      height: 264px;
      min-height: 264px;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.12);
      border-radius: 4px 4px 4px 4px;
      margin-bottom: 12px;

      .device-pic {
        padding-top: 40px;
        padding-left: 60px;

        .device-pic-title {
          font-size: 20px;
          font-family: Source Han Sans CN-Bold, Source Han Sans CN;
          font-weight: bold;
          color: #141522;
          margin-bottom: 15px;
        }

        .device-pic-common-box {
          margin-top: 9px;
        }

        .device-pic-common-key {
          font-size: 16px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #141522;
          text-align: left;
        }

        .device-pic-common-value {
          font-size: 16px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #8E92BC;
          text-align: right;
        }

        .payment-button {
          background: #4960E5;
          box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.04);
          border-radius: 3px 3px 3px 3px;
          border: 1px solid #4960E5;
          color: #fff;
        }

        .ele-button {
          border-radius: 3px 3px 3px 3px;
          border: 1px solid #4960E5;
          color: #4960E5;
          background-color: rgba(0, 0, 0, 0.01);
        }
      }
    }

    .echarts-pic {
      padding: 16px 12px 0px 50px;
    }

    .record {
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.12);
      border-radius: 4px 4px 4px 4px;
      margin-top: 24px;
      margin-bottom: 32px;
      padding: 24px 20px 24px 24px;

      .record-title {
        border-left: 4px solid #4960E5;
        font-size: 18px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #1C1C28;
        padding-left: 16px;
      }

      .record-option {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 24px;
      }

      .record-distance {
        margin-right: 24px;
      }

      .record-table {
        margin-top: 24px;
        margin-bottom: 24px;
        // min-height: 400px;
      }
    }
  }
}

.rest-money-box {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .rest-inner-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FAF2E6;
    margin-right: 10px;
    border-radius: 3px;
    padding-left: 8px;
    padding-right: 8px;
  }

  .rest-money-out-circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: relative;
    border: 1px solid #FA9600;

    .rest-money-inner-circle {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: 2px;
      border: 1px solid #FA9600;
    }
  }

  .rest-money-text {
    font-size: 12px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #FA9600;
    padding-left: 5px;
  }
}

.mony-option-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;

  .option-item {
    width: 68px;
    height: 32px;
    background: #F4F6FC;
    border-radius: 3px 3px 3px 3px;
    border: 1px solid #4960E5;
    margin-right: 16px;
    margin-bottom: 8px;
    text-align: center;
    color: #8E92BC;
    cursor: pointer;
  }

  .option-item-active {
    color: #4960E5;
  }
}

.payment-dialog-top {
  font-size: 18px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 500;
  color: #141522;
  margin-left: 10%;
  margin-bottom: 24px;
}

:deep(.el-tree-node__label) {
  font-size: 16px;
}

:deep(.el-pagination) {
  right: -8px !important;
  top: -10px !important;
}

.device-popover-box {
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.09);
  margin-top: 10px;

  .pop-device-item {
    margin-bottom: 10px;

    .item-top {
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: #141522;
    }

    .top-status {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #8E92BC;
    }

    .status-online {
      background-color: #3BBD40;
    }

    .item-bot {
      font-size: 18px;
      font-family: Source Han Sans CN-Bold, Source Han Sans CN;
      font-weight: bold;
      color: #4960E5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      padding-left: 10px;

      .bot-button {
        border: 1px solid #546FFF;
        color: #546FFF;
      }
    }
  }

  :deep(.stall-right .el-loading-mask) {
    z-index: 999999999 !important;
  }

  :deep(.el-popper) {
    padding: 0;
  }
}
</style>
