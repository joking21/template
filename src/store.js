import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
     toobarName: '我的考核任务'
  },
  mutations: {
    changeToobar(state, title){
      state.toobarName = title;
    },
  },
  actions: {
// this.$store.commit('changeToobar', '2');
  }
})
