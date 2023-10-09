<script setup>

const currentCityWeather=ref({})
const getCurrentCityWeather = ()=>{
  fetch(new URL('https://api.seniverse.com/v3/weather/daily.json?key=SYCGsDUSuorLEEu9C&language=zh-Hans&unit=c&start=-1&days=2&location=无锡'))
      .then((response) => response.json())
      .then((data) => {
        currentCityWeather.value = data.results[0].daily[0]
      }).catch((err)=>{
    throw new Error('接口请求错误')
  });
}

onMounted(()=>{
  getCurrentCityWeather()
})

</script>

<template>
  <div>
    <div class="weather">
      <div style="display: flex;justify-content: center;align-items: center" v-for="item in Object.keys(currentCityWeather)">
        <div class="key">{{item}}：</div>
        <div class="value">{{currentCityWeather[item]}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>