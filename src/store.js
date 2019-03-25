import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toobarName: sessionStorage.getItem('toobarName') ? sessionStorage.getItem('toobarName') : '我的考核任务',
    toobarIndex: sessionStorage.getItem('toobarIndex') ? sessionStorage.getItem('toobarIndex') : '1',
    token: '',
    user: {},
  },
  mutations: {
    changeToobar(state, data) {
      state.toobarName = data.title;
      state.toobarIndex = data.index;
      sessionStorage.setItem('toobarName', data.title);
      sessionStorage.setItem('toobarIndex', data.index);
    },
    changeLogin(state) {
      if (sessionStorage.getItem('token') && sessionStorage.getItem('user')) {
        state.token = sessionStorage.getItem('token');
        state.user = JSON.parse(sessionStorage.getItem('user'));
      } else {
        state.token = '';
        state.user = {};
      }
    }
  },
  actions: {

    // this.$store.commit('changeToobar', '2');
  }
})
