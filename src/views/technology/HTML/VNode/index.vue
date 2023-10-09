<script setup>
const vdom = (type,props,...children)=>{
  return {
    type,
    props,
    children
  }
}

const VNode = vdom('div',null,
    vdom('span',{className:'item'},'item'),
    vdom('span',{disabled:true}),
)

//将虚拟DOM转换为真实情况下的DOM
const toRealDOM=(VNode)=>{
  let $dom;
  //do something with VNode
  //1.对VNode的type进行处理
  if(typeof VNode === 'string'){
    $dom = document.createTextNode(VNode)
  }else{
    $dom = document.createElement(VNode.type)
  }

  //2.设置节点的属性
  if(VNode.props){
    Object.keys(VNode.props).forEach(key=>{
      setProp($dom,key,VNode.props[key])
    })
  }
  
  //3.如果存在子节点 需要对子节点进行递归操作
  if(VNode.children && VNode.children.length){
    VNode.children.forEach(childVNode=>{
      const realChildDOM = toRealDOM(childVNode)
      $dom.appendChild(realChildDOM)
    })
  }

  return $dom
}

//为某个节点设置某个属性

//定义一些util函数
//判断字符串是否以'on'开头
const isEventProp = (name)=>{
  return /^on/.test(name);
}

const extractEventName = (name)=>{//拿到除去on之外的字符
  return name.slice(0,2).toLowerCase();
}

//自定义属性
const isCustomProp=(name)=>{
  return false
}
const setProp = ($element,key,value)=>{
  //节点的设置需要考虑一些特殊情况
  //1.class是js的关键字，一般用className来表示DOM节点
  //2.一般以on开头的属性表示的是事件
  //3.除字符类型外，属性还可能是布尔类型
  if(isCustomProp(key)){ //一些框架是使用props进行传值的 所以不要加入的DOM元素当中
    return ;
  } else if(key === 'className'){
    $element.setAttribute('class',value)
  }else if(isEventProp(key)){
    $element.addEventListener(extractEventName(key),value)
  }else if(typeof value === 'boolean'){
    if(value){
      $element.setAttribute(key,value)
    }
    $element[key] = value
  }else{
    $element.setAttribute(key,value)
  }

}

/**
  *作者：陈章
  *时间：2023/10/08 17:39:05
  *功能： 虚拟DOM
 * 虚拟DOM被创建出来的目的就是为了性能提升的，通过虚拟DOM开发者可以减少不必要的DOM操作，以达到最优性能
 * Vue当中是通过diff方法实现的
 *
  */



//将VNode挂载到它的父节点下面
const mountDOM = ($parent,VNode)=>{
  $parent.appendChild(toRealDOM(VNode))
}

onMounted(()=>{
  mountDOM(document.getElementsByClassName('dom')[0],VNode)
})

</script>

<template>
<div>
  虚拟DOM的代码实现
  <div class="dom">

  </div>
</div>
</template>

<style scoped lang="scss">

</style>