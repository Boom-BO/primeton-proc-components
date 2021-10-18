<template>
  <!-- <transition name="fade"> -->
  <div class="primeton-dialog-mask" v-if="visible">
    <div class="primeton-dialog" :style="{ width: dialogWidth }">
      <i class="close-btn pre-iconfont icon-pre-close" @click="closeDialog"></i>
      <div class="header">
        {{ title }}
      </div>
      <div class="content-wrapper">
        <slot />
      </div>
      <div class="footer-wrapper">
        <slot name="footer" />
      </div>
    </div>
  </div>
  <!-- </transition> -->
</template>

<script>
export default {
  name: "PrimetonDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "标题",
    },
    width: {
      type: [String, Number],
      default: "30%",
    },
  },
  data() {
    return {};
  },
  computed: {
    dialogWidth() {
      return typeof this.width == "number" ? `${this.width}px` : this.width;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
      this.$emit("close", true);
    },
  },
};
</script>
<style lang="scss" scoped>
.primeton-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(#000000, 0.4);
  z-index: 999;

  .primeton-dialog {
    position: fixed;
    top: 15vh;
    left: 50%;
    width: 30%;
    background-color: #f6faf9;
    transform: translateX(-50%);
    box-sizing: border-box;
    z-index: 1;

    .close-btn {
      position: absolute;
      top: 11px;
      right: 20px;
      font-size: 16px;
      color: #fff;
      cursor: pointer;

      &:hover {
        color: darken(#fff, 10%);
      }
    }
    .header {
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      font-size: 15px;
      font-weight: 500;
      color: #fff;
      background-color: #4778c7;
      text-align: left;
      box-sizing: border-box;
    }
    .content-wrapper {
      width: 100%;
      min-height: 200px;
      padding: 10px 17px;
      box-sizing: border-box;
    }

    .footer-wrapper {
      width: 100%;
      padding: 0 0 10px 0;
      text-align: center;

      .u-button {
        margin-right: 20px;
        &:nth-last-of-type(1) {
          margin-right: 0;
        }
      }
    }
  }
  ::v-deep .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  ::v-deep .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>
