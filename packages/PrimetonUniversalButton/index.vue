<template>
  <div class="u-button-wrapper">
    <!-- <span :class="['u-button', size ? `button--${size}` : '', type ? `button--${type}` : '']" @click="handlerOnclick"> -->
    <slot />
    <!-- </span> -->
    <PrimetonDialog
      :visible.sync="dialogVisible"
      :title="title"
      :width="type === 'select_act' ? 500 : 650"
      @close="close"
    >
      <div class="content clearfix">
        <el-collapse
          v-if="type === 'act_select_party' || type === 'select_act_party'"
          v-model="activeCollapse"
          accordion
          @change="collapseOnChange"
        >
          <el-collapse-item
            v-for="(item, index) in auditLinks"
            :key="item.id"
            :name="index"
            :class="
              collapseRadio.indexOf(index) !== -1 && 'collapse-item__active'
            "
          >
            <template slot="title">
              <span class="title-icon" v-if="type === 'act_select_party'">
                <i class="pre-iconfont icon-pre-process"></i>
              </span>
              <span
                v-else
                class="collapse-radio"
                @click.stop="collapseRadioOnclick(index)"
              ></span>
              <label class="collapse-item-status-label">
                <i class="collapse-item-check el-icon-check"></i>
              </label>
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
                  @keyup.enter.native="search"
                ></el-input>
                <span class="search-text-btn" @click="search">
                  <i class="pre-iconfont icon-pre-search"></i> 查询
                </span>
                <div class="search-type">
                  <span
                    v-for="(type, tindex) in viewPartyType"
                    :key="tindex"
                    :class="type === activeTreeType[index] && 'active'"
                    @click="switchTreeType(type, index)"
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
                <span
                  :class="[
                    'custom-tree-node',
                    !hasAuth(data.typeCode) && 'disabled',
                  ]"
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
                :key="'tree' + index"
                :ref="'tree' + index"
                :props="defaultProps"
                :data="treeData"
                highlight-current
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              >
                <span
                  :class="[
                    'custom-tree-node',
                    !hasAuth(data.typeCode) && 'disabled',
                  ]"
                  :key="'node-' + index"
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
                已选（{{ selectedLength }}）
                <span class="clear-btn" @click="clearResult(index)">清空</span>
              </div>
              <ul class="selected-list">
                <template
                  v-if="
                    data[index] &&
                    data[index].selectedRoleArray &&
                    data[index].selectedRoleArray.length > 0
                  "
                >
                  <li
                    class="selected-item clearfix"
                    v-for="item in data[index].selectedRoleArray"
                    :key="item.id"
                  >
                    <div class="selected-item-icon">角色</div>
                    <div class="selected-item-c">
                      <p class="name">{{ item.name }}</p>
                      <p class="ID">ID:{{ item.id }}</p>
                    </div>
                    <i
                      class="pre-iconfont icon-pre-minus"
                      @click="delItem(tagIndex, 'role')"
                    ></i>
                  </li>
                </template>
                <template
                  v-if="
                    data[index] &&
                    data[index].selectedOrgArray &&
                    data[index].selectedOrgArray.length > 0
                  "
                >
                  <li
                    class="selected-item clearfix"
                    v-for="item in data[index].selectedOrgArray"
                    :key="item.id"
                  >
                    <div class="selected-item-icon">部门</div>
                    <div class="selected-item-c">
                      <p class="name">{{ item.name }}</p>
                      <p class="ID">ID:{{ item.id }}</p>
                    </div>
                    <i
                      class="pre-iconfont icon-pre-minus"
                      @click="delItem(tagIndex, 'org')"
                    ></i>
                  </li>
                </template>
                <template
                  v-if="
                    data[index] &&
                    data[index].selectedPersonArray &&
                    data[index].selectedPersonArray.length > 0
                  "
                >
                  <li
                    class="selected-item clearfix"
                    v-for="item in data[index].selectedPersonArray"
                    :key="item.id"
                  >
                    <div class="selected-item-icon">人员</div>
                    <div class="selected-item-c">
                      <p class="name">{{ item.name }}</p>
                      <p class="ID">ID:{{ item.id }}</p>
                    </div>
                    <i
                      class="pre-iconfont icon-pre-minus"
                      @click="delItem(tagIndex, 'emp')"
                    ></i>
                  </li>
                </template>
              </ul>
              <!-- <div class="result-total">
                选中
                <span class="clear-btn" @click="clearResult(index)">清空</span>
              </div>
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
                    v-for="(tag, tagIndex) in data[index].selectedRoleArray"
                    :key="tag.id"
                    @close="delItem(tagIndex, 'role')"
                  >
                    {{ tag.name }}
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
                    v-for="(tag, tagIndex) in data[index].selectedOrgArray"
                    :key="tag.id"
                    @close="delItem(tagIndex, 'org')"
                  >
                    {{ tag.name }}
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
                    v-for="(tag, tagIndex) in data[index].selectedPersonArray"
                    :key="tag.id"
                    @close="delItem(tagIndex, 'emp')"
                  >
                    {{ tag.name }}</p-tag
                  >
                </div>
              </template> -->
            </div>
          </el-collapse-item>
        </el-collapse>
        <!--选择后续环节-->
        <PrimetonProcessList
          v-model="selectionProcessData"
          :list-data="auditLinks"
          v-else-if="type === 'select_act'"
        />
        <div v-else class="simple-wrapper clearfix">
          <div class="tree-container">
            <div class="search-bar">
              <el-input
                v-model="keyword"
                placeholder="请输入关键字"
                size="mini"
                @keyup.enter.native="search"
              ></el-input>
              <span class="search-text-btn" @click="search">
                <i class="pre-iconfont icon-pre-search"></i> 查询
              </span>
              <div class="search-type">
                <span
                  v-for="(type, tindex) in viewPartyType"
                  :key="tindex"
                  :class="type === activeTreeType[0] && 'active'"
                  @click="switchTreeType(type, 0)"
                >
                  {{ type === "org" ? "机构树" : "角色树" }}
                </span>
              </div>
            </div>
            <el-tree
              v-if="isLazy"
              :ref="'lazy-tree' + 0"
              :key="'lazy-tree' + 0"
              :props="defaultProps"
              :load="loadNode"
              lazy
              node-key="id"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <span
                :class="[
                  'custom-tree-node',
                  !hasAuth(data.typeCode) && 'disabled',
                ]"
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
              :key="'tree' + 0"
              :ref="'tree' + 0"
              :props="defaultProps"
              :data="treeData"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <span
                :class="[
                  'custom-tree-node',
                  !hasAuth(data.typeCode) && 'disabled',
                ]"
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
              已选（{{ selectedLength }}）
              <span class="clear-btn" @click="clearResult(0)">清空</span>
            </div>
            <ul class="selected-list">
              <template
                v-if="
                  data[0] &&
                  data[0].selectedRoleArray &&
                  data[0].selectedRoleArray.length > 0
                "
              >
                <li
                  class="selected-item clearfix"
                  v-for="item in data[0].selectedRoleArray"
                  :key="item.id"
                >
                  <div class="selected-item-icon">角色</div>
                  <div class="selected-item-c">
                    <p class="name">{{ item.name }}</p>
                    <p class="ID">ID:{{ item.id }}</p>
                  </div>
                  <i
                    class="pre-iconfont icon-pre-minus"
                    @click="delItem(tagIndex, 'role')"
                  ></i>
                </li>
              </template>
              <template
                v-if="
                  data[0] &&
                  data[0].selectedOrgArray &&
                  data[0].selectedOrgArray.length > 0
                "
              >
                <li
                  class="selected-item clearfix"
                  v-for="item in data[0].selectedOrgArray"
                  :key="item.id"
                >
                  <div class="selected-item-icon">部门</div>
                  <div class="selected-item-c">
                    <p class="name">{{ item.name }}</p>
                    <p class="ID">ID:{{ item.id }}</p>
                  </div>
                  <i
                    class="pre-iconfont icon-pre-minus"
                    @click="delItem(tagIndex, 'org')"
                  ></i>
                </li>
              </template>
              <template
                v-if="
                  data[0] &&
                  data[0].selectedPersonArray &&
                  data[0].selectedPersonArray.length > 0
                "
              >
                <li
                  class="selected-item clearfix"
                  v-for="item in data[0].selectedPersonArray"
                  :key="item.id"
                >
                  <div class="selected-item-icon">人员</div>
                  <div class="selected-item-c">
                    <p class="name">{{ item.name }}</p>
                    <p class="ID">ID:{{ item.id }}</p>
                  </div>
                  <i
                    class="pre-iconfont icon-pre-minus"
                    @click="delItem(tagIndex, 'emp')"
                  ></i>
                </li>
              </template>
            </ul>
            <!-- <div class="result-total">
              选中
              <span class="clear-btn" @click="clearResult(0)">清空</span>
            </div>
            <template
              v-if="
                data[0] &&
                data[0].selectedRoleArray &&
                data[0].selectedRoleArray.length > 0
              "
            >
              <p class="title-row">角色：</p>
              <div class="tags-wrapper">
                <p-tag
                  v-for="(tag, tagIndex) in data[0].selectedRoleArray"
                  :key="tag.id"
                  @close="delItem(tagIndex, 'role')"
                >
                  {{ tag.name }}
                </p-tag>
              </div>
            </template>
            <template
              v-if="
                data[0] &&
                data[0].selectedOrgArray &&
                data[0].selectedOrgArray.length > 0
              "
            >
              <p class="title-row">部门：</p>
              <div class="tags-wrapper">
                <p-tag
                  v-for="(tag, tagIndex) in data[0].selectedOrgArray"
                  :key="tag.id"
                  @close="delItem(tagIndex, 'org')"
                >
                  {{ tag.name }}
                </p-tag>
              </div>
            </template>
            <template
              v-if="
                data[0] &&
                data[0].selectedPersonArray &&
                data[0].selectedPersonArray.length > 0
              "
            >
              <p class="title-row">人员：</p>
              <div class="tags-wrapper">
                <p-tag
                  v-for="(tag, tagIndex) in data[0].selectedPersonArray"
                  :key="tag.id"
                  @close="delItem(tagIndex, 'emp')"
                >
                  {{ tag.name }}</p-tag
                >
              </div>
            </template> -->
          </div>
        </div>
      </div>
      <div slot="footer" class="footer">
        <span class="u-button button--primary button--small" @click="comfirm">
          确定
        </span>
        <span class="u-button button--primary button--small" @click="close"
          >取消</span
        >
      </div>
    </PrimetonDialog>
  </div>
