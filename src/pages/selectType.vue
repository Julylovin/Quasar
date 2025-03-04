<!--
 * @Author: your name
 * @Date: 2019-10-24 14:03:54
 * @LastEditTime: 2019-11-07 11:45:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \湖南H5\src\pages\selectType.vue
 -->
<template>
  <div>
    <div class="container">
      <div class="question-container">
        <p>请选择量表类型</p>
      </div>
      <div class="answer-container">
        <radioGroup v-if="showList===2"  :options="typeList2" :value="currentAnswerIndex" @radioChange="radioChange"></radioGroup>
        <radioGroup v-if="showList===1" :options="typeList1" :value="currentAnswerIndex" @radioChange="radioChange"></radioGroup>
        <!-- <radioGroup v-else  :options="typeList" :value="currentAnswerIndex" @radioChange="radioChange"></radioGroup> -->
      </div>
      <div class="btn-container">
        <button class="btn-up" @click="onNext">下一步</button>
      </div>
    </div>
  </div>
</template>

<script>
import network from '../network/network.js'
import radioGroup from '../components/radioGroup.vue'

export default {
  created () {
    this.hospital_id = JSON.parse(localStorage.getItem('h5_stage_userinfo')).hospital_id
    if (this.$route.query.showList) {
      this.showList = this.$route.query.showList
    }
    this.$store.commit('example/editTitle', {
      title: '选择量表'
    })
    // localStorage.setItem('openid', this.$route.query.openid)
    // this.JsCode2Openid({
    //   openid: this.$route.query.openid,
    //   is_lan: 1
    // })
  },
  data () {
    return {
      showList: 1,
      hospital_id: Number,
      currentAnswerIndex: -1,
      typeList2: [
        {
          type: 1150,
          query: '妊娠早期:1-13+6周'
        },
        {
          type: 1151,
          query: '妊娠中期:14-27+6周'
        },
        {
          type: 1152,
          query: '妊娠晚期：28周及以后'
        },
        {
          type: 1153,
          query: '分娩后'
        },
        {
          type: 1154,
          query: '孕妇配偶调查问卷'
        },
        {
          type: 1155,
          query: '产妇配偶调查问卷'
        }
      ],
      typeList1: [
        {
          type: 1149,
          query: '心理健康评估'
        },
        {
          type: 90,
          query: '孕早期（<=13周）',
          name: '孕早期普筛'
        },
        {
          type: 91,
          query: '孕中期（13周~27周）',
          name: '孕中期普筛'
        },
        {
          type: 92,
          query: '孕晚期（28周及以后）',
          name: '孕晚期普筛'
        },
        {
          type: 637,
          query: '产后2-3天',
          name: ''
        },
        {
          type: 638,
          query: '产后42天',
          name: ''
        },
        {
          type: 639,
          query: '产后3个月',
          name: ''
        },
        {
          type: 640,
          query: '产后6个月',
          name: ''
        },
        {
          type: 641,
          query: '产后1年',
          name: ''
        },
        {
          type: 94,
          query: '产后普筛',
          name: '产后普筛'
        },
        {
          type: 115,
          query: '备孕期普筛'
        },
        {
          type: 114,
          query: '更年期普筛'
        },
        {
          type: 116,
          query: '普通人群普筛'
        },
        {
          type: 61,
          query: '情感气质自评'
        }
      ],
      typeList: [
        {
          type: 90,
          query: '孕早期'
        },
        {
          type: 91,
          query: '孕中期'
        },
        {
          type: 92,
          query: '孕晚期'
        },
        {
          type: 94,
          query: '产后'
        }
      ]
    }
  },
  components: {
    radioGroup
  },
  methods: {
    radioChange (val) {
      this.currentAnswerIndex = val
    },
    onNext () {
      if (this.currentAnswerIndex === -1) {
        this.$q.notify({
          message: '请选择量表类型',
          type: 'warning',
          position: 'top',
          timeout: 1000
        })
      } else if (!localStorage.getItem('h5_stage_userinfo')) {
        this.$q.notify({
          message: '用户信息不存在',
          type: 'warning',
          position: 'top',
          timeout: 1000
        })
      } else {
        if (+this.showList === 2) {
          this.onSubmit(this.typeList2[this.currentAnswerIndex].type)
        } else if (+this.showList === 1) {
          this.onSubmit(this.typeList1[this.currentAnswerIndex].type)
          localStorage.setItem('h5_stage_textName', this.typeList1[this.currentAnswerIndex].name)
        } else {
          this.onSubmit(this.typeList[this.currentAnswerIndex].type)
        }
      }
    },
    selectGroup (typeID) {
      const data = {
        user_id: JSON.parse(localStorage.getItem('h5_stage_userinfo')).id,
        role_id: typeID,
        department_id: this.$route.query.department_id || '92'
      }
      network.selectGroup(data).then(res => {
        this.$router.push({
          name: 'index',
          query: {
            department_id: this.$route.query.department_id || '92',
            sign: this.$route.query.sign,
            openid: this.$route.query.openid
          }
        })
      })
    },
    onSubmit (type) {
      if (!localStorage.getItem('h5_stage_userinfo')) {
        this.$q.notify({
          message: '用户信息不存在',
          type: 'warning',
          position: 'top',
          timeout: 1000
        })
      } else {
        this.selectGroup(type)
      }
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

.question-container {
  width: 320px;
  background: #FFFFFF;
  border-radius: 8px 8px 0 0;
  margin: 20px auto;
  position: relative;
}

.question-container p {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: rgba(74, 74, 74, 1);
  line-height: 25px;
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
  outline: none;
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
</style>
