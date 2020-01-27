import modules from './modules';
import Vue from 'vue';
import Vuex from 'vuex';
import state from './state'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
