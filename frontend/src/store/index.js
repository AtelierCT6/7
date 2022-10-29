import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    userInfo: {},
    posts: []
  },
  mutations: {
    userInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    allPosts(state, posts) {
      state.posts = posts.reverse()
    }
  },
  actions: {
    getUserInfo(context) {
      axios.get('api/user/' + localStorage.getItem('userId'))
        .then(({ data }) => {
          context.commit('userInfo', data)
        })
    },
    getAllPosts(context) {
      axios.get('api/post/' + localStorage.getItem('userId'))
        .then(({ data }) => {
          context.commit('allPosts', data)
        })
    }
  },
  modules: {
  }
})
