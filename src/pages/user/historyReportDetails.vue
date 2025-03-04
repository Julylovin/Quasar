<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 13:57:47
 * @LastEditTime: 2019-11-29 10:26:23
 * @LastEditors: Please set LastEditors
 -->
 <template>
  <div class="echarts-wrap" >
    <!-- 小程序原生组件实现的tabs组件 -->
    <Tabs :class="showTab?'':'noTab'" color="rgb(106,195,191)" v-model='current' @click="tabsChange" animated :ellipsis='false' sticky class="vant-defineByself">
      <!-- 用tab内的内容做循环，最后一个循环是总的几张折线图 -->
      <Tab v-for="(item, index) in tabsContent" :name='index'  :key="index+'tabs'" :title="item.role_name">
        <!-- 甲乳外科或长度小于1则最后一个tab统计图不展示 -->
        <div v-if="item.group_id === 41 || tabsContent.length < 2 || index < tabsContent.length-1" class="tabs-slot" style="background-color: #f3f3f3;">
          <div>
            <div class="base-details underline">
              <div class="base-details-title">量表情况</div>
              <span class="base-details-right">完成日期:&nbsp;{{item.create_time}}</span>
            </div>
            <!-- <div class="base-details base-details-last">
              <span>基本信息量表</span>
              <span class="base-details-right">填写完整</span>
            </div> -->
          </div>
          <div>
            <div v-for="(value, index2) in item.common_type_replays_info" @click="value.questionnaire_group_id!=41?toReportTypeDetails(value):''" :key="index2 + 'tabs_common_type_replays_info'" class="report-details underline">
              <div class="report-details-title">
                <span>{{value.alias_title}}</span>
                <div v-if="value.questionnaire_group_id!=41 &&showDetail" class="align-justify">
                  <span class="goStudy">查看详情</span>
                  <img class="report-details-img" :src="is_theme_color?'statics/images/arrow_right_l2.png': 'statics/images/arrow_right_l.png'" alt="">
                </div>
              </div>
              <p :class="value.questionnaire_group_id!=41?'report-details-score align-start': 'report-details-score'">
                <span>得分: {{value.score}}分</span>
                <span class="report-details-level">{{value.state_name}}</span>
                <!-- <span>参考分：{{value.total_score}}分</span> -->
              </p>
              <div class="total-progress">
                <div :style="{width: value.progress+'%'}" class="current-progess"></div>
              </div>
            </div>
          </div>
          <!-- scl90折叠面板 -->
          <div class="scl-collapse underline" v-for="(item1, index1) in item.scl_type_replays_info" :key="index1 +'tabs_scl_type_replays_info'">
            <Collapse v-model="activeSCLName" accordion @change="changeactiveSCLName">
              <collapse-item :name="index1" :title="item1.alias_title" :value="selectValueText !== index1? '点击展开':'点击收起'">
                <div class="scl-report-details" v-for="(value, sclIndex) in item1.tags" @click="toReportTypeDetails(item1, sclIndex)" :key="sclIndex+'tabs_tag'">
                  <div class="report-details-title report-details-title-small">
                    <span>{{value.tag}}</span>
                    <div v-if="showDetail" class="align-justify">
                      <span class="goStudy">查看详情</span>
                      <img class="report-details-img" :src="is_theme_color?'statics/images/arrow_right_l2.png': 'statics/images/arrow_right_l.png'" alt="">
                    </div>
                  </div>
                  <p class="report-details-score align-start mt4">
                    <span>得分：{{value.score}}分</span>
                    <span class="report-details-level">{{value.state}}</span>
                    <!-- <span>参考分：{{value.all_score}}分</span> -->
                  </p>
                  <div class="total-progress">
                    <div :style="{width: value.progress+'%'}" class="current-progess"></div>
                  </div>
                </div>
              </collapse-item>
            </Collapse>
          </div>
          <!-- 专家建议 -->
          <div class="advice-collapse">
            <div v-if="item.current_state">
              <div class="base-details  underline" >
                <div class="base-details-title">当前状况</div>
              </div>
              <ul class="report-details advice-ul">
                <li class="advice-p" v-for="(piece, pieceIndex) in item.current_state" :key="pieceIndex+'current_state'">{{ piece }}</li>
              </ul>
            </div>
            <div v-if="item.advise">
              <div class="base-details underline" >
                <div class="base-details-title">专家建议</div>
              </div>
              <ul class="report-details advice-ul">
                <li class="advice-p" v-for="(piece, pieceIndex) in item.advise" :key="pieceIndex+'advise'">{{ piece }}</li>
              </ul>
            </div>
            <!-- <Collapse v-model="activeAdviceName" accordion @change="changeActiveAdviceName">
              <collapse-item name="1" title="专家建议" :value="selectValueTextAdvice" class="adviceName">
                <div class="folded-contents"> -->
                  <!--如果当前状况不是空就显示 -->
                  <!-- <div v-if="item.current_state[0] !== ''">
                    <p class="current">当前状况</p>
                    <ul class="report-details advice-ul">
                      <li class="advice-p" v-for="(piece, pieceIndex) in item.current_state" :key="pieceIndex">{{ piece }}</li>
                    </ul>
                  </div> -->
                  <!-- 专家建议 -->
                  <!-- <p class="current" v-if="item.current_state[0] !== ''">专家建议</p>
                  <ul class="report-details advice-ul">
                    <li class="advice-p" v-for="(piece, pieceIndex) in item.advise" :key="pieceIndex">{{ piece }}</li>
                  </ul>
                </div>
              </collapse-item>
            </Collapse> -->
          </div>
        </div>
        <!-- 最后一个tab的显示格式 -->
        <div v-else style="background-color: #f3f3f3;">
          <div v-for="(brokenLineItem, brokenLineIndex) in lineChartsData" :key="brokenLineIndex+'lineCharts'" class="charts-wrapper borken-line-charts-wrapper">
            <p class="line-charts-title">{{brokenLineItem.alias_title}}</p>
            <ve-line height="300px" :data="brokenLineItem.chartData"  ></ve-line>
          </div>
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import network from '../../network/network.js'
import commen from '../../network/commen.js'
import { Tabs, Tab, Collapse, CollapseItem } from 'vant'

