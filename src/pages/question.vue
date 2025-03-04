<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-15 16:07:09
 * @LastEditTime: 2019-11-22 11:23:40
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="container" ref="container">
    <div v-if="questions[index].audio_url">
      <span v-if="audioPlay" class="audio"  @click="play()"><img class="audioImg" src="statics/images/audioOn.png" alt=""> 关闭语音</span>
      <span v-else class="audio"  @click="play()"><img class="audioImg" src="statics/images/audioOff.png" alt=""> 语音读题</span>
      <audio id="audio">
      </audio>
    </div>
    <div class="progress-component">
      <div class="total-progress">
        <div :style="{width: showProgress+'%'}" class="current-progess"></div>
      </div>
      <span class="progress-count">{{index + 1}}/{{questions.length}}</span>
    </div>
    <div :class="picture?'question-container center':'question-container'">
      <p v-if="!picture">{{index+1}}.{{questions[index].query}}<span class="question-type">{{showQuestionType}}</span></p>
      <img class="question-img" v-else :src="picture" alt="">
    </div>
    <div class="answer-container">
      <checkBoxGroup :options="questions[index].item" @checkboxChange="checkboxChange" :isUpdate="isNext" :value="currentAnswerIndex" v-if="multi"/>
      <radioGroup :options="questions[index].item" :value="currentAnswerIndex" :isUpdate="isNext" @radioChange="radioChange" v-if="single"></radioGroup>
      <div class="picker-group" @click="() => {showPicker = true}" v-if="drop">
        <p class="picker">{{questions[index].item[dropIndex].query == 0 ? dropValue : questions[index].item[dropIndex].query}}</p>
      </div>
      <Popup v-model="showPicker" position="bottom">
        <Picker
          show-toolbar
          :columns="questions[index].item"
          value-key="query"
          @cancel="showPicker = false"
          @confirm="bindPickerChange"
        />
      </Popup>
      <div  v-if="write">
        <!-- 特例 -->
        <div v-if="questions[index].questionnaire_topic_id == 5119 || questions[index].questionnaire_topic_id == 5122 || questions[index].questionnaire_topic_id == 5125 || questions[index].questionnaire_topic_id ==5127">
          <p class="writer-placeholder">{{questions[index].item[0].query ? questions[index].item[0].query : ''}}<br/>
            以下无需全填，请根据实际情况填写
          </p>
          <input class="picker writer-picker"  v-model="currentAnswer"  placeholder="" type="hidden">
          <input class="picker writer-picker" v-for="(item, itemindex) in fillarr" :key="itemindex+'mulfill'" v-model="fillarr[itemindex]"  @change="sumbmit(this)"  type="text" :placeholder="questions[index].item[1].query ? '请输入第'+(itemindex+1)+'个' + questions[index].item[1].query : ''">
        </div>
        <!-- 正常 -->
        <div v-else>
          <input class="picker writer-picker" v-model="currentAnswer" @change="fillText" type="text">
        </div>
      </div>
      <div class="date-time-wrapper" @click="() => {showTimePicker = true}" v-if="datePicker">
        <p class="picker timePicker">{{pickerDate}}</p>
      </div>
      <Popup v-model="showTimePicker" position="bottom">
        <DatetimePicker
          type="date"
          v-model="defaultDate"
          @confirm="bindDateChange"
          @cancel="showTimePicker = false"
          :min-date="minDate"
          :max-date="maxDate"
        />
      </Popup>
      <div class="date-time-wrapper" @click="() => {showTime = true}" v-if="timePicker">
        <p class="picker timePicker">{{pickerTime}}</p>
      </div>
      <Popup v-model="showTime" position="bottom">
        <DatetimePicker
          type="time"
          v-model="defaultTime"
          @confirm="bindTimeChange"
          @cancel="showTime = false"
          :min-hour="0"
          :max-hour="23"
        />
      </Popup>
    </div>
    <div class="btn-container">
      <button v-back-to-top class="btn-up" v-if="!showPrev" @click="goBack">上一题</button>
      <button v-back-to-top class="btn-down" @click="onSubmit">{{changeButton ? '下一题' : '完成'}}</button>
    </div>
  </div>
</template>

