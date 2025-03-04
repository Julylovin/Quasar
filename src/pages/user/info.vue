<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-24 10:47:35
 * @LastEditTime: 2019-08-13 14:27:15
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="container">
    <div class="info-wrapper">
      <span class="info-title">姓名</span>
      <input type="text" class="info-input no-border" align="right" disabled v-model="userName"/>
    </div>
    <div class="info-wrapper">
      <span class="info-title">就诊卡号</span>
      <input type="number" class="info-input no-border" align="right" disabled v-model="user_hoscard"/>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    this.userName = JSON.parse(localStorage.getItem('h5_stage_userinfo')).name
    this.user_hoscard = JSON.parse(localStorage.getItem('h5_stage_userinfo')).user_hoscard
  },
  data () {
    return {
      userName: '',
      user_hoscard: ''
    }
  }
}
</script>

<style scoped>
.container{
  padding-top: 10px;
  background: #f3f3f3;
  display: block;
  min-height: 100vh
}
.info-wrapper{
  display: flex;
  background: #ffffff;
  justify-content: space-between;
  width: 100%;
  color: #384256;
  font-size: 14px;
  height: 56px;
  align-items: center;
}
.info-title{
  flex: 1;
  margin-left: 16px
}
.info-input{
  height: 100%;
  flex: 4;
  background: #ffffff;
  text-align: right;
  padding-right: 16px;
  border-bottom: 1px solid #e7e7e7
}
</style>
