import Vue from "vue";
import MsgComponent from "./index.vue";

// 组件构造器，构造出一个 vue组件实例
const MsgConstructor = Vue.extend(MsgComponent);

function showtMsg({ text, type, duration = 2000 }) {
  const instance = new MsgConstructor({
    el: document.createElement("div"),
    data() {
      return {
        visible: true, // 是否显示
        text: text, // 文本内容
        type: type, // 类型
      };
    },
  });
  // 添加节点
  document.body.appendChild(instance.$el);
  // 过渡时间
  setTimeout(() => {
    instance.visible = false;
  }, duration);
}
// // 全局注册
// function registryMsg() {
//   Vue.prototype.$showMessage = showtMsg;
// }

export default showtMsg;
