<template>
  <div class="u-button-wrapper">
    <!-- <span :class="['u-button', size ? `button--${size}` : '', type ? `button--${type}` : '']" @click="handlerOnclick"> -->
    <slot />
    <!-- </span> -->
    <PrimetonDialog
      :visible.sync="dialogVisible"
      :title="title"
      :width="500"
      none-mark
      @close="close"
    >
      <PrimetonBaseTree ref="base-tree" v-bind="$attrs" v-on="$listeners" />
      <div slot="footer" class="footer">
        <span class="u-button button--primary button--small" @click="confirm">
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
import { Tree, Input } from "element-ui";
// import pTag from "../PrimetonTag";
import PrimetonDialog from "../PrimetonDialog";
import PrimetonBaseTree from "../PrimetonBaseTree";
import { on, off } from "@/utils/dom.js";

export default {
  name: "PrimetonSelectPerson",
  components: {
    PrimetonDialog,
    PrimetonBaseTree,
    // pTag,
    [Tree.name]: Tree,
    [Input.name]: Input,
    [Input.name]: Input,
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
    },
    // 选人事件
    confirm() {
      this.$refs["base-tree"].confirm();
    },
    // 弹窗关闭事件，
    close() {
      this.dialogVisible = false;
      // 清空已选节点数据
      this.$refs["base-tree"].data = {};
      this.$refs["base-tree"].collapseRadio = [];
      this.$emit("close");
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
