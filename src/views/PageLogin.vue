<template>
  <div class="d-login">
    <div class="d-loginheader">
      <p>信息考评管理系统</p>
      <p class="tip">账户密码登录</p>
    </div>
    <div class="login-content">
      <el-form ref="loginData" :model="loginData" :rules="rulesForm">
        <el-form-item prop="username">
          <!-- <el-input placeholder="请输入用户名" v-model="loginData.username">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input> -->
          <el-input v-model="loginData.username" style="width: 300px;" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="password_font_algin">
          <el-input type="password" v-model="loginData.password" style="width: 300px;" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item style="text-align:center;">
          <el-button
            type="primary"
            plain
            size="medium"
            style="width: 300px;"
            @click="submit('loginData')"
          >登&nbsp;&nbsp;录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <p>© 2005-2018 勤智数码科技股份有限公司 蜀 ICP 备 11012966 号</p>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import "../css/login.less";
</style>

<script>
import md5 from "md5";
export default {
  data() {
    return {
      rulesForm: {
        username: [
          { required: true, message: "用户名不能为空!", trigger: "change" }
        ],
        password: [
          { required: true, message: "密码不能为空!", trigger: "change" }
        ]
      },
      loginData: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const postData = {
            username: this.loginData.username,
            password: md5(this.loginData.password)
          };
          this.$post("/data/login", postData, data => {
            sessionStorage.setItem("token", data.object.tokenMap.accessToken);
            sessionStorage.setItem("user", JSON.stringify(data.object.user));
            this.$store.commit("changeLogin");
            this.$router.push({ path: "/" });
          });
        }
      });
    }
  }
};
</script>
