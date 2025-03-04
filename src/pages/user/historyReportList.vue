<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-24 10:49:15
 * @LastEditTime: 2019-09-24 11:28:40
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="discover-container">
    <a class="curse-cell-div" @click="toHistoryReportDetails(item)" v-for="(item,index) in reportList" :key="index">
      <div class="lesson-right-wrapper">
        <img :src="item.questionnaire_group_icon" alt="" class="lesson-right-img">
        <div class="curse-cell-intro">
          <p class="curse-cell-title">{{item.questionnaire_group_name}}</p>
          <p class="curse-cell-info">姓名：{{item.user_name}}</p>
          <p class="curse-cell-info">医院：{{item.hospital_name}}</p>
          <p class="curse-cell-info">更新时间：{{item.create_time}}</p>
        </div>
      </div>
      <img src="statics/images/arrow_right.png" alt="" class="lesson-icon">
    </a>
  </div>
</template>

<script>
import network from '../../network/network.js'

export default {
  mounted () {
    network.getReportList(JSON.parse(localStorage.getItem('h5_stage_userinfo')).id, JSON.parse(localStorage.getItem('h5_stage_userinfo')).openid).then(res => {
      this.reportList = res.map(val => {
        val.create_time = val.create_time.split(' ')[0]
        return val
      })
    }).catch(() => {
      this.$q.notify({
        message: '当前暂无已完成报告',
        type: 'warning',
        position: 'top',
        timeout: 3000
      })
    })
  },
  data () {
    return {
      reportList: [],
      customDialogModel: true
    }
  },
  methods: {
    toHistoryReportDetails (item) {
      let time = item.create_time.split(' ')[0]
      this.$router.push({
        name: 'historyReportDetails',
        params: {
          type: item.type,
          id: item.id,
          time: time
        }
      })
    }
  }
}
</script>

<style scoped>
.discover-container{
  min-height: 100vh;
  padding: 16px;
  background: #f3f3f3
}

.curse-cell-div {
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  padding: 16px;
  align-items: center;
  background: #fff;
}

.lesson-right-wrapper{
  display: flex;
  align-items: center
}

.lesson-right-img {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  margin-right: 16px
}

.curse-cell-title {
  font-size: 16px;
  line-height: 20px;
  color: #000000;
}

.curse-cell-info {
  font-size: 12px;
  color: #999999;
}

.lesson-icon{
  display: block;
  width: 15px;
  height: 15px
}
</style>
