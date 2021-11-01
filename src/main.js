import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

import "normalize.css/normalize.css";
import "@/styles/iconfont/iconfont.css";
import "@/styles/index.scss";

import MsgRegistry from "./../packages/MessageTip/index.js";

Vue.prototype.$showMessage = MsgRegistry;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
