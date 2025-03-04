<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-15 16:07:09
 * @LastEditTime: 2019-11-19 14:57:07
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="result-container">
    <div>
      <img src="statics/images/result.png" alt="" class="result-img">
      <!-- 非最后一个量表 -->
      <div v-if="!showLastButton">
        <p class="content">{{testName}}已完成提交</p>
      </div>
      <!-- 其他 -->
      <div v-else-if="showLastButton && type === 1">
        <p class="content">您已完成此次{{questionnaireName}}</p>
        <p class="content">请点击递交</p>
        <p class="content">向医护人员获取本次评估完整报告</p>
      </div>
      <!-- 孕期 -->
      <div v-else-if="showLastButton && type === 2">
        <p class="content">请准妈妈们自行进行3次免费心理筛查，</p>
        <p class="content">孕早中晚期各一次，</p>
        <p class="content">分娩后选择“产后普筛”均免费。</p>
        <p class="content">您已完成{{questionnaireName}}</p>
        <p class="content">请点击递交并到产科门诊12诊室查看结果</p>
      </div>
      <div v-else-if="showLastButton && type === 3">
        <p class="content">您已完成{{questionnaireName}}</p>
        <p class="content">请点击递交并到产科门诊12诊室查看结果</p>
      </div>
    </div>
    <button v-if="!showLastButton" @click="toNextPage" class="btn">前往下一量表</button>
    <button v-else @click="tohome" class="btn">递交</button>
    <q-dialog
      v-model="customDialogModel"
      prevent-close
      ok="确定"
      :cancel="returnCancelText"
      @ok="onOk"
      @cancel="onCancel"
    >
      <span slot="title">提示</span>
      <span class="dialog-msg" slot="message" v-html="returnPromptStr"></span>
       <template slot="buttons">
        <q-btn color="primary" label="Choose Superman" />
        <q-btn color="black" label="Choose Batman" />
      </template>
    </q-dialog>
  </div>
</template>

<script>
export default {
  mounted () {
    const _this = this
    this.$q.loading.show({
      message: '加载中...'
    })
    this.$store.commit('example/editTitle', {
      title: `${JSON.parse(localStorage.getItem('h5_stage_enableQuestionnaire')).name}体系`
    })
    // 修改页面文本
    this.returnTestName()
    let questionnaireids = JSON.parse(localStorage.getItem('h5_stage_enableQuestionnaire'))
    _this.questionnaireName = questionnaireids.name
    if (+questionnaireids.id === 51) {
      _this.questionnaireName = localStorage.getItem('h5_stage_textName')
      _this.type = 2
      if (_this.questionnaireName === '产后普筛') {
        _this.type = 3
      }
    }
    let questionnaire = JSON.parse(localStorage.getItem('h5_stage_currentQuestionnaire'))
    let nextPageId = +_this.$route.params.nextPageId
    // 记录当前完成的问卷
    questionnaireids.questionnaire_array = questionnaireids.questionnaire_array.map(val => {
      if (+val.id === questionnaire.id) {
        val.isFinished = true
      }
      return val
    })
    localStorage.setItem('h5_stage_enableQuestionnaire', JSON.stringify(questionnaireids))
    // 切换结果页的显示内容
    parseInt(nextPageId) === 0 ? _this.showLastButton = true : _this.showLastButton = false
    this.$q.loading.hide()
  },
  computed: {
    returnPromptStr () {
      return '您的评估结果可以从</br>“我的”-“评估报告” 查看'
    },
    returnCancelText () {
      return ''
    }
  },
  data () {
    return {
      hospital_id: JSON.parse(localStorage.getItem('h5_stage_userinfo')).hospital_id,
      testName: '',
      type: 1,
      questionnaireName: '',
      showLastButton: false,
      customDialogModel: false
    }
  },
  methods: {
    toNextPage () {
      this.$router.push({
        name: 'intro',
        params: {
          id: this.$route.params.nextPageId
        }
      })
    },
    tohome () {
      // 55曲江妇产医院隐藏查看报告弹窗直接跳转课程页
      if (this.hospital_id === 55) {
        this.onOk()
      } else {
        this.customDialogModel = true
      }
    },
    onOk () {
      localStorage.setItem('h5_stage_hasShowModel', 1)
      this.$router.push({
        name: 'index',
        query: {
          openid: localStorage.getItem('h5_stage_openid')
        }
      })
    },
    onCancel () {
      localStorage.clear()
      this.$router.push({
        name: 'welcome'
      })
    },
    returnTestName () {
      var id = JSON.parse(localStorage.getItem('h5_stage_currentQuestionnaire')).id
      JSON.parse(localStorage.getItem('h5_stage_enableQuestionnaire')).questionnaire_array.forEach((item, index) => {
        if (item.id === id) {
          if (+item.is_score === 0) {
            this.testName = item.title
          } else {
            this.testName = item.alias_title
          }
          return ''
        }
      })
    }
  }
}
</script>

<style scoped>
  .result-container{
    display: flex;
    flex-direction: column;
    overflow: auto;
    align-items: center;
    box-sizing: border-box;
    min-height: 100vh
  }
  .result-img{
    width: 130px;
    height: 130px;
    display: block;
    margin: 24px auto
  }
  .btn {
    width: 287px;
    height: 40px;
    background: #6ac4bf;
    border-radius: 20px;
    color: #ffffff;
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 20px;
    line-height: 40px;
    border: none
  }
  .content{
    width: 100%;
    font-size: 18px;
    line-height: 25px;
    color: #4A4A4A;
    text-align: center
  }
  .dialog-msg{
    text-align: center;
    display: block
  }
</style>
