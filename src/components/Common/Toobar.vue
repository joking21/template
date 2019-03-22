<template>
  <div class="toobar">{{toobarName}}</div>
</template>
<style lang="less">
.toobar {
  height: 48px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.05);
  padding: 0px 20px;
  line-height: 48px;
  font-size: 14px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}
</style>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    toobarName() {
      return this.$store.state.toobarName;
    }
  }
};
</script>

