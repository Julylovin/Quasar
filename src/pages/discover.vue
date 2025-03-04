<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-24 10:51:33
 * @LastEditTime: 2019-11-05 16:25:41
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="discover-container">
    <div class="showModel" v-if="hasShowModel==1 && time !== 1 && hospital_id!=20">
        <div  class="modelContent">
          <div class="title-model">
              温馨提示
          </div>
          <div class="content-model">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每天10到15分钟规律且有系统的学习训练减压放松课程，有助于缓解负面情绪带来的不适。
          </div>
          <div class="modelDefinedBtn" @click.stop="definedSub">
              确定
          </div>
        </div>
    </div>
    <div class="Acover" v-if="time === 1" >
      <div class="Aheader"></div>
      <div class="Atitle"></div>
      <div class="Abody-top"></div>
      <div class="Abody">
        <span class="Abody-left"></span>
        <span class="Abody-right">
          <img src="statics/images/lead-3.png" alt="" class="lead-3">
        </span>
      </div>
      <div class="Afooter">
        <img src="statics/images/lead-4.png" alt="" class="lead-4">
        <img src="statics/images/lead-6.png" alt="" class="lead-6" @click="toUser">
      </div>
    </div>
    <Tabs class="tab-container"
      :active="currentTab"
      color="#84cebe"
      title-active-color="#84cebe"
      :animated="true" @click="onClickTag">
      <Tab :title="tabitem.tab_name" v-for="(tabitem, tabindex) in typeList" :key="tabindex">
        <div class="tag-content">
            <div v-show="tabitem.data.length > 1"  v-for="(item,index) in tabitem.data" :key="index" >
              <div class="tag-list" :class=" current == index ? 'tag-list-active' :''" @click="showContent(item, index)">{{item.tab_name}}</div>
            </div>
        </div>
        <div class="class-container">
          <div v-for="(value, dataindex) in categoryType" :key="dataindex">
          <div class="title-container">
            <p class="type-title" v-show="categoryType.length>1">{{value.name}}</p>
            <div class="image-container">
            <a @click="toCourseDetails(it, tabindex, tabitem.tab_name)" class="curse-cell-div" v-for="(it,ind) in value.data[0]" :key="ind">
              <img :src="it.img" alt="">
              <div class="curse-cell-intro">
                <p class="curse-cell-title" v-if="it.title.indexOf('分钟')>-1"><b>{{it.title.split('分钟')[0]}}分钟</b>{{it.title.split('分钟')[1]}}</p>
                <p class="curse-cell-title" v-else>{{it.title}}</p>
                <p class="curse-cell-info">{{it.scan_num_show}}人加入学习</p>
                <div class="curse-cell-info">
                  <span>{{it.scan_num_show}}人加入学习</span>
                  <!-- <span v-if="it.is_need_pay === 0 " class="free">免费</span>
                  <span v-else-if="it.is_need_pay === 1 && it.pay_status === 0" class="price">￥9.9</span>
                  <span v-else class="paid">已 购</span> -->
                </div>
              </div>
            </a>
          </div>
          </div>
        </div>
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import network from '../network/network.js'
import { Tabs, Tab } from 'vant'

