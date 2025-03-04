<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-15 16:07:09
 * @LastEditTime: 2019-11-19 14:42:00
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    window.offline = false
    window.addEventListener('offline', res => {
      window.offline = true
    })
    window.addEventListener('online', res => {
      window.offline = false
      this.$q.loading.hide()
    })
  }
}
</script>

<style>
body {
  background: #ffffff;
}
p {
  margin: 0
}
</style>