<script>
import checkBoxGroup from '../components/checkBoxGroup.vue'
import radioGroup from '../components/radioGroup.vue'
import network from '../network/network.js'
import { Picker, Popup, DatetimePicker } from 'vant'

export default {
  watch: {
    audioPlay () {
      if (this.audioPlay) {
        this.playAudio(this.questions[this.index].audio_url)
      }
    },
    index () {
      if (this.audioPlay) {
        this.playAudio(this.questions[this.index].audio_url)
      }
    }
  },
  created () {
    this.$q.loading.show({
      message: '加载中...'
    })
    this.$store.commit('example/editTitle', {
      title: `${JSON.parse(localStorage.getItem('h5_stage_enableQuestionnaire')).name}体系`
    })
    var _this = this
    _this.index = 0
    _this.dropIndex = 0
    _this.changeButton = true
    if (_this.$route.params.questionID && !localStorage.getItem('h5_stage_totalQuestion')) {
      _this.totalQuestion = []
    } else if (!_this.$route.params.questionID) {
      _this.totalQuestion = []
    } else {
      _this.totalQuestion = JSON.parse(localStorage.getItem('h5_stage_totalQuestion'))
    }
    // 如果从card中进入将上次未完成的题目索引设置为index
    const questionList = JSON.parse(localStorage.getItem('h5_stage_currentQuestionnaire')).topic
    if (_this.$route.params.questionID) {
      questionList.forEach((value, index) => {
        if (value.questionnaire_topic_id === +_this.$route.params.questionID) {
          _this.index = index
        }
      })
    }
    _this.showNextQuestion(questionList[_this.index], _this.totalQuestion)
    _this.questions = questionList
    // 将已选中的答案存到storage里面
    const checkedQuestion = JSON.parse(localStorage.getItem('h5_stage_currentQuestion'))
    _this.storageAnswer(checkedQuestion, _this.totalQuestion)
    this.$q.loading.hide()
  },
  computed: {
    showPrev () {
      return this.index === 0
    },
    showProgress () {
      return Math.ceil(((this.index + 1) / this.questions.length) * 100)
    },
    showQuestionType () {
      switch (this.questions[this.index].type) {
        case 'single':
          return '[单选]'
        case 'multi':
          return '[多选]'
        case 'drop':
          return ''
        case 'fill':
          return '[填空]'
        case 'datePicker':
          return ''
        case 'timePicker':
          return ''
        default:
          return null
      }
    }
  },
  components: {
    checkBoxGroup,
    radioGroup,
    Picker,
    Popup,
    DatetimePicker
  },
  data () {
    return {
      picture: '',
      dropValue: '请选择',
      fillarr: ['', '', '', ''],
      questions: [],
      arr: [],
      totalQuestion: [],
      currentAnswer: '',
      pickerDate: '',
      pickerTime: '',
      currentAnswerIndex: -1,
      index: 0,
      dropIndex: 0,
      /**
       * isNext用来判断连续多选题中多选组件的状态变换
       */
      isNext: false,
      changeButton: true,
      single: false,
      multi: false,
      drop: false,
      write: false,
      datePicker: false,
      timePicker: false,
      showPicker: false,
      showTimePicker: false,
      showTime: false,
      minDate: new Date(1940, 1, 1),
      maxDate: new Date(),
      defaultDate: new Date(),
      defaultTime: '00:00',
      audioPlay: false
    }
  },
  methods: {
    /**
     * @description: 在点击上一题或者下一题的时候去更新当前题目的选项
     * @param totalAnswer: storage中的总答案
     * @param thisQuestion: 当前问题
     * @param currentAnswer: 当前问题的答案
     * @param totalQuestion: 问卷的所有问题
     * @param questionType: 当前题目的类型
     */
    play () {
      this.audioPlay = !this.audioPlay
    },
    playAudio (id) {
      var audio = document.getElementById('audio')
      audio.src = id
      audio.play()
    },
    judgeQuestionType: function (totalAnswer, thisQuestion, currentAnswer, totalQuestion, questionType) {
      // 判断答问卷第一题是否存在totalAnswer，不存在则手动设定为空数组
      if (!totalAnswer) {
        totalAnswer = []
      }
      const isPresence = totalAnswer.some(val => {
        return val.id === thisQuestion.questionnaire_topic_id
      })
      if (isPresence) {
        // 修改答案的时候需要同时更新选项id
        switch (questionType) {
          case 'single':
            totalQuestion = totalAnswer.map(val => {
              if (val.id === thisQuestion.questionnaire_topic_id) {
                val[questionType] = currentAnswer
                thisQuestion.item.forEach(item => {
                  if (currentAnswer === item.query) {
                    val.topic_item_id[0] = item.id
                  }
                })
              }
              return val
            })
            break
          case 'drop':
            totalQuestion = totalAnswer.map(val => {
              if (val.id === thisQuestion.questionnaire_topic_id) {
                val[questionType] = currentAnswer
                thisQuestion.item.forEach(item => {
                  if (currentAnswer === item.query) {
                    val.topic_item_id[0] = item.id
                  }
                })
              }
              return val
            })
            break
          case 'multi':
            totalQuestion = totalAnswer.map(val => {
              if (val.id === thisQuestion.questionnaire_topic_id) {
                val.topic_item_id = []
                val[questionType] = currentAnswer
                thisQuestion.item.forEach(item => {
                  JSON.parse(currentAnswer).forEach(value => {
                    if (value === item.query) {
                      val.topic_item_id.push(item.id)
                    }
                  })
                })
              }
              return val
            })
            break
          case 'fill':
            totalQuestion = totalAnswer.map(val => {
              if (val.id === thisQuestion.questionnaire_topic_id) {
                val[questionType] = currentAnswer
              }
              return val
            })
            break
          case 'datePicker':
            totalQuestion = totalAnswer.map(val => {
              if (val.id === thisQuestion.questionnaire_topic_id) {
                val[questionType] = currentAnswer
              }
              return val
            })
            break
          case 'timePicker':
            totalQuestion = totalAnswer.map(val => {
              if (val.id === thisQuestion.questionnaire_topic_id) {
                val[questionType] = currentAnswer
              }
              return val
            })
            break
        }
      } else {
        switch (questionType) {
          case 'multi':
            let multiTopicItemId = []
            thisQuestion.item.forEach(val => {
              JSON.parse(currentAnswer).forEach(item => {
                if (item === val.query) {
                  multiTopicItemId.push(val.id)
                }
              })
            })
            totalQuestion.push({
              id: thisQuestion.questionnaire_topic_id,
              [questionType]: currentAnswer,
              topic_item_id: multiTopicItemId
            })
            break
          case 'single':
            let singleTopicItemId = []
            thisQuestion.item.forEach(val => {
              if (currentAnswer === val.query) {
                singleTopicItemId.push(val.id)
              }
            })
            totalQuestion.push({
              id: thisQuestion.questionnaire_topic_id,
              [questionType]: currentAnswer,
              topic_item_id: singleTopicItemId
            })
            break
          case 'drop':
            let dropTopicItemId = []
            thisQuestion.item.forEach(val => {
              if (currentAnswer === val.query) {
                dropTopicItemId.push(val.id)
              }
            })
            totalQuestion.push({
              id: thisQuestion.questionnaire_topic_id,
              [questionType]: currentAnswer,
              topic_item_id: dropTopicItemId
            })
            break
          case 'fill':
            totalQuestion.push({
              id: thisQuestion.questionnaire_topic_id,
              [questionType]: currentAnswer
            })
            break
          case 'datePicker':
            totalQuestion.push({
              id: thisQuestion.questionnaire_topic_id,
              [questionType]: currentAnswer
            })
            break
          case 'timePicker':
            totalQuestion.push({
              id: thisQuestion.questionnaire_topic_id,
              [questionType]: currentAnswer
            })
            break
        }
      }
      return totalQuestion
    },
    onSubmit () {
      var _this = this
      _this.dropIndex = 0
      // H5的需要辨别localstorage里存的是不是JSON
      let query = localStorage.getItem('h5_stage_query')
      if (!query && (_this.questions[_this.index].type === 'single' || _this.questions[_this.index].type === 'datePicker' || _this.questions[_this.index].type === 'drop' || _this.questions[_this.index].type === 'timePicker')) {
        this.$q.notify({
          message: '请选择您的答案',
          type: 'warning',
          position: 'top',
          timeout: 1000
        })
        return null
      } else if (!query && _this.questions[_this.index].type === 'multi') {
        this.$q.notify({
          message: '请选择您的答案',
          type: 'warning',
          position: 'top',
          timeout: 1000
        })
        return null
      } else if (!query && _this.questions[_this.index].type === 'fill' && _this.questions[_this.index].questionnaire_topic_id !== 5119 && _this.questions[_this.index].questionnaire_topic_id !== 5122 && _this.questions[_this.index].questionnaire_topic_id !== 5125 && _this.questions[_this.index].questionnaire_topic_id !== 5127) {
        this.$q.notify({
          message: '请填写您的答案',
          type: 'warning',
          position: 'top',
          timeout: 1000
        })
        return null
      }
      // 每一次提交将每题答案存起来
      // if (_this.questions[_this.index].questionnaire_topic_id === 5119 && _this.questions[_this.index].questionnaire_topic_id !== 5122 && _this.questions[_this.index].questionnaire_topic_id !== 5125 && _this.questions[_this.index].questionnaire_topic_id !== 5127) {
      //   if (!query && typeof (query) !== 'undefined' && query !== 0) {
      //     _this.currentAnswer = ''
      //   } else {
      //     _this.currentAnswer = query
      //   }
      // } else {
      //   _this.currentAnswer = query
      // }
      if (query || query === 0) {
        _this.currentAnswer = query
      } else {
        _this.currentAnswer = ''
      }
      const totalAnswer = JSON.parse(localStorage.getItem('h5_stage_totalQuestion'))
      const thisQuestion = JSON.parse(localStorage.getItem('h5_stage_currentQuestion'))
      _this.totalQuestion = _this.judgeQuestionType(totalAnswer, thisQuestion, _this.currentAnswer, _this.totalQuestion, _this.questions[_this.index].type)
      localStorage.setItem('h5_stage_totalQuestion', JSON.stringify(_this.totalQuestion))
      if (thisQuestion.next_topic_id > 0) {
        let dropItem = thisQuestion.item.some(val => {
          return val.query === _this.currentAnswer && (thisQuestion.factor_item_ids ? thisQuestion.factor_item_ids.includes(val.id + '') : thisQuestion.factor_item_id === val.id + '')
        })
        let nextQuestionIndex = 0
        JSON.parse(localStorage.getItem('h5_stage_currentQuestionnaire')).topic.forEach((val, index) => {
          if (val.questionnaire_topic_id === thisQuestion.next_topic_id) {
            nextQuestionIndex = index
          }
        })
        dropItem ? _this.index = nextQuestionIndex : _this.index++
      } else {
        _this.index++
      }
      if ((_this.index + 1) <= _this.questions.length) {
        // 每套问卷最后一题的按钮名称切换
        if ((_this.index + 1) === _this.questions.length) {
          _this.changeButton = false
        }
        // 记录当前所做的是哪一题
        _this.recordQuestion()
        // 显示下一题
        _this.showNextQuestion(_this.questions[_this.index], _this.totalQuestion)
        // 默认选择之前的答案需要对题目进行分类并存到storage
        _this.storageAnswer(_this.questions[_this.index], _this.totalQuestion)
        // 强制更新单选和多选组件的状态
        _this.isNext = true
        _this.arr = []
      } else {
        this.$q.loading.show({
          message: '加载中...'
        })
        _this.index = _this.questions.length - 1
        // 定义数据集合
        let answerData = {}
        // 获取可做量表组的id
        const currentGroupListIO = JSON.parse(localStorage.getItem('h5_stage_enableQuestionnaire')).id
        const currentTestID = JSON.parse(localStorage.getItem('h5_stage_currentQuestionnaire')).id
        // 获取问卷完成时间
        const endTime = (new Date().getTime())
        // 计算答题时间
        answerData.duration = `${Math.ceil((endTime - localStorage.getItem('h5_stage_startTime')) / 60000)}分钟`
        // 获取user_id
        answerData.user_id = JSON.parse(localStorage.getItem('h5_stage_userinfo')).id
        // 获取questionnare_id
        answerData.questionnaire_id = currentTestID
        // 获取questionnaire_group_id
        answerData.questionnaire_group_id = currentGroupListIO
        // 获取questionnaire_id_array
        answerData.questionnaire_id_array = JSON.parse(localStorage.getItem('h5_stage_enableQuestionnaire')).questionnaire_id_array
        // 整合数据
        answerData.content = JSON.stringify(_this.totalQuestion)
        var nextPageId = 0
        if (window.offline) {
          this.$q.loading.show({
            message: '网络不稳定或者已断开，请确保网络畅通后再试'
          })
        } else {
          network.postReply(answerData).then(res => {
            const totalList = JSON.parse(localStorage.getItem('h5_stage_enableQuestionnaire')).questionnaire_id_array
            totalList.forEach((val, index) => {
              if (+val === currentTestID) {
                // 判断最后一张问卷是否完成
                if (+currentTestID !== +totalList[totalList.length - 1]) {
                  nextPageId = totalList[index + 1]
                } else {
                  nextPageId = 0
                }
                this.$q.loading.hide()
                localStorage.removeItem('h5_stage_currentQuestion')
                this.$router.push({
                  name: 'result',
                  params: {
                    nextPageId: nextPageId
                  }
                })
              }
            })
          }).catch((err) => {
            // 此问卷不是当前授权问卷组1012就进下一个异常处理 清理缓存并且跳转首页重新进入
            // 如果此问卷已经提交  先弹错误提示然后根据情况跳转到结果页
            this.$q.notify({
              message: err.message,
              type: 'negative',
              position: 'top',
              timeout: 1000
            })
            // 故意操作不存在的变量，直接走下一个catch
            err.err.err++
            const totalList = JSON.parse(localStorage.getItem('h5_stage_enableQuestionnaire')).questionnaire_id_array
            totalList.forEach((val, index) => {
              if (+val === currentTestID) {
                // 判断最后一张问卷是否完成
                if (+currentTestID !== +totalList[totalList.length - 1]) {
                  nextPageId = totalList[index + 1]
                } else {
                  nextPageId = 0
                }
                this.$q.loading.hide()
                localStorage.removeItem('h5_stage_currentQuestion')
                this.$router.push({
                  name: 'result',
                  params: {
                    nextPageId: nextPageId
                  }
                })
              }
            })
          }).catch(() => {
            // 跳转过程出现异常则清理做题记录并且跳转到首页重新加载
            localStorage.removeItem('h5_stage_currentQuestion')
            this.$router.push({
              name: 'index',
              query: {
                openid: localStorage.getItem('h5_stage_openid')
              }
            })
          })
        }
      }
    },
    goBack: function () {
      const _this = this
      if (JSON.parse(localStorage.getItem('h5_stage_currentQuestion')).preview_topic_id) {
        let lastDropQuestion = {}
        JSON.parse(localStorage.getItem('h5_stage_totalQuestion')).forEach(value => {
          if (value.id === JSON.parse(localStorage.getItem('h5_stage_currentQuestion')).preview_topic_id) {
            lastDropQuestion = value
          }
        })
        let dropItem = JSON.parse(localStorage.getItem('h5_stage_currentQuestionnaire')).topic.some(item => {
          return item.questionnaire_topic_id === lastDropQuestion.id && (item.factor_item_ids ? item.factor_item_ids.includes(lastDropQuestion.topic_item_id[0] + '') : lastDropQuestion.topic_item_id[0] + '' === item.factor_item_id)
        })
        let prevQuestionIndex = 0
        JSON.parse(localStorage.getItem('h5_stage_currentQuestionnaire')).topic.forEach((val, index) => {
          if (val.questionnaire_topic_id === JSON.parse(localStorage.getItem('h5_stage_currentQuestion')).preview_topic_id) {
            prevQuestionIndex = index
          }
        })
        dropItem ? _this.index = prevQuestionIndex : _this.index--
      } else {
        _this.index--
      }
      _this.isNext = true
      const answer = JSON.parse(localStorage.getItem('h5_stage_totalQuestion'))[this.index]
      this.recordQuestion()
      this.showPrevQuestion(this.questions[_this.index], answer)
      if (this.index < this.questions.length) {
        this.changeButton = true
      }
      // 默认选择之前的答案需要对题目进行分类并存到storage
      _this.storageAnswer(this.questions[_this.index], this.totalQuestion)
    },
    showNextQuestion: function (question, totalQuestion) {
      var _this = this
      // 下一题是这四题多个填空时，显示之前答案
      if (question.questionnaire_topic_id === 5119 || question.questionnaire_topic_id === 5122 || question.questionnaire_topic_id === 5125 || question.questionnaire_topic_id === 5127) {
        totalQuestion.forEach(val => {
          if (val.id === question.questionnaire_topic_id) {
            this.fillarr = val.fill.split(',')
          } else {
            this.fillarr = []
          }
          this.fillarr.length = 4
        })
      }
      // 648题为预计毕业日期故去掉时间限制，其他题均为今日之前
      if (+question.questionnaire_topic_id !== 648) {
        this.maxDate = new Date()
      } else {
        this.maxDate = new Date(2030, 1, 1)
      }
      switch (question.type) {
        case 'single':
          if (question.is_picture === 1) {
            this.picture = question.picture
          } else {
            this.picture = ''
          }
          _this.single = true
          _this.multi = false
          _this.drop = false
          _this.write = false
          _this.timePicker = false
          _this.datePicker = false
          _this.currentAnswerIndex = -1
          // 点击下一题时显示之前的答案
          totalQuestion.forEach(val => {
            if (val.id === question.questionnaire_topic_id) {
              question.item.forEach((value, index) => {
                if (val['single'] === value.query) {
                  _this.currentAnswerIndex = index
                }
              })
            }
          })
          break
        case 'multi':
          _this.single = false
          _this.multi = true
          _this.drop = false
          _this.write = false
          _this.timePicker = false
          _this.datePicker = false
          _this.currentAnswerIndex = []
          totalQuestion.forEach(data => {
            if (data.id === question.questionnaire_topic_id) {
              question.item.forEach((val, index) => {
                JSON.parse(data['multi']).forEach(value => {
                  if (val.query === value) {
                    _this.currentAnswerIndex.push(index)
                  }
                })
              })
            }
          })
          break
        case 'drop':
          _this.single = false
          _this.multi = false
          _this.drop = true
          _this.write = false
          _this.timePicker = false
          _this.datePicker = false
          _this.dropValue = '请选择'
          break
        case 'fill':
          _this.single = false
          _this.multi = false
          _this.drop = false
          _this.write = true
          _this.timePicker = false
          _this.datePicker = false
          _this.currentAnswer = ''
          break
        case 'datePicker':
          _this.single = false
          _this.multi = false
          _this.drop = false
          _this.write = false
          _this.datePicker = true
          _this.timePicker = false
          _this.pickerDate = ''
          break
        case 'timePicker':
          _this.single = false
          _this.multi = false
          _this.drop = false
          _this.write = false
          _this.datePicker = false
          _this.timePicker = true
          _this.pickerTime = ''
          break
        default:
          break
      }
      localStorage.removeItem('h5_stage_query')
      // 从主页返回问卷时更新currentQuestion状态
      localStorage.setItem('h5_stage_currentQuestion', JSON.stringify(question))
    },
    showPrevQuestion: function (question, answer) {
      var _this = this
      // 下一题是这四题多个填空时，显示之前答案
      if (question.questionnaire_topic_id === 5119 || question.questionnaire_topic_id === 5122 || question.questionnaire_topic_id === 5125 || question.questionnaire_topic_id === 5127) {
        this.fillarr = answer.fill.split(',')
        this.fillarr.length = 4
      }
      // 648题为预计毕业日期故去掉时间限制，其他题均为今日之前
      if (+question.questionnaire_topic_id !== 648) {
        this.maxDate = new Date()
      } else {
        this.maxDate = new Date(2030, 1, 1)
      }
      switch (question.type) {
        case 'single':
          if (question.is_picture === 1) {
            this.picture = question.picture
          } else {
            this.picture = ''
          }
          _this.single = true
          _this.multi = false
          _this.drop = false
          _this.write = false
          _this.timePicker = false
          _this.datePicker = false
          _this.currentAnswerIndex = -1
          question.item.forEach((val, index) => {
            if (val.query === answer['single']) {
              _this.currentAnswerIndex = index
            }
          })
          break
        case 'multi':
          _this.single = false
          _this.multi = true
          _this.drop = false
          _this.write = false
          _this.timePicker = false
          _this.datePicker = false
          _this.currentAnswerIndex = []
          question.item.forEach((val, index) => {
            JSON.parse(answer['multi']).forEach(value => {
              if (val.query === value) {
                _this.currentAnswerIndex.push(index)
              }
            })
          })
          break
        case 'drop':
          _this.single = false
          _this.multi = false
          _this.drop = true
          _this.write = false
          _this.timePicker = false
          _this.datePicker = false
          _this.dropValue = '请选择'
          break
        case 'fill':
          _this.single = false
          _this.multi = false
          _this.drop = false
          _this.write = true
          _this.timePicker = false
          _this.datePicker = false
          _this.currentAnswer = ''
          break
        case 'datePicker':
          _this.single = false
          _this.multi = false
          _this.drop = false
          _this.write = false
          _this.datePicker = true
          _this.pickerDate = ''
          _this.timePicker = false
          break
        case 'timePicker':
          _this.single = false
          _this.multi = false
          _this.drop = false
          _this.write = false
          _this.datePicker = false
          _this.timePicker = true
          _this.pickerTime = ''
          break
        default:
          break
      }
      localStorage.removeItem('h5_stage_query')
      localStorage.setItem('h5_stage_currentQuestion', JSON.stringify(question))
    },
    recordQuestion: function () {
      // 将当前题目记录在storage中
      const _this = this
      let currentQuestion = {}
      _this.questions.forEach((val, index) => {
        if (index === _this.index) {
          currentQuestion = val
        }
      })
      localStorage.setItem('h5_stage_currentQuestion', JSON.stringify(currentQuestion))
    },
    storageAnswer: function (checkedQuestion, totalQuestion) {
      switch (checkedQuestion.type) {
        case 'single':
          totalQuestion.forEach(val => {
            if (val.id === checkedQuestion.questionnaire_topic_id) {
              localStorage.setItem('h5_stage_query', val['single'])
            }
          })
          break
        case 'multi':
          totalQuestion.forEach(val => {
            if (val.id === checkedQuestion.questionnaire_topic_id) {
              localStorage.setItem('h5_stage_query', val['multi'])
            }
          })
          break
        case 'drop':
          break
        case 'fill':
          totalQuestion.forEach(val => {
            if (val.id === checkedQuestion.questionnaire_topic_id) {
              localStorage.setItem('h5_stage_query', val['fill'])
              this.currentAnswer = val['fill']
            }
          })
          break
        default:
          break
      }
    },
    radioChange: function (val) {
      this.currentAnswerIndex = val
      JSON.parse(localStorage.getItem('h5_stage_currentQuestion')).item.forEach((value, index) => {
        if (index === val) {
          localStorage.setItem('h5_stage_query', value.query)
          // 如果next_topic_id === -1 则直接将后续题目丢掉 直接提交问卷
          if (+this.questions[this.index].next_topic_id === -1 && +this.questions[this.index].factor_item_id === +value.id) {
            this.changeButton = false
            this.questions.length = this.index + 1
          } else {
            this.questions = JSON.parse(localStorage.getItem('h5_stage_currentQuestionnaire')).topic
            this.changeButton = true
          }
          // 不存在终止问卷的答案时才自动下一题
          if (this.questions[this.index].type === 'single' && this.totalQuestion.length <= this.index && +this.questions[this.index].next_topic_id !== -1) {
            var _this = this
            setTimeout(function () {
              _this.onSubmit()
            }, 300)
          }
        }
      })
    },
    checkboxChange: function (val) {
      this.currentAnswerIndex = val
      this.isNext = false
      let checkboxValue = []
      JSON.parse(localStorage.getItem('h5_stage_currentQuestion')).item.forEach((value, index) => {
        val.forEach(item => {
          if (index === item) {
            checkboxValue.push(value.query)
          }
        })
      })
      if (checkboxValue.length !== 0) {
        localStorage.setItem('h5_stage_query', JSON.stringify(checkboxValue))
      } else {
        localStorage.removeItem('h5_stage_query')
      }
    },
    bindPickerChange: function (value) {
      if (value.query === '0') {
        this.dropValue = 0
      }
      var _this = this
      _this.questions[_this.index].item.forEach((val, index) => {
        if (val.id === value.id) {
          _this.dropIndex = index
        }
      })
      localStorage.setItem('h5_stage_query', _this.questions[_this.index].item[_this.dropIndex].query)
      this.showPicker = false
    },
    bindDateChange: function (value) {
      const date = new Date(value)
      this.pickerDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      localStorage.setItem('h5_stage_query', this.pickerDate)
      this.showTimePicker = false
    },
    bindTimeChange: function (value) {
      this.pickerTime = value
      localStorage.setItem('h5_stage_query', this.pickerTime)
      this.showTime = false
    },
    fillText: function (e) {
      localStorage.setItem('h5_stage_query', e.target.value)
    },
    sumbmit: function (e) {
      var temp = []
      this.fillarr.forEach(item => {
        if (item !== '') {
          temp.push(item)
        }
      })
      this.currentAnswer = temp.toString()
      localStorage.setItem('h5_stage_query', this.currentAnswer)
    }
  }
}
</script>

