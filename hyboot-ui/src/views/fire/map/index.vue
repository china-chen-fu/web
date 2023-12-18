<template>
  <div class="map-main" v-if="showMap">
    <div id="map-container"></div>
    <div class="time">
      <div>{{ moment().format('YYYY年MM月DD日') }}</div>
      <div>{{ calcWeek }}</div>
      <div>{{ time }}</div>
    </div>
    <div class="num">
      <div class="num-item">
        <div class="num-value">{{ leftBox.regionNum }}</div>
        <div class="num-desc">已监控区域数量</div>
      </div>
      <div class="num-item">
        <div class="num-value">{{ leftBox.deviceNum }} </div>
        <div class="num-desc">设备数量</div>
      </div>
      <div class="num-item" style="cursor: pointer">
        <div class="num-value" style="color: red;">{{ leftBox.todayAlarm }}</div>
        <div class="num-desc">今日异常告警</div>
      </div>
      <div class="num-item" style="cursor: pointer" @click="jumpToAlarm">
        <div class="num-value" style="color: red;">{{ leftBox.totalAlarm }}</div>
        <div class="num-desc">异常告警总数</div>
      </div>
    </div>

    <el-dialog :title="dialogTitle" v-model="visible" append-to-body destroy-on-close :before-close="dialogClose" width="726px">
      <div class="flex-between" style="padding-left: 24px;padding-right: 24px;">
        <div class="loop-title">回路</div>
        <div class="flex-between">
          <div class="basic-status normal">正常</div>
          <div class="basic-status offline">离线</div>
          <div class="basic-status warn">告警</div>
        </div>
      </div>
      <div class="loop-box">
        <template v-if="loopData.data.length">
          <div class="loop-item" v-for="(item, index) in loopData.data" :key="index">
            <img v-if="item.loopStatus == '正常'" src="@/assets/images/fire/loop-zc.svg" alt="">
            <img v-if="item.loopStatus == '离线'" src="@/assets/images/fire/loop-offline.svg" alt="">
            <img v-if="item.loopStatus == '告警'" src="@/assets/images/fire/loop-warn.svg" alt="">
            <div class="loop-name" @click="routeTo(item)">{{ item.loopName }}</div>
          </div>
        </template>
        <div v-else style="text-align: center;width: 100%;height: 100%;padding-top: 10%;">
          <img src="@/assets/images/fire/monitor-chart-null.png" alt="">
          <div style="color: #B4B9BF;">暂无数据</div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button type="primary" @click="dialogConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { shallowRef } from '@vue/reactivity'
import { onMounted } from 'vue';
import moment from 'moment';
import { ref, reactive } from "vue";
import pdcService from "@/api/fire/pdc";
import mapService from '../../../api/fire/map';
import { useRouter, useRoute } from "vue-router"

const router = useRouter();
const route = useRoute();
let showMap = ref(false)
const map = shallowRef(null);
let timer = ref(null)
let time = ref(null)
let leftBox = reactive({
  deviceNum: "0/0",
  regionNum: 0,
  todayAlarm: 0,
  totalAlarm: 0
})

const imgs = [
  { regionName: '农贸', active: "nm-online.svg", inactive: "nm-offline.svg" },
  { regionName: '花卉', active: "hh-online.svg", inactive: "hh-offline.svg" },
  { regionName: '老办公楼', active: "bg-online.svg", inactive: "bg-offline.svg" },
  { regionName: '工艺品', active: "gy-online.svg", inactive: "gy-offline.svg" },
  { regionName: '茶叶', active: "nm-online.svg", inactive: "nm-offline.svg" },
]
let markers = ref([]);

let dialogTitle = ref('')
let visible = ref(false)

let loopData = reactive({
  data: []
})

onBeforeMount(() => {
  getOverviewData();
  timer.value = setInterval(() => {
    time.value = moment().format('HH:mm:ss')
  }, 1000)
})

onMounted(() => {
  getRegion();
})

onBeforeUnmount(() => {
  clearInterval(timer.value);
})

watch(route, () => {
  map.value.destroy();
})

let calcWeek = computed(() => {
  let week = ""
  switch (moment().format('dddd')) {
    case "Monday": {
      week = "星期一";
      break;
    }
    case "Tuesday": {
      week = "星期二";
      break;
    }
    case "Wednesday": {
      week = "星期三";
      break;
    }
    case "Thursday": {
      week = "星期四";
      break;
    }
    case "Friday": {
      week = "星期五";
      break;
    }
    case "Saturday": {
      week = "星期六";
      break;
    }
    case "Sunday": {
      week = "星期天";
      break;
    }
  }
  return week;
})

function initMap () {
  AMapLoader.load({
    key: "f46f1dcae9a32784a383cdf30357c92f",
    version: "2.0",
    plugins: ['AMap.ToolBar', 'AMap.Driving', 'AMap.Geolocation', 'AMap.ControlBar'],
  }).then((AMap) => {
    map.value = new AMap.Map("map-container", {
      viewMode: "2D",
      zoom: 17.3,
      center: [120.310438, 31.570544],
      resizeEnable: true,
    });
    map.value.addControl(new AMap.ControlBar({
      position: {
        bottom: '20px',
        right: '20px'
      }
    }));
    addMarker(AMap);
    map.value.setFeatures(['road', 'bg', 'building'])
  }).catch(e => {
    console.log(e);
  })
}

