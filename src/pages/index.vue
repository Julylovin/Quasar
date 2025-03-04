<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 13:57:47
 * @LastEditTime: 2019-11-29 10:25:54
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="container">
    <div class="cover"  v-if="time === 1 && hospital_id!=20">
      <div class="cover-top">
        <img src="statics/images/lead-1.png" alt="" class="lead-1">
      </div>
      <div class="Cbody"></div>
      <div class="center"></div>
      <div class="Cfooter"></div>
      <div class="last">
        <img src="statics/images/lead-2-2.png" alt="" class="lead-2-2">
        <img src="statics/images/lead-2-1.png" alt="" class="last-1">
        <img src="statics/images/lead-6.png" alt="" class="last-2" @click="toDiscover">
      </div>
    </div>
    <div class="logo-bg"></div>
    <!-- 首页改版 -->
    <div class="bigBox">
      <Swipe v-if="hospital_id != 62" :autoplay="5000" indicator-color="white" class="banner">
         <Swipe-item v-for="(item, index) in imgList" :key="index">
           <a :href="item.url">
             <img :src="item.src" alt="">
           </a>
         </Swipe-item>
      </Swipe>
      <Swipe v-else :autoplay="5000" indicator-color="white" class="banner">
         <Swipe-item v-for="(item, index) in imgList62" :key="index">
           <a :href="item.url">
             <img :src="item.src" alt="">
           </a>
         </Swipe-item>
      </Swipe>
    </div>
    <!-- <div class="user-info">
      <img src="statics/images/avatar.png" class="avatar" alt="">
      <div>
        <span class="user-name">欢迎您！{{returnNickName}}</span>
        <span class="login-info">这是您的第{{returnLoginCount}}次登录</span>
      </div>
    </div>
    <div class="introduce-container">
      <img src="statics/images/notice.png" class="notice" alt="">
      <div class="introduce">
        <span class="introduce-title">{{articleTitle}}</span>
      </div>
    </div> -->
    <Tabs
      class="tab-container"
      :active="currentTab"
      color="#84cebe"
      :animated="true"
      >
      <Tab
        v-for="(value, key, index) in returnScaleList"
        :key="index"
        :title="value.name"
      >
        <!-- <div slot="title">
          <img :src="value.tab_icon" alt="" class="tab-icon">
          <p class="tab-title">{{value.name}}</p>
        </div> -->
        <div class="system-container">
          <div
          class="system-cell"
          v-for="(item,index2) in value.scaleInfo"
          :key="index2"
          @click="toQuestionInfo(item)"
          >
            <div v-if="!item.enable" class="disabled">
              <img src="statics/images/lock.png" class="locked" alt="">
            </div>
            <div class="system-left">
              <div class="paper-avatar-wrapper">
                <img :src="item.icon" class="paper-avatar" alt="">
              </div>
              <div class="text">
                <p class="system-title">{{item.name}}</p>
                <p class="system-info">已有{{item.count}}位用户参与测评</p>
              </div>
            </div>
            <div class="system-right">
              <div v-if="item.enable" class="system-right-top">
                <span>去评估</span>
                <Icon name="arrow" />
              </div>
              <span v-else style="color: #8E8E93">暂未授权</span>
            </div>
          </div>
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import network from '../network/network.js'
import { Tabs, Tab, Swipe, SwipeItem, Icon } from 'vant'
import md5 from 'js-md5'