<style scoped>
  .container{
    min-height: 100vh;
    background: #FFFFFF;
    padding-top: 24px;
  }
  .progress-component {
    display: flex;
    align-items: center;
    justify-content: center
  }

  .progress-count{
    color: #98d8ca
  }

  .question-container {
    width: 320px;
    background: #FFFFFF;
    border-radius: 8px 8px 0 0;
    margin: 24px auto;
    position: relative;
  }
  .center {
    text-align: center;
  }
  .question-container p {
    font-size: 18px;
    font-weight: 500;
    color: rgba(74, 74, 74, 1);
    line-height: 25px;
  }

  .question-type{
    color: #98d8ca
  }

  .answer-container {
    background: #FFFFFF;
    border-radius: 0 0 8px 8px;
    position: relative;
    padding-bottom: 20px;
  }

  .btn-container {
    display: flex;
    justify-content: center;
    width: 335px;
    margin: 16px auto;
  }

  .btn-up {
    width: 130px;
    height: 44px;
    border-radius: 25px;
    background: rgba(74, 74, 74, 0);
    border: 1px solid #6ac3bf;
    font-size: 16px;
    margin-right: 20px;
    font-weight: 400;
    color: #6ac3bf;
    line-height: 41px;
  }

  .btn-down {
    width: 130px;
    height: 44px;
    border-radius: 25px;
    background: #6ac4bf;
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 41px;
    border: none
  }

  .total-progress{
    background:rgba(240, 241, 245, 1);
    width: 290px;
    height: 20px;
    border-radius: 10px
  }
  .current-progess{
    background:#6ac4bf;
    height:20px;
    border-radius: 10px
  }
  .picker-group{
    width: 335px;
    margin: 0 auto
  }
  .writer-picker{
    width: 80%;
    display:  block;
    margin: 0 auto;
    outline: none;
    border: none
  }
  .timePicker{
    width: 100%
  }
  .picker {
    background: rgba(240, 241, 245, 1);
    border-radius: 25px;
    height: 48px;
    font-size: 18px;
    color: #4a4a4a;
    text-align: center;
    line-height: 48px;
    margin-top: 20px;
  }
  .date-time-wrapper{
    width: 335px;
    margin: 0 auto
  }
  .hidden{
    display: block !important
  }
  .radio-group /deep/ .radio-item {
    padding-right: 16px;
    line-height: 25px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .radio-group /deep/ .radio-item-title{
    margin: 0 !important;
  }
  .writer-placeholder{
    margin:  auto 24px;
    font-size: 16px;
    width: 310px;
    /* font-weight: bold; */
    color: rgba(96,98,102,.6);
    text-align: center;
    line-height: 30px;
  }
  .writer-picker::placeholder{
    font-size: 18px;
    /* font-weight: 600; */
    color: rgba(96,98,102,.3);
  }
  .question-img {
    width: 234px;
  }
  /* =========语音读题============================ */
  .audio {
    position: absolute;
    top: 15px;
    color: white;
    /* background-color: red; */
    right: 10px;
    z-index: 2000;
  }
  .audioImg {
    width: 20px;
    height: 20px;
    vertical-align: bottom;
  }
</style>
