<template>
  <div class="aside">
    <el-menu
      class="el-menu-vertical-demo"
      active-text-color="#ffffff"
      text-color="#ffffff"
      background-color="transparent"
      @select="selectJump"
      :unique-opened="true"
      :collapse="isCollapse"
    >
      <div v-for="item in menuList" :key="item.id">
        <el-menu-item v-if="item.children.length===0" :index="item.sysMenu.url">
          <i :class="item.sysMenu.icon"></i>
          <span>{{item.sysMenu.menuName}}</span>
        </el-menu-item>
        <el-submenu v-else :index="item.sysMenu.id">
          <template slot="title">
            <i :class="item.sysMenu.icon"></i>
            <span>{{item.sysMenu.menuName}}</span>
          </template>
          <el-menu-item
            v-for="iitem in item.children"
            :key="iitem.sysMenu.id"
            :index="iitem.sysMenu.url"
          >{{iitem.sysMenu.menuName}}</el-menu-item>
        </el-submenu>
      </div>
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
      isCollapse: false,
      menuList: []
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
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.$get("/getLoginUserMenus", null, data => {
        this.menuList = data;
      });
    },
    checkShow(id) {
      if (this.menuList.indexof(id) > -1) {
        return true;
      }
      return false;
    },
    selectJump(index) {
      let title;
      let url;
      this.$router.push({ path: index });
    },
    changeBtn() {
      this.isCollapse ? (this.isCollapse = false) : (this.isCollapse = true);
    }
  }
};
</script>

