import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import {getCookie} from '../util'
Vue.use(Vuex)

const state = {
    headToggle:0,
    userInfo : getCookie('userInfo')== null ? '' : JSON.parse(getCookie('userInfo')), //登录信息
}

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})

export default store