export default {
  created () {
    if (this.$route.query.sign) {
      localStorage.setItem('h5_stage_sign', this.$route.query.sign)
    }
    if (localStorage.getItem('h5_stage_userinfo') && JSON.parse(localStorage.getItem('h5_stage_userinfo')).openid !== this.$route.query.openid) {
      localStorage.clear()
    }
    sessionStorage.clear()
    localStorage.setItem('h5_stage_openid', this.$route.query.openid)
    this.JsCode2Openid({
      sign: this.$route.query.sign || localStorage.getItem('h5_stage_sign') || '0',
      phone: this.$route.query.openid,
      department_id: this.$route.query.department_id || '92'
    })
  },
  mounted () {
    this.$q.loading.show({
      message: '加载中...'
    })
    this.$store.commit('example/editTitle', {
      title: '心身健康管理'
    })
  },
  components: {
    Tabs,
    Tab,
    Swipe,
    SwipeItem,
    Icon
  },
  data () {
    return {
      nickName: '',
      loginCount: '',
      articleTitle: '',
      articleContent: '',
      unFinishedPage: Array,
      UnFinishedPageID: String,
      scaleList: [],
      currentTab: 0,
      hospital_id: Number,
      imgList: [{
        url: '/h5_stage/#/discover',
        // url: '/#/discover',
        src: 'statics/images/banner1.png'
      },
      // {
      //   url: '',
      //   src: 'statics/images/banner2.png'
      // },
      {
        url: '/h5_stage/#/phoneList',
        // url: '/#/phoneList',
        src: 'statics/images/banner3.png'
      }],
      // 62山西妇幼隐藏专家咨询
      imgList62: [{
        url: '/h5_stage/#/discover',
        // url: '/#/discover',
        src: 'statics/images/banner1.png'
      },
      {
        url: '/h5_stage/#/phoneList',
        // url: '/#/phoneList',
        src: 'statics/images/banner3.png'
      }],
      time: Number
    }
  },
  computed: {
    returnNickName () {
      return this.nickName
    },
    returnLoginCount () {
      return this.loginCount
    },
    // 将获取的问卷列表分类
    returnScaleList () {
      var listData = {}
      for (var i = 0, len = this.scaleList.length; i < len; i++) {
        if (Object.keys(listData).indexOf("'" + this.scaleList[i].tab_type.toString()) > -1) {
          listData["'" + this.scaleList[i].tab_type].scaleInfo.push(this.scaleList[i])
        } else {
          var tabTypeStr = "'" + this.scaleList[i].tab_type
          listData[tabTypeStr] = {}
          listData[tabTypeStr].name = this.scaleList[i].tab_name
          listData[tabTypeStr].scaleInfo = [this.scaleList[i]]
          listData[tabTypeStr].tab_icon = this.scaleList[i].tab_icon
        }
      }
      var listData1 = {}
      var listData2 = {}
      var listData3 = {}
      var listData4 = {}
      for (var k in listData) {
        if (k === "'2") {
          listData1[k] = listData[k]
        } else if (k === "'4") {
          listData2[k] = listData[k]
        } else if (k === "'3") {
          listData3[k] = listData[k]
        } else {
          listData4[k] = listData[k]
        }
      }
      var newListData = Object.assign(listData1, listData2, listData3, listData4)
      if (this.hospital_id === 51) {
        for (let i in newListData) {
          if (+newListData[i].tab_type === 1) {
            newListData[i].name = '职工心身健康评估'
          }
        }
      }
      for (k in newListData) {
        if (k === "'2") {
          var scaleInfo = []
          newListData[k].scaleInfo.forEach(item => {
            if (item.enable) {
              scaleInfo.push(item)
            }
          })
          newListData[k].scaleInfo.forEach(item => {
            if (!item.enable) {
              scaleInfo.push(item)
            }
          })
          newListData[k].scaleInfo = scaleInfo
        }
      }
      return newListData
    }
  },
  methods: {
    // 授权成功以后获取临时登录凭证并存储对应的openid用来登录
    JsCode2Openid: function (argument) {
      var _this = this
      network.login(argument).then(res => {
        _this.nickName = res.user.name
        _this.time = res.count
        localStorage.setItem('h5_stage_loginToken', res.token)
        localStorage.setItem('h5_stage_loginCount', res.count)
        localStorage.setItem('h5_stage_hospital_id', res.user.hospital_id)
        localStorage.setItem('h5_stage_userinfo', JSON.stringify(res.user))
        this.hospital_id = JSON.parse(localStorage.getItem('h5_stage_userinfo')).hospital_id
        network.getArticleList({
          category_id: 2
        }).then(res => {
          _this.articleTitle = res[0].title
          _this.articleContent = res[0].content
          _this.getScaleList()
          _this.toHuixing()
        })
      }).catch((err) => {
        this.$q.loading.hide()
        this.$q.notify({
          message: err.message,
          type: 'negative',
          timeout: 3000
        })
        this.$router.push({
          name: 'welcome',
          query: {
            department_id: this.$route.query.department_id || '92',
            sign: this.$route.query.sign,
            openid: this.$route.query.openid
          }
        })
      })
    },
    // 获取量表列表
    getScaleList () {
      const _this = this
      const userID = {
        user_id: JSON.parse(localStorage.getItem('h5_stage_userinfo')).id
      }
      network.getScaleList(userID).then(res => {
        var tabList = []
        tabList = res.filter(item => { return item.enable === true })
        if (tabList.length > 0) {
          if (tabList[0].tab_type === 1) {
            _this.currentTab = 3
          } else if (tabList[0].tab_type === 2) {
            _this.currentTab = 0
          } else if (tabList[0].tab_type === 3) {
            _this.currentTab = 2
          } else {
            _this.currentTab = 1
          }
        } else {
          _this.currentTab = 0
        }
        res.forEach(item => {
          if (item.enable) {
            localStorage.setItem('h5_stage_ListID', JSON.stringify(item.id))
          }
        })
        localStorage.setItem('h5_stage_tab_type', JSON.stringify(res[0].tab_type))
        localStorage.setItem('h5_stage_scaleListID', JSON.stringify(res))
        _this.scaleList = res.map(value => {
          // 设置问卷是否完成的初始字段
          if (value.enable) {
            localStorage.setItem('h5_stage_enableQuestionnaire', JSON.stringify(value))
          }
          return value
        })
        const isEnable = JSON.parse(localStorage.getItem('h5_stage_scaleListID')).every(item => {
          return item.enable === false
        })
        this.$q.loading.hide()
        if (isEnable) {
          return
        }
        const questionnaireIds = JSON.parse(localStorage.getItem('h5_stage_enableQuestionnaire')).questionnaire_array
        // 判断当前做到了哪一套问卷
        _this.getQuestionnaireState(questionnaireIds)
      }).catch(() => {
      })
    },
    // 获取问卷的完成状态
    getQuestionnaireState: function (data) {
      this.unFinishedPage = data.filter(val => {
        if (!val.isFinished) {
          return val
        }
      })
      if (this.unFinishedPage.length !== 0) {
        this.unFinishedPageID = this.unFinishedPage[0].id
      } else {
        // 问卷全部完成则此数组为空
        this.unFinishedPageID = -1
      }
    },
    toQuestionInfo (item) {
      const UnFinishedPageID = this.unFinishedPageID
      if (!item.enable) {
        this.$q.notify({
          message: '您没有回答问卷的权限\r\n请联系相关医务人员',
          type: 'warning',
          position: 'top',
          timeout: 3000
        })
      } else {
        if (localStorage.getItem('h5_stage_currentQuestion') && localStorage.getItem('h5_stage_ListID') === localStorage.getItem('h5_stage_ListID2')) {
          this.$router.push({
            name: 'question',
            params: {
              questionID: JSON.parse(localStorage.getItem('h5_stage_currentQuestion')).questionnaire_topic_id
            }
          })
        } else {
          if (UnFinishedPageID === -1) {
            this.$q.notify({
              message: '此问卷组已经全部完成，请重新授权',
              type: 'warning',
              position: 'top',
              timeout: 2000
            })
            return
          }
          localStorage.removeItem('h5_stage_currentQuestionnaire')
          localStorage.removeItem('h5_stage_startTime')
          localStorage.removeItem('h5_stage_currentQuestion')
          localStorage.removeItem('h5_stage_totalQuestion')
          localStorage.removeItem('h5_stage_query')
          this.$router.push({
            name: 'intro',
            params: {
              id: UnFinishedPageID
            }
          })
        }
      }
    },
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
      this.imgList[1].url = str1 + 'signature=' + newSignature
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
    toDiscover () {
      this.$router.push({
        name: 'discover'
      })
    }
  }
}
</script>