export default {
  created () {
    this.hasShowModel = localStorage.getItem('h5_stage_hasShowModel')
    this.typeIndex = this.$route.query.typeIndex
    this.currentTab = localStorage.getItem('h5_stage_discoverTab') ? localStorage.getItem('h5_stage_discoverTab') - 0 : 0
    this.getCategory()
    this.isWeiXin()
    this.userId = JSON.parse(localStorage.getItem('h5_stage_userinfo')).id
    this.time = localStorage.getItem('h5_stage_loginCount') - 0
  },
  mounted () {
    this.$q.loading.show({
      message: '加载中...'
    })
    this.$store.commit('example/editTitle', {
      title: '课程'
    })
  },
  components: {
    Tabs,
    Tab
  },
  data () {
    return {
      tabTitle: '',
      hasShowModel: 0,
      categoryType: [],
      typeIndex: '',
      tagSecordContent: [
        { name: '',
          data: []
        }
      ],
      current: 0,
      typeList: [],
      currentTab: 0,
      // currentTab: localStorage.getItem('discoverTab') ? localStorage.getItem('discoverTab') - 0 : 0,
      userId: '',
      isWX: Boolean,
      time: Number
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler: function (newValue, oldValue) {
        if (oldValue === undefined) {
        }
      },
      deep: true
    }
  },
  methods: {
    async getCategory () {
      const result = await network.getTagCategory().then(res => {
        if (this.typeIndex || this.typeIndex === 0) {
          var temp = localStorage.getItem('h5_stage_current')
          this.showContent(res[this.typeIndex].data[temp], temp)
        } else {
          if (this.$route.query.first === 'true') {
            this.currentTab = 0
            this.showContent(res[0].data[0], 0)
          } else {
            // this.current = 0
            var tabCurrent = 0
            // tab_type=1是常用量表，2是妇女类，3是医务人员类4是儿童5是青少年6是心脏
            // ListID=3、48更年期,4备孕期，24妇科，41甲乳外科，其他详见数据库且均默认调整孕产期tab
            if (localStorage.getItem('h5_stage_tab_type') === '2') {
              this.currentTab = 0
              if (localStorage.getItem('h5_stage_ListID') === '4') {
                tabCurrent = 1
              } else if (localStorage.getItem('h5_stage_ListID') === '3' || localStorage.getItem('h5_stage_ListID') === '48') {
                tabCurrent = 2
              } else if (localStorage.getItem('h5_stage_ListID') === '24') {
                tabCurrent = 3
              } else {
                tabCurrent = 0
              }
            } else if (localStorage.getItem('h5_stage_tab_type') === '3') {
              this.currentTab = 1
            } else {
              this.currentTab = 2
            }
            // 甲乳外科属于tab_type=2孕产类但是跳转时跳转到减压音乐
            if (localStorage.getItem('h5_stage_ListID') === '41') {
              this.currentTab = 2
              tabCurrent = 0
            }
            this.showContent(res[this.currentTab].data[tabCurrent], tabCurrent)
          }
        }
        return res
      })
      this.typeList = result
      // this.typeList.forEach(item => {
      //   item.data.forEach(async value => {
      //     value.category_id = value.id
      //     value.data = await this.getData(value)
      //     if (value.id === 33) {
      //       value.data[0].title = '4分钟-释放身心，全然放松'
      //       value.data[1].title = '8分钟-回归当下的平静'
      //     } else if (value.id === 32) {
      //       value.data[0].title = '5分钟-呼吸练习，为今天的自己加油'
      //       value.data[1].title = '10分钟-抽离练习，回到当下'
      //       value.data[2].title = '15分钟-放下自己，把一天归零'
      //     }
      //     this.$forceUpdate()
      //   })
      // })
      this.$q.loading.hide()
    },
    isWeiXin () {
      var ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) === 'micromessenger') {
        this.isWX = true
      } else {
        this.isWX = false
      }
    },
    selectType (item) {
      return +item.id > 22
    },
    async getData (id) {
      const result = await network.getArticleList(id).then(res => {
        if (localStorage.getItem('h5_stage_articleList')) {
          var temp = JSON.parse(localStorage.getItem('h5_stage_articleList'))
          res.forEach(item => {
            temp.push(item)
          })
          localStorage.setItem('h5_stage_articleList', JSON.stringify(temp))
        } else {
          localStorage.setItem('h5_stage_articleList', JSON.stringify(res))
        }
        return res
      })
      return result
    },
    toCourseDetails (item, index, title) {
      localStorage.setItem('h5_stage_current', this.current)
      // 31备孕期 30 28 26 孕产期 32 医务人员 34妇科  33减压 32 医务人员
      localStorage.setItem('h5_stage_discoverTab', index)
      localStorage.setItem('h5_stage_currentArticle', JSON.stringify(item))
      // let _this = this
      // 暂时取消付费判断，并且隐藏页面与费用有关标签
      if (item.is_need_pay === 100 && item.pay_status === 0) {
        const cmsId = JSON.parse(localStorage.getItem('h5_stage_currentArticle')).id
        // if (_this.isWX) {
        network.order(
          {
            user_id: this.userId,
            cms_id: cmsId,
            js_code: this.userId,
            platform_type: 4
          }
        ).then(res => {
          res.data.data.time_stamp = JSON.stringify(res.data.data.time_stamp)
          this.callWxPay(res.data.data)
        }).catch((err) => {
          this.$q.notify({
            message: err.message,
            type: 'negative',
            position: 'top',
            timeout: 3000
          })
        })
        // } else {
        //   network.order(
        //     {
        //       user_id: this.userId,
        //       cms_id: cmsId,
        //       js_code: this.userId,
        //       platform_type: 4
        //     }
        //   ).then(res => {
        //     window.location.href = res.data.data.mweb_url
        //   }).catch(() => {
        //     this.$q.notify({
        //       message: '创建订单失败',
        //       type: 'negative',
        //       position: 'top',
        //       timeout: 3000
        //     })
        //   })
        // }
      } else {
        if (item.category_id >= 31) {
          localStorage.setItem('h5_stage_tabTitle', this.tabTitle)
          const startTime = Number(new Date())
          this.$router.push({
            name: 'audio',
            query: {
              start_time: startTime,
              typeIndex: index,
              course_id: item.id
            }
          })
        } else {
          const startTime = Number(new Date())
          this.$router.push({
            name: 'webview',
            query: {
              start_time: startTime,
              typeIndex: index
            }
          })
        }
      }
    },
    callWxPay (params) {
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.jsApiCall(params), false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.jsApiCall(params))
          document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall(params))
        }
      } else {
        this.jsApiCall(params)
      }
    },
    jsApiCall (params) {
      var _this = this
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          'appId': 'wx7977a04fc1140363',
          'timeStamp': params.time_stamp,
          'nonceStr': params.nonce_str,
          'package': 'prepay_id=' + params.prepay_id,
          'signType': params.sign_type,
          'paySign': params.pay_sign
        },
        function (res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            _this.$router.go(0)
            // alert(JSON.parse(localStorage.getItem('itemdetails')).id)
            // if (localStorage.getItem('itemdetails').category_id >= 31) {
            //   alert(localStorage.getItem('itemdetails').category_id)
            //   const startTime = Number(new Date())
            //   _this.$router.push({
            //     name: 'audio',
            //     query: {
            //       start_time: startTime,
            //       typeIndex: index
            //     }
            //   })
            // } else {
            //   alert(localStorage.getItem('itemdetails') + '0--------------------')
            //   const startTime = Number(new Date())
            //   _this.$router.push({
            //     name: 'webview',
            //     query: {
            //       start_time: startTime
            //     }
            //   })
            // }
          }
        }
      )
    },
    toUser () {
      this.$router.push({
        name: 'userIndex'
      })
    },
    async onClickTag (name, title) {
      const result = await network.getTagCategory().then(res => {
        this.showContent(res[name].data[0], 0)
        return res
      })
      this.typeList = result
      this.$q.loading.hide()
    },
    showContent (data, ind) {
      this.tabTitle = data.tab_name
      this.current = ind
      this.categoryType = data.data
      localStorage.removeItem('h5_stage_articleList')
      data.data.forEach(async (ele, index) => {
        this.categoryType[index].data = []
        ele.category_id = ele.id
        ele.user_id = localStorage.getItem('h5_stage_user_id')
        this.categoryType[index].data.push(await this.getData(ele))
        // this.tagSecordContent.name = ele.name
        this.$forceUpdate()
      })
      // this.categoryType.forEach( item => {
      // })
    },
    definedSub () {
      localStorage.setItem('h5_stage_hasShowModel', 0)
      this.hasShowModel = 0
    }
  }
}
</script>

