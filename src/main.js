import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

var apiUrl;
if (process.env.NODE_ENV == 'development') {
  apiUrl = 'http://localhost:3000/api';
} else if (process.env.NODE_ENV == 'production') {
  apiUrl = window.location.origin;
}

const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    'x-api-token': process.env.VUE_APP_Q_API_TOKEN
  }
});

window.axios = instance;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
