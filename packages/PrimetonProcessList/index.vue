<template>
  <div class="primeton-process-list">
    <el-collapse v-model="activeCollapse" accordion @change="collapseOnChange">
      <el-collapse-item
        v-for="(value, key, index) in listData"
        :key="index"
        :name="index"
        :class="activeCollapseRadio == value[0].id && 'collapse-item__active'"
      >
        <template slot="title">
          <span
            class="collapse-radio"
            @click.stop="collapseRadioOnclick(index, key, value)"
          ></span>
          <label class="collapse-item-status-label">
            <i class="collapse-item-check el-icon-check"></i>
          </label>
          <span class="title">{{ key }}</span>
        </template>
        <div class="primeton-process-list-container">
          <div class="time-line" v-for="item in value" :key="item.id">
            <span class="line-node"></span>
            <div class="item-title">
              <span class="approver">{{ item.approver || "" }}</span>
              <span class="time">{{ item.opinionTime || "" }}</span>
            </div>
            <div class="opinion">审批意见：{{ item.opinions || "" }}</div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { Collapse, CollapseItem } from "element-ui";
export default {
  name: "primeton-process-list",
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
  },
  props: {
    modelVal: {
      type: [String, Number],
      default: "",
    },
    listData: {
      type: Object,
      default: () => [],
    },
    isBack: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: "modelVal", //指向props的参数名
    event: "change", //事件名称
  },
  data() {
    return {
      activeCollapse: 0, // 当前展开或选中的流程
      activeCollapseRadio: "", // 选流程选人中被选中的流程Index
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    if (this.listData && Object.keys(this.listData).length > 0) {
      this.activeCollapseRadio =
        this.listData[Object.keys(this.listData)[0]][0].id;
      this.$emit("change", this.activeCollapseRadio);
    }
  },
  methods: {
    // 环节折叠面板展开事件
    collapseOnChange() {},
    // 选环节--设置选中环节的状态
    collapseRadioOnclick(index, key, value) {
      this.activeCollapseRadio = value[0].id;
      this.$emit("change", this.activeCollapseRadio);
    },
  },
};
</script>
<style lang="scss" scoped>
.primeton-process-list {
  width: 100%;
  // min-height: 200px;
  box-sizing: border-box;

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
          // border-bottom: 1px solid #d2d9e6;
        }

        .title {
          display: inline-block;
          width: calc(100% - 62px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
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
      .el-collapse-item__wrap {
        // background: #f5f6fb;
        // margin-bottom: -1px;

        .el-collapse-item__content {
          // background: #f5f6fb;
          padding: 0 18px 14px 18px;
        }
      }
    }
  }
  .primeton-process-list-container {
    width: 100%;
    padding: 10px 10px;
    background: #f5f6fb;
    text-align: left;

    .time-line {
      position: relative;
      width: 100%;
      padding: 3px 0 3px 25px;
      .item-title {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .approver {
          display: inline-block;
          vertical-align: text-bottom;
          font-size: 16px;
          font-weight: 500;
          color: #2a2a2a;
        }
        .time {
          display: inline-block;
          vertical-align: text-bottom;
          margin-left: 10px;
          font-size: 14px;
          font-weight: 400;
          color: #929fb1;
        }
      }

      .opinion {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .line-node {
        position: absolute;
        left: 5px;
        top: 15px;
        width: 6px;
        height: 6px;
        background: #ffffff;
        border: 1px solid #707a88;
        border-radius: 50%;
      }

      &::before {
        position: absolute;
        top: 0;
        left: 8.5px;
        content: "";
        width: 0;
        height: 100%;
        border-left: 1px dashed #787878;
      }
    }
  }
}
</style>