function addMarker (AMap) {
  markers.value.forEach((item, index) => {
    let img = item.regionStatus == '1' ? (new URL(`../../../assets/images/fire/${item.active}`, import.meta.url).href) : (new URL(`../../../assets/images/fire/${item.inactive}`, import.meta.url).href)
    let icon = new AMap.Icon({
      size: new AMap.Size(32, 32),
      // 图标的取图地址
      image: img,
      // 图标所用图片大小
      imageSize: new AMap.Size(32, 32),
      // 图标取图偏移量
      imageOffset: new AMap.Pixel(0, 0)
    })
    let marker = new AMap.Marker({
      position: [item.longitude, item.latitude],
      icon: icon,
      offset: new AMap.Pixel(-13, -30)
    })
    marker.setLabel({
      direction: 'right',
      offset: new AMap.Pixel(0, 0),  //设置文本标注偏移量
      content: `<div class='marker-label'>${item.regionName}</div>`, //设置文本标注内容
    })
    marker['id'] = item.id;
    marker['name'] = item.regionName;
    marker.on('click', markerClick);
    map.value.add(marker)
  })
}

function markerClick (e) {
  mapService.getRegionLoopStatus(e.target.id).then(res => {
    dialogTitle.value = e.target.name;
    visible.value = true;
    if (res.data) {
      loopData.data = res.data;
    }
  })
}

function dialogClose () {
  visible.value = false;
}

function dialogConfirm () {
  visible.value = false;
}

function getRegion () {
  pdcService.getRegionList().then(res => {
    if (res.rows.length) {
      imgs.forEach(img => {
        res.rows.forEach((row, idx) => {
          if (row.fullName.includes(img.regionName)) {
            res.rows[idx]['active'] = img.active;
            res.rows[idx]['inactive'] = img.inactive;
          }
        })
      })
      markers.value = res.rows;
      showMap.value = true;
      initMap();
    }
  })
}

function getOverviewData () {
  mapService.getOverviewData().then(res => {
    if (res.data) {
      leftBox.deviceNum = res.data.deviceNum;
      leftBox.regionNum = res.data.regionNum;
      leftBox.todayAlarm = res.data.todayAlarm;
      leftBox.totalAlarm = res.data.totalAlarm;
    }
  })
}

function routeTo (loop) {
  router.push({
    path: "/monitor-detail",
    query: {
      id: loop.id,
      deviceId: loop.deviceId,
      number: loop.deviceNumber
    }
  })
}

function jumpToAlarm (type) {
  router.push({
    path: "/warn/warn/warning",
  })
}
</script>

<style scoped lang="scss">
.map-main {
  width: 100vw;
  height: calc(100vh - 70px);
  position: relative;

  .time {
    width: 311px;
    height: 56px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    position: absolute;
    top: 24px;
    left: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 16px;
    padding-right: 16px;
    color: #fff;
    font-size: 16px;
    font-family: PingFang SC-Semibold, PingFang SC;
    font-weight: 600;
  }

  .num {
    width: 146px;
    height: 356px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    position: absolute;
    top: 104px;
    left: 24px;
    text-align: center;
    padding: 24px;

    .num-item {
      margin-top: 24px;

      .num-value {
        font-size: 24px;
        font-family: Source Han Sans CN-Bold, Source Han Sans CN;
        font-weight: bold;
        color: #FFFFFF;
      }

      .num-desc {
        font-size: 14px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #FFFFFF;
      }
    }
  }
}

#map-container {
  width: 100%;
  height: calc(100vh - 70px);
}

:deep(.amap-marker-label) {
  border: 0;
  background-color: rgba(255, 255, 255, 0);
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loop-title {
  font-size: 14px;
  font-family: PingFang SC-Semibold, PingFang SC;
  font-weight: 600;
  color: #000000;
}

.basic-status {
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #000000;
  padding-left: 10px;
}

.normal::before {
  content: "";
  width: 8px;
  height: 8px;
  background-color: #3BBD40;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

.offline::before {
  content: "";
  width: 8px;
  height: 8px;
  background-color: #CED4DB;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

.warn::before {
  content: "";
  width: 8px;
  height: 8px;
  background-color: #FF6165;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

.loop-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  align-content: baseline;
  margin-top: 24px;
  padding-left: 24px;
  height: 478px !important;
  overflow: auto !important;
}

.loop-item {
  width: 140px;
  height: 120px;
  background: #FFFFFF;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  margin-bottom: 16px;
  margin-right: 16px;
  text-align: center;
  padding: 16px;
  // white-space: nowrap;
  // overflow: hidden;
  // text-overflow: ellipsis;
}

.loop-name {
  margin-top: 16px;
  font-size: 12px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: #8D9094;
  cursor: pointer;
}

.loop-name:hover {
  color: #1890ff;
}

:deep(.amap-marker) {
  z-index: 99999999 !important;
}
</style>