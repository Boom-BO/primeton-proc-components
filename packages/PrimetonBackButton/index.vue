<template>
  <div class="u-button-wrapper">
    <slot />
    <PrimetonDialog
      :visible.sync="dialogVisible"
      :title="title"
      :width="500"
      @close="close"
    >
      <div class="content clearfix">
        <!--选择后退环节-->
        <PrimetonProcessList
          v-model="selectedLineID"
          :list-data="listData"
          is-back
        />
      </div>
      <div slot="footer" class="footer">
        <span class="u-button button--primary button--small" @click="comfirm">
          确定
        </span>
        <span class="u-button button--primary button--small" @click="close">
          取消
        </span>
      </div>
    </PrimetonDialog>
  </div>
</template>

<script>
import { Collapse, CollapseItem } from "element-ui";
import PrimetonDialog from "../PrimetonDialog";
import PrimetonProcessList from "../PrimetonProcessList";
import { on, off } from "@/utils/dom.js";
export default {
  name: "PrimetonBackButton",
  components: {
    PrimetonDialog,
    PrimetonProcessList,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
  },
  props: {
    title: {
      type: String,
      default: "标题",
    },
    beforeOpen: {
      type: Function,
    },
  },
  data() {
    return {
      dialogVisible: false,
      slotNode: null, // 插槽节点
      listData: [], // 环节数据
      selectedLineID: "", // 环节选择--已选的环节id
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    if (this.$slots.default) {
      this.slotNode = this.$slots.default[0].elm;
      on(this.slotNode, "click", () => {
        if (!this.beforeOpen) {
          this.open();
        } else {
          this.beforeOpen(() => {
            this.open();
          });
        }
      });
    }
  },
  beforeDestroy() {
    if (this.slotNode) {
      off(this.slotNode, "click", this.close);
    }
  },
  methods: {
    // 弹窗打开事件
    open() {
      this.dialogVisible = true;
      // 获取环节数据
      this.$emit("loadData", (listData) => {
        if (!listData || !Object.keys(listData).length > 0) {
          // 无环节数据，弹窗提醒
          this.$showMessage({
            text: "无环节数据！",
            type: "error",
          });
          this.dialogVisible = false;
          return false;
        }
        this.listData = listData;
      });
    },
    // 弹窗关闭事件，
    close() {
      this.dialogVisible = false;
      // 清空已选节点数据
      this.selectedLineID = "";
      this.$emit("close");
    },
    // 确认提交事件，格式化已选节点数据并抛出
    comfirm() {
      // 选环节--单独处理事件
      if (this.selectedLineID === "") {
        this.$showMessage({
          text: "未选择任何环节！",
          type: "error",
        });
        return false;
      } else {
        // 接口需要的数据格式处理
        // const arr = this.selectedLineID.map((item) => ({ id: item }));
        // 确认并抛出已选环节ID数组
        this.$emit("confirm", this.selectedLineID, () => {
          console.log(
            "🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀",
            this.selectedLineID
          );
          this.close();
        });
        return this.selectedLineID;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  box-sizing: border-box;

  .title-icon {
    width: 25px;
    height: 25px;
    margin-right: 15px;
    border-radius: 50%;
    overflow: hidden;
    background: #378af7;
    text-align: center;
    line-height: 25px;

    i {
      color: #fff;
      font-size: 15px;
    }
  }
}

.u-button-wrapper {
  display: inline-block;

  .u-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;

    &.button--primary {
      color: #fff;
      background-color: #409eff;
      border-color: #409eff;
    }

    &.button--success {
      color: #fff;
      background-color: #67c23a;
      border-color: #67c23a;
    }

    &.button--success {
      color: #fff;
      background-color: #67c23a;
      border-color: #67c23a;
    }

    &.button--info {
      color: #fff;
      background-color: #909399;
      border-color: #909399;
    }

    &.button--warning {
      color: #fff;
      background-color: #e6a23c;
      border-color: #e6a23c;
    }

    &.button--danger {
      color: #fff;
      background-color: #f56c6c;
      border-color: #f56c6c;
    }

    &.button--medium {
      padding: 10px 20px;
      font-size: 14px;
      border-radius: 4px;
    }

    &.button--small {
      padding: 7px 15px;
      font-size: 12px;
      border-radius: 3px;
    }

    &.button--mini {
      padding: 5px 15px;
      font-size: 12px;
      border-radius: 3px;
    }
  }
}
</style>
