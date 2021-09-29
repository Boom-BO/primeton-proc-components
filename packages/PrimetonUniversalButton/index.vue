<template>
  <div class="u-button-wrapper">
    <!-- <span :class="['u-button', size ? `button--${size}` : '', type ? `button--${type}` : '']" @click="handlerOnclick"> -->
    <slot />
    <!-- </span> -->
    <PrimetonDialog :visible.sync="dialogVisible" :title="title" :width="650">
      <div class="content clearfix">
        <el-collapse
          v-model="activeCollapse"
          accordion
          @change="collapseOnChange"
        >
          <el-collapse-item
            v-for="(item, index) in auditLinks"
            :key="item.id"
            :name="index"
          >
            <template slot="title" class="title-bar">
              <span class="title-icon">
                <i class="iconfont icon-pre-process"></i>
              </span>
              {{ item.name }}
              <span v-if="activeCollapse === index" class="placeholder">
                选择参与者
              </span>
              <span v-else class="placeholder">{{
                getSelectedLabel(index)
              }}</span>
            </template>
            <div class="tree-container">
              <div class="search-bar">
                <el-input
                  v-model="keyword"
                  placeholder="请输入关键字"
                  size="mini"
                  @keyup.enter="search"
                ></el-input>
                <span class="search-text-btn" @click="search">
                  <i class="iconfont icon-pre-search"></i> 查询
                </span>
                <div class="search-type">
                  <span
                    v-for="(type, index) in viewPartyType"
                    :key="index"
                    :class="index === 0 && 'active'"
                    @click="search(type)"
                  >
                    {{ type === "org" ? "机构树" : "角色树" }}
                  </span>
                </div>
              </div>
              <el-tree
                v-if="isLazy"
                :ref="'lazy-tree' + index"
                :key="'lazy-tree' + index"
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
                  <i
                    v-if="data.type === 'org'"
                    class="iconfont icon-pre-org"
                  ></i>
                  <i
                    v-if="data.type === 'person'"
                    class="iconfont icon-pre-staff"
                  ></i>
                  <i
                    v-if="data.type === 'role'"
                    class="iconfont icon-pre-org"
                  ></i>
                  <span class="node-label">{{ node.label }}</span>
                </span>
              </el-tree>
              <el-tree
                v-else
                :key="'tree' + index"
                :ref="'tree' + index"
                :props="defaultProps"
                :data="treeData"
                highlight-current
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <i
                    v-if="data.type === 'company'"
                    class="iconfont icon-pre-wenjianjia"
                  ></i>
                  <i
                    v-if="data.type === 'org'"
                    class="iconfont icon-pre-org"
                  ></i>
                  <i
                    v-if="data.type === 'person'"
                    class="iconfont icon-pre-staff"
                  ></i>
                  <i
                    v-if="data.type === 'role'"
                    class="iconfont icon-pre-org"
                  ></i>
                  <span class="node-label">{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
            <div class="result-container">
              <template
                v-if="
                  data[index] &&
                  data[index].selectedRoleArray &&
                  data[index].selectedRoleArray.length > 0
                "
              >
                <p class="title-row">角色：</p>
                <div class="tags-wrapper">
                  <p-tag
                    v-for="tag in data[index].selectedRoleArray"
                    :key="tag.id"
                    @close="delItem(tag, 'role')"
                  >
                    {{ tag.label }}
                  </p-tag>
                </div>
              </template>
              <template
                v-if="
                  data[index] &&
                  data[index].selectedOrgArray &&
                  data[index].selectedOrgArray.length > 0
                "
              >
                <p class="title-row">部门：</p>
                <div class="tags-wrapper">
                  <p-tag
                    v-for="tag in data[index].selectedOrgArray"
                    :key="tag.id"
                    @close="delItem(tag, 'org')"
                  >
                    {{ tag.label }}
                  </p-tag>
                </div>
              </template>
              <template
                v-if="
                  data[index] &&
                  data[index].selectedPersonArray &&
                  data[index].selectedPersonArray.length > 0
                "
              >
                <p class="title-row">人员：</p>
                <div class="tags-wrapper">
                  <p-tag
                    v-for="tag in data[index].selectedPersonArray"
                    :key="tag.id"
                    @close="delItem(tag, 'person')"
                  >
                    {{ tag.label }}</p-tag
                  >
                </div>
              </template>
            </div>
          </el-collapse-item>
          <!-- <el-collapse-item>
            <template slot="title">
              <span class="title-icon">
                <i class="iconfont icon-pre-process"></i>
              </span>
              领导审批
              <span class="placeholder">选择参与者</span>
            </template>
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
                  <i
                    v-if="data.type === 'org'"
                    class="iconfont icon-pre-org"
                  ></i>
                  <i
                    v-if="data.type === 'person'"
                    class="iconfont icon-pre-staff"
                  ></i>
                  <i
                    v-if="data.type === 'role'"
                    class="iconfont icon-pre-org"
                  ></i>
                  <span class="node-label">{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
            <div class="result-container">
              <template
                v-if="
                  data[1].selectedRoleArray &&
                  data[1].selectedRoleArray.length > 0
                "
              >
                <p class="title-row">角色：</p>
                <div class="tags-wrapper">
                  <p-tag
                    v-for="tag in data[1].selectedRoleArray"
                    :key="tag.id"
                    @close="delItem(tag, 'role')"
                    >{{ tag.label }}
                  </p-tag>
                </div>
              </template>
              <template
                v-if="
                  data[1].selectedOrgArray &&
                  data[1].selectedOrgArray.length > 0
                "
              >
                <p class="title-row">部门：</p>
                <div class="tags-wrapper">
                  <p-tag
                    v-for="tag in data[1].selectedOrgArray"
                    :key="tag.id"
                    @close="delItem(tag, 'org')"
                    >{{ tag.label }}
                  </p-tag>
                </div>
              </template>
              <template
                v-if="
                  data[1].selectedPersonArray &&
                  data[1].selectedPersonArray.length > 0
                "
              >
                <p class="title-row">人员：</p>
                <div class="tags-wrapper">
                  <p-tag
                    v-for="tag in data[1].selectedPersonArray"
                    :key="tag.id"
                    @close="delItem(tag, 'person')"
                  >
                    {{ tag.label }}</p-tag
                  >
                </div>
              </template>
            </div>
          </el-collapse-item> -->
        </el-collapse>
      </div>
      <div slot="footer" class="footer">
        <span class="u-button button--small" @click="close">取消</span>
        <span class="u-button button--primary button--small" @click="comfirm">
          确认
        </span>
      </div>
    </PrimetonDialog>
  </div>
</template>

<script>
import { Tree, Collapse, CollapseItem, Input } from "element-ui";
import pTag from "../PrimetonTag";
import PrimetonDialog from "../PrimetonDialog";
import { on, off } from "@/utils/dom.js";
export default {
  name: "PrimetonUniversalButton",
  components: {
    PrimetonDialog,
    pTag,
    [Tree.name]: Tree,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Input.name]: Input,
  },
  props: {
    title: {
      type: String,
      default: "标题",
    },
    type: {
      type: String,
      default: "default_submit",
    },
    viewPartyType: {
      type: Array,
      default: () => ["role", "org"],
    },
    // 范围相关配置项
    config: {
      type: Object,
      default: () => {
        return {
          buttonType: "act_select_party",
          isNotAllowParentChild: false,
          orgScope: "all",
          roleScope: "all",
          selectPartyType: "emp,role,org,position",
          viewPartyType: "org,role",
        };
      },
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
      auditLinks: [
        {
          id: "manualActivity4",
          name: "财务审批",
          participants: [
            {
              id: "1021",
              name: "部门经理",
              typeCode: "role",
            },
            {
              id: "41",
              name: "开发部",
              typeCode: "org",
            },
          ],
        },
        {
          id: "leaderActivity4",
          name: "领导审批",
          participants: [
            {
              id: "1021",
              name: "部门经理",
              typeCode: "role",
            },
            {
              id: "41",
              name: "开发部",
              typeCode: "org",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
      activeCollapse: 0, // 当前展开或选中的流程
      data: [],
      keyword: "",
      isLazy: true,
      treeData: [], // 非懒加载数据
      // data[0].selectedRoleArray: [], // 已勾选的角色
      // data[0].selectedOrgArray: [], // 已勾选的部门
      // data[0].selectedPersonArray: [], // 已勾选的人员
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    if (this.$slots.default) {
      this.slotNode = this.$slots.default[0].elm;
      on(this.slotNode, "click", this.open);
    }
    this.$emit("loadLinks", (auditLinks) => {
      this.auditLinks = auditLinks;
    });
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
        this.$emit("loadTreeRootData", this.config, (root) => {
          this.treeData = root;
          return resolve(root);
        });
        // 返回数据为两层，默认展开显示两层数据
        const rootNode = node.childNodes[0];
        rootNode.expanded = true;
        rootNode.loadData();
      } else {
        // 加载子数据
        this.$emit("loadTreeChildrenData", node, this.config, (children) => {
          return resolve(children);
        });
      }
    },
    handleNodeClick(data) {
      if (!this.data[this.activeCollapse]) {
        this.$set(this.data, this.activeCollapse, {});
        if (!this.data[this.activeCollapse]["selectedOrgArray"]) {
          this.$set(this.data[this.activeCollapse], "selectedOrgArray", []);
        }
        if (!this.data[this.activeCollapse]["selectedPersonArray"]) {
          this.$set(this.data[this.activeCollapse], "selectedPersonArray", []);
        }
        if (!this.data[this.activeCollapse]["selectedRoleArray"]) {
          this.$set(this.data[this.activeCollapse], "selectedRoleArray", []);
        }
      }
      if (data.type === "org" || data.type === "company") {
        // if (
        //   !this.data[this.activeCollapse] ||
        //   !this.data[this.activeCollapse]["selectedOrgArray"]
        // ) {
        //   this.$set(this.data, this.activeCollapse, {});
        //   this.$set(this.data[this.activeCollapse], "selectedOrgArray", []);
        //   this.data[this.activeCollapse]["selectedOrgArray"].push(data);
        // } else {
        // 选择部门
        const index = this.data[this.activeCollapse].selectedOrgArray.findIndex(
          (item) => item.id === data.id
        );
        if (index !== -1) {
          this.data[this.activeCollapse].selectedOrgArray.splice(index, 1);
        } else {
          this.data[this.activeCollapse].selectedOrgArray.push(data);
        }
        // }
      } else if (data.type === "person") {
        // 选择人员
        // if (
        //   !this.data[this.activeCollapse] ||
        //   !this.data[this.activeCollapse]["selectedPersonArray"]
        // ) {
        //   this.$set(this.data, this.activeCollapse, {});
        //   this.$set(this.data[this.activeCollapse], "selectedPersonArray", []);
        //   this.data[this.activeCollapse]["selectedPersonArray"].push(data);
        // } else {
        const index = this.data[
          this.activeCollapse
        ].selectedPersonArray.findIndex((item) => item.id === data.id);
        if (index !== -1) {
          this.data[this.activeCollapse].selectedPersonArray.splice(index, 1);
        } else {
          this.data[this.activeCollapse].selectedPersonArray.push(data);
        }
        // }
      } else if (data.type === "role") {
        // 选择角色
        // if (
        //   !this.data[this.activeCollapse] ||
        //   !this.data[this.activeCollapse]["selectedRoleArray"]
        // ) {
        //   this.$set(this.data, this.activeCollapse, {});
        //   this.$set(this.data[this.activeCollapse], "selectedRoleArray", []);
        //   this.data[this.activeCollapse]["selectedRoleArray"].push(data);
        // } else {
        const index = this.data[
          this.activeCollapse
        ].selectedRoleArray.findIndex((item) => item.id === data.id);
        if (index !== -1) {
          this.data[this.activeCollapse].selectedRoleArray.splice(index, 1);
        } else {
          this.data[this.activeCollapse].selectedRoleArray.push(data);
        }
        // }
      }
    },
    delItem(index, type) {
      if (type === "org" || type === "company") {
        this.data[this.activeCollapse].selectedOrgArray.splice(index, 1);
      } else if (type === "person") {
        this.data[this.activeCollapse].selectedPersonArray.splice(index, 1);
      } else if (type === "role") {
        this.data[this.activeCollapse].selectedRoleArray.splice(index, 1);
      }
    },
    open() {
      console.log("&&&&&&&&&&&&&&&&");
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
      this.data = [];
      // this.data[0].selectedOrgArray = [];
      // this.data[0].selectedPersonArray = [];
      // this.data[0].selectedRoleArray = [];
      this.$emit("close");
    },
    comfirm() {
      this.$emit("confirm", this.data, () => {
        this.close();
      });
      // this.close();
    },
    getSelectedLabel(index) {
      if (!this.data[index] || JSON.stringify(this.data[index]) === "{}") {
        return "选择参与者";
      } else {
        let label = "";
        if (
          this.data[index].selectedOrgArray &&
          this.data[index].selectedOrgArray.length > 0
        ) {
          label +=
            "部门：" +
            this.data[index].selectedOrgArray
              .map((item) => item.label)
              .join("、") +
            "。";
        }
        if (
          this.data[index].selectedPersonArray &&
          this.data[index].selectedPersonArray.length > 0
        ) {
          label +=
            "人员：" +
            this.data[index].selectedPersonArray
              .map((item) => item.label)
              .join("、") +
            "。";
        }
        if (
          this.data[index].selectedPersonArray &&
          this.data[index].selectedPersonArray.length > 0
        ) {
          label +=
            "角色：" +
            this.data[index].selectedPersonArray
              .map((item) => item.label)
              .join("、") +
            "。";
        }
        return label;
      }
    },
    // 折叠面板展开事件
    collapseOnChange(val) {
      console.log(
        "🚀 ~ file: index.vue ~ line 541 ~ collapseOnChange ~ val",
        val
      );
      this.keyword = "";
      this.isLazy = true;
      this.treeData = [];
    },
    search(type) {
      console.log("🚀 ~ file: index.vue ~ line 500 ~ search ~ type", type);
      if (this.keyword === "") {
        this.collapseOnChange();
      } else {
        this.$emit("filter", this.keyword, (data) => {
          this.isLazy = false;
          this.treeData = data;
        });
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

  ::v-deep .el-collapse-item__header {
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 15px;
    color: #3a3a3a;
    border-bottom: 1px solid #fff;

    &.is-active {
      border-bottom: 1px solid #d2d9e6;
    }

    .placeholder {
      max-width: 350px;
      margin-left: auto;
      font-size: 12px;
      color: #a3a3a3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .el-collapse-item__arrow {
      margin: 0 8px;
    }
  }

  ::v-deep .el-collapse {
    border: none;

    .el-collapse-item {
      border: 1px solid #d2d9e6;
      border-radius: 5px;
      margin-bottom: 20px;
      overflow: hidden;
    }
  }

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

    .search-bar {
      position: relative;
      width: 100%;
      padding: 10px 15px 5px 15px;
      box-sizing: border-box;

      ::v-deep .el-input__inner {
        padding-right: 60px;
        background: #f8f9fe;
      }

      .search-text-btn {
        position: absolute;
        top: 12.5px;
        right: 25px;
        font-size: 12px;
        font-weight: 500;
        color: #599af6;
        cursor: pointer;
        z-index: 1;

        .icon-pre-search {
          font-size: 15px;
          display: inline-block;
          vertical-align: middle;
        }

        &:hover {
          color: darken(#599af6, 20%);
        }
      }

      .search-type {
        width: 100%;
        margin: 10px 0 0 0;
        font-size: 12px;
        font-weight: 500;
        color: #747677;
        text-align: left;

        span {
          margin-left: 10px;
          cursor: pointer;

          &:nth-of-type(1) {
            margin-left: 0;
          }

          &:hover,
          &.active {
            color: #378af7;
          }
        }
      }
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
