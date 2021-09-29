<template>
  <span class="primeton-tag">
    <slot />
    <i
      v-if="closeable"
      class="close-btn iconfont icon-pre-close-circle"
      @click="del"
    ></i>
  </span>
</template>

<script>
export default {
  name: "pTag",
  components: {},
  props: {
    closeable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    del() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped>
.primeton-tag {
  position: relative;
  display: inline-block;
  height: 24px;
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 0 12px;
  line-height: 22px;
  font-size: 12px;
  color: #409eff;
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  cursor: default;

  &:nth-last-of-type(1) {
    margin-right: 0;
  }

  &:hover {
    .close-btn {
      display: inline;
    }
  }

  .close-btn {
    display: none;
    position: absolute;
    top: -8px;
    right: -5px;
    font-size: 12px;
    border-radius: 50%;
    color: #ff4465;
  }
}
</style>