export default {
  created () {
    this.is_theme_color = +localStorage.getItem('h5_stage_is_theme_color')
    this.$q.loading.show({
      message: '加载中...'
    })
    // console.log()
    if (this.$route.query.openid) {
      commen.init(this)
    } else {
      this.getReport()
    }
  },
  components: {
    Tabs,
    Tab,
    Collapse,
    CollapseItem
  },
  data () {
    return {
      is_theme_color: 0,
      radarSetting: {
        radius: '80%',
        indicator: [
        ],
        name: {
          formatter: function (text) {
            var strlength = text.length
            if (strlength % 2 === 1) {
              text = text.replace(/\S{2}/g, function (match) {
                return match + '\n'
              })
            } else {
              text = text.replace(/\S{2}/g, function (match) {
                return match + '\n'
              })
              strlength = text.length
              text = text.substring(0, strlength - 1)
            }
            return text
          },
          textStyle: {
            padding: [0, 0]
          }
        }
      },
      showDetail: true,
      radarSeries: [{
        type: 'radar',
        legend: {
          data: ['得分']
        },
        name: [],
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            var temp = params.name + '<br/>'
            params.seriesName.split(',').forEach((item, index) => {
              if (!item) {
                return temp
              } else {
                temp = temp + item + ':' + params.value[index] + '<br/>'
              }
            })
            return temp
          }
        },
        data: [
        ]
      }],
      showTab: true,
      current: 0,
      showRadar: true,
      selectValueText: -1,
      activeSCLName: -1,
      tabsContent: [],
      unMaternalContent: {},
      lineChartsData: []
    }
  },
  methods: {
    getReport () {
      network.getReport(JSON.parse(localStorage.getItem('h5_stage_userinfo')).id, this.$route.params.id, this.$route.params.type, JSON.parse(localStorage.getItem('h5_stage_userinfo')).openid).then(res => {
        if (res.length < 2) {
          this.showTab = false
        }
        res = Object.values(res)
        // 韦氏量表
        if (res[0].role_id === 633 || res[0].role_id === 634) {
          this.showDetail = false
          this.showRadar = false
          // var tempRes = []
          // tempRes.create_time = res[0].create_time
          // tempRes.replays_info = []
          // tempRes.replays_info.push(res[0][1])
          res[0].replays_info[1].is_score = 0
          res[0].replays_info[2] = {
            alias_title: '韦氏量表（言语类）',
            type: 1,
            is_score: 1,
            tags: []
          }
          res[0].replays_info[1].list[0].forEach((item, index) => {
            res[0].replays_info[2].tags[index] = {
              all_score: item.max_score,
              score: item.score,
              tag: item.title,
              state: ''
            }
          })
          res[0].replays_info[3] = {
            alias_title: '韦氏量表（操作类）',
            type: 1,
            is_score: 1,
            tags: []
          }
          res[0].replays_info[1].list[1].forEach((item, index) => {
            res[0].replays_info[3].tags[index] = {
              all_score: item.max_score,
              score: item.score,
              tag: item.title,
              state: ''
            }
          })
          res[0].replays_info[4] = {
            alias_title: '韦氏量表',
            type: 1,
            is_score: 1,
            tags: []
          }
          res[0].replays_info[1].score_list.forEach((item, index) => {
            res[0].replays_info[4].tags[index] = {
              score: item.standard_score,
              tag: item.name,
              state: item.state
            }
          })
        }
        res = res.map((val, index) => {
          let item = {}
          item.title = val.role_name
          item.sub = index
          if (val.create_time) {
            val.create_time = val.create_time.split(' ')[0]
          }
          // 常用量表 儿童量表 青少年量表 展示程度最重的专家建议展示
          if (+this.$route.params.type === 11 || +this.$route.params.type === 14 || +this.$route.params.type === 31) {
            var maxLevel = {
              state_level: -100
            }
            val.replays_info.forEach(item => {
              // 没tags的把症状程度最大的赋值给max_level,有tags的遍历tags还把症状程度最大的赋值给max_level
              if (!item.tags) {
                if (item.state_level > maxLevel.state_level && item.advise) {
                  maxLevel = item
                }
              } else {
                item.tags.forEach(item1 => {
                  if (item.state_level > maxLevel.state_level && item.advise) {
                    maxLevel = item.state_level
                  }
                })
              }
            })
            if (maxLevel.current_state) {
              val.current_state = maxLevel.current_state
            }
            if (maxLevel.advise) {
              val.advise = maxLevel.advise
            }
          }
          if (val.advise) {
            val.advise = val.advise.split('\n\n')
          }
          if (val.current_state) {
            val.current_state = val.current_state.split('\n\n')
          }
          // 新增进度条比例字段以及图表配置字段
          val.replays_info = this.createProgress(val.replays_info)
          // 将问卷结果提出并分类
          val.common_type_replays_info = val.replays_info.filter(item => item.type === 0)
          val.scl_type_replays_info = val.replays_info.filter(item => item.type !== 0)
          return val
        })
        res.map(item => {
          item.role_name = commen.cutBracketsContent(item.role_name)
        })
        this.tabsContent = res
        // 遍历将多因子项所有tag的名称分数统计出来存起来方便雷达图调用
        this.tabsContent.forEach((item, index) => {
          item.scl_type_replays_info.forEach((item1, index1) => {
            item1.indicator = []
            item1.radarData = [{
              name: '得分',
              value: []
            }]
            item1.tags.forEach((item2, index2) => {
              item1.indicator.push({
                name: item2.tag,
                max: 5
              })
              item1.radarData[0].value.push((item2.score / item2.all_score * 5).toFixed(2))
            })
            // 当因子项小于7时以正六边形展示雷达图不存在的内容push空标题和0值
            if (item1.tags.length < 7) {
              for (let i = 6; i > item1.indicator.length;) {
                item1.indicator.push({
                  name: '',
                  max: 5
                })
                item1.radarData[0].value.push(0)
              }
            }
          })
        })
        // 默认展示最新授权的tab
        if (res.length) {
          this.current = res.length - 1
        }
        // 甲乳外科加入tabs但是不展示统计图
        if (+this.$route.params.type !== 41 && this.showTab) {
          // 获取统计折线图数据
          network.getLineCharts(JSON.parse(localStorage.getItem('h5_stage_userinfo')).id, +this.$route.params.type, JSON.parse(localStorage.getItem('h5_stage_userinfo')).openid).then(res => {
            this.tabsContent.push({
              role_name: '统计'
            })
            this.lineChartsData = res.map(item => {
              item.chartData = {}
              item.chartData.columns = ['时期', '分数']
              item.chartData.rows = []
              item.data.forEach(value => {
                let chartDataObj = {}
                chartDataObj['时期'] = value.role_name
                chartDataObj['分数'] = value.score
                item.chartData.rows.push(chartDataObj)
              })
              return item
            })
          })
        }
        this.$q.loading.hide()
      }).catch(err => {
        this.$q.notify({
          message: err + '',
          type: 'negative',
          position: 'top',
          timeout: 30000
        })
        this.$q.loading.hide()
      })
    },
    tabsChange () {
      this.activeSCLName = -1
    },
    changeactiveSCLName (e) {
      this.selectValueText = e
      if (e || e === 0) {
        this.radarSetting.indicator = this.tabsContent[this.current].scl_type_replays_info[e].indicator
        this.radarSeries[0].data = this.tabsContent[this.current].scl_type_replays_info[e].radarData
        this.radarSeries[0].name = []
        this.radarSetting.indicator.forEach(item => {
          this.radarSeries[0].name.push(item.name)
        })
      }
    },
    changeactiveSCLName1 (e) {
      this.selectValueText = e
      if (e || e === 0) {
        if (+this.unMaternalContent.scl_type_replays_info[e].questionnaire_id === 86) {
          this.showRadar = false
          return
        } else {
          this.showRadar = true
        }
        this.radarSetting.indicator = this.unMaternalContent.scl_type_replays_info[e].indicator
        this.radarSeries[0].data = this.unMaternalContent.scl_type_replays_info[e].radarData
        this.radarSeries[0].name = []
        this.radarSetting.indicator.forEach(item => {
          this.radarSeries[0].name.push(item.name)
        })
      }
    },
    toReportTypeDetails (value, sclIndex = -1) {
      this.$router.push({
        name: 'historyReportTypeDetails',
        params: {
          id: value.id,
          sclIndex
        }
      })
    },
    createProgress (value) {
      value.map(item => {
        if (+item.type > 0 && +item.is_score !== 0 && !item.tags) {
          item.type = 0
        }
      })
      // is_score = 0 是基础信息问卷不展示，item.type === 0 是普通量表 >0 是多因子项的量表
      // temp1先遍历取出普通量表 temp2取出多因子项量表，temp1 、temp2合并普通量表在前，多因子项在后，基础信息量表不展示
      var temp1 = value.filter(item => {
        if (+item.type === 0 && +item.is_score !== 0) {
          item.progress = Math.ceil((item.score / item.total_score) * 100)
          return item
        }
      })
      var temp2 = value.filter(item => {
        if (+item.type > 0 && +item.is_score !== 0) {
          item.tags.map(val => {
            val.progress = Math.ceil((val.score / val.all_score) * 100)
            return val
          })
          return item
        }
      })
      temp1.push.apply(temp1, temp2)
      return temp1
    }
  }
}
</script>