<style scoped>
.tab-container {
  width:100%;
}
.discover-container{
  min-height: 100vh;
  background: #fff;
}

.title-container {
  margin: 16px 0;
}

.type-title{
  font-size: 18px;
  font-weight: 500;
  border-left: 4px solid rgb(106, 195, 191);
  padding-left: 8px;
  margin: 16px 0;
}

.image-container{
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap
}

.curse-cell-div {
  margin-bottom: 10px;
  width: 49%;
  background: #fff;
  display: inline-block;
  position: relative;
  border-radius: 5px;
  box-shadow: 0px 2px 8px 0px rgba(200, 199, 204, 1);
  overflow: hidden;
}

.curse-cell-div img {
  width: 100%;
  height: 96px;
  display: block;
}

.curse-cell-intro {
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  width: 100%;
}

.curse-cell-title {
  font-size: 16px;
  color: #384256;
  margin-bottom: 8px
}

.curse-cell-info {
  position: absolute;
  width: 100%;
  top: 72px;
  left: 0;
  font-size: 12px;
  line-height: 24px;
  color: #ffffff;
  padding-left: 12px;
  padding-right: 8px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, .5);
  /* display: flex;
  justify-content: space-between; */
}

.class-container {
  box-sizing: border-box;
  width: 100%;
  padding: 0 16px 16px 16px;
}

