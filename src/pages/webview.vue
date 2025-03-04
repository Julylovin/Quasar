<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-15 16:07:09
 * @LastEditTime: 2019-10-24 09:38:19
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div v-if="start_time !== String" class="lesson" v-html="url"></div>
  <!-- <iframe v-else frameborder="no" border="0" marginwidth="0" marginheight="0" class="webview" :src="url"></iframe> -->
</template>

<script>
import network from '../network/network.js'

export default {
  created: function () {
    this.$store.commit('example/editTitle', {
      title: JSON.parse(localStorage.getItem('h5_stage_currentArticle')).title
    })
    network.getArticleDetails({
      id: JSON.parse(localStorage.getItem('h5_stage_currentArticle')).id
    }).then(res => {
      this.url = res.content
    }).catch((err) => {
      this.$q.notify({
        message: err.message,
        type: 'negative',
        position: 'top',
        timeout: 3000
      })
      this.$router.push({
        name: 'discover'
      })
    })
    this.start_time = this.$route.query.start_time
  },
  beforeRouteLeave (to, from, next) {
    const data = {}
    const currentArticle = JSON.parse(localStorage.getItem('h5_stage_currentArticle'))
    data.user_id = JSON.parse(localStorage.getItem('h5_stage_userinfo')).id
    data.duration = Math.ceil((Number(new Date()) - this.start_time) / 60000)
    data.articleId = currentArticle.id
    data.title = currentArticle.title
    data.link = currentArticle.link
    data.img = currentArticle.img
    data.category_id = currentArticle.category_id
    network.recordArticle(data).then(res => {
      localStorage.removeItem('h5_stage_currentArticle')
      next()
    })
  },
  data: function () {
    return {
      url: String,
      start_time: String
    }
  }
}
</script>

<style scoped>
.webview{
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden
}
.lesson >>> img{
  height: auto !important;
}
</style>
