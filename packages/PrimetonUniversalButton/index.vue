<template>
  <div class="u-button-wrapper">
    <!-- <span :class="['u-button', size ? `button--${size}` : '', type ? `button--${type}` : '']" @click="handlerOnclick"> -->
    <slot />
    <!-- </span> -->
    <PrimetonDialog :visible.sync="dialogVisible" title="选择人员" :width="650">
      <div class="content clearfix">
        <div class="tree-container">
          <el-tree
            ref="tree"
            :props="defaultProps"
            :load="loadNode"
            lazy
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <i
                v-if="data.type === 'company'"
                class="iconfont icon-pre-wenjianjia"
              ></i>
              <i v-if="data.type === 'org'" class="iconfont icon-pre-org"></i>
              <i
                v-if="data.type === 'person'"
                class="iconfont icon-pre-staff"
              ></i>
              <i v-if="data.type === 'role'" class="iconfont icon-pre-org"></i>
              <span class="node-label">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
        <div class="result-container">
          <template v-if="selectedRoleArray && selectedRoleArray.length > 0">
            <p class="title-row">角色：</p>
            <div class="tags-wrapper">
              <p-tag
                v-for="tag in selectedRoleArray"
                :key="tag.id"
                @close="delItem(tag, 'role')"
                >{{ tag.label }}</p-tag
              >
            </div>
          </template>
          <template v-if="selectedOrgArray && selectedOrgArray.length > 0">
            <p class="title-row">部门：</p>
            <div class="tags-wrapper">
              <p-tag
                v-for="tag in selectedOrgArray"
                :key="tag.id"
                @close="delItem(tag, 'org')"
                >{{ tag.label }}</p-tag
              >
            </div>
          </template>
          <template
            v-if="selectedPersonArray && selectedPersonArray.length > 0"
          >
            <p class="title-row">人员：</p>
            <div class="tags-wrapper">
              <p-tag
                v-for="tag in selectedPersonArray"
                :key="tag.id"
                @close="delItem(tag, 'person')"
                >{{ tag.label }}</p-tag
              >
            </div>
          </template>
        </div>
      </div>
      <div slot="footer" class="footer">
        <span class="u-button button--small" @click="close">取消</span>
        <span class="u-button button--primary button--small" @click="comfirm"
          >确认</span
        >
      </div>
    </PrimetonDialog>
  </div>
</template>

<script>
import { Tree } from "element-ui";
import pTag from "../PrimetonTag";
import PrimetonDialog from "../PrimetonDialog";
import { on, off } from "@/utils/dom.js";
export default {
  name: "PrimetonUniversalButton",
  components: { PrimetonDialog, pTag, [Tree.name]: Tree },
  props: {
    treeData: {
      type: Array,
      default: () => [],
    },
    // loadTreeData: {
    //   type: Function,
    //   default: () => {
    //     return [];
    //   },
    // },
  },
  data() {
    return {
      dialogVisible: false,
      slotNode: null,
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
      selectedRoleArray: [], // 已勾选的角色
      selectedOrgArray: [], // 已勾选的部门
      selectedPersonArray: [], // 已勾选的人员
    };
  },
  computed: {
    defaultExpandKeys() {
      return this.treeData[0] ? [this.treeData[0].id] : [];
    },
  },
  watch: {},
  created() {},
  mounted() {
    if (this.$slots.default) {
      this.slotNode = this.$slots.default[0].elm;
      on(this.slotNode, "click", this.open);
    }
  },
  beforeDestroy() {
    if (this.slotNode) {
      off(this.slotNode, "click", this.close);
    }
  },
  methods: {
    // 懒加载
    loadNode(node, resolve) {
      if (node.level === 0) {
        // 加载根数据
        this.$emit("loadTreeRootData", (root) => {
          return resolve(root);
        });
        // 返回数据为两层，默认展开显示两层数据
        const rootNode = node.childNodes[0];
        rootNode.expanded = true;
        rootNode.loadData();
      } else {
        // 加载子数据
        this.$emit("loadTreeChildrenData", node, (children) => {
          return resolve(children);
        });
      }
    },
    handleNodeClick(data) {
      if (data.type === "org" || data.type === "company") {
        // 选择部门
        const index = this.selectedOrgArray.findIndex(
          (item) => item.id === data.id
        );
        if (index !== -1) {
          this.selectedOrgArray.splice(index, 1);
        } else {
          this.selectedOrgArray.push(data);
        }
      } else if (data.type === "person") {
        // 选择人员
        const index = this.selectedPersonArray.findIndex(
          (item) => item.id === data.id
        );
        if (index !== -1) {
          this.selectedPersonArray.splice(index, 1);
        } else {
          this.selectedPersonArray.push(data);
        }
      } else if (data.type === "role") {
        // 选择人员
        const index = this.selectedRoleArray.findIndex(
          (item) => item.id === data.id
        );
        if (index !== -1) {
          this.selectedRoleArray.splice(index, 1);
        } else {
          this.selectedRoleArray.push(data);
        }
      }
    },
    delItem(index, type) {
      if (type === "org" || type === "company") {
        this.selectedOrgArray.splice(index, 1);
      } else if (type === "person") {
        this.selectedPersonArray.splice(index, 1);
      } else if (type === "role") {
        this.selectedRoleArray.splice(index, 1);
      }
    },
    open() {
      console.log("&&&&&&&&&&&&&&&&");
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
      this.selectedOrgArray = [];
      this.selectedPersonArray = [];
      this.selectedRoleArray = [];
      this.$emit("close");
    },
    comfirm() {
      this.$emit(
        "confirm",
        {
          org: this.selectedOrgArray,
          person: this.selectedPersonArray,
          role: this.selectedRoleArray,
        },
        () => {
          this.close();
        }
      );
      // this.close();
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  border: 1px solid #d2d9e6;
  border-radius: 5px;
  background-color: #fff;
  overflow: hidden;
  box-sizing: border-box;

  .tree-container {
    float: left;
    width: 50%;
    box-sizing: border-box;

    .icon-pre-wenjianjia {
      color: #70bffd;
    }
    .icon-pre-org {
      color: #70bffd;
    }
    .icon-pre-staff {
      color: #cfae80;
    }
  }
  .result-container {
    float: left;
    width: 50%;
    height: 220px;
    padding: 5px 10px;
    border-left: 1px solid #d2d9e6;
    text-align: left;
    box-sizing: border-box;

    .title-row {
      margin: 5px 0;
      font-size: 14px;
    }

    .tags-wrapper {
      min-height: 40px;
    }
  }
  .custom-tree-node {
    font-size: 14px;
    .iconfont {
      margin-right: 5px;
    }
  }
}
.u-button-wrapper {
  display: inline-block;
  .u-button {
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
      padding: 9px 15px;
      font-size: 12px;
      border-radius: 3px;
    }

    &.button--mini {
      padding: 7px 15px;
      font-size: 12px;
      border-radius: 3px;
    }
  }
}
</style>
