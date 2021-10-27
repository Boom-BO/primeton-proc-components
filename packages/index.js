import "normalize.css/normalize.css";
import "@/styles/iconfont/iconfont.css";
import "@/styles/index.scss";

import PrimetonUniversalButton from "./PrimetonUniversalButton/index.vue";
import PrimetonBackButton from "./PrimetonBackButton/index.vue";
import PrimetonDialog from "./PrimetonDialog/index.vue";
import PrimetonTag from "./PrimetonTag/index.vue";

const components = [
  PrimetonUniversalButton,
  PrimetonDialog,
  PrimetonTag,
  PrimetonBackButton,
];

const install = function (Vue) {
  // 判断是否安装
  if (install.installed) return;
  components.map((component) => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  // 导出的对象必须具备一个 install 方法
  install,
  // 组件列表
  ...components,
};
