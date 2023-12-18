<template>
  <div>
    <!--验证图片-->
    <canvas
      ref="canvasRef"
      class="slide-canvas"
      :width="canvasWidth"
      :height="canvasHeight"
    />
    <!--阻塞块-->
    <canvas
      ref="blockRef"
      class="slide-block"
      :width="canvasWidth"
      :height="canvasHeight"
    />

    <div
      class="slider"
      :class="{
        'verify-active': verifyActive,
        'verify-success': verifySuccess,
        'verify-fail': verifyFail
      }"
    >
      <!--滑块-->
      <div class="slider-box" :style="{ width: sliderBoxWidth }">
        <!-- 按钮 -->
        <div
          class="slider-button"
          id="slider-button"
          :style="{ left: sliderButtonLeft }"
        >
          <!-- 按钮图标 -->
          <div class="slider-button-icon" />
        </div>
      </div>
      <!--滑动条提示文字-->
      <span class="slider-hint">请向右滑动</span>
    </div>
  </div>
</template>

<script setup>
import getAssetsFile from '@/utils/pub-use'
import { ElMessage } from 'element-plus'

/**
 *@Author : ChenZhang
 *@Date : 2023/12/18 15:36:18
 *@Description : 初始化dom对象
 */
const canvasWidth = 320
const canvasHeight = 155
const ACCURACY = 3
const blockRef = ref()
const canvasRef = ref()
let blockCtx, canvasCtx //两个创建的canvas对象

const initDom = () => {
  if (canvasRef.value) canvasCtx = canvasRef.value.getContext('2d')
  if (blockRef.value) blockCtx = blockRef.value.getContext('2d')
  initImage()
}

/**
 *@Author : ChenZhang
 *@Date : 2023/12/18 15:20:56
 *@Description : canvas 创建图片对象
 */

const imageList = []
/* 获取imgSrc*/
const getImageSrc = () => {
  const len = imageList.length
  return len > 0
    ? imageList[getNonceByRange(0, len)]
    : `https://loyer.wang/view/ftp/wallpaper/${getNonceByRange(1, 1000)}.jpg`
}

/* 根据指定范围获取随机数*/
const getNonceByRange = (start, end) => {
  return Math.round(Math.random() * (end - start) + start)
}

const createImage = (onload) => {
  const image = document.createElement('img')
  image.crossOrigin = 'Anonymous'
  image.onload = onload
  image.onerror = () => {
    image.src = getAssetsFile('slidingVerificationCode/verification-image.jpg')
  }
  image.src = getImageSrc()
  return image
}

/**
 *@Author : ChenZhang
 *@Date : 2023/12/18 15:20:07
 *@Description : 前端获取验证码
 */
let image = null

//TODO 遮罩曾

let isLoading = ref(false)

let nonceStr
const initImage = () => {
  image = createImage(() => {
    drawBlock()
    canvasCtx.drawImage(image, 0, 0, canvasWidth, canvasHeight)
    blockCtx.drawImage(image, 0, 0, canvasWidth, canvasHeight)
    // 将抠图防止最左边位置
    let yAxle = blockY - blockRadius * 2
    let ImageData = blockCtx.getImageData(blockX, yAxle, blockWidth, blockWidth)
    blockRef.value.width = blockWidth
    blockCtx.putImageData(ImageData, 0, yAxle)
    // 图片加载完关闭遮蔽罩
    isLoading.value = false
    // 前端校验设置特殊值
    nonceStr = 'loyer'
  })
}

/**
 *@Author : ChenZhang
 *@Date : 2023/12/18 15:31:21
 *@Description : 绘制Block
 */
const blockLength = 42
const blockRadius = 10
const blockWidth = blockLength * 2
let blockX, blockY

const drawBlock = () => {
  blockX = getNonceByRange(blockWidth + 10, canvasWidth - (blockWidth + 10))
  blockY = getNonceByRange(
    10 + blockRadius * 2,
    canvasHeight - (blockWidth + 10)
  )
  draw(canvasCtx, 'fill')
  draw(blockCtx, 'clip')
}

/**
 *@Author : ChenZhang
 *@Date : 2023/12/18 15:43:12
 *@Description : 页面绘制
 */

