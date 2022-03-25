<template>
  <div class="content clearfix" :class="layoutStyle">
    <div class="search-bar clearfix" v-if="layoutStyle === 'tb'">
      <div class="search-type">
        <span
          v-for="(type, tindex) in viewPartyType"
          :key="tindex"
          :class="type === activeTreeType && 'active'"
          @click="switchTreeType(type)"
        >
          {{ type === "org" ? "机构树" : "角色树" }}
        </span>
      </div>
      <div class="input-wrapper">
        <el-input
          v-model="keyword"
          placeholder="请输入关键字"
          size="mini"
          @keyup.enter.native="search"
        ></el-input>
        <span class="search-text-btn" @click="search">
          <i class="pre-iconfont icon-pre-search"></i> <span>查询</span>
        </span>
      </div>
    </div>
    <div class="simple-wrapper clearfix">
      <div class="tree-container">
        <div class="search-bar" v-if="layoutStyle !== 'tb'">
          <el-input
            v-model="keyword"
            placeholder="请输入关键字"
            size="mini"
            @keyup.enter.native="search"
          ></el-input>
          <span class="search-text-btn" @click="search">
            <i class="pre-iconfont icon-pre-search"></i> <span>查询</span>
          </span>
          <div class="search-type">
            <span
              v-for="(type, tindex) in viewPartyType"
              :key="tindex"
              :class="type === activeTreeType && 'active'"
              @click="switchTreeType(type)"
            >
              {{ type === "org" ? "机构树" : "角色树" }}
            </span>
          </div>
        </div>
        <el-tree
          v-if="isLazy"
          ref="lazy-tree"
          key="lazy-tree"
          :props="defaultProps"
          :load="loadNode"
          lazy
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <span
            :class="['custom-tree-node', !hasAuth(data.typeCode) && 'disabled']"
            slot-scope="{ node, data }"
          >
            <i
              v-if="data.typeCode === 'company'"
              class="pre-iconfont icon-pre-wenjianjia"
            ></i>
            <i
              v-if="data.typeCode === 'org'"
              class="pre-iconfont icon-pre-org"
            ></i>
            <i
              v-if="data.typeCode === 'emp'"
              class="pre-iconfont icon-pre-staff"
            ></i>
            <i
              v-if="data.typeCode === 'role'"
              class="pre-iconfont icon-pre-role"
            ></i>
            <span class="node-label">{{ node.label }}</span>
          </span>
        </el-tree>
        <!-- <template v-else> -->
        <!-- v-if="treeData.length > 0" -->
        <el-tree
          v-else
          :key="'tree'"
          :ref="'tree'"
          :props="defaultProps"
          :data="treeData"
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <span
            :class="['custom-tree-node', !hasAuth(data.typeCode) && 'disabled']"
            :key="'node-' + 0"
            slot-scope="{ node, data }"
          >
            <i
              v-if="data.typeCode === 'company'"
              class="pre-iconfont icon-pre-wenjianjia"
            ></i>
            <i
              v-if="data.typeCode === 'org'"
              class="pre-iconfont icon-pre-org"
            ></i>
            <i
              v-if="data.typeCode === 'emp'"
              class="pre-iconfont icon-pre-staff"
            ></i>
            <i
              v-if="data.typeCode === 'role'"
              class="pre-iconfont icon-pre-role"
            ></i>
            <span class="node-label">{{ node.label }}</span>
          </span>
        </el-tree>
        <!-- <div v-else class="none-search-data">
                  <img src="@/assets/none-search-data.png" alt="" />
                  <p>暂无搜索结果</p>
                </div> -->
        <!-- </template> -->
      </div>
      <div class="result-container">
        <div class="result-total">
          已选({{ selectedLength }})
          <span class="clear-btn" @click="clearResult">清空</span>
        </div>
        <ul class="selected-list">
          <li
            class="selected-item clearfix"
            v-for="(item, index) in data.selectedRoleArray"
            :key="item.id"
          >
            <div class="selected-item-icon">角色</div>
            <div class="selected-item-c">
              <p class="name">{{ item.name }}</p>
              <p class="ID">ID:{{ item.id }}</p>
            </div>
            <i
              class="pre-iconfont icon-pre-minus"
              @click="delItem(index, 'role')"
            ></i>
          </li>
          <li
            class="selected-item clearfix"
            v-for="(item, index) in data.selectedOrgArray"
            :key="item.id"
          >
            <div class="selected-item-icon">部门</div>
            <div class="selected-item-c">
              <p class="name">{{ item.name }}</p>
              <p class="ID">ID:{{ item.id }}</p>
            </div>
            <i
              class="pre-iconfont icon-pre-minus"
              @click="delItem(index, 'org')"
            ></i>
          </li>
          <li
            class="selected-item clearfix"
            v-for="(item, index) in data.selectedPersonArray"
            :key="item.id"
          >
            <div class="selected-item-icon">人员</div>
            <div class="selected-item-c">
              <p class="name">{{ item.name }}</p>
              <p class="ID">ID:{{ item.id }}</p>
            </div>
            <i
              class="pre-iconfont icon-pre-minus"
              @click="delItem(index, 'emp')"
            ></i>
          </li>
        </ul>
        <!-- <template
              v-if="
                data &&
                data.selectedRoleArray &&
                data.selectedRoleArray.length > 0
              "
            >
              <p class="title-row">角色：</p>
              <div class="tags-wrapper">
                <p-tag
                  v-for="(tag, tagIndex) in data.selectedRoleArray"
                  :key="tag.id"
                  @close="delItem(tagIndex, 'role')"
                >
                  {{ tag.name }}
                </p-tag>
              </div>
            </template>
            <template
              v-if="
                data &&
                data.selectedOrgArray &&
                data.selectedOrgArray.length > 0
              "
            >
              <p class="title-row">部门：</p>
              <div class="tags-wrapper">
                <p-tag
                  v-for="(tag, tagIndex) in data.selectedOrgArray"
                  :key="tag.id"
                  @close="delItem(tagIndex, 'org')"
                >
                  {{ tag.name }}
                </p-tag>
              </div>
            </template>
            <template
              v-if="
                data &&
                data.selectedPersonArray &&
                data.selectedPersonArray.length > 0
              "
            >
              <p class="title-row">人员：</p>
              <div class="tags-wrapper">
                <p-tag
                  v-for="(tag, tagIndex) in data.selectedPersonArray"
                  :key="tag.id"
                  @close="delItem(tagIndex, 'emp')"
                >
                  {{ tag.name }}</p-tag
                >
              </div>
            </template> -->
      </div>
    </div>
    <div class="base-footer u-button-wrapper" v-if="layoutStyle === 'tb'">
      <span class="u-button button--primary button--small" @click="confirm">
        确定
      </span>
      <span class="u-button button--primary button--small" @click="close">
        取消
      </span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Tree, Input } from "element-ui";

