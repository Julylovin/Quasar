<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-24 10:47:10
 * @LastEditTime: 2019-11-22 10:59:28
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="discover-container">
    <a class="curse-cell-div align-justify" v-for="(item,index) in courseList" :key="index" @click="toCourseDetails (item, index)">
      <div class="lesson-right-wrapper">
        <img :src="item.img" alt="" class="lesson-right-img">
        <div class="curse-cell-intro">
          <p class="curse-cell-title">{{item.title}}</p>
          <p class="curse-name">学习时间：{{item.create_time}}</p>
          <p class="curse-cell-info">学习时长：{{item.duration}}分钟</p>
        </div>
      </div>
      <div class="goStudy">
        继续学习>
      </div>
    </a>
  </div>
</template>

<script>
import network from '../../network/network.js'

export default {
  mounted () {
    network.historyCourse(JSON.parse(localStorage.getItem('h5_stage_userinfo')).id).then(res => {
      this.courseList = res.map(val => {
        val.create_time = val.create_time.split(' ')[0]
        return val
      })
    }).catch(() => {
      this.$q.notify({
        message: '暂无历史课程',
        type: 'negative',
        position: 'top',
        timeout: 3000
      })
    })
  },
  data () {
    return {
      courseList: []
    }
  },
  methods: {
    toCourseDetails (item, index) {
      localStorage.setItem('h5_stage_tabTitle', item.category_name)
      item.id = item.article_id
      item.content = item.is_mp3 === 1 ? item.mp3_url : ''
      localStorage.setItem('h5_stage_currentArticle', JSON.stringify(item))
      if (item.category_id >= 31) {
        const startTime = Number(new Date())
        this.$router.push({
          name: 'audio',
          query: {
            start_time: startTime,
            typeIndex: index,
            routecome: 'lesson'
          }
        })
      } else {
        const startTime = Number(new Date())
        this.$router.push({
          name: 'webview',
          query: {
            start_time: startTime,
            routecome: 'lesson'
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.discover-container{
  min-height: 100vh;
  padding-top: 16px;
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
  width: 94px;
  height: 62px;
  border-radius: 5px;
  margin-right: 16px
}

.curse-cell-intro {
  width: 150px;
}

.curse-cell-title {
  font-size: 16px;
  line-height: 20px;
  color: #000000;
}

.curse-name {
  color: #999999;
  font-size: 12px;
  margin-top: 5px
}

.curse-cell-info {
  font-size: 12px;
  color: #999999;
  margin-top: 5px
}
.align-justify{
  display:flex;
  justify-content: space-between;
}
.goStudy{
  font-size: 14px;
  color: #6ac3bf
}
</style>
