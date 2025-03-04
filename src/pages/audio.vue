<template>
  <div class="container">
    <div>
        <audio :src="mp3_url" id="player"></audio>
    </div>
    <div class="imgBox">
      <img src="statics/images/circle.png" class="circle">
      <img :src="imgSrc" class="midCircle">
      <div class="smallCircle"></div>
    </div>
    <div class="audioTitle">{{title}}</div>
    <!-- 进度条 -->
    <div class="progressBox">
      <Slider v-model="value" @input="startDrag"/>
    </div>
    <div class="timeBox">
      <p>{{showTime1}}</p>
      <p>{{showTime2}}</p>
    </div>
    <div class="btnBox">
      <img src="statics/images/back.png" class="back" @click="audioBack">
      <div class="loadingBox" v-if="isLoading">
        <Loading color="#fff" size="50px" class="loading" type="spinner"/>
      </div>
      <img :src="isPlayAudio ? 'statics/images/audioStop.png' : 'statics/images/audioPlay.png'" class="playBox" @click="playAudio">
      <img src="statics/images/go.png" class="go" @click="audioGo()">
    </div>
  </div>
</template>

<script>
import network from '../network/network.js'
import { Loading, Slider } from 'vant'

export default {
  created () {
    this.showTime1 = '00:00'
    this.showTime2 = '00:00'
    this.start_time = this.$route.query.start_time
  },
  beforeRouteLeave (to, from, next) {
    this.postCourse()
    next()
  },
  mounted () {
    this.selectAudio()
    this.loadaudio()
    this.backgroundAudioManager = document.getElementById('player')
  },
  components: {
    Loading,
    Slider
  },
  data () {
    return {
      index: -1,
      value: 0,
      mp3_url: '',
      title: '',
      isPlayAudio: false,
      backgroundAudioManager: '',
      audioSeek: 0,
      audioTime: 0,
      audioDuration: 0,
      isAuto: false,
      showTime1: '00:00',
      showTime2: '00:00',
      isLoading: false,
      imgSrc: '',
      start_time: String
    }
  },
  methods: {
    startDrag () {
      if (+this.value > 98) {
        this.value = 98
      }
      this.audioSeek = parseInt(this.value / 100 * this.backgroundAudioManager.duration)
      this.setTime(1)
    },
    postCourse () {
      const data = {}
      if (this.$route.query.course_id) {
        var currentArticle = this.mp3[this.index % this.mp3.length]
      } else {
        currentArticle = this.mp3
      }
      data.user_id = JSON.parse(localStorage.getItem('h5_stage_userinfo')).id
      data.duration = Math.ceil((Number(new Date()) - this.start_time) / 60000)
      data.articleId = currentArticle.id
      data.title = currentArticle.title
      data.link = currentArticle.link
      data.img = currentArticle.img
      data.category_id = currentArticle.category_id
      network.recordArticle(data).then(res => {
        localStorage.removeItem('h5_stage_currentArticle')
      })
    },
    setTime (type) {
      var that = this
      var seek = that.audioSeek
      var duration = that.backgroundAudioManager.duration
      if (type === 1) {
        this.backgroundAudioManager.currentTime = this.audioSeek
        // this.backgroundAudioManager.play()
      }
      if (type === 2) {
        that.value = parseInt(that.backgroundAudioManager.currentTime / that.backgroundAudioManager.duration * 100)
      }
      var min = parseInt((seek + 1) / 60)
      var sec = parseInt((seek + 1) % 60)
      if (min.toString().length === 1) {
        min = `0${min}`
      }
      if (sec.toString().length === 1) {
        sec = `0${sec}`
      }
      var min1 = parseInt(duration / 60)
      var sec1 = parseInt(duration % 60)
      if (min1.toString().length === 1) {
        min1 = `0${min1}`
      }
      if (sec1.toString().length === 1) {
        sec1 = `0${sec1}`
      }
      if (that.value >= 99 && !that.$route.query.course_id) {
        console.log(12)
        that.backgroundAudioManager.load()
        that.audioSeek = 0
        that.audioDuration = duration
        that.isPlayAudio = false
        that.showTime1 = '00:00'
        return false
      } else if (that.value >= 99 && that.$route.query.course_id) {
        that.isAuto = true
        that.audioGo()
        return
      }
      that.audioSeek = seek + 1
      that.audioDuration = duration
      that.showTime1 = `${min}:${sec}`
      that.showTime2 = `${min1}:${sec1}`
    },
    playAudio () {
      if (!this.backgroundAudioManager.src) {
        this.backgroundAudioManager.src = this.mp3_url
      }
      var isPlayAudio = this.isPlayAudio
      this.backgroundAudioManager.title = this.title
      this.backgroundAudioManager.pause()
      this.isPlayAudio = !this.isPlayAudio
      if (isPlayAudio) {
        this.audioSeek = this.backgroundAudioManager.currentTime
      } else {
        if (this.backgroundAudioManager.duration !== 0) {
          this.audioDuration = this.backgroundAudioManager.duration
        }
        this.backgroundAudioManager.play()
      }
    },
    loadaudio () {
      var that = this
      this.durationIntval = setInterval(function () {
        if (that.isPlayAudio === true) {
          that.setTime(2)
        }
      }, 1000)
    },
    audioBack () {
      let _this = this
      if (_this.$route.query.course_id) {
        _this.postCourse()
        _this.index--
        if (_this.index < 0) {
          _this.index = _this.index + _this.mp3.length
        }
        _this.getAudio(+_this.index % _this.mp3.length)
        _this.start_time = Number(new Date())
      } else {
        if (!_this.backgroundAudioManager.src || _this.audioSeek === 0) {
          _this.audioSeek = 0
          _this.backgroundAudioManager.currentTime = 0
          return false
        } else if (_this.audioSeek <= 15 && _this.audioSeek > 0) {
          _this.audioSeek = 0
          _this.isPlayAudio = true
          _this.backgroundAudioManager.currentTime = 0
          _this.backgroundAudioManager.play()
        } else {
          _this.audioSeek -= 15
          _this.backgroundAudioManager.currentTime -= 15
          _this.isPlayAudio = true
          _this.backgroundAudioManager.play()
        }
      }
    },
    audioGo () {
      let _this = this
      if (_this.$route.query.course_id) {
        _this.postCourse()
        _this.index++
        _this.getAudio(+_this.index % _this.mp3.length)
        _this.start_time = Number(new Date())
      } else {
        if (!_this.backgroundAudioManager.src) {
          _this.audioSeek = 0
          _this.backgroundAudioManager.currentTime = 0
          return false
        } else if (_this.audioSeek + 15 >= _this.audioDuration) {
          _this.audioSeek = 0
          _this.backgroundAudioManager.currentTime = 0
          _this.isPlayAudio = false
          _this.backgroundAudioManager.load()
          _this.showTime1 = '00:00'
        } else {
          _this.audioSeek += 15
          _this.backgroundAudioManager.currentTime += 15
          _this.isPlayAudio = true
          _this.backgroundAudioManager.play()
        }
      }
    },
    getAudio (index) {
      this.mp3_url = this.mp3[index].content
      this.title = this.mp3[index].title
      this.imgSrc = this.mp3[index].img
      this.audioSeek = 0
      this.isPlayAudio = false
      this.value = 0
      this.showTime1 = '00:00'
      if (this.isAuto) {
        setTimeout(() => {
          this.playAudio()
        }, 100)
        this.isAuto = false
      }
    },
    selectAudio () {
      if (this.$route.query.course_id) {
        this.mp3 = JSON.parse(localStorage.getItem('h5_stage_articleList'))
        this.mp3.forEach((item, index) => {
          if (+item.id === +this.$route.query.course_id) {
            this.index = index
            this.getAudio(index)
          }
        })
      } else {
        this.mp3 = JSON.parse(localStorage.getItem('h5_stage_currentArticle'))
        this.mp3_url = this.mp3.content
        this.title = this.mp3.title
        this.imgSrc = this.mp3.img
      }
    }
  }
}
</script>

