<template>
  <div class="dragContainer">
    <div class="dragContainer_navigation">
      <el-tree
          ref="navigationTree"
          :data="areaData"
          :props="defaultProps"
          node-key="regionId"
          :check-on-click-node="true"
          @node-click.native="handleNodeClick">
        <template #default="{node,data}">
          <div :class="{level3node: data.level === 3, 'nodeActive': currentNodeId === data.regionId}">{{data.regionName}}</div>
        </template>
      </el-tree>
    </div>
    <div class="dragContainer_left" ref="ragContainer" v-if="pageStatus === 'show'">
      <div class="noAreaImg" v-if="noImgUrl">
        <el-upload
            class="avatar-uploader"
            action="/"
            :show-file-list="false"
            :http-request="imgSuccess">
          <el-button type="primary">上传图片</el-button>
        </el-upload>
      </div>
      <template v-else>
        <div
            id="showBox"
            class="dragContainer_left_main"
            :style="{
              backgroundImage: areaImgUrlBg,
              transform: `translate(-50%, -50%) scale(${scaleMultiple})`,
              top: `${transformY}`,
              left: `${transformX}`,
            }"
            @mousedown.stop="dragDiv($event)"
            @mouseup.stop="dragUp"
            @drop.prevent="drop($event)"
            @dragover.prevent="dragover"
            @mousewheel="handleScroll"
        >
          <!--        给元素添加鼠标按下事件不执行任何操作，调用stop修饰符阻止冒泡触发父组件事件-->
          <template v-for="(item, index) in boxContent">
            <div
                v-if="['1','2','3'].includes(item.type)"
                class="box_item"
                :key="item.labelId"
                :id="item.labelId"
                @mouseenter.stop="handleItemMouseEnter(item)"
                @mouseleave.stop="handleItemMouseLeave"
                :style="{
                  top: `${item.positionTop - elHeight / 2}px`,
                  left: `${item.positionLeft - elWidth / 2}px`,
                }"
                :class="{
                  box_active: item.showGroup,
                  box_on: item.isOn === '0'
                }"
            >
              <i class="iconfont icon-shezhi" v-if="item.type === '1'" @click="handleOpenLoopDetail(item)"></i>
              <i class="iconfont icon-fengshan" v-if="item.type === '2'" @click="handleOpenLoopDetail(item)"></i>
              <i class="iconfont icon-jianzhu" v-if="item.type === '3'" @click="handleOpenControlCabinet"></i>
            </div>
            <div
                v-if="item.type === '4'"
                class="box_item box_item_type4"
                :key="item.labelId"
                :id="item.labelId"
                @mouseenter.stop="handleItemMouseEnter(item)"
                @mouseleave.stop="handleItemMouseLeave"
                @click="handleOpenLoopDetail(item)"
                :style="{
                  top: `${item.positionTop - item.positionLength / 4}px`,
                  left: `${item.positionLeft + item.positionWidth / 4}px`,
                  width: `${item.positionWidth}px`,
                  height: `${item.positionLength}px`,
                  transform: `translate(-50%,-50%) rotate(${item.positionRotate}deg)`
                }"
                :class="{ box_active: item.showGroup ,box_type4_on: item.isOn === '0'}"
            >
            </div>
          </template>
        </div>
      </template>
    </div>
    <div class="dragContainer_left" ref="ragContainer" v-if="pageStatus === 'edit'">
        <div
            id="box"
            class="dragContainer_left_main"
            :style="{
              backgroundImage: areaImgUrlBg,
              transform: `translate(-50%, -50%) scale(${scaleMultiple})`,
              top: `${transformY}`,
              left: `${transformX}`
            }"
            @mousedown.stop="dragDiv($event)"
            @mouseup.stop="dragUp"
            @drop.prevent="drop($event)"
            @dragover.prevent="dragover"
            @mousewheel="handleScroll"
            @mousemove="handleBoxMouseMove"
            @mouseleave="handleBoxMouseLeave"
        >
          <!--        给元素添加鼠标按下事件不执行任何操作，调用stop修饰符阻止冒泡触发父组件事件-->
          <template v-for="(item, index) in boxContent">
            <div
                v-if="['1','2','3'].includes(item.type)"
                class="box_item"
                :key="item.labelId"
                :id="item.labelId"
                @dragstart="dragstart($event, 'move', item.labelId)"
                draggable="true"
                @mousedown.stop="() => {}"
                @mouseenter.stop="handleItemMouseEnter(item)"
                @mouseleave.stop="handleItemMouseLeave"
                @click="showItem(item, index)"
                @dragend="dragend($event)"
                :data-type="item.type"
                :style="{
                  top: `${item.positionTop - elHeight / 2}px`,
                  left: `${item.positionLeft - elWidth / 2}px`,
                }"
                :class="{ box_active: item.showGroup,box_focus: index === editItemIdx }"
            >
              <i class="iconfont icon-shezhi" v-if="item.type === '1'"></i>
              <i class="iconfont icon-fengshan" v-if="item.type === '2'"></i>
              <i class="iconfont icon-jianzhu" v-if="item.type === '3'"></i>
              <span class="box_item_delete" @click.stop="deleteBoxItem(index)">×</span>
            </div>
            <div
                v-if="item.type === '4'"
                class="box_item box_item_type4"
                :key="item.labelId"
                :id="item.labelId"
                @dragstart="dragstart($event, 'move', item.labelId)"
                draggable="true"
                @mousedown.stop="() => {}"
                @mouseenter.stop="handleItemMouseEnter(item)"
                @mouseleave.stop="handleItemMouseLeave"
                @click="showItem(item, index)"
                @dragend="dragend($event)"
                :data-type="item.type"
                :style="{
                  top: `${item.positionTop - item.positionLength / 4}px`,
                  left: `${item.positionLeft + item.positionWidth / 4}px`,
                  width: `${item.positionWidth}px`,
                  height: `${item.positionLength}px`,
                  transform: `translate(-50%,-50%) rotate(${item.positionRotate}deg)`
                }"
                :class="{ box_active: item.showGroup,box_focus: index === editItemIdx  }"
            >
              <span class="box_item_delete" @click.stop="deleteBoxItem(index)">×</span>
            </div>
          </template>
        </div>
    </div>
    <div class="dragContainer_right" v-if="pageStatus === 'edit'">
      <div class="dragContainer_right_operate">
        <el-button-group>
          <el-button type="primary" @click="savePage" :loading="saveLoading">保 存</el-button>
          <el-button @click="cancelSaveAndReload">取 消</el-button>
        </el-button-group>
      </div>
      <div class="dragContainer_right_baseTitle"><span>组件</span></div>
      <div class="dragContainer_right_appList">
        <div class="appList_item">
          <div
              class="appList_item_img"
              draggable="true"
              @dragstart="dragstart($event, 'copy')"
              @dragend="dragend($event)"
              data-type="1"
          >
            <i class="iconfont icon-shezhi"></i>
          </div>
          <div class="appList_item_title">灯</div>
        </div>
        <div class="appList_item">
          <div
              class="appList_item_img"
              draggable="true"
              @dragstart="dragstart($event, 'copy')"
              @dragend="dragend($event)"
              data-type="2"
          >
            <i class="iconfont icon-fengshan"></i>
          </div>
          <div class="appList_item_title">风扇</div>
        </div>
        <div class="appList_item">
          <div
              class="appList_item_img"
              draggable="true"
              @dragstart="dragstart($event, 'copy')"
              @dragend="dragend($event)"
              data-type="3"
          >
            <i class="iconfont icon-jianzhu"></i>
          </div>
          <div class="appList_item_title">控制柜</div>
        </div>
        <div class="appList_item">
          <div
              class="appList_item_img"
              draggable="true"
              @dragstart="dragstart($event, 'copy')"
              @dragend="dragend($event)"
              data-type="4"
          >
            <i class="iconfont icon-rectangle"></i>
          </div>
          <div class="appList_item_title">灯柜</div>
        </div>
      </div>
      <div class="dragContainer_right_baseTitle"><span>属性</span></div>
      <div class="box_item_bind" v-if="bindFlag && bindType !== '3'">
        <div class="box_item_type4_setting">
          <div class="box_item_type4_setting_item"  v-if="bindType === '4'">
            <div class="box_item_type4_setting_item_label">灯柜宽度：</div>
            <div class="box_item_type4_setting_item_input">
              <el-input-number  size="small" type="number" v-model="positionWidth" placeholder="请输入"  />
            </div>
          </div>
          <div class="box_item_type4_setting_item" v-if="bindType === '4'">
            <div class="box_item_type4_setting_item_label">灯柜高度：</div>
            <div class="box_item_type4_setting_item_input">
              <el-input-number  size="small" type="number" v-model="positionLength" placeholder="请输入"  />
            </div>
          </div>
          <div class="box_item_type4_setting_item" v-if="bindType === '4'">
            <div class="box_item_type4_setting_item_label">灯柜旋转角度(顺时针)：</div>
            <div class="box_item_type4_setting_item_input">
              <el-input-number  size="small" type="number" v-model="positionRotate" placeholder="请输入"  />
            </div>
          </div>
          <div class="box_item_type4_setting_item">
            <div class="box_item_type4_setting_item_label">设备横坐标：</div>
            <div class="box_item_type4_setting_item_input">
              <el-input-number  size="small" type="number" v-model="positionLeft" placeholder="请输入"  />
            </div>
          </div>
          <div class="box_item_type4_setting_item">
            <div class="box_item_type4_setting_item_label">设备纵坐标：</div>
            <div class="box_item_type4_setting_item_input">
              <el-input-number  size="small" type="number" v-model="positionTop" placeholder="请输入"  />
            </div>
          </div>
        </div>
        <div class="box_item_bind_select">
          <el-select v-model="bindId" size="small" filterable placeholder="请选择回路">
            <el-option
                v-for="item in options"
                :key="item.label"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </div>
        <div class="box_item_bind_button">
          <el-button size="small" @click="cancelBind">取消</el-button>
          <el-button size="small" type="primary" @click="doBind"
          >绑定</el-button
          >
        </div>
      </div>
    </div>
    <div class="reset" v-if="!noImgUrl">
      <el-tooltip
          class="box-item"
          effect="dark"
          content="还原"
          placement="right"
      >
        <el-icon><FullScreen @click="resetBox" /></el-icon>
      </el-tooltip>
    </div>
    <div class="mouseLocation" v-if="showMouseLocation">
      <div>当前鼠标信息：横坐标{{nowMouseX}} 丨 纵坐标{{nowMouseY}}</div>
    </div>
