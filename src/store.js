import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    user: {},
  },
  mutations: {
    changeLogin(state) {
      if (sessionStorage.getItem('token')) {
        state.token = sessionStorage.getItem('token');
        state.user = JSON.parse(sessionStorage.getItem('user')) || {};
      } else {
        state.token = '';
        state.user = {};
      }
    },

  },
  actions: {

    // this.$store.commit('changeToobar', '2');
  }
})
