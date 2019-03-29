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
    return {
      toobarName: ""
    };
  },
  created() {
    const href = window.location.pathname;
    this.changeName(href);
  },
  methods: {
    changeName(href) {
      let title = "";
      switch (href) {
        case "/":
          title = "我的考评任务";
          break;
        case "/indexBaseManage":
          title = "考评指标管理 / 指标库管理";
          break;
        case "/templateManage":
          title = "考评指标管理 / 考评模板管理";
          break;
        case "/taskSet":
          title = "考评任务设置";
          break;
        case "/taskManagement":
          title = "考评工作汇总 / 考评任务管理";
          break;
        case "/reportAnalysis":
          title = "考评工作汇总 / 考评分析报表";
          break;
        default:
          title = "未知";
      }
      this.toobarName = title;
    }
  },
  watch: {
    $route(to, from) {
      const href = to.fullPath;
      this.changeName(href);
    }
  }
};
</script>

