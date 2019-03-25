<template>
  <div class="d-login">
    <!-- <header>
      <h3>{{systemName.systemShowName}}</h3>
    </header>-->
    <div class="d-loginheader">
      <p>信息考评管理系统</p>
      <p class="tip">账户密码登录</p>
    </div>
    <div class="login-content">
      <el-form ref="login" :model="loginData" :rules="MessageL">
        <el-form-item prop="username" class="userName_font">
          <el-input v-model="loginData.username" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="password_font_algin">
          <el-input type="password" v-model="loginData.password" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item style="text-align:center;">
          <el-button
            type="primary"
            plain
            size="medium"
            style="width: 300px;"
            @click="submit"
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
.d-login {
  background: url("../assets/login.svg");
  height: 100vh;
  .login-content {
    text-align: center;
    width: 300px;
    position: absolute;
    left: 50%;
    margin-left: -150px;
    top: 200px;
  }
  .d-loginheader {
    text-align: center;
    width: 500px;
    line-height: 40px;
    position: absolute;
    left: 50%;
    margin-left: -250px;
    top: 100px;
    font-size: 24px;
    .tip {
      font-size: 14px;
      color: #008af1;
      width: 93px;
      margin: 0 auto;
      border-bottom: 1px solid #008af1;
    }
  }
  .footer {
    font-size: 13px;
    font-family: MicrosoftYaHei;
    color: rgba(153, 153, 153, 1);
    position: absolute;
    bottom: 30px;
    width: 100%;
    text-align: center;
  }
}
</style>

<script>
import md5 from "md5";
// md5(state.login.password)
export default {
  data() {
    return {
      MessageL: {
        name: [{ required: true, message: "用户名不能为空!", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空!", trigger: "blur" }
        ]
      },
      loginData: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    submit() {
      const data = {
        username: this.loginData.username,
        password: md5(this.loginData.password)
      };
      this.$post("/data/login", data, (data) => {
        sessionStorage.setItem("token", data.object.tokenMap.accessToken);
        sessionStorage.setItem("user", JSON.stringify(data.object.user));
        this.$store.commit("changeLogin");
        this.$router.push({ path: "/" });
      });
    },
    // seccessFun(data) {}
  }
};
</script>
