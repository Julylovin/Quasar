<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-24 10:49:25
 * @LastEditTime: 2019-09-24 10:32:52
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="details-title-container">
    <div class="details-title">
      <div class="details-title-item details-title-item-first">
        <p class="details-content-title">评估结果</p>
        <p class="details-content-count">{{reportDetails.replay.score}}分</p>
        <p class="details-content-progress">{{reportDetails.replay.score}}/{{sclIndex === -1 ? reportDetails.questionnaire.total_score : reportDetails.replay.all_score}}</p>
        <div class="total-progress">
          <div :style="{width: showProgress+'%'}" class="current-progess"></div>
        </div>
      </div>
      <div class="details-title-item">
        <p class="details-content-title">当前状况评级</p>
        <div class="details-level-wrapper">
          <p class="details-level-left">{{sclIndex === -1 ? reportDetails.replay.state_name : reportDetails.replay.state}}</p>
        <!--  <span :style="{backgroundColor: returnColor}" class="level-color"></span> -->
        </div>
      </div>
    </div>
    <div class="current-situation">
      <p class="current-situation-title">当前情况</p>
      <p class="current-situation-content">{{reportDetails.replay.current_state}}</p>
    </div>
    <!-- <div class="current-situation">
      <p class="current-situation-title">专家建议</p>
      <p class="current-situation-content">{{reportDetails.replay.advise}}</p>
    </div> -->
    <div class="details-tags current-situation">
      <div class="details-tags-item" @click="toIconPath(item, index)" v-for="(item, index) in iconList" :key="index">
        <img class="details-tags-img" :src="item.image" alt="">
        <p>{{item.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import network from '../../network/network.js'
import md5 from 'js-md5'

export default {
  created () {
    this.toHuixing()

    if (this.$route.params.sclIndex === -1) {
      network.getResult(this.$route.params.id).then(res => {
        this.reportDetails = res
      })
    } else {
      network.getSCLResult(this.$route.params.id).then(res => {
        this.reportDetails.questionnaire = res.questionnaire
        this.reportDetails.replay = res.replay[this.$route.params.sclIndex]
        this.sclIndex = this.$route.params.sclIndex
      })
    }
  },
  data () {
    return {
      sclIndex: -1,
      reportDetails: {
        replay: {
          score: 0
        },
        questionnaire: {
          total_score: 0
        }
      },
      iconList: [
        {
          name: '援助热线',
          image: 'statics/images/help-phone.png',
          path: 'phoneList'
        },
        {
          name: '咨询专家',
          image: 'statics/images/experts.png',
          path: ''
        }
        // ,
        // {
        //   name: '学习课程',
        //   image: 'statics/images/study-course.png',
        //   path: 'discover'
        // }
      ]
    }
  },
  computed: {
    showProgress () {
      let totalScore = this.sclIndex === -1 ? this.reportDetails.questionnaire.total_score : this.reportDetails.replay.all_score
      return Math.ceil((this.reportDetails.replay.score / totalScore) * 100)
    }
  },
  methods: {
    toHuixing () {
      var signature = '74a3a21ffca9b09d8d1f90a54a3014ca'
      // var signature = 'shhSeXg6wRTlkb88'
      var myDate = new Date()
      myDate = myDate.getTime()
      let data1 = {
        saasInfoId: 10003,
        saasInfoUserId: JSON.parse(localStorage.getItem('h5_stage_userinfo')).openid,
        realname: JSON.parse(localStorage.getItem('h5_stage_userinfo')).name,
        sex: 2,
        mobile: JSON.parse(localStorage.getItem('h5_stage_userinfo')).phone,
        doctorId: 0,
        signtime: myDate,
        redirectUrl: JSON.parse(localStorage.getItem('h5_stage_userinfo')).hospital_id === 27 ? 'https://mp.haoxinqing.cn/doctor/list?sort=1&hospitalId=10961' : 'https://mp.haoxinqing.cn/doctor/list?sort=1&minPrice=5&maxPrice=6'
      }
      let newSignature = this.encryption(signature, data1)
      data1.redirectUrl = encodeURIComponent(data1.redirectUrl)
      let str1 = 'https://papi.haoxinqing.cn/papi/patient/saas/authorizeCallback?'
      Object.keys(data1).forEach((item) => {
        str1 = str1 + item + '=' + data1[item] + '&'
      })
      this.iconList[1].url = str1 + 'signature=' + newSignature
    },
    // 第三方H5跳转参数加密
    encryption (key, data) {
      var arrkey = []
      var arrvalue = []
      var arr = []
      Object.keys(data).forEach((item) => {
        arrkey.push(item)
      })
      Object.values(data).forEach((item) => {
        arrvalue.push(item)
      })
      arrkey.forEach((item, index) => {
        arr[index] = '' + item + arrvalue[index]
      })
      arr = arr.sort()
      var stringA = ''
      arr.forEach((item) => {
        stringA = stringA + item
      })
      var stringSignTemp = key + stringA
      return md5(stringSignTemp).toUpperCase()
    },
    toIconPath (item, index) {
      if (index === 1) {
        location.href = this.iconList[1].url
      } else {
        this.$router.push({
          name: item.path
        })
      }
    }
  }
}
</script>

<style scoped>
.details-title-container{
  background: #f3f3f3;
  padding: 16px;
  min-height: 100vh
}
.details-title{
  display: flex;
  justify-content: space-between
}
.details-title-item{
  padding: 16px;
  background: #fff;
  flex: 1;
  border-radius: 5px
}
.details-title-item-first{
  margin-right: 10px
}
.details-content-title{
  font-size: 14px;
  color: #384256;
  opacity: 0.65;
}
.details-content-count{
  font-size: 18px;
  opacity: 0.85;
  margin-top: 9px
}
.details-content-progress{
  font-size: 12px;
  color: #384256;
  opacity: 0.45;
  margin-top: 15px
}
.total-progress{
  margin-top: 4px;
  background:#ededed;
  height: 4px;
}
.current-progess{
  background:#ff928e;
  height:4px;
}
.details-level-wrapper{
  display: inline-block;
  margin-top: 16px
}
.details-level-left{
  display: inline-block;
  font-size: 28px;
}
.level-color{
  display: inline-block;
  vertical-align: middle;
  margin-left: 16px;
  width: 18px;
  height: 18px;
  border-radius: 6px
}
.current-situation{
  background: #ffffff;
  padding: 16px;
  margin-top: 10px;
  border-radius: 5px
}
.current-situation-title{
  font-size: 16px;
  margin-bottom: 10px
}
.current-situation-content{
  font-size: 14px
}
.details-tags{
  display: flex;
  justify-content: space-between
}
.details-tags-item{
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #384256
}
.details-tags-img{
  width: 36px;
  height: 36px;
  margin-bottom: 8px;
  border-right: 1px solid #f3f3f3
}
</style>
