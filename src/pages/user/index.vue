 <!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-24 10:46:39
 * @LastEditTime: 2019-11-29 10:26:42
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="mine-container">
    <div class="Ucover" v-if="time === 1 && hospital_id!=20">
      <div class="Uheader"></div>
      <div class="Ubody"></div>
      <div class="Ufooter">
        <img src="statics/images/lead-5.png" alt="" class="lead-5">
        <img src="statics/images/lead-6.png" alt="" class="lead-7" @click="toIndex">
      </div>
    </div>
    <div class="people-card">
      <div class="avatar-container">
        <img class="avatar" src="statics/images/avatar.png" />
      </div>
      <p class="user-name">{{name}}</p>
    </div>
    <div class="nav-type">
      <a v-if="hospital_id!=55" :href="linkHref.reportHref" class="nav-item">
        <img class="nav-avatar" src="statics/images/history-result.png" />
        <p>评估报告</p>
      </a>
      <a :href="hospital_id==62?linkHref.docotorConsult:url" @click="navigateToDoctor" class="nav-item">
        <img class="nav-avatar" src="statics/images/huixin-doctor.png" />
        <p>专家咨询</p>
      </a>
      <a :href="linkHref.phoneHref" class="nav-item">
        <img class="nav-avatar" src="statics/images/hot-phone.png" />
        <p>心理热线</p>
      </a>
    </div>
    <div class="mine-options">
      <div class="option-item" @click="toOtherPage(item.path)" v-for="(item, index) in returnOptions" :key="index">
        <div class="option-item-left">
          <img class="options-icon" :src="item.imgSrc" />
          <span>{{item.name}}</span>
        </div>
        <img src="statics/images/arrow_right.png" alt="" class="option-arrow">
      </div>
    </div>
  </div>
</template>

<script>
import network from '../../network/network.js'
import md5 from 'js-md5'

export default {
  created () {
    this.$store.commit('example/editTitle', {
      title: '我的'
    })
    this.name = JSON.parse(localStorage.getItem('h5_stage_userinfo')).nickname
    this.time = localStorage.getItem('h5_stage_loginCount') - 0
    this.toHuixing()
  },
  computed: {
    returnOptions () {
      return [...this.options, {
        imgSrc: 'statics/images/logout.png',
        name: '清理缓存',
        path: ''
      }]
    }
  },
  data () {
    return {
      url: '',
      name: '',
      linkHref: {
        reportHref: '/h5_stage/#/historyReportList',
        // reportHref: '/#/historyReportList',
        docotorConsult: '/h5_stage/#/doctorConsult',
        phoneHref: '/h5_stage/#/phoneList'
        // phoneHref: '/#/phoneList'
      },
      options: [
        // {
        //   imgSrc: 'statics/images/history-course.png',
        //   name: '历史课程',
        //   path: 'lesson'
        // },
        {
          imgSrc: 'statics/images/user-info.png',
          name: '个人资料',
          path: 'info'
        },
        {
          imgSrc: 'statics/images/about-us.png',
          name: '关于我们',
          path: 'about'
        }
      ],
      hospital_id: JSON.parse(localStorage.getItem('h5_stage_userinfo')).hospital_id,
      time: Number
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
      this.url = str1 + 'signature=' + newSignature
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
    toOtherPage (path) {
      if (path === '') {
        localStorage.removeItem('h5_stage_currentQuestionnaire')
        localStorage.removeItem('h5_stage_startTime')
        localStorage.removeItem('h5_stage_currentQuestion')
        localStorage.removeItem('h5_stage_totalQuestion')
        localStorage.removeItem('h5_stage_query')
        this.$q.notify({
          message: '缓存清除成功',
          type: 'positive',
          position: 'top',
          timeout: 3000
        })
      } else {
        if (path === 'welcome') {
          localStorage.clear()
          this.$router.push({
            name: 'welcome'
          })
        } else {
          this.$router.push({
            name: `${path}`
          })
        }
      }
    },
    navigateToDoctor () {
      let data = {
        user_id: JSON.parse(localStorage.getItem('h5_stage_userinfo')).id,
        action: 'app_times'
      }
      // 成功打开小程序，更新用户跳转小程序次数
      network.actionCount(data).then(() => {
      }).catch(() => {
      })
    },
    toIndex () {
      localStorage.setItem('h5_stage_loginCount', 2)
      this.$router.push({
        name: 'index',
        query: {
          openid: localStorage.getItem('h5_stage_openid')
        }
      })
    }
  }
}
</script>

<style scoped>
  .mine-container {
    min-height: 100vh;
    background: #f3f3f3
  }

  .people-card {
    background: #6ac3bf;
    padding-bottom: 30px
  }

  .avatar-container {
    display: flex;
    justify-content: center;
  }

  .avatar {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    box-shadow: 0 0 15px #FFFFFF;
    margin-top: 10px;
  }

  .user-name {
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    margin-top: 8px;
  }

  .nav-type{
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    margin-bottom: 16px;
  }

  .nav-item{
    flex: 1;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 14px;
    color: #384256
  }

  .nav-avatar{
    width: 25px;
    height: 25px;
    margin: 0 auto
  }

  .mine-options {
    padding: 20px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 2px 4px 0px rgba(200, 199, 204, 1);
  }

  .option-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #f3f3f3
  }

  .option-item-left{
    display: flex;
    align-items: center
  }

  .option-item:last-child {
    margin-bottom: 0
  }

  .option-item span {
    font-weight: 400;
    font-size: 18px;
    color: rgba(0, 0, 0, 1);
    line-height: 25px;
  }

  .options-icon {
    width: 24px;
    height: 24px;
    margin-right: 16px
  }

  .option-arrow{
    width: 24px;
    height: 24px;
  }
  .Ucover {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999;
  width: 100%;
  height: 100%;
}

.Uheader {
  width: 100%;
  height: 150px;
  background-color: rgba(0, 0, 0, 0.7);
}

.Ubody {
  width: 100%;
  height: 66px;
}

.Ufooter {
  position: relative;
  width: 100%;
  height: 600px;
  background-color: rgba(0, 0, 0, 0.7);
}

.lead-5 {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
}

.lead-7 {
  position: absolute;
  left: 50%;
  top: 200px;
  transform: translateX(-50%);
}
</style>
