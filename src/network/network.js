/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-15 16:07:09
 * @LastEditTime: 2019-11-29 10:25:42
 * @LastEditors: Please set LastEditors
 */
import commen from '../network/commen'
import axios from 'axios'
// 2020.9.2正式环境发布
// 正式环境域名 const API_BASEURL = 'https://cc.epihealth.cn/'
// 测试环境http://8.129.0.106/的域名是http://weixin.epihealth.cn/
const API_BASEURL1 = document.location.href.indexOf('localhost') !== -1 ? 'http://8.129.0.106:8025/' : API_BASEURL
const baseUrl = API_BASEURL1 + 'api/'
const cmsBaseUrl = API_BASEURL1 + 'web/'
const appkey = 'jpw1q3robe9tiuagld08mep6sl4jdcib'
const channel = 0

function myPost (url, params) {
  return axios({
    url: url,
    data: params,
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'appkey': appkey,
      'channel': channel,
      'versions': 'H5',
      'platform': 'H5',
      'hospital-id': localStorage.getItem('h5_stage_hospital_id'),
      'token': localStorage.getItem('h5_stage_loginToken'),
      'conv-id': localStorage.getItem('h5_stage_hospital_id')
    }
  })
}

function myPost1 (url, params) {
  return axios({
    url: url,
    data: params,
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'appkey': appkey,
      'channel': channel,
      'versions': 'H5',
      'platform': 'H5',
      'hospital-id': localStorage.getItem('h5_stage_hospital_id'),
      'conv-id': localStorage.getItem('h5_stage_hospital_id')
    }
  })
}

function myGet (url) {
  return axios({
    url: url,
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'appkey': appkey,
      'channel': channel,
      'platform': 'H5',
      'versions': 'H5',
      'token': localStorage.getItem('h5_stage_loginToken'),
      'hospital-id': localStorage.getItem('h5_stage_hospital_id'),
      'conv-id': localStorage.getItem('h5_stage_hospital_id')
    }
  })
}

function selectGroup (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(baseUrl + 'SelectStageUser/selectGroup', data).then(
      response => {
        resolve(response)
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function register (data) {
  if (data.phone) {
    data.phone = commen.encrypt(data.phone)
  }
  var promise = new Promise((resolve, reject) => {
    myPost1(baseUrl + 'SelectStageUser/login', data).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}
// function privateRegister (data) {
//   var promise = new Promise((resolve, reject) => {
//     myPost(baseUrl + 'user/registerM', data).then(
//       response => {
//         if (response.data.ret === 1) {
//           resolve(response.data.data)
//         } else {
//           reject(response.data)
//         }
//       }
//     ).catch(
//       error => {
//         reject(error)
//       }
//     )
//   })
//   return promise
// }

function login (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(baseUrl + 'SelectStageUser/getUserInfo', data).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getScaleList (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(baseUrl + 'SelectStageUser/groupLists', data).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getQuestionnaireDetails (id) {
  var promise = new Promise((resolve, reject) => {
    myPost(baseUrl + 'Entity/get?id=' + id).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getArticleList (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(cmsBaseUrl + 'Cms/getpagelist', data).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data.message)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function recordArticle (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(cmsBaseUrl + 'Cms/add', data).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getCategory (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(cmsBaseUrl + 'Cms/getCategory', data).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getTagCategory (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(cmsBaseUrl + 'Cms/getMultiCategorys', data).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function postReply (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(baseUrl + 'SelectStageUser/addReply', data).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getResult (id) {
  var promise = new Promise((resolve, reject) => {
    myGet(baseUrl + `Reply/getResult?id=${id}`).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data.message)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getSCLResult (id) {
  var promise = new Promise((resolve, reject) => {
    myGet(baseUrl + `Reply/getSCLResult?id=${id}`).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data.message)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function logError (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(baseUrl + 'WxLog/add', data).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function historyCourse (id) {
  var promise = new Promise((resolve, reject) => {
    myGet(cmsBaseUrl + `Cms/history?user_id=${id}`).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data.message)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getReport (userId, authId, type, openid) {
  var promise = new Promise((resolve, reject) => {
    myGet(baseUrl + `Report/get?user_id=${userId}&auth_id=${authId}&type=${type}&openid=${openid}`).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data.message)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getReportList (id, openid) {
  var promise = new Promise((resolve, reject) => {
    myGet(baseUrl + `Report/lists?user_id=${id}&openid=${openid}`).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data.message)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getLineCharts (id, type, openid) {
  var promise = new Promise((resolve, reject) => {
    myGet(baseUrl + `Report/linechart?user_id=${id}&type=${type}&openid=${openid}`).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data.message)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getPhoneList (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(baseUrl + 'config/get', data).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data.message)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getQuestionnaire (id, userId) {
  var promise = new Promise((resolve, reject) => {
    myGet(baseUrl + `Entity/get?id=${id}&user_id=${userId}`).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data.message)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function actionCount (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(baseUrl + 'user/updateTimes ', data).then(
      response => {
        resolve(response)
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function getAgreement () {
  var promise = new Promise((resolve, reject) => {
    myGet('https://cc.epihealth.cn/api/wap/agreement').then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data.message)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}

function order (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(baseUrl + 'Order/create', data).then(
      response => {
        resolve(response)
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}
function getArticleDetails (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(cmsBaseUrl + 'Cms/detail', data).then(
      response => {
        if (response.data.ret === 1) {
          resolve(response.data.data)
        } else {
          reject(response.data.message)
        }
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
  return promise
}
function sendSmsCode (data) {
  var promise = new Promise((resolve, reject) => {
    myPost(baseUrl + 'user/sendSmsCode', data).then(
      response => {
        resolve(response.data)
      }
    )
  })
  return promise
}
export default {
  register,
  login,
  getScaleList,
  getQuestionnaireDetails,
  getArticleList,
  recordArticle,
  postReply,
  getResult,
  logError,
  getSCLResult,
  historyCourse,
  getReport,
  getReportList,
  getLineCharts,
  getPhoneList,
  getQuestionnaire,
  getCategory,
  getTagCategory,
  getArticleDetails,
  actionCount,
  // privateRegister,
  getAgreement,
  order,
  selectGroup,
  sendSmsCode
}
