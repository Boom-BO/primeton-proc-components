<template>
  <div class="primeton-process-list">
    <div
      class="primeton-process-list-item"
      v-for="item in listData"
      :key="item.id"
    >
      <span class="selection">
        <i
          v-if="selectionData.findIndex((el) => el.id === item.id) !== -1"
          @click="select(item, false)"
          class="selection-icon selection-icon-active el-icon-success"
        ></i>
        <span v-else class="selection-icon" @click="select(item, true)"></span>
      </span>
      <template v-if="isBack">
        <div class="primeton-process-list-item-container">
          <div class="item-title">
            <span class="title">{{ item.name || "" }}</span>
            <span class="people">办理人：{{ item.approver || "" }}</span>
          </div>
          <div class="opinion">审批意见：{{ item.opinions || "" }}</div>
        </div>
      </template>
      <span v-else class="primeton-process-item-name">{{
        item.name || ""
      }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "primeton-process-list",
  components: {},
  props: {
    modelVal: {
      type: Array,
      default: () => [],
    },
    listData: {
      type: Array,
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
      selectionData: [],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    select(item, isSet) {
      if (this.isBack) {
        // 选回退环节-单选
        this.selectionData = [];
      }
      if (isSet) {
        this.selectionData.push(item);
      } else {
        const index = this.selectionData.findIndex((el) => el.id === item.id);
        this.selectionData.splice(index, 1);
      }
      this.$emit("change", this.selectionData);
    },
  },
};
</script>
<style lang="scss" scoped>
.primeton-process-list {
  width: 100%;
  min-height: 200px;
  padding: 16px 24px 16px 43px;
  background: #ffffff;
  border-radius: 5px;
  border: 1px solid #d2d9e6;
  box-sizing: border-box;

  &-item {
    position: relative;
    width: 100%;
    height: 70px;
    padding: 10px 13px;
    margin-bottom: 17px;
    line-height: 58px;
    font-size: 12px;
    font-weight: 500;
    color: #22232f;
    background: #f5f6fb;
    border-radius: 3px;
    text-align: left;
    box-sizing: border-box;

    &::before {
      position: absolute;
      top: 0;
      left: -18px;
      content: "";
      width: 0px;
      height: calc(100% + 16px);
      border-right: 1px dashed #d2d9e6;
    }

    &:nth-last-of-type(1) {
      margin-bottom: 0;
      &::before {
        height: 100%;
      }
    }

    &-container {
      .item-title {
        line-height: 20px;
        .title {
          display: inline-block;
          vertical-align: text-bottom;
          font-size: 14px;
          font-weight: 500;
          color: #22232f;
        }
        .people {
          display: inline-block;
          vertical-align: text-bottom;
          margin-left: 10px;
          font-size: 12px;
          font-weight: 400;
          color: #929fb1;
        }
      }
      .opinion {
        margin-top: 5px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #9ba9bb;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .selection {
      position: absolute;
      top: 26px;
      left: -25px;
      width: 16px;
      height: 16px;
      background-color: #fff;
      z-index: 1;
      cursor: pointer;

      .selection-icon {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 14px;
        height: 14px;
        background-color: #fff;
        border: 1px solid #c1c7cf;
        border-radius: 50%;

        &-active {
          font-size: 16px;
          border: none;
          color: #378af7;
        }
      }
    }
  }
}
</style>