<style scoped>
  .bigBox {
    width: 100%;
    box-sizing: border-box;
  }
  .logo-bg{
    width: 100%;
    height: 150px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    background: #6ac3bf;
    position: absolute;
    top: 0;
    z-index: -1
  }
  .user-info {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center
  }

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 0 0 25px #FFFFFF;
    margin: 15px 0 15px 20px;
  }

  .user-name {
    display: block;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    margin: 0 0 0 15px;
  }

  .system-title {
    font-size: 16px;
    color: #4A4A4A;
  }

  .login-info {
    display: inline-block;
    border-radius: 9px;
    font-size: 12px;
    line-height: 18px;
    margin: 8px 0 0 15px;
    color: #FFFFFF;
    background: #559c99;
    padding-left: 15px;
    padding-right: 16px
  }

  .introduce-container{
    display: flex;
    margin-left: 16px;
    margin-right: 16px;
    box-sizing: border-box;
    border-radius: 6px;
    box-shadow: 0 2px 4px 0 rgba(200, 199, 204, 1);
    justify-content: flex-start;
    background: #FFFFFF;
    align-items: center;
    padding: 16px
  }

  .notice{
    width: 50px;
    height: 50px
  }

  .introduce-title{
    display: block;
    font-size: 18px;
    font-weight: 400;
    color: #384256;
    margin: 0 0 0 15px;
  }

  .introduce-content{
    display: inline-block;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    line-height: 18px;
    margin: 8px 0 0 15px;
    color: #384256;
    opacity: 0.65;
  }

  .system-info {
    font-size: 12px;
    color: #8E8E93;
  }

  .to-blue {
    width: 15px;
    height: 15px;
    float: right;
  }

  .tab-container {
    width:100%;
    margin-top:5px;
  }

  .system-container {
    background: #ffffff;
    box-sizing: border-box;
    margin-bottom: 20px;
    padding-left: 16px;
    padding-right: 16px
  }

  .system-cell {
    position: relative;
    display: inline-block;
    border-radius: 4px;
    border-right: 1px solid #F3F3F3;
    border-bottom: 1px solid #F3F3F3;
    margin-bottom: 2px;
    padding: 10px 0;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .system-left {
    display: flex;
    justify-content: flex-start;
  }

  .paper-avatar-wrapper{
    display: flex;
    align-items: center;
  }

  .paper-avatar{
    width: 64px;
    height: 64px;
  }

  .text{
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .system-right {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-right: 10px;
  }

  .system-right-top {
    display: flex;
    align-items: center;
    color: #84cebe;
  }

  .womanTitle {
    box-sizing: border-box;
    padding-left: 6px;
    border-left: 8px solid #84cebe;
    margin-top: 6px;
    margin-bottom: 6px;
  }

  .disabled{
    background: rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100%;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
  }

  .locked{
    width: 25px;
    height: 28px;
  }

  .banner {
    width: 100%;
    height: 166px;
  }

  .banner img {
    width: 100%;
  }

  .cover {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
  }

  .cover-top {
    position: relative;
    width: 100%;
    height: 168px;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .lead-1 {
    position: absolute;
    bottom: 12px;
    left: 32px;
  }

  .Cbody {
    width: 100%;
    height: 44px;
  }

  .center {
    width: 100%;
    height: 10px;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .Cfooter {
    height: 80px;
    width: 100%;
  }

  .lead-2-2 {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }

  .last {
    position: relative;
    width: 100%;
    height: 518px;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .last-1 {
    position: absolute;
    top: 80px;
    right: 0;
  }

  .last-2 {
    position: absolute;
    left: 50%;
    top: 160px;
    transform: translateX(-50%);
  }

  .tab-icon {
    width: 24px;
    height: 24px;
  }

  .tab-title {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    color: #6AC3BF;
  }
</style>
