<template>
  <div class="header">
    <el-row>
      <el-col :span="12">
        <div class="title">
          <p>信息考评管理系统</p>
        </div>
        <div class="line"></div>
        <div class="other-system" @mouseenter="productEnter" @mouseleave="productLeave">
          <p>
            产品服务
            <i v-if="!isShow" style="margin-left: 5px;" class="el-icon-caret-bottom"></i>
            <i v-else style="margin-left: 5px;" class="el-icon-caret-top"></i>
          </p>
          <ul v-if="isShow">
            <li v-for="(item,index) in menuList" :key="index">
              <a :href="`/eva?${item.jumpUrl}`" target="_black">{{item.productShowName}}</a>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <div class="location">
          <i class="el-icon-location-outline"></i>
          <span>{{user.regionName}}</span>
        </div>
        <div class="admin" @mouseenter="peopleEnter" @mouseleave="peopleLeave">
          <div class="imgIcon">
            <img src="../../assets/people.jpg" alt>
          </div>
          <div class="people">
            <p class="userName">{{user.userName}}</p>
            <i v-if="!isShowLoginout" class="el-icon-caret-bottom d-icon"></i>
            <i v-else class="el-icon-caret-top d-icon"></i>
            <ul v-if="isShowLoginout">
              <li style="cursor:pointer" @click="loginOut">退出</li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="less">
@import "../../css/header.less";
</style>

<script>
export default {
  data() {
    return {
      isShow: false,
      isShowLoginout: false,
      menuList: [],
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  created(){
    this.getList();
  },
  methods: {
    getList(){
      this.$get("/getProductIntegrateList", null, (data)=>{
        this.menuList = data;
      })
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    productEnter() {
      this.isShow = true;
    },
    productLeave() {
      this.isShow = false;
    },
    peopleEnter() {
      this.isShowLoginout = true;
    },
    peopleLeave() {
      this.isShowLoginout = false;
    },
    loginOut() {
      this.$post("/logout", null, (data) => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        this.$store.commit("changeLogin");
        this.$router.push({ path: "/login" });
      });
    }
  }
};
</script>

