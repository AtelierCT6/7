import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

const app = createApp(App)

axios.defaults.baseURL = 'http://localhost:3000/'
app.config.globalProperties.$http = axios

axios.interceptors.request.use(
  request => {
    const token = localStorage.getItem('token')
    if (token) {
      request.headers.Authorization = 'Bearer ' + token
    }
    return request
  },
  error => {
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response.status === 401) {
      localStorage.clear()
      router.replace({
        path: '/login',
        query: { redirect: router.currentRoute.fullPath }
      })
      return Promise.reject(error.response)
    }
  }
)

app.use(store).use(router).mount('#app')