export default {
  name: "PrimetonBaseTree",
  components: {
    [Tree.name]: Tree,
    [Input.name]: Input,
    [Input.name]: Input,
  },
  props: {
    layoutStyle: {
      type: String,
      default: "",
    },
    viewPartyType: {
      type: Array,
      default: () => ["org", "role"],
    },
    // 范围相关配置项
    config: {
      type: Object,
      default: () => {
        return {
          buttonType: "",
          isNotAllowParentChild: true,
          orgScope: "all",
          roleScope: "all",
          selectPartyType: "company,emp,role,org,position",
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
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "isLeaf",
      },
      data: {},
      activeTreeType: "org", // 环节的选中tab数组
      keyword: "",
      isLazy: true,
      treeData: [], // 非懒加载数据
      treeRootNode: null, // 懒加载树的根节点容器（因为有多个流程），用于重置树
      treeRootResolve: null, // 懒加载树根节点的赋值回调容器（因为有多个流程）
    };
  },
  computed: {
    selectedLength() {
      const a = this.data.selectedRoleArray
        ? this.data.selectedRoleArray.length
        : 0;
      const b = this.data.selectedOrgArray
        ? this.data.selectedOrgArray.length
        : 0;
      const c = this.data.selectedPersonArray
        ? this.data.selectedPersonArray.length
        : 0;
      return a + b + c;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 当前节点类型是否可选
    hasAuth(type) {
      return this.config.selectPartyType.split(",").indexOf(type) !== -1;
    },
    // 切换不同类型树（组织树与角色树切换）
    switchTreeType(type) {
      this.activeTreeType = type;
      // 清除检索条件，并切换为懒加载树
      this.resetAllTree();
      // this.$set(this.activeTreeType, type);
      if (this.treeRootNode) {
        this.treeRootNode.childNodes = []; //把存起来的node的子节点清空，不然会界面会出现重复树
        this.loadNode(this.treeRootNode, this.treeRootResolve); //再次执行懒加载的方法
      }
    },
    // 懒加载
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.treeRootNode = node;
        this.treeRootResolve = resolve;
        // 加载根数据
        // 判断父组件是否实现该事件
        if (this.$listeners["loadTreeRootData"]) {
          this.$emit(
            "loadTreeRootData",
            this.activeTreeType,
            this.config,
            (root) => {
              if (root) {
                this.treeData = root;
                this.$nextTick(() => {
                  // 返回数据为两层，默认展开显示两层数据
                  const childNodes = node.childNodes[0];
                  childNodes.expanded = true;
                  childNodes.loadData();
                });
                return resolve(root);
              } else {
                console.log(root, "****************");
              }
            }
          );
        } else {
          axios({
            headers: {
              "X-EOS-SourceSysKey": "07c89ccc326c491fb30b9e395b9ea814",
              Authorization: localStorage.getItem("uniqueId"),
            },
            method: "post",
            url: "/org/gocom/comm/bfp/store/om/query-root-participants-tree-by-scope",
            data: {
              typeCode: this.activeTreeType,
              scope: this.config.orgScope,
              fixedValue: "",
            },
          })
            .then(function (res) {
              return resolve(res.data.data || []);
            })
            .catch(() => {
              return resolve([]);
            });
        }
      } else {
        // 加载子数据
        if (this.$listeners["loadTreeChildrenData"]) {
          this.$emit(
            "loadTreeChildrenData",
            node,
            this.activeTreeType,
            this.config,
            (children) => {
              return resolve(children);
            }
          );
        } else {
          axios({
            headers: {
              "X-EOS-SourceSysKey": "07c89ccc326c491fb30b9e395b9ea814",
              Authorization: localStorage.getItem("uniqueId"),
            },
            method: "post",
            url: "/org/gocom/comm/bfp/store/om/query-all-child-participants-tree",
            data: {
              typeCode: this.activeTreeType,
              participantID: node.data.id,
            },
          })
            .then(function (res) {
              return resolve(res.data.data || []);
            })
            .catch(() => {
              return resolve([]);
            });
        }
      }
    },
    // 判断父节点是否已选
    parentIsSelected(parent, data) {
      if (!parent || !parent.data || !parent.data.id) {
        return false;
      }
      const pIndex = data.findIndex((item) => item.id === parent.data.id);
      if (pIndex !== -1) {
        // 父元素已选择，不可选
        this.$showMessage({
          type: "warning",
          text: "父节点已选择！",
        });
        return true;
      } else {
        return this.parentIsSelected(parent.parent, data);
      }
    },
    // 判断字典点是否已选
    childIsSelected(child, data) {
      if (!child || !child.length > 0) {
        return false;
      }
      let isTrue = false;
      for (let i = 0; i < child.length; i++) {
        const cIndex = data.findIndex((item) => item.id === child[i].data.id);
        if (cIndex !== -1) {
          // 父元素已选择，不可选
          this.$showMessage({
            type: "warning",
            text: "子节点已选择！",
          });
          isTrue = true;
        }
      }
      if (isTrue) {
        return true;
      } else {
        for (let i = 0; i < child.length; i++) {
          return this.childIsSelected(child[i].childNodes, data);
        }
      }
    },
    // 节点点击事件，根据节点类型放入不同的环节中的相应类型容器
    handleNodeClick(data, Node) {
      if (!this.hasAuth(data.typeCode)) {
        return;
      }
      if (!this.data["selectedOrgArray"]) {
        this.$set(this.data, "selectedOrgArray", []);
      }
      if (!this.data["selectedPersonArray"]) {
        this.$set(this.data, "selectedPersonArray", []);
      }
      if (!this.data["selectedRoleArray"]) {
        this.$set(this.data, "selectedRoleArray", []);
      }
      const allSelectedArr = [
        ...this.data.selectedOrgArray,
        ...this.data.selectedPersonArray,
        ...this.data.selectedRoleArray,
      ];
      if (data.typeCode === "org" || data.typeCode === "company") {
        // 选择部门
        const index = this.data.selectedOrgArray.findIndex(
          (item) => item.id == data.id
        );
        if (index !== -1) {
          this.data.selectedOrgArray.splice(index, 1);
        } else {
          // 父子节点不可同时选择处理
          if (this.config.isNotAllowParentChild) {
            if (
              this.parentIsSelected(Node.parent, allSelectedArr) ||
              this.childIsSelected(Node.childNodes, allSelectedArr)
            ) {
              return false;
            }
          }
          this.data.selectedOrgArray.push(data);
        }
      } else if (data.typeCode === "emp") {
        // 选择人员
        const index = this.data.selectedPersonArray.findIndex(
          (item) => item.id === data.id
        );
        if (index !== -1) {
          this.data.selectedPersonArray.splice(index, 1);
        } else {
          // 父子节点不可同时选择处理
          if (this.config.isNotAllowParentChild) {
            if (
              this.parentIsSelected(Node.parent, allSelectedArr) ||
              this.childIsSelected(Node.childNodes, allSelectedArr)
            ) {
              return false;
            }
          }
          this.data.selectedPersonArray.push(data);
        }
      } else if (data.typeCode === "role") {
        // 选择角色
        const index = this.data.selectedRoleArray.findIndex(
          (item) => item.id === data.id
        );
        if (index !== -1) {
          this.data.selectedRoleArray.splice(index, 1);
        } else {
          // 父子节点不可同时选择处理
          if (this.config.isNotAllowParentChild) {
            if (
              this.parentIsSelected(Node.parent, allSelectedArr) ||
              this.childIsSelected(Node.childNodes, allSelectedArr)
            ) {
              return false;
            }
          }
          this.data.selectedRoleArray.push(data);
        }
      }
      console.log("🚀 🚀 🚀 🚀 🚀 11111🚀 🚀 ", this.data);
    },
    // 删除已选节点，删除对应环节中对应类型的数据
    delItem(index, type) {
      if (type === "org" || type === "company") {
        this.data.selectedOrgArray.splice(index, 1);
      } else if (type === "emp") {
        this.data.selectedPersonArray.splice(index, 1);
      } else if (type === "role") {
        this.data.selectedRoleArray.splice(index, 1);
      }
    },
    // 确认提交事件，格式化已选节点数据并抛出
    confirm() {
      const obj = {
        id: "id", // 活动定义ID
        isAppoint: false, // 是否指派活动（是否选环节），只选人为false，选环节选人为true
        appointedParticipants: { ...this.data },
      };
      if (obj.appointedParticipants.length > 0) {
        // 未选取任何数据，弹窗提醒
        this.$showMessage({
          text: "未选择任何人员或组织、角色等！",
          type: "error",
        });
        return false;
      }
      // 关闭弹窗的回调
      this.$emit("confirm", obj, () => {
        this.close();
      });
    },
    close() {
      this.clearResult();
      this.$emit("close");
    },
    // 清空所有选中节点数据
    clearResult() {
      if (this.data) {
        this.$set(this.data, "selectedOrgArray", []);
        this.$set(this.data, "selectedPersonArray", []);
        this.$set(this.data, "selectedRoleArray", []);
      }
    },
    // 环节折叠面板展开事件
    resetAllTree() {
      // 清空其他环节相关数据
      this.keyword = "";
      this.isLazy = true;
      this.treeData = [];
    },
    // 关键词检索，获取数据后根据回调渲染无懒加载的新树
    search() {
      if (this.keyword === "") {
        this.resetAllTree();
      } else {
        this.treeRootNode = null;
        this.treeRootResolve = null;
        if (this.$listeners["filter"]) {
          this.$emit(
            "filter",
            this.keyword,
            this.activeTreeType,
            this.config,
            (data) => {
              this.isLazy = false;
              this.treeData = data;
            }
          );
        } else {
          axios({
            headers: {
              "X-EOS-SourceSysKey": "07c89ccc326c491fb30b9e395b9ea814",
              Authorization: localStorage.getItem("uniqueId"),
            },
            method: "post",
            url: "/org/gocom/comm/bfp/store/om/query-participants-tree-by-scope-and-name",
            data: {
              typeCode: this.activeTreeType,
              participantName: this.keyword,
              scope: this.config.orgScope,
              fixedValue: "",
            },
          })
            .then(function (res) {
              this.isLazy = false;
              this.treeData = res.data.data;
            })
            .catch(() => {
              this.isLazy = false;
              this.treeData = [];
            });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  box-sizing: border-box;

  .simple-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    background: #fff;
    border: 1px solid #d2d9e6;
  }

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

  .tree-container {
    width: 50%;
    box-sizing: border-box;

    .icon-pre-wenjianjia {
      color: #70bffd;
    }

    .icon-pre-org {
      color: #ffc800;
    }

    .icon-pre-staff {
      color: #cfae80;
    }

    .icon-pre-role {
      color: #70bffd;
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
        line-height: 22px;
        box-sizing: border-box;
        cursor: pointer;
        z-index: 1;

        .icon-pre-search {
          font-size: 15px;
          display: inline-block;
          vertical-align: middle;
        }
        span {
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

    ::v-deep .el-tree {
      height: 190px;
      overflow: auto;
    }

    .none-search-data {
      margin: 20px 0 0 0;
      text-align: center;

      img {
        display: block;
        width: 80px;
        margin: 0 auto;
      }

      p {
        margin: 5px 0 0 0;
        font-size: 12px;
        color: #999;
      }
    }
  }

  .result-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    padding: 10px;
    border-left: 1px solid #d2d9e6;
    text-align: left;
    box-sizing: border-box;
    overflow-y: auto;

    .result-total {
      font-size: 16px;
      font-weight: 500;
      color: #000412;

      .clear-btn {
        display: inline-block;
        vertical-align: baseline;
        margin-left: 5px;
        padding: 0 7px;
        height: 20;
        line-height: 18px;
        font-size: 12px;
        font-weight: 400;
        color: #575b5d;
        border: 1px solid #dedede;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          color: #409eff;
          border-color: #409eff;
        }

        &:hover {
          color: #409eff;
          border-color: #409eff;
        }
      }
    }

    .selected-list {
      margin: 0;
      box-sizing: border-box;
      .selected-item {
        position: relative;
        padding: 10px 0 6px 5px;
        border-bottom: 1px dashed #d7dae2;

        &-icon {
          float: left;
          width: 36px;
          height: 36px;
          font-size: 14px;
          font-weight: 400;
          color: #378af7;
          background: #ebf3fe;
          border: 1px solid #c6deff;
          border-radius: 4px;
          line-height: 36px;
          text-align: center;
        }
        &-c {
          float: left;
          height: 100%;
          width: calc(100% - 70px);
          margin-left: 10px;
          text-align: left;
          .name {
            font-size: 16px;
            font-weight: 400;
            color: #131313;
            line-height: 20px;
          }
          .ID {
            margin-top: 3px;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 20px;
          }
        }
        .icon-pre-minus {
          position: absolute;
          top: 20px;
          right: 2px;
          color: #b5b9c4;
          cursor: pointer;
          transition: color 0.3s;

          &:hover {
            color: #f66e6b;
          }
        }
      }
    }

    .title-row {
      margin: 5px 0;
      font-size: 14px;
    }

    .tags-wrapper {
      min-height: 26px;
    }
  }

  .custom-tree-node {
    font-size: 14px;

    .pre-iconfont {
      margin-right: 5px;
    }

    &.disabled {
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
  &.tb {
    height: 100%;
    width: 100%;
    .simple-wrapper {
      height: calc(100% - 92px);
      padding: 10px 0;
      .tree-container {
        height: 100%;
        overflow: auto;
        ::v-deep .el-tree {
          height: auto;
        }
      }
    }

    .search-bar {
      position: relative;
      width: 100%;
      padding: 8px 10px;
      box-sizing: border-box;
      border: 1px solid #d2d9e6;
      border-bottom: none;

      .input-wrapper {
        float: left;
        width: calc(50% - 15px);
        margin-left: 15px;

        ::v-deep .el-input__inner {
          padding-right: 60px;
          background: #f8f9fe;
        }

        .search-text-btn {
          position: absolute;
          top: 10.5px;
          right: 20px;
          font-size: 12px;
          font-weight: 500;
          color: #599af6;
          line-height: 22px;
          box-sizing: border-box;
          cursor: pointer;
          z-index: 1;

          .icon-pre-search {
            font-size: 15px;
            display: inline-block;
            vertical-align: middle;
          }
          span {
            display: inline-block;
            vertical-align: middle;
          }

          &:hover {
            color: darken(#599af6, 20%);
          }
        }
      }

      .search-type {
        float: left;
        width: 50%;
        font-size: 12px;
        font-weight: 500;
        color: #747677;
        text-align: left;

        span {
          position: relative;
          line-height: 28px;
          display: inline-block;
          margin-left: 10px;
          padding: 0 10px;
          font-size: 16px;
          cursor: pointer;

          &:nth-of-type(1) {
            margin-left: 0;
          }

          &:hover,
          &.active {
            color: #378af7;
          }
          &.active {
            &::before {
              position: absolute;
              bottom: -8px;
              left: 0;
              content: "";
              width: 100%;
              height: 3px;
              background-color: #378af7;
            }
          }
        }
      }
    }
  }
}

.u-button-wrapper {
  padding: 10px 0;
  text-align: center;
  user-select: none;

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
    margin-left: 20px;
    &:nth-of-type(1) {
      margin-left: 0;
    }

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
  ul {
    height: auto;
    margin: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
    padding-inline-start: 0;
    li {
      display: block;
      text-align: left;
    }
  }
  p {
    margin: 0;
  }
}
</style>