</template>

<script>
import { Tree, Collapse, CollapseItem, Input } from "element-ui";
// import pTag from "../PrimetonTag";
import PrimetonDialog from "../PrimetonDialog";
import PrimetonProcessList from "../PrimetonProcessList";
import { on, off } from "@/utils/dom.js";

export default {
  name: "PrimetonUniversalButton",
  components: {
    PrimetonDialog,
    PrimetonProcessList,
    // pTag,
    [Tree.name]: Tree,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Input.name]: Input,
    [Input.name]: Input,
  },
  props: {
    title: {
      type: String,
      default: "标题",
    },
    type: {
      type: String,
      default: "act_select_party",
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
    beforeOpen: {
      type: Function,
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
      slotNode: null, // 插槽节点
      auditLinks: [], // 环节数据
      // [
      //   {
      //     id: "manualActivity4",
      //     name: "财务审批",
      //     participants: [
      //       {
      //         id: "1021",
      //         name: "部门经理",
      //         typeCode: "role",
      //       },
      //       {
      //         id: "41",
      //         name: "开发部",
      //         typeCode: "org",
      //       },
      //     ],
      //   },
      //   {
      //     id: "leaderActivity4",
      //     name: "领导审批",
      //     participants: [
      //       {
      //         id: "1021",
      //         name: "部门经理",
      //         typeCode: "role",
      //       },
      //       {
      //         id: "41",
      //         name: "开发部",
      //         typeCode: "org",
      //       },
      //     ],
      //   },
      // ],
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "isLeaf",
      },
      activeCollapse: 0, // 当前展开或选中的流程
      data: [],
      activeTreeType: [], // 环节的选中tab数组
      keyword: "",
      isLazy: true,
      treeData: [], // 非懒加载数据
      treeRootNodes: [], // 懒加载树的根节点容器（因为有多个流程），用于重置树
      treeRootResolve: [], // 懒加载树根节点的赋值回调容器（因为有多个流程）
      collapseRadio: [], // 选流程选人中被选中的流程Index

      selectionProcessData: [], // 环节选择--已选的环节id
    };
  },
  computed: {
    selectedLength() {
      const a =
        this.data[this.activeCollapse] &&
        this.data[this.activeCollapse].selectedRoleArray
          ? this.data[this.activeCollapse].selectedRoleArray.length
          : 0;
      const b =
        this.data[this.activeCollapse] &&
        this.data[this.activeCollapse].selectedOrgArray
          ? this.data[this.activeCollapse].selectedOrgArray.length
          : 0;
      const c =
        this.data[this.activeCollapse] &&
        this.data[this.activeCollapse].selectedPersonArray
          ? this.data[this.activeCollapse].selectedPersonArray.length
          : 0;
      return a + b + c;
    },
  },
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
    // 当前节点类型是否可选
    hasAuth(type) {
      return this.config.selectPartyType.split(",").indexOf(type) !== -1;
    },
    // 切换不同类型树（组织树与角色树切换）
    switchTreeType(type, index) {
      // this.activeTreeType[index] = type;
      // 清除检索条件，并切换为懒加载树
      this.collapseOnChange();
      this.$set(this.activeTreeType, index, type);
      console.log(
        "🚀 ~ file: index.vue ~ line 548 ~ switchTreeType ~ this.treeRootNode",
        this.treeRootNode
      );
      if (this.treeRootNodes[index]) {
        this.treeRootNodes[index].childNodes = []; //把存起来的node的子节点清空，不然会界面会出现重复树
        this.loadNode(this.treeRootNodes[index], this.treeRootResolve[index]); //再次执行懒加载的方法
      }
    },
    // 懒加载
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.treeRootNodes[this.treeRootNodes.length] = node;
        this.treeRootResolve[this.treeRootResolve.length] = resolve;
        // 加载根数据
        this.$emit(
          "loadTreeRootData",
          this.activeTreeType[this.activeCollapse],
          this.config,
          (root) => {
            this.treeData = root;
            this.$nextTick(() => {
              // 返回数据为两层，默认展开显示两层数据
              const childNodes = node.childNodes[0];
              childNodes.expanded = true;
              childNodes.loadData();
            });
            return resolve(root);
          }
        );
      } else {
        // 加载子数据
        this.$emit(
          "loadTreeChildrenData",
          node,
          this.activeTreeType[this.activeCollapse],
          this.config,
          (children) => {
            return resolve(children);
          }
        );
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
      const allSelectedArr = [
        ...this.data[this.activeCollapse].selectedOrgArray,
        ...this.data[this.activeCollapse].selectedPersonArray,
        ...this.data[this.activeCollapse].selectedRoleArray,
      ];
      if (data.typeCode === "org" || data.typeCode === "company") {
        // 选择部门
        const index = this.data[this.activeCollapse].selectedOrgArray.findIndex(
          (item) => item.id == data.id
        );
        if (index !== -1) {
          this.data[this.activeCollapse].selectedOrgArray.splice(index, 1);
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
          this.data[this.activeCollapse].selectedOrgArray.push(data);
        }
      } else if (data.typeCode === "emp") {
        // 选择人员
        const index = this.data[
          this.activeCollapse
        ].selectedPersonArray.findIndex((item) => item.id === data.id);
        if (index !== -1) {
          this.data[this.activeCollapse].selectedPersonArray.splice(index, 1);
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
          this.data[this.activeCollapse].selectedPersonArray.push(data);
        }
      } else if (data.typeCode === "role") {
        // 选择角色
        const index = this.data[
          this.activeCollapse
        ].selectedRoleArray.findIndex((item) => item.id === data.id);
        if (index !== -1) {
          this.data[this.activeCollapse].selectedRoleArray.splice(index, 1);
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
          this.data[this.activeCollapse].selectedRoleArray.push(data);
        }
      }
    },
    // 删除已选节点，删除对应环节中对应类型的数据
    delItem(index, type) {
      if (type === "org" || type === "company") {
        this.data[this.activeCollapse].selectedOrgArray.splice(index, 1);
      } else if (type === "emp") {
        this.data[this.activeCollapse].selectedPersonArray.splice(index, 1);
      } else if (type === "role") {
        this.data[this.activeCollapse].selectedRoleArray.splice(index, 1);
      }
    },
    // 弹窗打开事件
    open() {
      this.dialogVisible = true;
      // 获取环节数据
      if (this.type === "只选人") {
        console.log("只选人************************");
      } else {
        this.$emit("loadLinks", (auditLinks) => {
          if (!auditLinks || !auditLinks.length > 0) {
            // 无环节数据，弹窗提醒
            this.$showMessage({
              text: "无环节数据！",
              type: "error",
            });
            this.dialogVisible = false;
            return false;
          }
          this.auditLinks = auditLinks;
          // 设置每个环节的默认展示树类型，默认为组织树
          this.auditLinks.forEach(() => {
            this.activeTreeType.push("org");
          });
        });
      }
    },
    // 弹窗关闭事件，
    close() {
      this.dialogVisible = false;
      // 清空已选节点数据
      this.data = [];
      this.collapseRadio = [];
      this.$emit("close");
    },
    // 确认提交事件，格式化已选节点数据并抛出
    comfirm() {
      // isNull：是否有选取的数据
      let isNull = true;
      let allData = [...this.data];
      if (this.type === "select_act_party") {
        // 选环节并选人
        if (!this.collapseRadio.length > 0) {
          this.$showMessage({
            text: "未选择任何流程环节！",
            type: "error",
          });
          return false;
        } else {
          allData = allData.filter(
            (val, index) => this.collapseRadio.indexOf(index) !== -1
          );
        }
      } else if (this.type === "select_act") {
        // 选环节--单独处理事件
        if (!this.selectionProcessData.length > 0) {
          return false;
        } else {
          // 接口需要的数据格式处理
          // const arr = this.selectionProcessData.map((item) => ({ id: item }));
          // 确认并抛出已选环节ID数组
          this.$emit("confirm", this.selectionProcessData, () => {
            this.close();
          });
          return this.selectionProcessData;
        }
      }
      let data = allData.map((item, index) => {
        const obj = {
          id: this.auditLinks[index].id, // 活动定义ID
          isAppoint: this.type !== "act_select_party", // 是否指派活动（是否选环节），只选人为false，选环节选人为true
          appointedParticipants: [
            ...item.selectedOrgArray,
            ...item.selectedPersonArray,
            ...item.selectedRoleArray,
          ],
        };
        if (obj.appointedParticipants.length > 0) {
          isNull = false;
        }
        return obj;
      });
      if (isNull) {
        // 未选取任何数据，弹窗提醒
        this.$showMessage({
          text: "未选择任何人员或组织、角色等！",
          type: "error",
        });
        return false;
      }
      if (this.type === "select_party") {
        // 只选人,去掉环节数据
        data = data[0];
      }
      // 关闭弹窗的回调
      this.$emit("confirm", data, () => {
        this.close();
      });
      // this.close();
    },
    // 清空所有选中节点数据
    clearResult(index) {
      if (this.data[index]) {
        this.$set(this.data[index], "selectedOrgArray", []);
        this.$set(this.data[index], "selectedPersonArray", []);
        this.$set(this.data[index], "selectedRoleArray", []);
      }
    },
    // 环节收起时，环节头部显示已选节点数据
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
              .map((item) => item.name)
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
              .map((item) => item.name)
              .join("、") +
            "。";
        }
        if (
          this.data[index].selectedRoleArray &&
          this.data[index].selectedRoleArray.length > 0
        ) {
          label +=
            "角色：" +
            this.data[index].selectedRoleArray
              .map((item) => item.name)
              .join("、") +
            "。";
        }
        return label;
      }
    },
    // 环节折叠面板展开事件
    collapseOnChange(val) {
      console.log(
        "🚀 ~ file: index.vue ~ line 549 ~ collapseOnChange ~ val",
        val
      );
      // if (val !== "" && this.type === "select_act_party") {
      //   // 选环节选人时，单选时设置选中状态
      //   this.collapseRadio = val;
      // }
      // 清空其他环节相关数据
      this.keyword = "";
      this.isLazy = true;
      this.treeData = [];
    },
    // 关键词检索，获取数据后根据回调渲染无懒加载的新树
    search() {
      if (this.keyword === "") {
        this.collapseOnChange();
      } else {
        this.treeRootNodes = [];
        this.treeRootResolve = [];
        this.$emit(
          "filter",
          this.keyword,
          this.activeTreeType[this.activeCollapse],
          this.config,
          (data) => {
            this.isLazy = false;
            this.treeData = data;
          }
        );
      }
    },
    // 选环节选人--设置选中环节的状态
    collapseRadioOnclick(index) {
      const cindex = this.collapseRadio.indexOf(index);
      if (cindex !== -1) {
        this.collapseRadio.splice(cindex, 1);
      } else {
        this.collapseRadio.push(index);
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

  ::v-deep .el-collapse {
    border: none;

    .el-collapse-item {
      border: 1px solid #d2d9e6;
      border-radius: 5px;
      margin-bottom: 20px;
      overflow: hidden;

      .el-collapse-item__header {
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

        .collapse-item-status-label {
          display: none;
        }
      }

      .collapse-radio {
        display: inline-block;
        vertical-align: middle;
        margin-right: 15px;
        width: 14px;
        height: 14px;
        border: 1px solid #d1d1d1;
        border-radius: 50%;
        transition: all 0.3s;
        cursor: pointer;
        box-sizing: content-box;

        // &::before {
        //   width: 8px;
        //   height: 8px;
        //   background: #ffffff;
        // }

        // &.active {
        //   width: 8px;
        //   height: 8px;
        //   background: #ffffff;
        //   border: 4px solid #378af7;

        //   // &::before {
        //   //   border: 1px solid #979797;
        //   // }
        // }
      }

      .el-radio {
        margin-right: 15px;
        &__label {
          display: none;
        }
      }

      &.collapse-item__active {
        border-color: #378af7;
        .el-collapse-item__header {
          position: relative;
          .collapse-item-status-label {
            display: block;
            position: absolute;
            right: -16px;
            top: -12px;
            width: 46px;
            height: 26px;
            background: #378af7;
            text-align: center;
            transform: rotate(35deg);
            box-shadow: 0 1px 1px #ccc;

            .collapse-item-check {
              font-size: 16px;
              font-weight: 500;
              color: #fff;
              transform: rotate(-30deg) translate(3px, -3px);
            }
          }
          .collapse-radio {
            width: 8px;
            height: 8px;
            background: #ffffff;
            border: 4px solid #378af7;
          }
        }
      }
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
    float: left;
    width: 50%;
    height: 270px;
    padding: 5px 10px;
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
        vertical-align: text-top;
        margin-left: 5px;
        padding: 0 7px;
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

  .simple-wrapper {
    width: 100%;
    height: 100%;
    padding: 10px 0;
    background: #fff;
    border: 1px solid #d2d9e6;
  }
}
</style>
<style lang="scss">
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
</style>
