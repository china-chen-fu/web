<template>
  <div class="devops-container" ref="viewRef">
    <div class="container--left" ref="leftRef">
      <slot name="left"> </slot>
    </div>

    <div class="container--inner">
      <div class="search" ref="searchRef">
        <slot name="search"> </slot>
      </div>

      <div class="content" ref="contentRef">
        <div class="content-header" ref="contentHeaderRef">
          <slot name="content-header"> </slot>
        </div>
        <slot name="content"> </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
//动态计算content的高度  等于整个的高度减去search的高度
//如何将组件里面的表格高度发送出去
const viewRef = ref()
const searchRef = ref()
const contentRef = ref()
const leftRef = ref()
const contentHeaderRef = ref()
let searchHeight = ref(0)
let viewHeight = ref(0)
let contentHeaderHeight = ref(0)
let tableHeight = ref(300)
let leftWidth = ref(0)
let contentWidth = ref(0)
let realContentWidth = ref(null) //内容区域实际的宽度

const reCalculateHeight = () => {
  nextTick(() => {
    if (searchRef.value) {
      searchHeight.value = searchRef.value.offsetHeight
    }
    if (viewRef.value) {
      viewHeight.value = viewRef.value.offsetHeight
    }
    if (contentHeaderRef.value) {
      contentHeaderHeight.value = contentHeaderRef.value.offsetHeight
    }
    if (leftRef.value) {
      leftWidth.value = leftRef.value.offsetWidth
    }
    //右侧宽度重新计算
    if (leftWidth.value) {
      contentWidth.value = `calc( 100% - ${leftWidth.value + 20}px)`
    }
    if (contentRef.value) {
      realContentWidth.value = contentRef.value.getBoundingClientRect().width
    }
    handleReCalculateHeight()
  })
}

const handleReCalculateHeight = () => {
  let height
  if (searchHeight.value === 22 && searchRef.value) {
    searchRef.value.style.marginBottom = `0`
    searchRef.value.style.padding = '0'
    height = viewHeight.value - 16 * 2
  } else {
    height = viewHeight.value - searchHeight.value - 16 * 2 - 12
  }

  if (leftWidth.value === 0 && leftRef.value) {
    leftRef.value.style.marginRight = '0px'
  }

  if (contentHeaderHeight.value === 0 && contentHeaderRef.value) {
    contentHeaderRef.value.style.marginBottom = '0px'
  }
  if (contentRef.value) {
    contentRef.value.style.height = `${height}px`
    //计算表格的显示最大高度
    tableHeight.value = height - contentHeaderHeight.value - 32 - 70 - 12 - 35
    realContentWidth.value = contentRef.value.getBoundingClientRect().width
  }
}

reCalculateHeight()
window.addEventListener('resize', () => {
  reCalculateHeight()
})

defineExpose({
  tableHeight,
  realContentWidth,
  reCalculateHeight
})
</script>

<style lang="scss">
.devops-container {
  padding: 16px;
  height: calc(100vh - 72px);
  display: flex;
  .container--left {
    margin-right: 20px;
  }
  .container--inner {
    flex: 1;
    width: v-bind(contentWidth);
    height: 100%;
    .search {
      background: #ffffff;
      margin-bottom: 12px;
      border-radius: 4px;
      padding: 20px 16px 2px 16px;
      .tabs{
        .el-tabs{
          .el-tabs__header{
            margin-top: -4px;
            margin-bottom: 0;
            .el-tabs__nav-wrap{
              &::after{
                display: none;
              }
            }
          }

          .el-tabs__nav{
            .el-tabs__active-bar{
              display: none;
            }

            .el-tabs__item{
              color: #A8ABB2;
              height: auto;
              font-size: 14px;
              font-weight: 400;
              line-height: 14px;
              text-align: center;
              padding: 0 12px 14px 12px;
              &:hover{
                color: #606266;
              }

              &+.el-tabs__item{
                margin-left: 24px;
              }


              &.is-active {
                color: #606266;
                position: relative;
                &::after{
                  opacity: 1;
                  width: 100%;
                  content: "";
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  height: 3px;
                  background-color: var(--el-color-primary);
                  transition: opacity var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);
                }
              }
            }
          }

          &.el-tabs--top{
            .el-tabs__item.is-top:nth-child(2){
              padding-left: 12px;
            }
          }
        }
      }

      .search--inner {
        display: flex;
        justify-content: space-between;
        .condition {
          flex: 7;
        }
        .btn {
          flex: 1;
          display: flex;
          justify-content: end;
        }

        .el-input {
          width: 240px;
        }

        .el-form-item__label {
          font-weight: 400;
          color: #606266;
        }
      }
    }

    .content {
      width: 100%;
      background: #ffffff;
      border-radius: 4px;
      padding: 16px;
      .search--inner {
        display: flex;
        justify-content: space-between;
        .condition {
          flex: 7;
        }
        .btn {
          flex: 1;
          display: flex;
          justify-content: end;
        }

        .el-input {
          width: 240px;
        }

        .el-form-item__label {
          font-weight: 400;
          color: #606266;
        }
      }
      .func-btn {
        margin-bottom: 16px;
      }

      .content-header {
        margin-bottom: 16px;
      }
    }
  }
}

.el-tabs__header {
  margin: -10px 0 20px;
}

.el-tabs__nav-wrap::after {
  height: 1px;
  background-color: #e6ebf0;
}

.pagination-container {
  .el-pagination {
    right: 38px;
  }
}
</style>