<style scoped>
.echarts-wrap {
  width: 100%;
  background: #f3f3f3
}
.base-details{
  background: #ffffff;
  padding: 16px;
  margin-top:4px;
  /* padding: 16px 0 10px;
  margin:4px  16px 0 16px; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  /* border-bottom: 1px solid rgba(0,0,0,.2); */
}
.base-details-last{
  margin-top: 0
}
.base-details-right{
  color: rgba(0,0,0,.8);
}
.total-progress{
  margin-top: 4px;
  background:#e8e8e8;
  width: 287px;
  height: 5px;
}
.current-progess{
  background:#6ac2bf;
  height:5px;
}
.report-details{
  background: #ffffff;
  padding: 16px;
  /* border-bottom: 1px solid rgba(0,0,0,.2) */
}
.scl-report-details{
  background: #ffffff;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #f3f3f3
}
.folded-contents {
  transition: 0.3s;
}
.report-details-first{
  margin-top: 16px;
}
.report-details-title{
  font-size: 18px;
  color: #000;
  display: flex;
  justify-content: space-between
}
.collapse-arrow-fold {
  transform: rotate(90deg);
  transition: transform 0.3s;
  display: block;
  width: 10px;
  height: 15px
}
.collapse-arrow-unfold {
  transform: rotate(270deg);
  transition: transform 0.3s;
  display: block;
  width: 10px;
  height: 15px
}
.report-details-score{
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: rgba(0,0,0,.8);
  opacity: 0.65;
  margin-top: 20px;
}
.charts-wrapper{
  width: 100%;
  height: 400px;
  margin-top: 16px;
  padding-top: 16px;
  background: #ffffff
}