<!--    在展示状态下鼠标移动到设备上，展示回路名称-->
    <div class="loopMsg" v-if="showLoopMsg && pageStatus === 'show'">回路: {{showLoopMsgById}}</div>
    <div class="pageFunctionPart" v-if="pageStatus === 'show' && !noImgUrl">
      <el-popconfirm
          :icon="Warning"
          icon-color="#FFBF00"
          title="确认要删除当前节点图片及配置信息吗？"
          @confirm="clearAllDevice"
      >
        <template #reference>
          <el-button :icon="Delete" plain size="small" type="danger" style="width: 84px;">删除</el-button>
        </template>
      </el-popconfirm>
      <el-upload
          style="display: inline-block;margin: 0 10px;"
          class="avatar-uploader"
          action="/"
          :show-file-list="false"
          :http-request="imgSuccess">
        <el-button plain size="small" style="width: 84px;" >重新上传</el-button>
      </el-upload>
      <el-button :icon="Edit" plain size="small" style="width: 84px;" @click="editPage">编辑</el-button>
    </div>
    <div class="dialogs">
      <control-cabinet
          v-if="openControlCabinet"
          @closeControlCabinet="handleCloseControlCabinet"
          :currentNodeId="currentNodeId"
          :currentNodeName="currentNodeName"
      ></control-cabinet>
      <loop-detail
          v-if="openLoopDetail"
          @closeLoopDetail="handleCloseLoopDetail"
          :loopId="loopId"
      ></loop-detail>
    </div>
  </div>
