/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-15 16:07:09
 * @LastEditTime: 2019-11-08 09:38:04
 * @LastEditors: Please set LastEditors
 */

const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    redirect: { name: 'index' },
    children: [
      {
        path: 'index',
        component: () => import('pages/index.vue'),
        name: 'index',
        query: {
          openid: ''
        }
      },
      {
        path: 'webview',
        component: () => import('pages/webview.vue'),
        name: 'webview',
        query: {
          start_time: ''
        }
      },
      {
        path: 'selectType',
        component: () => import('pages/selectType.vue'),
        name: 'selectType',
        query: {
          phone: ''
        }
      },
      {
        path: 'intro/:id',
        component: () => import('pages/intro.vue'),
        name: 'intro'
      },
      {
        path: 'welcome',
        component: () => import('pages/welcome.vue'),
        name: 'welcome',
        query: {
          hospital_id: ''
        }
      },
      {
        path: 'welcome2',
        component: () => import('pages/welcome2.vue'),
        name: 'welcome2',
        query: {
          hospital_id: ''
        }
      },
      {
        path: 'question/:questionID',
        component: () => import('pages/question.vue'),
        name: 'question'
      },
      {
        path: 'result/:nextPageId',
        component: () => import('pages/result.vue'),
        name: 'result'
      },
      {
        path: 'discover',
        component: () => import('pages/discover.vue'),
        name: 'discover'
      },
      {
        path: 'phoneList',
        component: () => import('pages/phoneList.vue'),
        name: 'phoneList'
      },
      {
        path: 'doctorConsult',
        component: () => import('pages/doctorConsult.vue'),
        name: 'doctorConsult'
      },
      {
        path: 'agreement',
        component: () => import('pages/agreement.vue'),
        name: 'agreement'
      },
      {
        path: 'audio',
        component: () => import('pages/audio.vue'),
        name: 'audio',
        query: {
          start_time: ''
        }
      },
      {
        path: 'userIndex',
        component: () => import('pages/user/index.vue'),
        name: 'userIndex'
      },
      {
        path: 'about',
        component: () => import('pages/user/about.vue'),
        name: 'about'
      },
      {
        path: 'lesson',
        component: () => import('pages/user/lesson.vue'),
        name: 'lesson'
      },
      {
        path: 'info',
        component: () => import('pages/user/info.vue'),
        name: 'info'
      },
      {
        path: 'historyReportDetails/:id/:type',
        component: () => import('pages/user/historyReportDetails.vue'),
        name: 'historyReportDetails'
      },
      {
        path: 'historyReportList',
        component: () => import('pages/user/historyReportList.vue'),
        name: 'historyReportList'
      },
      {
        path: 'historyReportTypeDetails/:id',
        component: () => import('pages/user/historyReportTypeDetails.vue'),
        name: 'historyReportTypeDetails'
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
