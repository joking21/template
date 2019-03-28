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
      <!-- <el-submenu v-for="item in menuList" v-if="item.children.length!==0" :key="item.id" :index="item.id">
        <template slot="title">
          <i v-if="item.id==='me_00001'" class="iconfont iconwodekaopingrenwu-1"></i>
          <i v-if="item.id==='me_00002'" class="iconfont iconkaopingzhibiaoguanli"></i>
          <i v-if="item.id==='me_00005'" class="iconfont iconkaopingrenwushezhisvg"></i>
          <i v-if="item.id==='me_00006'" class="iconfont iconkaopingrenwuhuizong"></i>
          <span>{{item.name}}</span>
        </template>
        <el-menu-item v-for="iitem in item.children" :key="iitem.id" :index="iitem.id">{{iitem.name}}</el-menu-item>
      </el-submenu>
      <el-menu-item v-for="item in menuList" v-if="item.children.length===0" :key="item.id" :index="item.id">
          <i v-if="item.id==='me_00001'" class="iconfont iconwodekaopingrenwu-1"></i>
          <i v-if="item.id==='me_00002'" class="iconfont iconkaopingzhibiaoguanli"></i>
          <i v-if="item.id==='me_00005'" class="iconfont iconkaopingrenwushezhisvg"></i>
          <i v-if="item.id==='me_00006'" class="iconfont iconkaopingrenwuhuizong"></i>
          <span>{{item.name}}</span>
      </el-menu-item> -->
      <el-menu-item index="1" v-if="menuList.indexOf('me_00001')>-1">
        <i class="iconfont iconwodekaopingrenwu-1"></i>
        <span slot="title">我的考评任务</span>
      </el-menu-item>
      <el-submenu index="2" v-if="menuList.indexOf('me_00002')>-1">
        <template slot="title">
          <i class="iconfont iconkaopingzhibiaoguanli"></i>
          <span>考评指标管理</span>
        </template>
        <el-menu-item index="2-1" v-if="menuList.indexOf('me_00003')>-1">指标库管理</el-menu-item>
        <el-menu-item index="2-2" v-if="menuList.indexOf('me_00004')>-1">考评模板管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="3" v-if="menuList.indexOf('me_00005')>-1">
        <i class="iconfont iconkaopingrenwushezhisvg"></i>
        <span slot="title">考评任务设置</span>
      </el-menu-item>
      <el-submenu index="4" v-if="menuList.indexOf('me_00006')>-1">
        <template slot="title">
          <i class="iconfont iconkaopingrenwuhuizong"></i>
          <span>考评工作汇总</span>
        </template>
        <el-menu-item index="4-1" v-if="menuList.indexOf('me_00007')>-1">考评任务管理</el-menu-item>
        <el-menu-item index="4-2" v-if="menuList.indexOf('me_00008')>-1">考评分析报表</el-menu-item>
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
      isCollapse: false,
      menuList: [],
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
  created(){
    this.getList();
  },
  methods: {
    getList(){
      // /getLoginUserMenus
      this.$get("/getLoginUserMenus",null,(data)=>{
        console.log(data);
        // this.menuLis;
        const temp = [];
        for(let i =0;i<data.length;i++){
            temp.push(data[i].id);
            if(data[i].children){
              const childTemp = data[i].children;
              for(let j = 0; j<childTemp.length;j++){
                temp.push(childTemp[j].id);
              }
            }
        }
        console.log(temp);
        this.menuList = temp;
      })
    },
    checkShow(id){
      if(this.menuList.indexof(id)>-1){
        return true;
      }
      return false;
    },
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
      // switch (index) {
      //   case "me_00001":
      //     title = "我的考评任务";
      //     url = "/";
      //     break;
      //   case "me_00003":
      //     title = "考评指标管理 / 指标库管理";
      //     url = "/indexBaseManage";
      //     break;
      //   case "me_00004":
      //     title = "考评指标管理 / 考评模板管理";
      //     url = "/templateManage";
      //     break;
      //   case "me_00005":
      //     title = "考评任务设置";
      //     url = "/taskSet";
      //     break;
      //   case "me_00007":
      //     title = "考评工作汇总 / 考评任务管理";
      //     url = "/taskManagement";
      //     break;
      //   case "me_00008":
      //     title = "考评工作汇总 / 考评分析报表";
      //     url = "/reportAnalysis";
      //     break;
      //   default:
      //     title = "未知";
      // }
      this.$router.push({ path: url });
      this.$store.commit("changeToobar", { title: title, index: index });
    },
    changeBtn() {
      this.isCollapse ? (this.isCollapse = false) : (this.isCollapse = true);
    }
  }
};
</script>

