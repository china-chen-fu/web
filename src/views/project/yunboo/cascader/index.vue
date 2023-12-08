<template>
  <div style="padding: 16px">
    <div class="first__row" style="display: flex; margin-bottom: 16px">
      <el-input
        v-model="input"
        placeholder="Please input"
        style="width: 240px; margin-right: 24px"
      />
      <el-button type="primary" @click="search">搜索</el-button>
    </div>
    <el-cascader-panel
      ref="cascaderRef"
      v-model="panelValue"
      :options="options"
      :props="cascaderProps"
      @change="change"
      style="width: 800px; background-color: #ffffff"
    />
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

const panelValue = ref([])

const cascaderRef = ref()
const change = () => {
  console.log('panelValue.value11', panelValue.value)
}

/**
 *@Author : ChenZhang
 *@Date : 2023/12/08 11:08:26
 *@Description : 添加过滤功能
 */

const currentSelect = ref()

const currentSelectChange = () => {
  console.log('currentSelect', currentSelect.value)
  /**
   *@Author : ChenZhang
   *@Date : 2023/12/08 11:14:06
   *@Description : 改变之后根据搜索的内容高亮当前的节点
   */
}

const input = ref()

//Component Form Checkbox
const search = () => {
  console.log(cascaderRef.value.menuList, 'menuList')
  console.log(cascaderRef.value.menus, 'menus')
  console.log(cascaderRef.value.checkedNodes, 'checkedNodes')
  console.log(
    'cascaderRef.value.menuList.menuId',
    cascaderRef.value.menuList.menuId
  )

  let el = document.querySelector(
    `.el-cascader-node[aria-owns=${cascaderRef.value.menuList[0].menuId}]`
  )
  focusNode(el)
  nextTick(() => {
    //展开第二个节点
    let el2 = document.querySelector(
      `.el-cascader-node[aria-owns=${cascaderRef.value.menuList[1].menuId}]`
    )
    focusNode(el2)
    nextTick(() => {
      console.log(
        'cascaderRef.value.menuList[2]',
        cascaderRef.value.menuList[2].menuId
      )
      let menuId3 = cascaderRef.value.menuList[2].menuId
      let uid3 = cascaderRef.value.menuList[2].nodes[0].uid

      let el3 = document.getElementById(`${menuId3}-${uid3}`)
      focusNode(el3)
      console.log(el3, 'el3')
    })
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
</script>
