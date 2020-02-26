import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Credentials from "./api/amplifyConf";
import axios from "axios";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

let apiUrl;
let instance;
if (process.env.NODE_ENV == "development") {
    apiUrl = "http://localhost:3000/api";
    instance = axios.create({
        baseURL: apiUrl,
        headers: {
            "x-api-token": Credentials.DEV_API_TOKEN,
            "q-data-center": Credentials.DEV_DATA_CENTER
        }
    });
} else if (process.env.NODE_ENV == "production") {
    apiUrl = window.location.origin + "/api";
    instance = axios.create({
        baseURL: apiUrl
    });
}

window.axios = instance;
Vue.config.productionTip = false;

Vue.use(BootstrapVue);
new Vue({
    router,
    store,
    render: function(h) {
        return h(App);
    }
}).$mount("#app");