.borken-line-charts-wrapper{
  height: 300px;
}
.report-details-img{
  display: block;
  width: 6px;
  height: 12px;
  margin-left: 2px;
  margin-top: 4px;
}
.scl-collapse >>> .van-cell, .advice-collapse >>> .van-cell{
  font-size: 16px
}
.advice-collapse{
  margin-top: 10px
}
.advice-ul {
  list-style-type:square;
  margin-bottom: 12px;
}
.advice-p {
  margin-bottom: 10px;
  word-spacing: 5px;
  line-height: 24px;
  margin-left: 16px;
  font-size: 14px;
  font-weight: 400;
}
.line-charts-title{
  text-align: center;
  margin-bottom: 10px
}
.current {
  font-weight: bold;
  font-size: 16px;
}
.vant-defineByself /deep/ .van-tab {
  font-size: 18px!important;
  font-weight: bolder;
}
.base-details-title{
  font-size: 18px;
  font-weight: 900;
  position: relative;
  padding-left: 16px;
}
.base-details-title:after{
  content: '';
  left: 0;
  top: 8px;
  position: absolute;
  width: 10px;
  height: 10px;
  background: #6ac2bf;
}
.align-justify{
  display:flex;
  justify-content: space-between;
  position: relative;
  top: 20px;
  align-items: center;
  letter-spacing: 1px;
}
.align-start{
  display:flex;
  justify-content: flex-start;
}
.goStudy{
  font-size: 14px;
  color: #6ac3bf
}
.report-details-level{
  color: #e93c00;
  font-size: 18px;
  position: relative;
  font-weight: bolder;
  margin-left: 40px;
  top: -5px;
}
.scl-collapse  /deep/ .van-cell .van-cell__value{
  color: #6ac3bf;
  font-size: 14px!important;
}
.scl-collapse  /deep/ .van-icon-arrow::before{
  color: #6ac3bf;
}
.advice-collapse /deep/ .van-cell .van-cell__value{
  color: #6ac3bf;
  font-size: 14px!important;
}
.advice-collapse  /deep/ .van-icon-arrow::before{
  color: #6ac3bf;
}
.mt4{
  margin-top: 4px;
}
.advice-collapse /deep/ .van-cell__title{
  font-size: 17px;
}
.scl-collapse /deep/ .van-cell__title{
  font-size: 17px;
}
.report-details-title-small{
  font-size: 16px;
}
.adviceName{
  position:relative;
  padding-left: 20px;
  font-size: 19px;
  font-weight: 900;
}
.adviceName:after{
  content: '';
  left:16px;
  top:16px;
  position: absolute;
  width: 12px;
  height: 12px;
  background: #6ac2bf;
}
.underline {
  position:relative;
}
.underline:after {
  position: absolute;
  content: '';
  width: 100%;
  height: 1px;
  bottom: 0;
  background: rgba(0,0,0,.2);
  left: 0;
}
.advice-ul li{
  list-style-type:none;
}
.van-tabs  /deep/ .van-sticky{
  margin-bottom: 6px;
}
.noTab /deep/ .van-sticky {
  display: none;
}
</style>
