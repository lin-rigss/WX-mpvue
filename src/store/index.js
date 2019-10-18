import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';
import * as mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

const state = {
  isAuthenticated: false,  // 是否授权
  user: null, // 用户信息
  openId: '',  // openId
  lessonInfo: null // 课程信息
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
