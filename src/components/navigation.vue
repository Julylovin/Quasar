<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 17:42:03
 * @LastEditTime: 2019-11-05 17:04:58
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="navigation-wrapper" v-if="titleChange">
    <q-icon
      v-if="type !== 0"
      name="navigate_before"
      size="24px"
      class="float-left q-ml-md icon-top"
      @click.native="toHomePage"
    />
    <span>{{returnTitle}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      /**
       * 0:不显示回退按钮
       * 1:回退按钮退回到上一页
       * 2:回退按钮退回到主页
       * 3:回退按钮退回到课程页
       */
      type: 0,
      typeIndex: '',
      newRouter: String,
      titleChange: false
    }
  },
  computed: {
    returnTitle () {
      let title = String
      if (this.newRouter.name === 'welcome' || this.newRouter.name === 'index' || this.newRouter.name === 'phoneList' || this.newRouter.name === 'webview' || this.newRouter.name === 'userIndex' || this.newRouter.name === 'intro' || this.newRouter.name === 'result' || this.newRouter.name === 'question') {
        title = this.$store.state.example.title
      } else if (this.newRouter.name === 'discover') {
        title = '课程'
      } else if (this.newRouter.name === 'audio') {
        title = localStorage.getItem('h5_stage_tabTitle')
      } else if (this.newRouter.name === 'agreement') {
        title = '心身管理隐私条件'
      } else if (this.newRouter.name === 'historyReportList' || this.newRouter.name === 'historyReportDetails' || this.newRouter.name === 'historyReportTypeDetails') {
        title = '个人报告'
      } else if (this.newRouter.name === 'lesson') {
        title = '历史课程'
      } else if (this.newRouter.name === 'info') {
        title = '个人资料'
      } else if (this.newRouter.name === 'about') {
        title = '关于我们'
      } else if (this.newRouter.name === 'doctorConsult') {
        title = '专家咨询'
      } else if (this.newRouter.name === 'selectType') {
        title = '选择量表'
      } else {
        title = '我的'
      }
      return title
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler: function (newValue, oldValue) {
        this.newRouter = newValue
        if (newValue.name === 'index' || newValue.name === 'welcome' || newValue.name === 'discover' || newValue.name === 'userIndex') {
          this.type = 0
          this.titleChange = false
        } else if (newValue.name === 'intro' || newValue.name === 'result' || newValue.name === 'question' || newValue.name === 'phoneList') {
          this.type = 2
          this.titleChange = true
        } else if (newValue.name === 'audio' || newValue.name === 'webview') {
          this.type = 3
          this.titleChange = true
        } else if (newValue.name === 'lesson') {
          this.type = 4
          this.titleChange = true
        } else {
          this.type = 1
          this.titleChange = true
        }
      }
    }
  },
  methods: {
    toHomePage () {
      if (this.$route.query.routecome === 'lesson') {
        this.$router.push({
          name: 'lesson'
        })
      } else {
        if (this.type === 1) {
          this.$router.go(-1)
        } else if (this.type === 3) {
          this.titleChange = true
          this.$router.push({
            name: 'discover',
            query: {
              typeIndex: this.$route.query.typeIndex
            }
          })
        } else if (this.type === 4) {
          this.titleChange = true
          this.$router.push({
            name: 'userIndex'
          })
        } else {
          this.$router.push({
            name: 'index',
            query: {
              openid: localStorage.getItem('h5_stage_openid'),
              typeIndex: this.$route.query.typeIndex
            }
          })
        }
      }
    }
  }
}
</script>
<style scoped>
.navigation-wrapper{
  position: relative;
  height: 50px;
  color: #fff;
  font-size: 14px;
  background: #6ac3bf;
  line-height: 50px;
  text-align: center
}
.icon-top{
  top: 13px;
  left: 10px;
  position: absolute;
}
</style>
