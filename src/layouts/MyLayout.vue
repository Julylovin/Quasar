<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 13:57:47
 * @LastEditTime: 2019-11-05 17:00:18
 * @LastEditors: Please set LastEditors
 -->
<template>
  <q-layout>
    <q-layout-header>
      <navigation></navigation>
    </q-layout-header>
    <q-page-container>
      <router-view/>
    </q-page-container>
    <!-- 添加H5的tabs -->
    <div v-if="isShowTabs" class="footer-wrapper" style="padding-top:60px;">
      <q-layout-footer >
        <div class="tabbar">
          <div v-for="(item, index) in tabList" :key="index" class="tab-item" @click="tabLink(index)"
            :class="isActive == index? 'activeClass':''">
            <div style="width:100%;display:flex;justify-content:center;" class="tab-iconImg">
              <img :src="item.icon" alt="">
            </div>
            <p class="item-wrap">{{item.label}}</p>
          </div>
        </div>
        <!-- <q-tabs color="white" text-color="secondary">
          <q-tab @click="tabLink(index)" slot="title" :icon="item.icon" replace :label="item.label" v-for="(item, index) in tabList" :key="index"/>
        </q-tabs> -->
      </q-layout-footer>
    </div>
  </q-layout>
</template>

<script>
import Navigation from '../components/navigation.vue'

export default {
  name: 'MyLayout',
  data () {
    return {
      isShowTabs: true,
      isActive: -1,
      isShowNavigation: true,
      tabList: [
        {
          icon: 'statics/images/home-Icon.png',
          label: '首页'
        },
        // {
        //   icon: 'statics/images/class-Icon.png',
        //   label: '课程'
        // },
        {
          icon: 'statics/images/my-Icon.png',
          label: '我的'
        }
        // {
        //   icon: 'home',
        //   label: '首页'
        // },
        // {
        //   icon: 'reorder',
        //   label: '课程'
        // },
        // {
        //   icon: 'perm_identity',
        //   label: '我的'
        // }
      ]
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler: function (newVlaue, oldValue) {
        if (newVlaue.name === 'index' || newVlaue.name === 'discover' || newVlaue.name === 'userIndex') {
          this.isShowTabs = true
          this.isActive = newVlaue.name === 'discover' ? 1 : newVlaue.name === 'index' ? 0 : 2
        } else {
          this.isShowTabs = false
        }
      }
    }
  },
  components: {
    Navigation
  },
  methods: {
    tabLink (index) {
      this.isActive = index
      const _this = this
      switch (index) {
        case 0:
          _this.$router.push({
            name: 'index',
            query: {
              openid: localStorage.getItem('h5_stage_openid')
            }
          })
          break
        // case 1:
        //   _this.$router.push({
        //     name: 'discover',
        //     query: {
        //       first: 'true'
        //     }
        //   })
        //   break
        default:
          _this.$router.push({
            name: 'userIndex'
          })
      }
    }
  }
}
</script>

<style scoped>
.footer-wrapper >>> .q-layout-footer.absolute-bottom{
  position: fixed
}
.tabbar{
  color:#26a69a ;
  width:100%;
  height: 64px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  background: #ffffff;
  bottom: 0px;
  left: 0px;
}
.activeClass{
  background:rgba(0,0,0,.2);
  border-bottom:1px solid #26a69a;
  transition: all .3s ease;
}
.tab-item{
  width:33%;
  font-size:14px;
  height:100%;
  padding: 10px 12px;
  position:relative;
  box-sizing: border-box;
}
.item-wrap{
  width:100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 3px;
}
.tab-iconImg img{
  width:25px;
  height:25px;
  margin-bottom: 5px;
}
.tabbar .tab-item:nth-last-of-type(1) img{
  width: 22px;
}
</style>
