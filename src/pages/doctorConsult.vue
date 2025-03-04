<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-24 10:46:59
 * @LastEditTime: 2019-08-20 09:45:58
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="register-container">
    <div >
      <img class="img" src="statics/images/doctorConsult/1.png" />
    </div>
    <div >
      <img class="img" src="statics/images/doctorConsult/2.png" />
    </div>
  </div>
</template>

<script>
export default {
  created () {
    if (this.$route.query.assistant_id) {
      this.imgSrc = '/static/assistant/' + this.$route.query.assistant_id + '.png'
    }
  },
  data () {
    return {
      imgSrc: '/static/assistant/1.png'
    }
  }
}
</script>
<style scoped>
  .register-container {
    min-height: 92vh;
    text-align: center;
  }
  .img {
    width: 90%;
    /* height: 80px; */
    margin-top: 10px;
    margin-bottom: 10px
  }
</style>
