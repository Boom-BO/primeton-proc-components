import vue from "vue";
import MsgComponent from "./index.vue";

// 组件构造器，构造出一个 vue组件实例
const MsgConstructor = vue.extend(MsgComponent);

function showtMsg({ text, type, duration = 2000 }) {
  const msgDom = new MsgConstructor({
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
  document.body.appendChild(msgDom.$el);
  // 过渡时间
  setTimeout(() => {
    msgDom.visible = false;
  }, duration);
}
// 全局注册
function registryMsg() {
  vue.prototype.$showMessage = showtMsg;
}

export default registryMsg;
