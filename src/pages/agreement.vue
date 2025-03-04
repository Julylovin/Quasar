<!--
 * @Author: your name
 * @Date: 2019-10-24 09:23:54
 * @LastEditTime: 2019-10-24 09:37:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \上海量表H5\src\pages\agreement.vue
 -->
<template>
  <div class="login-bg">
    <p class="center">心身健康管理知情同意条款</p><br>
    <p style="text-indent: 2em">在使用心身健康管理产品服务前，请仔细阅读并了解个人隐私权与服务内容等相关政策。</p><br>
    <p style="text-indent: 2em">心身健康管理系统中采用的评估量表是来自国内外精神科广泛使用的自评量表工具，综合国内各学科专家临床经验，编写评语与指导建议。量表评估结果与症状程度仅能提供辅助临床诊断参考，不能取代医生的最终判断。由于通过线上自评，我们无法确保您填写答案的真实性，评估的结果不能代表真实的结果。如您对评估结果或评语建议有任何疑虑，建议找专业医务人员进行全面评估与检查。</p><br>
    <p style="text-indent: 2em">有关您的个人信息与隐私资料将得到完善保护与保密，防止数据遭到未经授权访问、公开披露、使用、修改或损坏。我们出于提供线上量表测评、个人化分级评估报告、干预课程、线上咨询、干预热线等服务，追踪了解您各时期的心理评估状态，将收集和使用您填写的信息,平均填写时间预计在20分钟以内。其中揭露的个人资料均属保密，供数据分析与产出结果报告使用。</p><br>
    <p style="text-indent: 2em">我们保留对本隐私权政策内容及服务内容进行调整或变更，任何更新将以标注更新时间的方式公布，经调整或变更的内容一经通知或公布后生效。如您在调整或变更后继续使用提供的任一服务，我们相信这代表您已充分阅读、理解并接受修改后的隐私权政策并受其约束。</p>
    <button class="btn-red" @click="toWelcome">我已阅读并同意条款</button>
  </div>
</template>

<script>
export default {
  methods: {
    toWelcome () {
      localStorage.setItem('h5_stage_agree', 1)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.btn-red {
  width: 100%;
  height: 44px;
  background: #6ac4bf;
  /* border-radius: 25px; */
  color: #ffffff;
  font-size: 16px;
  margin-top: 24px;
  margin-bottom: 24px;
  line-height: 43px;
  border: none;
}
.login-bg {
  background-color: #fff;
  margin: 20px;
  font: 13px/20px normal Helvetica, Arial, sans-serif;
  color: #4F5155;
}

p {
  font-size: 16px
}

.center {
  text-align: center;
}
</style>
