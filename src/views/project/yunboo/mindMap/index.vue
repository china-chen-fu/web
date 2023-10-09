<script setup>
/**
  *作者：陈章
  *时间：2023/10/09 13:59:06
  *功能：实现一个简单的脑图结构
  */
import {SVG, Text} from '@svgdotjs/svg.js'


class Node {
  //构造函数
  constructor(opt = {}) {
    this.nodeData = opt.data// 节点真实数据，就是上述说的渲染树的节点
    this.isRoot =  opt.isRoot// 是否是根节点
    this.layerIndex = opt.layerIndex// 节点层级
    this.width = 0// 节点宽
    this.height = 0// 节点高
    this.left = opt.left || 0// left
    this.top = opt.top || 0// top
    this.parent = opt.parent || null// 父节点
    this.children = []// 子节点
    // ...

  }

  //计算节点宽高
  getSize(){
    let textData = this.createTextNode()
    this.width = textData.width + 20
    this.height = textData.height + 10
  }

  createTextNode(){
    let node = new Text().text(this.nodeData.data.text)
    let { width , height } =node.bbox()
    return {
      node,
      width,
      height
    }
  }

  render(){
    let textData = this.createTextNode()

    textData.node.x(10).y(5)

    this.group.rect(this.width,this.height).x(0).y(0)

    this.group.add(textData.node)

    this.group.translate(this.left,this.right)

    this.draw.add(this.group)
  }


}

// class Render {
//   // 第一次遍历渲染树
//   walk(this.renderer.renderTree, null, (cur, parent, isRoot, layerIndex) => {
//   // 先序遍历
//   // 创建节点实例
//   let newNode = new Node({
//     data: cur,// 节点数据
//     layerIndex// 层级
//   })
//   // 节点实例关联到节点数据上
//   cur._node = newNode
//   // 根节点
//   if (isRoot) {
//     this.root = newNode
//     // 定位在画布中心位置
//     newNode.left = (this.mindMap.width - node.width) / 2
//     newNode.top = (this.mindMap.height - node.height) / 2
//   } else {// 非根节点
//   // 互相收集
//   newNode.parent = parent._node
//   parent._node.addChildren(newNode)
//   // 定位到父节点右侧
//   newNode.left = parent._node.left + parent._node.width + marginX
// }
// }, null, true, 0)
// }

onMounted(()=>{
  const draw = SVG().addTo('.svg').size(600, 600)
  const rect = draw.rect(600, 600).attr({ fill: "#ccc" })
  let group = draw.group()
  let node = new Node({
    data:{
      data:{
        text:'我是节点'
      }
    }
  })
  node.group = group
  node.draw = draw
  node.render()
})


/**
  *作者：陈章
  *时间：2023/10/09 17:44:27
  *功能：是指一个且套结构可以渲染node节点
  */






</script>

<template>
<div class="svg">

</div>
</template>

<style scoped lang="scss">

</style>