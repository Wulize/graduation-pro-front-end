import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showNav: false,
    userName: '',
    unreadMsg: 0,
    isConnect: false,
    sightList: [],
    longgestSight:''
  },
  mutations: {},
  actions: {},
  modules: {},
})
