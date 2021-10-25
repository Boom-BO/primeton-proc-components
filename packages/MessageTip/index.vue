<template>
  <div v-if="visible" :class="['message-tip', type || 'info']">
    <i class="icon el-icon-warning-outline"></i>
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "pre-message",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.message-tip {
  position: fixed;
  top: 25vh;
  left: 50%;
  transform: translateX(-50%);
  min-width: 120px;
  height: 46px;
  padding: 0 30px;
  font-size: 14px;
  font-weight: 500;
  color: #191a1c;
  line-height: 46px;
  background: #ffffff;
  box-shadow: 0px 2px 6px 3px rgba(163, 163, 163, 0.34);
  border-radius: 8px;
  text-align: center;
  z-index: 9999;
  .icon {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    font-size: 20px;
    color: #606266;
  }

  &.error {
    .icon {
      color: #fb5756;
    }
  }
}
</style>
