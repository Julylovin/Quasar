<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 13:57:47
 * @LastEditTime: 2019-10-18 14:55:06
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="container">
    <img :src="questionnaireInfo.banner" alt="" class="intro-top">
    <div class="intro-content">
      <p class="test-title">{{questionnaireInfo.title}}</p>
      <p class="test-content" v-for="(item, index) in questionnaireInfo.intro" :key="index">{{item}}</p>
      <button class="btn-red" @click="navigateTo">开始答题</button>
    </div>
  </div>
</template>

<script>
import network from '../network/network.js'

export default {
  mounted () {
    this.$q.loading.show({
      message: '加载中...'
    })
    localStorage.setItem('h5_stage_ListID2', localStorage.getItem('h5_stage_ListID'))
    this.$store.commit('example/editTitle', {
      title: `${JSON.parse(localStorage.getItem('h5_stage_enableQuestionnaire')).name}体系`
    })
    this.getQuestionnaireInfo(this.$route.params.id)
  },
  data () {
    return {
      questionnaireInfo: {},
      count: 0,
      duration: 0,
      startTime: ''
    }
  },
  methods: {
    navigateTo () {
      localStorage.setItem('h5_stage_startTime', (new Date()).getTime())
      this.$router.push({
        name: 'question',
        params: {
          questionID: -1
        }
      })
    },
    getQuestionnaireInfo (id) {
      const _this = this
      var userId = JSON.parse(localStorage.getItem('h5_stage_userinfo')).id
      network.getQuestionnaire(id, userId).then(res => {
        res.intro = res.intro.split('br')
        _this.questionnaireInfo = res
        _this.count = res.topic.length
        _this.duration = res.duration
        JSON.parse(localStorage.getItem('h5_stage_enableQuestionnaire')).questionnaire_array.forEach(val => {
          if (val.id === id || val.id === id - 0) {
            _this.questionnaireInfo.title = val.alias_title
          }
        })
        if (+_this.questionnaireInfo.is_score === 0) {
          _this.questionnaireInfo.title = JSON.parse(localStorage.getItem('h5_stage_enableQuestionnaire')).name + '体系'
        }
        localStorage.setItem('h5_stage_currentQuestionnaire', JSON.stringify(_this.questionnaireInfo))
        localStorage.removeItem('h5_stage_totalQuestion')
        this.$q.loading.hide()
      })
    }
  }
}
</script>

<style scoped>
.container{
  background: #f3f3f3;
  min-height: 100vh;
}
.intro-top{
  width: 100%;
  height: 190px;
}
.intro-content{
  margin: 16px;
  padding: 16px;
  background: #ffffff;
  text-align: center
}
.test-title{
  font-size: 16px;
  color: #383c45;
  margin-top: 24px
}
.test-time{
  font-size: 14px;
  color: #383c45;
  margin-top: 12px;
  opacity: 0.45;
}
.test-content{
  font-size: 14px;
  color: #383c45;
  margin-top: 12px;
  opacity: 0.45;
  padding-left: 16px;
  padding-right: 16px;
}
.btn-red {
  width: 300px;
  height: 44px;
  background: #6ac4bf;
  border-radius: 25px;
  color: #ffffff;
  font-size: 16px;
  margin-top: 24px;
  margin-bottom: 24px;
  line-height: 43px;
  border: none;
}
</style>
