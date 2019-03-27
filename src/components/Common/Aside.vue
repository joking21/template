<template>
  <div class="aside">
    <!-- :default-openeds="['2']" -->
    <el-menu
      :default-active="toobarIndex"
      class="el-menu-vertical-demo"
      :default-openeds="[zankai]"
      active-text-color="#ffffff"
      text-color="#ffffff"
      background-color="transparent"
      @select="selectJump"
      :unique-opened="true"
      :collapse="isCollapse"
    >
      <el-menu-item index="1">
        <i class="iconfont iconwodekaopingrenwu-1"></i>
        <span slot="title">我的考评任务</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="iconfont iconkaopingzhibiaoguanli"></i>
          <span>考评指标管理</span>
        </template>
        <el-menu-item index="2-1">指标库管理</el-menu-item>
        <el-menu-item index="2-2">考评模板管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="3">
        <i class="iconfont iconkaopingrenwushezhisvg"></i>
        <span slot="title">考评任务设置</span>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <i class="iconfont iconkaopingrenwuhuizong"></i>
          <span>考评工作汇总</span>
        </template>
        <el-menu-item index="4-1">考评任务管理</el-menu-item>
        <el-menu-item index="4-2">考评分析报表</el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="d-aside-footer">
      <i
        class="el-icon-d-arrow-left"
        style="font-size: 20px; color: #ffffff; cursor: pointer;"
        @click="changeBtn"
      ></i>
    </div>
  </div>
</template>
<style lang="less">
@import "../../css/aside.less";
</style>

<script>
export default {
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    toobarIndex() {
      return this.$store.state.toobarIndex;
    },
    zankai() {
      return this.$store.state.toobarIndex.split("-")[0];
    }
  },
  methods: {
    selectJump(index) {
      let title;
      let url;
      switch (index) {
        case "1":
          title = "我的考评任务";
          url = "/";
          break;
        case "2-1":
          title = "考评指标管理 / 指标库管理";
          url = "/indexBaseManage";
          break;
        case "2-2":
          title = "考评指标管理 / 考评模板管理";
          url = "/templateManage";
          break;
        case "3":
          title = "考评任务设置";
          url = "/taskSet";
          break;
        case "4-1":
          title = "考评工作汇总 / 考评任务管理";
          url = "/taskManagement";
          break;
        case "4-2":
          title = "考评工作汇总 / 考评分析报表";
          url = "/reportAnalysis";
          break;
        default:
          title = "未知";
      }
      this.$router.push({ path: url });
      this.$store.commit("changeToobar", { title: title, index: index });
    },
    changeBtn() {
      this.isCollapse ? (this.isCollapse = false) : (this.isCollapse = true);
    }
  }
};
</script>