const draw = (ctx, operation) => {
  const PI = Math.PI
  let x, y, l, r
  x = blockX
  y = blockY
  l = blockLength
  r = blockRadius
  // 绘制
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
  ctx.lineTo(x + l, y)
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
  ctx.lineTo(x + l, y + l)
  ctx.lineTo(x, y + l)
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
  ctx.lineTo(x, y)
  // 修饰
  ctx.lineWidth = 2
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.stroke()
  ctx[operation]()
  ctx.globalCompositeOperation = 'destination-over'
}

/**
 *@Author : ChenZhang
 *@Date : 2023/12/18 15:59:39
 *@Description : 定义各种事件
 */
const verifySuccess = ref(false)
//滑动开始事件
let originX, originY, isMouseDown, timestamp
const startEvent = (x, y) => {
  if (isLoading.value || verifySuccess.value) {
    return
  }
  originX = x
  originY = y
  isMouseDown = true
  timestamp = +new Date()
}

//滑动事件
let sliderButtonLeft = ref('0px')
let sliderBoxWidth = 0
const verifyActive = ref(false) //校验进行时的状态
const dragDistanceList = [] //拖动的数组 用于校验操作的人是否是真人
const moveEvent = (x, y) => {
  if (!isMouseDown) {
    return false
  }
  const moveX = x - originX
  const moveY = y - originY
  if (moveX < 0 || moveX + 40 >= canvasWidth) {
    return false
  }
  sliderButtonLeft.value = moveX + 'px'
  let blockLeft = ((canvasWidth - 40 - 20) / (canvasWidth - 40)) * moveX
  blockRef.value.style.left = blockLeft + 'px'
  verifyActive.value = true
  sliderBoxWidth = moveX + 'px'
  dragDistanceList.push(moveY)
}

//滑动结束事件
const endEvent = (x) => {
  if (!isMouseDown) {
    return false
  }
  isMouseDown = false
  if (x === originX) {
    return false
  }
  // 开始校验
  isLoading.value = true
  // 校验结束
  verifyActive.value = false
  // 滑动时长
  timestamp = +new Date() - timestamp
  // 移动距离
  const moveLength = parseInt(blockRef.value.style.left)
  // 限制操作时长10S，超出判断失败
  if (timestamp > 10000) {
    // verifyFailEvent();
  }
  // else
  //   // 人为操作判定
  // if (!this.turingTest()) {
  //   this.verifyFail = true;
  //   this.$emit('again');
  // } else

  // 是否前端校验
  const accuracy = ACCURACY <= 1 ? 1 : ACCURACY > 10 ? 10 : ACCURACY // 容错精度值
  const spliced = Math.abs(moveLength - blockX) <= accuracy // 判断是否重合
  if (!spliced) {
    verifyFailEvent()
  } else {
    // 设置特殊值，后台特殊处理，直接验证通过
    // this.$emit('success', { nonceStr: this.nonceStr, value: moveLength })
    ElMessage.success('校验成功')
  }
}

/**
 *@Author : ChenZhang
 *@Date : 2023/12/18 15:57:12
 *@Description : 绑定各种事件
 */

const bindEvents = () => {
  // 监听鼠标按下事件
  document
    .getElementById('slider-button')
    .addEventListener('mousedown', (event) => {
      startEvent(event.clientX, event.clientY)
    })
  // 监听鼠标移动事件
  document.addEventListener('mousemove', (event) => {
    moveEvent(event.clientX, event.clientY)
  })
  // 监听鼠标离开事件
  document.addEventListener('mouseup', (event) => {
    endEvent(event.clientX)
  })
  // 监听触摸开始事件
  document
    .getElementById('slider-button')
    .addEventListener('touchstart', (event) => {
      startEvent(event.changedTouches[0].pageX, event.changedTouches[0].pageY)
    })
  // 监听触摸滑动事件
  document.addEventListener('touchmove', (event) => {
    moveEvent(event.changedTouches[0].pageX, event.changedTouches[0].pageY)
  })
  // 监听触摸离开事件
  document.addEventListener('touchend', (event) => {
    endEvent(event.changedTouches[0].pageX)
  })
}

