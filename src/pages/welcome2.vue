<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-15 16:07:09
 * @LastEditTime: 2019-11-19 14:52:37
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="login-bg">
    <div class="bran">
      <img src="statics/images/logo.png" alt="" class="logo">
    </div>
    <div class="blank-container">
      <div class="input-wrapper">
        <img src="statics/images/user.png" alt="" class="input-icon">
        <input type="text" class="input no-border" v-model="userName" placeholder-style="color: #dadce1" placeholder="孕产妇姓名" />
      </div>
      <div class="input-wrapper">
        <img src="statics/images/phone.png" alt="" class="input-icon">
        <input type="number" class="input no-border" v-model="phone" placeholder-style="color: #dadce1" placeholder="孕产妇联系方式" />
      </div>
      <div class="input-wrapper">
        <img src="statics/images/phone.png" alt="" class="input-icon">
         <input
          class="number"
          type="number"
          v-model="code"
          maxlength="6"
          placeholder="请输入6位验证码"
        />
        <div class="sendBox">
          <div class="code" v-show="showSend<1" @click="sendSmsCode">获取验证码</div>
          <div class="codeNumber" v-show="showSend>0">{{showSend}}s</div>
        </div>
       </div>
      <div class="input-wrapper">
        <img src="statics/images/user_hoscard.png" alt="" class="input-icon">
        <input type="text" class="input no-border" v-model="user_hoscard" placeholder-style="color: #dadce1" placeholder="孕产妇身份证号" />
      </div>
      <div class="label">
        <div style="width:40px;height:40px;position:absolute;left:40px;" @click="isChecked=!isChecked"></div>
        <img @click="isChecked=!isChecked" v-if="isChecked" src="statics/images/checkbox.png" class="checkboxSelected">
        <img @click="isChecked=!isChecked" v-else src="statics/images/checkbox1.png" class="checkboxSelected">
        <span >请阅读并同意《<span class="underline" @click="readTerms">心身管理隐私条件</span>》</span>
      </div>
      <button class="btn-red" @click="switchToTab">登录</button>
    </div>
  </div>
</template>

<script>
import network from '../network/network.js'
export default {
  created () {
    localStorage.setItem('h5_stage_hospital_id', 100)
    if (localStorage.getItem('h5_stage_agree')) {
      this.isChecked = true
      localStorage.removeItem('h5_stage_agree')
    }
  },
  mounted () {
    this.$store.commit('example/editTitle', {
      title: '登陆'
    })
    if (sessionStorage.getItem('userName') || sessionStorage.getItem('phone')) {
      this.userName = sessionStorage.getItem('userName')
      this.phone = sessionStorage.getItem('phone')
      this.user_hoscard = sessionStorage.getItem('user_hoscard')
    }
  },
  data () {
    return {
      user_hoscard: '',
      userName: '',
      phone: '',
      showSend: 0,
      code: '',
      avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKWCGHKVHS0rm8tPNuhA1ibmEUKtzXhSWfbZ0qQfnkDXwKH4iaS7RwbicoPnRtXHqptqNiceRW8WiaWc6A/132',
      isChecked: false
    }
  },
  methods: {
    sendSmsCode () {
      network.sendSmsCode({ phone: this.phone }).then(res => {
        if (res.ret === 0) {
          this.$q.notify({
            message: res.message + '',
            type: 'warning',
            position: 'top',
            timeout: 3000
          })
        } else {
          this.showSend = 60
          var time = setInterval(() => {
            this.showSend--
            if (this.showSend < 1) {
              clearInterval(time)
            }
          }, 1000)
        }
      })
    },
    switchToTab () {
      if (!preventWatering('register', 2)) {
        return false
      }
      var _this = this
      if (_this.userName === '' || _this.userName[0].match(/\s+/g)) {
        this.$q.notify({
          message: '请输入正确的姓名格式',
          type: 'warning',
          position: 'top',
          timeout: 3000
        })
        return null
      } else if (_this.phone === '') {
        this.$q.notify({
          message: '请输入手机号',
          type: 'warning',
          position: 'top',
          timeout: 3000
        })
        return null
      } else if (!(/^[1]([3-9])[0-9]{9}$/.test(_this.phone))) {
        this.$q.notify({
          message: '请输入正确的手机号',
          type: 'warning',
          position: 'top',
          timeout: 3000
        })
        return null
      } else if (!_this.code) {
        this.$q.notify({
          message: '请输入验证码',
          type: 'warning',
          position: 'top',
          timeout: 3000
        })
        return null
      } else if (!_this.isChecked) {
        this.$q.notify({
          message: '请选择知情同意',
          type: 'warning',
          position: 'top',
          timeout: 3000
        })
        return null
      } else {
        let data = {
          phone: _this.phone,
          user_hoscard: _this.user_hoscard,
          name: _this.userName,
          code: _this.code,
          avatar_url: _this.avatarUrl,
          openid: _this.user_hoscard,
          department_id: this.$route.query.department_id || '92',
          is_lan: +localStorage.getItem('h5_stage_is_lan') || 0,
          sign: this.$route.query.sign || '0'
        }
        network.register(data).then(res => {
          localStorage.setItem('h5_stage_loginToken', res.token)
          // localStorage.setItem('h5_stage_auth_id', res.auth.id)
          localStorage.setItem('h5_stage_user_id', res.user.id)
          localStorage.setItem('h5_stage_userinfo', JSON.stringify(res.user))
          _this.$router.push({
            name: 'selectType',
            query: {
              showList: 2,
              sign: this.$route.query.sign,
              department_id: this.$route.query.department_id || '92',
              openid: res.user.openid
            }
          })
        }).catch((err) => {
          this.$q.notify({
            message: err.message,
            type: 'negative',
            timeout: 3000
          })
        })
      }
    },
    readTerms () {
      sessionStorage.setItem('userName', this.userName)
      sessionStorage.setItem('phone', this.phone)
      sessionStorage.setItem('user_hoscard', this.user_hoscard)
      this.$router.push({
        name: 'agreement'
      })
    }
  }
}

