<template>
  <div class="timeList">
    <div class="timeList_title">周次</div>
    <div class="timeList_list">
      <div class="timeList_list_item" v-for="i in timeList" :key="i.time">
        <span class="timeList_list_item_holiday" v-if="i.vacation === '1'">寒假</span>
        <span class="timeList_list_item_holiday" v-else-if="i.vacation === '2'">暑假</span>
        <span class="timeList_list_item_week" v-else>{{i.week || '-'}}</span>
      </div>
      <!--      <div class="timeList_list_item">-->
      <!--        <span class="timeList_list_item_week">2</span>-->
      <!--      </div>-->
      <!--      <div class="timeList_list_item">-->
      <!--        <span class="timeList_list_item_holiday">暑假</span>-->
      <!--      </div>-->
      <!--      <div class="timeList_list_item">-->
      <!--        <span class="timeList_list_item_week">3</span>-->
      <!--      </div>-->
      <!--      <div class="timeList_list_item">-->
      <!--        <span class="timeList_list_item_holiday">寒假</span>-->
      <!--      </div>-->
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  timeList:{
    type:Array,
    default:() => []
  }
})
</script>
<style scoped lang="scss">
.timeList{
  position: absolute;
  top:62px;
  left:0;
  font-size: 12px;
  &_title{
    text-align: center;
    height: 31px;
    font-size: 12px;
    padding: 10px 0 5px;
    color: #7353D6;
  }
  &_list{
    background: rgba(115, 83, 214, 0.08);
    &_item{
      width: 28px;
      height: 42px;
      line-height: 40px;
      padding: 0;
      border-radius: 8px;
      border: 1px solid transparent;
      text-align: center;
      &_week{
        display: block;
        width:20px;
        height:20px;
        line-height: 20px;
        margin: 0 auto;
        color:#ffffff;
        background: #7353D6;
        border-radius: 50%;
        position: relative;
        top:10px;
      }
      &_holiday{
        color:#7353D6;
      }
    }
  }
}
</style>