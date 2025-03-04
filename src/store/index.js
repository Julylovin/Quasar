/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-15 16:07:09
 * @LastEditTime: 2019-08-20 16:06:01
 * @LastEditors: Please set LastEditors
 */
import Vue from 'vue'
import Vuex from 'vuex'
import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      example
    }
  })

  return Store
}