/**
 * 当前时间戳
 * @returns {number}
 */
function localTime () {
  // 获得服务器时间
  return Date.parse(new Date()) / 1000
}

/**
 * 防灌水
 * @param type  屏蔽类型
 * @param time  间隔秒数
 */
function preventWatering (type, second) {
  var time = localStorage.getItem('h5_stage_' + type)
  if (time && time >= localTime() - second) {
    return false
  } else {
    localStorage.setItem('h5_stage_' + type, localTime())
    return true
  }
}
</script>

<style scoped>
  .bg-reg{
    width: 80%;
    margin: 20% auto;
  }
  .reg-button{
    width:250px;
    display: block;
    padding: 10px;
    outline: none;
    border-radius: 5px;
    color: #ffffff;
    border: none;
    margin: 0 auto;
    font-size: 18px;
    background: #6ac4bf;
  }
  .text-last {
    color: #686868;
    font-size: 12px
  }
  .foot-word{
    position:absolute;
    bottom:12px;
    width: 100%;
    text-align: center;
  }
  .login-bg{
    background: #ffffff;
    min-height: 100vh;
  }

  img {
    display: block;
  }

  .bran {
    text-align: center;
  }

  .bran .logo {
    height: 200px;
    width: 100%;
  }

  .input-wrapper{
    display: flex;
    align-items: center;
    border: 1px solid #F0F1F5;
    position: relative;
    margin-bottom: 16px;
    border-radius: 25px;
    padding: 5px 16px
  }
  .inputtitle{
    width: 80px;
    font-size: 12px;
  }
  .number {
  position: relative;
  z-index: 4;
  outline: none;
  border: none;
}

.sendBox{
  width: 90px;
  position: absolute;
  font-size: 16px;
  right: 14px;
  z-index: 5;
  text-align: right;
  top: 5px;
}
.code {
  font-size: 16px;
  color: #017FFF;
}
.codeNumber{
  font-size: 16px;
  color: #999999;
}
  .input-icon{
    width: 22px;
    height: 22px;
    margin-right: 16px
  }

  .blank-container {
    background: #ffffff;
    width: 335px;
    height: 345px;
    border-radius: 8px;
    margin: 30px auto;
  }

  .input {
    width: 300px;
    height: 40px;
    color: #000;
    outline: none
  }

  .picker {
    line-height: 43px;
    color: #dadce1;
    width: 260px
  }

  .btn-red {
    width: 335px;
    height: 44px;
    background: #6ac4bf;
    border-radius: 25px;
    color: #ffffff;
    font-size: 16px;
    line-height: 43px;
    border: none;
    outline: none
  }

  .label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #9B9B9B;
    text-align: center;
    margin: 20px auto;
  }
  .checkboxSelected {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .underline {
    text-decoration: underline;
  }
</style>