/**
 *@Author : ChenZhang
 *@Date : 2023/12/18 16:24:05
 *@Description : 校验失败
 */
const verifyFail = ref(false)
const verifyFailEvent = () => {
  verifyFail.value = true
  ElMessage.warning('校验失败！')
  refresh()
}

const refresh = () => {
  // 延迟class的删除，等待动画结束
  setTimeout(() => {
    verifyFail.value = false
  }, 500)
  isLoading.value = true
  verifyActive.value = false
  verifySuccess.value = false
  blockRef.style.left = '0px'
  sliderBoxWidth = 0
  sliderButtonLeft.value = '0px'
  // 刷新画布
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight)
  blockCtx.clearRect(0, 0, canvasWidth, canvasHeight)
  blockRef.value.width = canvasWidth
  // 刷新图片
  image.src = getImageSrc()
}

/**
 *@Author : ChenZhang
 *@Date : 2023/12/18 15:35:34
 *@Description :入口函数
 */
const init = () => {
  initDom()
  bindEvents()
}

/**
 *@Author : ChenZhang
 *@Date : 2023/12/18 15:41:18
 *@Description : dom渲染好后初始化
 */

onMounted(() => {
  init()
})
</script>

<style scoped lang="scss">
/*验证图片*/
.slide-canvas {
  border-radius: 5px;
}

/*阻塞块*/
.slide-block {
  position: absolute;
  left: 0;
  top: 0;
}

/*校验失败时的阻塞块样式*/
.slide-block.verify-fail {
  transition: left 0.5s linear;
}

/*滑动条*/
.slider {
  position: relative;
  text-align: center;
  width: 320px;
  height: 40px;
  line-height: 40px;
  margin-top: 15px;
  background: #f7f9fa;
  color: #45494c;
  border: 1px solid #e4e7eb;
  border-radius: 5px;
}

/*滑动盒子*/
.slider-box {
  position: absolute;
  left: 0;
  top: 0;
  height: 40px;
  border: 0 solid #1991fa;
  background: #d1e9fe;
  //border-radius: 5px;
}

/*滑动按钮*/
.slider-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  background: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: background 0.2s linear;
  border-radius: 5px;
}

/*鼠标悬浮时的按钮样式*/
.slider-button:hover {
  background: #1991fa;
}

/*鼠标悬浮时的按钮图标样式*/
.slider-button:hover .slider-button-icon {
  background-position: 0 -13px;
}

/*滑动按钮图标*/
.slider-button-icon {
  position: absolute;
  top: 15px;
  left: 13px;
  width: 15px;
  height: 13px;
  //background: url('../../assets/images/light.png') 0 -26px;
  background-size: 35px 470px;
}

/*校验时的按钮样式*/
.verify-active .slider-button {
  height: 38px;
  top: -1px;
  border: 1px solid #1991fa;
}

/*校验时的滑动箱样式*/
.verify-active .slider-box {
  height: 38px;
  border-width: 1px;
}

/*校验成功时的滑动箱样式*/
.verify-success .slider-box {
  height: 38px;
  border: 1px solid #52ccba;
  background-color: #d2f4ef;
}

/*校验成功时的按钮样式*/
.verify-success .slider-button {
  height: 38px;
  top: -1px;
  border: 1px solid #52ccba;
  background-color: #52ccba !important;
}

/*校验成功时的按钮图标样式*/
.verify-success .slider-button-icon {
  background-position: 0 0 !important;
}

/*校验失败时的滑动箱样式*/
.verify-fail .slider-box {
  height: 38px;
  border: 1px solid #f57a7a;
  background-color: #fce1e1;
  transition: width 0.5s linear;
}

/*校验失败时的按钮样式*/
.verify-fail .slider-button {
  height: 38px;
  top: -1px;
  border: 1px solid #f57a7a;
  background-color: #f57a7a !important;
  transition: left 0.5s linear;
}

/*校验失败时的按钮图标样式*/
.verify-fail .slider-button-icon {
  top: 14px;
  background-position: 0 -82px !important;
}

/*校验状态下的提示文字隐藏*/
.verify-active .slider-hint,
.verify-success .slider-hint,
.verify-fail .slider-hint {
  display: none;
}
</style>
