<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-24 10:51:09
 * @LastEditTime: 2019-11-29 10:26:13
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="phone-list-container">
    <div class="local-list">
      <IndexList>
        <input type="text" placeholder='搜索' class="input" id='search'  @click="focus()" v-model="keyword"/>
        <a v-show="showCancel" @click="cancel" style="color:rgb(106,195,191)">取消</a>
        <IndexSection  v-for="(item, index) in phoneList" :key="index" :index="item.initial">
          <Cell v-for="(phoneItem, index2) in item.cells" :key="index2" :title="phoneItem.area" :label="phoneItem.time" @click.native="callPhone(phoneItem.phone)" />
        </IndexSection>
      </IndexList>
    </div>
  </div>
</template>

<script>
import network from '../network/network.js'
import { IndexList, IndexSection, Cell } from 'mint-ui'

export default {
  mounted () {
    this.$store.commit('example/editTitle', {
      title: '心理危机干预热线'
    })
    this.search()
  },
  watch: {
    keyword (value) {
      this.search()
    }
  },
  data () {
    return {
      showCancel: false,
      keyword: '',
      phoneList: []
    }
  },
  components: {
    IndexList,
    IndexSection,
    Cell
  },
  methods: {
    focus () {
      document.getElementById('search').style.width = '80%'
      this.showCancel = true
    },
    cancel () {
      this.keyword = ''
      document.getElementById('search').style.width = '93%'
      this.showCancel = false
    },
    search () {
      var data = {}
      data.keyword = this.keyword
      network.getPhoneList(data).then(res => {
        const NAMES = res.list
        const ALPHABET = []
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((initial) => {
          const cells = NAMES.filter((name) => name.py.charAt(0).toUpperCase() === initial)
          if (cells.length > 0) {
            ALPHABET.push({
              initial,
              cells
            })
          }
        })
        if (JSON.parse(localStorage.getItem('h5_stage_userinfo')).hospital_id === 27) {
          for (var i = 0; i <= ALPHABET.length - 1; i++) {
            if (ALPHABET[i].initial === 'Q') {
              this.phoneList = [{
                initial: ALPHABET[i].initial,
                cells: [ALPHABET[i].cells[ALPHABET[i].cells.length - 1]]
              }]
            }
          }
        } else {
          this.phoneList = ALPHABET
        }
      })
    },
    callPhone (phone) {
      let data = {
        user_id: JSON.parse(localStorage.getItem('h5_stage_userinfo')).id,
        action: 'line_times'
      }
      // 成功拨打热线，更新用户拨打热线次数
      network.actionCount(data).then(() => {
      }).catch(() => {
      })
      // 拨打电话
      window.location.href = `tel://${phone}`
    }
  }
}
</script>

<style scoped>
.local-list >>> .mint-indexsection-index{
  border-bottom: 1px solid rgba(222, 222, 222);
}
.local-list >>> .mint-cell-wrapper {
  border-bottom: 1px solid rgba(235, 235, 235);
}
.input {
  background: rgba(240, 241, 245, 1);
  border-radius:10px;
  height: 40px;
  font-size: 16px;
  color: #4a4a4a;
  line-height: 40px;
  margin: 10px;
  padding: 5px 10px;
  width: 93%;
  outline: none;
  border: none
}

.local-list{
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px
}
</style>