<style scoped>
.container {
  box-sizing: border-box;
  padding: 0 68px;
}

.imgBox {
  margin-top: 72px;
  position: relative;
}

.circle {
  width: 222px;
  height: 222px;
  margin-left: 20px;
  display: block;
}

.midCircle {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background-color: pink;
  position: absolute;
  left: 36px;
  top: 15px;
}

.smallCircle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #d7f3f2;
  position: absolute;
  top: 75px;
  left: 95px;
}

.audioTitle {
  width: 100%;
  margin-top: 16px;
  font-size: 18px;
  flood-color: #666;
  text-align: center;
}

.progressBox {
  width: 100%;
  height: 3px;
  background-color: #e8e8e8;
  margin-top: 70px;
}

.progress {
  height: 3px;
  background-color: #7cc2c0;
}

.btnBox {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-top: 42px;
  width: 100%;
  height: 65px;
}

.back {
  display: block;
  width: 24px;
  height: 24px;
  margin-top: 20px;
}

.go {
  display: block;
  width: 24px;
  height: 24px;
  margin-top: 20px;
}

.playBox {
  width: 65px;
  height: 65px;
}

.timeBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #bbb;
  margin-top: 8px;
}

.loadingBox {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background-color: #7CC2C0;
}

.loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
</style>