</template>
<script>
export default {
  name: "dragAndDrop",
};
</script>
<script setup>
import controlCabinet from "./components/controlCabinet";
import loopDetail from "./components/loopDetail";
import {computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import { Delete, Edit, Warning } from '@element-plus/icons-vue'

let boxContent = ref([]); //存放id=box中元素
/**
 * 导航相关内容
 */
import { getMarketMapListApi, getAreaDetailByIdApi } from '@/api/lamp/lightMonitor'
const navigationTree = ref(null)
const defaultProps = {
  children: 'children',
  label: 'regionName',
}
const areaData = ref([])//区域信息列表
const currentNodeId = ref('')//当前被选中区域id
const currentNodeName = ref('')//当前被选中区域名称
const areaImgUrl = ref('')//当前画布底图
//该区域是否有底图，有则可添加设备，否则只能先上传底图
const noImgUrl = computed(()=>{
  return ['',null,undefined].includes(areaImgUrl.value)
})
//TODO
// 画布尺寸动态化设置，结合v-bind()
const areaImgWidth = ref(0)//当前画布宽度
const areaImgHeight = ref(0)//当前画布高度

const areaImgUrlBg = computed(()=>{
  console.log(`${areaImgUrl.value}`)
  return `${areaImgUrl.value}`
})
const areaImgWidthPx = computed(()=>{
  return areaImgWidth.value + 'px'
})
const areaImgHeightPx = computed(()=>{
  return areaImgHeight.value + 'px'
})
const findFirstLevel3Child = (arr) => {
  const length = arr.length;
  for (let i = 0; i < length; i++) {
    if (arr[i].level !== 3 && arr[i].children) {
      return findFirstLevel3Child(arr[i].children);
    } else if (
        arr[i].level === 3 &&
        (!arr[i].children || arr[i].children.length === 0)
    ) {
      const regionId = arr[i].regionId
      const regionName = arr[i].regionName
      return {regionId, regionName}
    }
  }
};
const getMarketMapList = async () => {
  const res = await getMarketMapListApi()
  const {code, rows, msg} = res
  if(code === 200){
    areaData.value = [...rows]
    const sessionId = sessionStorage.getItem('pageReloadId')
    const sessionName = sessionStorage.getItem('pageReloadName')
    let id = ''
    let name = ''
    if(sessionId){
      id = sessionId
      name = sessionName
    }else{
      const {regionId, regionName} = findFirstLevel3Child(areaData.value)
      if(!regionId){
        ElMessage.error('暂无区域信息')
        return
      }
      id = regionId
      name = regionName
    }
    await nextTick(()=>{
      navigationTree.value.setCurrentKey(id, true)
    })
    currentNodeId.value = id
    currentNodeName.value = name
    await getAreaDetail()
    await getAreaList()
  }else{
    ElMessage.error(msg)
  }
}
const handleNodeClick = (data) => {
  pageStatus.value = 'show'
  openControlCabinet.value = false
  openLoopDetail.value = false
  let regionId = ''
  if(data.level === 3){
    boxContent.value = []
    regionId = data.regionId
    currentNodeId.value = regionId
    currentNodeName.value = data.regionName
    getAreaDetail()
    getAreaList()
  }
}
//根据id获取区域详情-底图
const getAreaDetail = async () => {
  const res = await getAreaDetailByIdApi(currentNodeId.value)
  // console.log(res)
  const {code, data, msg} = res
  if(code === 200){
    const domain = location.origin + '/images'
    areaImgUrl.value = data.image ? `url(${domain}/${data.image})` : '' //todo
    // areaImgUrl.value = 'url(http://192.168.1.180:8000/cyimages/1.jpg)'
    // console.log(areaImgUrl.value)
    areaImgWidth.value = data.imageWidth || ''
    areaImgHeight.value = data.imageHeight || ''
  }else{
    ElMessage.error(msg)
  }
}
onMounted(()=>{
  //根据屏幕大小确定缩放比例，使画布能尽量全部展示在屏幕内
  Big.DP = 2
  const w = new Big(ragContainer.value.offsetWidth)
  scaleMultiple.value = Number(w.div(1680));
  getMarketMapList()
  funType()
})
onUnmounted(() => {
  sessionStorage.removeItem('pageReloadId')
  sessionStorage.removeItem('pageReloadName')
  openControlCabinet.value = false
  openLoopDetail.value = false
})
const funType = () => {
  let beginTime = 0; //开始时间
  let differTime = 0; //时间差
  window.onunload = function () {
    differTime = new Date().getTime() - beginTime;
    if (differTime <= 5) {
      console.log("这是关闭");
    } else {
      console.log("这是刷新");
      sessionStorage.setItem('pageReloadId',currentNodeId.value)
      sessionStorage.setItem('pageReloadName',currentNodeName.value)
    }
  };
  window.onbeforeunload = function () {
    beginTime = new Date().getTime();
  };
}
import {uploadImgApi, clearAreaAllMsgApi} from '@/api/lamp/lightMonitor'
//上传底图
const imgSuccess = (params) => {
  openControlCabinet.value = false
  openLoopDetail.value = false
  const file = params.file
  const isJPG = ['image/png','image/jpeg'].includes(file.type);
  if (!isJPG) {
    ElMessage({message:'图片只能是 JPG/PNG 格式!',type:'error'})
    return
  }
  let reader = new FileReader()
  reader.readAsDataURL(params.file)
  reader.onload = e => {
    const img = e.target.result;
    const image = new Image()
    image.src = img
    image.onload = _ => {
      let width = image.width
      let height = image.height
      let formData = new FormData();
      formData.append("file", file);
      formData.append("regionId", currentNodeId.value);
      formData.append("imageWidth", width);
      formData.append("imageHeight", height);
      uploadImgApi(formData).then(res => {
        const {code, msg} = res
        if(code === 200){
          getAreaDetail()
          getAreaList()
        }else{
          ElMessage.error(msg)
        }
      })
    }
  }
}

//清空页面设备信息
const clearAllDevice = async () => {
  openControlCabinet.value = false
  openLoopDetail.value = false
  const params = {
    regionId: currentNodeId.value,
    image: ''
  }
  const res = await clearAreaAllMsgApi(params)
  // console.log(res)
  const {code, msg} = res
  if(code === 200){
    ElMessage.success('删除成功')
    await getAreaDetail()
    await getAreaList()
  }else{
    ElMessage.error(msg)
  }
}
const pageStatus = ref('show'); // show：页面展示状态， edit页面编辑状态
const editPage = () => {
  pageStatus.value = 'edit'
  openControlCabinet.value = false
  openLoopDetail.value = false
}
import {saveNodeListApi, getAreaListByRegionIdApi} from '@/api/lamp/lightMonitor'
const saveLoading = ref(false)
//保存区域设备列表
const savePage = async () => {
  saveLoading.value = true
  const res = await saveNodeListApi(currentNodeId.value, boxContent.value).catch(() => {saveLoading.value = true})
  saveLoading.value = false
  const {code, msg} = res
  if(code === 200){
    ElMessage.success('保存成功')
    await getAreaList()
  }else{
    ElMessage.error(msg)
  }
  pageStatus.value = 'show'
}
//取消数据设置，重新请求上一次数据
const cancelSaveAndReload = async () => {
  await getAreaList()
  pageStatus.value = 'show'
}
//获取页面上所有设备列表
const getAreaList = async () => {
  const params = {
    regionId: currentNodeId.value
  }
  const res = await getAreaListByRegionIdApi(params)
  // console.log(res)
  const {code, rows, msg} = res
  if(code === 200){
    boxContent.value = []
    rows.forEach(d => {
      boxContent.value.push({
        ...d,
        positionLeft: Number(d.positionLeft),
        positionTop: Number(d.positionTop),
        positionWidth: Number(d.positionWidth),
        positionLength: Number(d.positionLength),
        positionRotate: Number(d.positionRotate),
        showGroup:false
      })
    })
    // console.log(boxContent)
  }else{
    ElMessage.error(msg)
  }
}

//定义参数代表盒子中元素大小，这个值传入css设置元素，同时在页面回显时使用
const elWidth = ref(30);
const elHeight = ref(30);
const cssUseWidth = elWidth.value + "px";
const cssUseHeight = elHeight.value + "px";
//画布鼠标滚动放大缩小
import Big from "big.js";
const ragContainer = ref()
const scaleMultiple = ref(1); //结合css实现放大缩小
const handleScroll = (e) => {
  if (e.deltaY < 0) {
    if (scaleMultiple.value <= 3) {
      const num = new Big(scaleMultiple.value); //使用Big.js处理数据防止js数字丢失精度
      scaleMultiple.value = Number(num.plus(0.05));
    }
  } else {
    if (scaleMultiple.value >= 0.1) {
      const num = new Big(scaleMultiple.value);
      scaleMultiple.value = Number(num.minus(0.05));
    }
  }
};
const showMouseLocation = ref(false)
const showLoopMsg = ref(false)
const showLoopMsgById = ref('')
const nowMouseX = ref(0)
const nowMouseY = ref(0)
const handleBoxMouseLeave = () => {
  showMouseLocation.value = false
  nowMouseX.value = 0
  nowMouseY.value = 0
}
const handleBoxMouseMove = (e) => {
  showMouseLocation.value = true
  const el = document.getElementById("box");
  const boxOffsetLeft =
      el.offsetLeft - (el.clientWidth * scaleMultiple.value) / 2; //容器距离屏幕左距离，缩放后要乘以相应的比例.除以2是源点在元素中央
  const boxOffsetTop =
      el.offsetTop - (el.clientHeight * scaleMultiple.value) / 2; //容器距离屏幕上距离，缩放后要乘以相应的比例
  const itemOffsetBoxLeft = e.clientX - boxOffsetLeft;
  const itemOffsetBoxTop = e.clientY - boxOffsetTop;
  nowMouseX.value = Math.floor((itemOffsetBoxLeft - 240) / scaleMultiple.value)
  nowMouseY.value = Math.floor((itemOffsetBoxTop - 70) / scaleMultiple.value)
}
const transformX = ref("50%"); //起始偏移量，结合css保证水平居中
const transformY = ref("50%"); //起始偏移量，结合css保证垂直居中
let storeX = ref(0); //保存上次水平移动距离
let storeY = ref(0); //保存上次垂直移动距离
const dragDiv = (e) => {
  const beginX = e.clientX - storeX.value; //根据上次移动距离确定移动起始点
  const beginY = e.clientY - storeY.value;
  document.onmousemove = (e) => {
    const x = e.clientX - beginX;
    const y = e.clientY - beginY;
    storeX.value = x;
    storeY.value = y;
    transformX.value =
        x > 0 ? `calc(50% + ${Math.abs(x)}px)` : `calc(50% - ${Math.abs(x)}px)`;
    transformY.value =
        y > 0 ? `calc(50% + ${Math.abs(y)}px)` : `calc(50% - ${Math.abs(y)}px)`;
  };
};
const dragUp = () => {
  document.onmousemove = null;
  document.onmouseup = null;
};
/**
 * 拖拽元素至容器相关内容
 */
import { HashCode } from "@/utils/hash";
//生成不重复的hash字符串
const createNewId = (str) => {
  let idHasExist = boxContent.value.some((d) => d.id === str);
  if (idHasExist) {
    const str = HashCode(15);
    createNewId(str);
  } else {
    return str;
  }
};
const dragstart = (e, dragType, labelId = "") => {
  e.dataTransfer.setData("type", e.target.dataset.type);
  e.dataTransfer.setData("dragType", dragType);
  if (labelId) {
    e.dataTransfer.setData("labelId", labelId);
  }
};
const dragend = (e) => {
  e.dataTransfer.clearData();
};
const drop = (e) => {
  const dragType = e.dataTransfer.getData("dragType");
  const el = document.getElementById("box");
  const boxOffsetLeft =
      el.offsetLeft - (el.clientWidth * scaleMultiple.value) / 2; //容器距离屏幕左距离，缩放后要乘以相应的比例.除以2是源点在元素中央
  const boxOffsetTop =
      el.offsetTop - (el.clientHeight * scaleMultiple.value) / 2; //容器距离屏幕上距离，缩放后要乘以相应的比例
  const itemOffsetBoxLeft = e.clientX - boxOffsetLeft;
  const itemOffsetBoxTop = e.clientY - boxOffsetTop;
  if (dragType === "copy") {
    //复制-新增
    const id = HashCode(15);
    const item = {
      labelId: createNewId(id), //检查生成的id是否已经存在，确保id唯一性
      //此处若id=box元素的左边和顶部有具值元素，要相应减去具值元素对应的宽度和高度 start
      //具体算法有待到正式项目环境中调整
      positionLeft: Math.floor((itemOffsetBoxLeft - 240) / scaleMultiple.value),
      positionTop: Math.floor((itemOffsetBoxTop - 70) / scaleMultiple.value),
      //此处若id=box元素的左边和顶部有具值元素，要相应减去具值元素对应的宽度和高度 end
      type: e.dataTransfer.getData("type"),//1圆灯，2风扇，3控制柜，4灯柜
      loopId: "", //回路分组id
      regionId: "", //区域分组id  此处数据要根据左侧导航选中值确认
      showGroup: false, //同组元素被选中，显示相同样式
      positionRotate:0,//灯柜旋转角度
      positionLength:10,//灯柜高
      positionWidth:100,//灯柜宽
    };
    // console.log(item);
    boxContent.value.push(item);
  } else if (dragType === "move") {
    //移动-编辑
    //根据id查找移动元素在数组中的位置，并修改坐标信息
    const labelId = e.dataTransfer.getData("labelId");
    const index = boxContent.value.findIndex((d) => d.labelId === labelId);
    boxContent.value[index]["positionLeft"] = Math.floor((itemOffsetBoxLeft - 240) / scaleMultiple.value);
    boxContent.value[index]["positionTop"] = Math.floor((itemOffsetBoxTop - 70) / scaleMultiple.value);
  }
};
const dragover = () => {
  //我存在的意义是让元素能放置在id=box中，无任何执行操作
};

/**
 * 节点操作相关内容
 */
//删除元素
const deleteBoxItem = (idx) => {
  // console.log(idx,boxContent.value)
  boxContent.value.splice(idx, 1);
};
//定义变量，显示/隐藏绑定下拉框
let bindFlag = ref(false);//是否节点被点击，展示节点配置模块
let bindId = ref(""); //被点击节点id
let bindType = ref(null) //被点击节点类型，1,2展示回路，4展示灯柜配置和回路，3不做任何展示
const positionRotate = ref(0)
const positionLength = ref(0)
const positionWidth = ref(0)
const positionLeft = ref(0)
const positionTop = ref(0)
let editItemIdx = ref(null);
import {getLoopListApi} from '@/api/lamp/lightMonitor'
const getLoopList = async() => {
  const res = await getLoopListApi()
  // console.log(res)
  const {code, data, msg} = res
  if(code === 200){
    options.value = [...data]
  }else{
    ElMessage.error(msg)
  }
}
onMounted(()=>{
  getLoopList()
})
//回路列表
const options = ref([]);
//展示节点信息
const showItem = (item, idx) => {
  console.log(item);
  bindFlag.value = true;
  bindType.value = item.type;
  bindId.value = item.loopId;

  positionWidth.value = boxContent.value[idx].positionWidth
  positionLength.value = boxContent.value[idx].positionLength
  positionRotate.value = boxContent.value[idx].positionRotate
  positionLeft.value = boxContent.value[idx].positionLeft
  positionTop.value = boxContent.value[idx].positionTop
  editItemIdx.value = idx;
};
watch(positionWidth, () =>{
  if(editItemIdx.value || editItemIdx.value === 0)
  boxContent.value[editItemIdx.value].positionWidth = positionWidth.value
})
watch(positionLength, () =>{
  if(editItemIdx.value || editItemIdx.value === 0)
  boxContent.value[editItemIdx.value].positionLength = positionLength.value
})
watch(positionRotate, () =>{
  if(editItemIdx.value || editItemIdx.value === 0)
  boxContent.value[editItemIdx.value].positionRotate = positionRotate.value
})
watch(positionLeft, () =>{
  if(editItemIdx.value || editItemIdx.value === 0)
    boxContent.value[editItemIdx.value].positionLeft = positionLeft.value
})
watch(positionTop, () =>{
  if(editItemIdx.value || editItemIdx.value === 0)
    boxContent.value[editItemIdx.value].positionTop = positionTop.value
})
const cancelBind = () => {
  bindFlag.value = false;
  bindId.value = "";
  editItemIdx.value = null;
  positionWidth.value = 0
  positionLength.value = 0
  positionRotate.value = 0
};
const doBind = () => {
  boxContent.value[editItemIdx.value].loopId = bindId.value;
  cancelBind();
  // console.log(boxContent);
};
const handleItemMouseEnter = (item) => {
  showLoopMsg.value = true
  showLoopMsgById.value = ''
  if (item.loopId) {
    showLoopMsgById.value = options.value.find(d => d.value === item.loopId).label
    boxContent.value.forEach((d) => {
      if (d.loopId === item.loopId) {
        d.showGroup = true;
      }
    });
  }
};
const handleItemMouseLeave = () => {
  showLoopMsg.value = false
  showLoopMsgById.value = ''
  boxContent.value.forEach((d) => {
    d.showGroup = false;
  });
};
const resetBox = () => {
  scaleMultiple.value = 1;
  transformX.value = "50%";
  transformY.value = "50%";
  storeX.value = 0;
  storeY.value = 0;
};

/*
  弹窗相关操作
 */
import {
  openControlCabinet,
  handleOpenControlCabinet,
  handleCloseControlCabinet,
  openLoopDetail,
  loopId,
  handleOpenLoopDetail,
  handleCloseLoopDetail
} from './hook/dialogControl'
</script>
<style scoped lang="scss">
.dragContainer {
  display: flex;
  justify-content: space-between;
  background: #f8f8f8;
  height:calc( 100vh - 70px );
  &_navigation{
    flex: 0 0 240px;
    width:240px;
    height:100%;
    overflow-y: auto;
    background: #ffffff;
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.08);
    padding:24px;
    box-sizing: border-box;
    ::v-deep(.el-tree-node){
      border-radius: 4px;
      overflow: hidden;
    }
    ::v-deep(.el-tree-node__content){
      height:32px;
    }
    ::v-deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content){
      color:#606266;
      background-color: transparent !important;
    }
    ::v-deep(.el-tree-node:focus > .el-tree-node__content){
      color:#606266;
      background-color: transparent !important;
    }
    ::v-deep(.el-tree-node:hover > .el-tree-node__content){
      color:#606266;
      background-color: transparent !important;
    }
    ::v-deep(.el-tree-node__expand-icon.is-leaf){
      display: none;
    }
    .level3node{
      display: block;
      position: relative;
      left:-36px;
      width: 192px !important;
      height: 32px;
      line-height: 32px;
      padding-left:56px;
      box-sizing: border-box;
      border-radius: 4px;
    }
    .nodeActive{
      color:#3BB2f6 !important;
      background: #eff6ff!important;
    }
  }
  &_left {
    flex: 1;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    .noAreaImg{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
    }
    &_main {
      width: v-bind('areaImgWidthPx');
      height: v-bind('areaImgHeightPx');
      //background-image: url(../../../assets/images/lightSetting/market.png);
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      position: absolute;
      //background: #fff;
      user-select: none;
      transition: transform 0.1s linear;
      .box_item {
        position: absolute;
        width: v-bind("cssUseWidth");
        height: v-bind("cssUseHeight");
        border: 2px solid transparent;
        box-sizing: border-box;
        text-align: center;
        user-select: none;
        transition: border-color 0.1s linear;
        color:#B4B9BF;
        i{
          font-size: 26px;
        }
        &:hover {
          .box_item_delete {
            display: block;
          }
        }
        &_delete {
          width: 15px;
          font-size: 12px;
          height: 15px;
          line-height: 12px;
          background: #e60012;
          color: #fff;
          text-align: center;
          position: absolute;
          top: -6px;
          right: -6px;
          border-radius: 50%;
          cursor: pointer;
          display: none;
        }
      }
      .box_item_type4{
        background: #B4B9BF;
      }
      .box_active {
        border-color: #3B82F6;
      }
      .box_on{
        color:#22C55E;
      }
      .box_type4_on{
        background: #22C55E;
      }
      .box_focus{
        animation: bink 1s linear infinite;
      }
    }
  }
  &_right {
    flex: 0 0 200px;
    width: 200px;
    height: 100vh;
    overflow-y: auto;
    background: #ffffff;
    box-shadow: -1px 0 5px 1px #ddd;
    user-select: none;
    &_operate {
      padding: 10px;
      box-sizing: border-box;
      width: 100%;
      ::v-deep(.el-button-group) {
        width: 100%;
      }
      ::v-deep(.el-button) {
        width: 50%;
      }
    }
    &_baseTitle {
      padding:0 10px;
      box-sizing: border-box;
      span{
        display: block;
        font-size: 12px;
        padding: 3px 8px;
        color: #666;
        background-color: #efefef;
        border-radius: 3px;
        margin-top: 8px;
        margin-bottom: 4px;
      }
    }
    &_appList {
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      //min-height: 400px;
      flex-wrap: wrap;
      .appList_item {
        text-align: center;
        margin-right: 20px;
        user-select: none;
        &_img {
          margin-bottom: 10px;
          i {
            color: #000;
          }
        }
        &_title {
          font-size: 12px;
          color: #666;
          transform: scale(0.7);
          white-space: nowrap;
          line-height: 0.7;
        }
      }
    }
    .box_item_bind {
      padding: 10px;
      box-sizing: border-box;
      &_select {
        margin-bottom: 10px;
      }
    }
    .box_item_type4_setting{
      &_item{
        margin-bottom: 10px;
        &_label{
          font-size: 12px;
          margin-bottom: 5px;
        }
      }
    }
  }
  .reset {
    position: fixed;
    bottom: 30px;
    left: 270px;
    cursor: pointer;
    font-size: 25px;
    z-index: 1000;
  }
  .mouseLocation{
    position: fixed;
    top: 80px;
    left: 250px;
    cursor: pointer;
    font-size: 16px;
    z-index: 1000;
    color:#6EB5FF;
  }
  .loopMsg{
    position: fixed;
    top: 80px;
    left: 250px;
    font-size: 12px;
    z-index: 1000;
    background: rgba(0,0,0,.8);
    color:#ffffff;
    height:30px;
    line-height: 30px;
    padding:0 8px;
    border-radius: 3px;
  }
  .pageFunctionPart{
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
  }
}
@keyframes bink {
  0%{
    box-shadow: 0 0 0 0 #22C55E;
  }
  50%{
    box-shadow: 0 0 5px 1px #22C55E;
  }
  100%{
    box-shadow: 0 0 0 0 #22C55E;
  }
}
</style>