.audio-box {
  min-height: 100vh;
  background: #f3f3f3;
  box-sizing: border-box;
  padding: 0 16px 16px 16px;
}

.curse-cell-audio {
  position: absolute;
  width: 100%;
  top: 72px;
  left: 0;
  font-size: 12px;
  line-height: 24px;
  color: #ffb400;
  padding-left: 12px;
  padding-right: 8px;
  background: rgba(0, 0, 0, .5);
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
}

.free {
  float: right;
  height: 18px;
  line-height: 18px;
  font-weight: 800;
  margin-top: 3px;
  background-color: #ffb400;
  color: #fff;
  border-radius: 2px;
  padding: 0 8px;
}

.price {
  float: right;
  height: 18px;
  line-height: 18px;
  font-weight: 800;
  margin-top: 3px;
  background-color: #fe1515;
  color: #fff;
  border-radius: 2px;
  padding: 0 8px;
  padding-left: 5px;
}

.paid {
  height: 18px;
  line-height: 18px;
  font-weight: 800;
  margin-top: 3px;
  background-color: #41ca6b;
  border-radius: 2px;
  color: #fff;
  float: right;
  padding: 0 8px;
}

.Acover {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999;
  width: 100%;
  height: 100%;
}

.Aheader {
  width: 100%;
  /* height: 50px; */
  background-color: rgba(0, 0, 0, 0.7);
}

.Atitle {
  width: 100%;
  height: 44px;
}

.Abody-top {
  width: 100%;
  /* height: 86px; */
  height: 96px;
  background-color: rgba(0, 0, 0, 0.7);
}

.Abody {
  width: 100%;
  height: 146px;
}

.Abody-left {
  float: left;
  height: 138px;
  width: 50%;
}

.Abody-right {
  float: left;
  position: relative;
  height: 100%;
  width: 50%;
  background-color: rgba(0, 0, 0, 0.7);
}

.lead-3 {
  position: absolute;
  top: 58px;
  left: 0;
}

.Afooter {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

.lead-4 {
  position: absolute;
  top: 68px;
  left: 50%;
  transform: translateX(-50%);
}

.lead-6 {
  position: absolute;
  top: 166px;
  left: 50%;
  transform: translateX(-50%);
}
.tag-content {
  display: flex;
  justify-content: flex-start;
  padding: 5px 0;
  padding: 0 10px;
  background: #fff;
  border-top: 12px solid #fff;
}
.tag-list {
  margin-right: 10px;
  background: rgba(132,206,190,.1);
  font-size: 14px;
  text-align: center;
  color: rgb(104, 196, 176);
  padding:5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: 5px;
}
.tag-list-active {
  background: rgba(132,206,190,.4);
  color: #84cebe;
}
.van-tab .van-tab__text {
  font-size: 16px!important;
}
/* 弹窗 */
.showModel {
  background: rgba(0,0,0,.5);
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modelContent{
  /* position: absolute;
  top: 150px; */
  width:340px;
  height:210px;
  background: #FFFF;
  border-radius: 10px;
  padding: 15px;
  font-size: 18px;
}
.title-model{
  font-weight: bold;
  text-align: center;
}
.content-model{
  margin: 15px 0 30px;
}
.modelDefinedBtn{
  text-align: center;
  height:34px;
  width:64%;
  line-height: 34px;
  color:#fff;
  background: #84cebe;
  border-radius:10px;
  margin: 0 auto;
}
</style>
