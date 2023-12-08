<template>
<div class="container" ref="containerRef">

</div>
</template>

<script setup>
import * as echarts from 'echarts'
const y = (mu, sigma) => (x) => 1 / (x * sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-Math.pow(Math.log(x) - mu, 2) / (2 * Math.pow(sigma, 2)))

const containerRef = ref()

onMounted(()=>{
  const myChart = echarts.init(containerRef.value);

  let xArr = []

  for(let i=0;i<500;i++){
    xArr.push(i)
  }

  let yArr1 = []
  let yArr2 = []
  let yArr3 = []
  let yArr4 = []
  let yArr5 = []
  let func1 = y(0,0.65)
  let func2 = y(0,0.7)
  let func3 = y(0.3,0.8)
  let func4 = y(0,0.9)
  let func5 = y(0.1,0.75)

  let rate = 95
  for(let i=0;i<xArr.length;i++)
  {
    let params = (xArr[i] + 20)/rate
    yArr1.push(func1(params)/5)
    yArr2.push(func2(params)/5)
    yArr3.push(func3(params)/5)
    yArr4.push(func4(params)/5)
    yArr5.push(func5(params)/5)
  }

// 创建图标
  myChart.setOption({
    xAxis: {
      type: 'category',
      data: xArr
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data:yArr1 ,
        type: 'line',
        smooth: true,
        showSymbol: false
      },
      {
        data:yArr2 ,
        type: 'line',
        smooth: true,
        showSymbol: false
      },
      {
        data:yArr3 ,
        type: 'line',
        smooth: true,
        showSymbol: false
      },
      {
        data:yArr4 ,
        type: 'line',
        smooth: true,
        showSymbol: false
      },
      {
        data:yArr5 ,
        type: 'line',
        smooth: true,
        showSymbol: false
      },
    ]
  })
})

</script>

<style scoped lang="scss">

.container{
  width: 500px;
  height: 400px;
}

</style>