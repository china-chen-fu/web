<template>
  <div style="padding: 16px">
    <div class="first__row" style="display: flex; margin-bottom: 16px">
      <el-input
        v-model="searchKeyword"
        placeholder="Please input"
        style="width: 240px; margin-right: 24px"
      />
      <el-button type="primary" @click="search">搜索</el-button>
    </div>
    <el-cascader-panel
      ref="cascaderRef"
      v-model="panel"
      :options="options"
      :props="cascaderProps"
      style="width: 800px; background-color: #ffffff"
    />

    <!--    <el-cascader></el-cascader>-->
  </div>
</template>

<script setup>
const cascaderProps = {
  multiple: true
}

const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          },
          {
            value: 'efficiency',
            label: 'Efficiency'
          },
          {
            value: 'controllability',
            label: 'Controllability'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation'
          },
          {
            value: 'top nav',
            label: 'Top Navigation'
          }
        ]
      }
    ]
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout'
          },
          {
            value: 'color',
            label: 'Color'
          },
          {
            value: 'typography',
            label: 'Typography'
          },
          {
            value: 'icon',
            label: 'Icon'
          },
          {
            value: 'button',
            label: 'Button'
          }
        ]
      },
      {
        value: 'form',
        label: 'Form',
        children: [
          {
            value: 'radio',
            label: 'Radio'
          },
          {
            value: 'checkbox',
            label: 'Checkbox'
          },
          {
            value: 'input',
            label: 'Input'
          },
          {
            value: 'input-number',
            label: 'InputNumber'
          },
          {
            value: 'select',
            label: 'Select'
          },
          {
            value: 'cascader',
            label: 'Cascader'
          },
          {
            value: 'switch',
            label: 'Switch'
          },
          {
            value: 'slider',
            label: 'Slider'
          },
          {
            value: 'time-picker',
            label: 'TimePicker'
          },
          {
            value: 'date-picker',
            label: 'DatePicker'
          },
          {
            value: 'datetime-picker',
            label: 'DateTimePicker'
          },
          {
            value: 'upload',
            label: 'Upload'
          },
          {
            value: 'rate',
            label: 'Rate'
          },
          {
            value: 'form',
            label: 'Form'
          }
        ]
      },
      {
        value: 'data',
        label: 'Data',
        children: [
          {
            value: 'table',
            label: 'Table'
          },
          {
            value: 'tag',
            label: 'Tag'
          },
          {
            value: 'progress',
            label: 'Progress'
          },
          {
            value: 'tree',
            label: 'Tree'
          },
          {
            value: 'pagination',
            label: 'Pagination'
          },
          {
            value: 'badge',
            label: 'Badge'
          }
        ]
      },
      {
        value: 'notice',
        label: 'Notice',
        children: [
          {
            value: 'alert',
            label: 'Alert'
          },
          {
            value: 'loading',
            label: 'Loading'
          },
          {
            value: 'message',
            label: 'Message'
          },
          {
            value: 'message-box',
            label: 'MessageBox'
          },
          {
            value: 'notification',
            label: 'Notification'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'menu',
            label: 'Menu'
          },
          {
            value: 'tabs',
            label: 'Tabs'
          },
          {
            value: 'breadcrumb',
            label: 'Breadcrumb'
          },
          {
            value: 'dropdown',
            label: 'Dropdown'
          },
          {
            value: 'steps',
            label: 'Steps'
          }
        ]
      },
      {
        value: 'others',
        label: 'Others',
        children: [
          {
            value: 'dialog',
            label: 'Dialog'
          },
          {
            value: 'tooltip',
            label: 'Tooltip'
          },
          {
            value: 'popover',
            label: 'Popover'
          },
          {
            value: 'card',
            label: 'Card'
          },
          {
            value: 'carousel',
            label: 'Carousel'
          },
          {
            value: 'collapse',
            label: 'Collapse'
          },
          {
            value: 'collapse1',
            label: 'Collapse1'
          },
          {
            value: 'collapse2',
            label: 'Collapse2'
          },
          {
            value: 'collapse3',
            label: 'Collapse3'
          }
        ]
      }
    ]
  },
  {
    value: 'resource',
    label: 'Resource',
    children: [
      {
        value: 'axure',
        label: 'Axure Components'
      },
      {
        value: 'sketch',
        label: 'Sketch Templates'
      },
      {
        value: 'docs',
        label: 'Design Documentation'
      }
    ]
  }
]

const panel = ref([])

const cascaderRef = ref()
/**
 *@Author : ChenZhang
 *@Date : 2023/12/11 09:46:09
 *@Description : 实现过滤功能
 */
const searchKeyword = ref('')
const input = ref()

//Component Form Checkbox
const search = () => {
  console.log(panel.value, 'panel')
  const { value } = searchKeyword

  if (!value) return

  const pathNodes = calculateSuggestions()

  if (!pathNodes) {
    return
  }

  let pathNodesLength = pathNodes.length

  locateToNode(pathNodes, pathNodesLength)
}

const locateToNode = async (pathNodes, length, index = 0) => {
  let menuId = cascaderRef.value.menuList[index].menuId
  let uid = pathNodes[index].uid
  nextTick(async () => {
    let el = document.getElementById(`${menuId}-${uid}`)
    await focusNode(el)
    index++
    if (index < length) await locateToNode(pathNodes, length, index)
  })
}

/**
 *@Author : ChenZhang
 *@Date : `2023/12/08 14:56:30`
 *@Description : 遍历当前的list获取需要跳转的uid
 */

const focusNode = (el) => {
  if (!el) return
  el.focus()
  !isLeaf(el) && el.click()
}
const isLeaf = (el) => !el.getAttribute('aria-owns')

const calculateSuggestions = () => {
  /**
   *@Author : ChenZhang
   *@Date : 2023/12/11 10:10:39
   *@Description : 精准匹配需要从查询的商品并且实现定位
   */

  const allNodes = cascaderRef.value.getFlattedNodes()
  const targetNode = allNodes.find((item) => {
    return item.level === 3 && item.label === searchKeyword.value
  })

  if (!targetNode) return
  //返回一个pathNodes
  return targetNode.pathNodes
}

/**
 *@Author : ChenZhang
 *@Date : 2023/12/11 11:12:55
 *@Description : TODO 实现数据回显 数据的回显的就是找到对应的pathNodes 拼接路径或者是flattedNodes中的属性
 */
</script>
