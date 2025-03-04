/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-15 16:07:09
 * @LastEditTime: 2019-11-05 10:55:05
 * @LastEditors: Please set LastEditors
 */
/*
export function someMutation (state) {
}
*/
export function editTitle (state, payload) {
  state.title = payload.title
}

export function savePlatformInfo (state, payload) {
  state.platformInfo = payload.platformInfo
}
