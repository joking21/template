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
            <li>选项1</li>
            <li>选项1</li>
            <li>选项1</li>
            <li>选项1</li>
            <li>选项1</li>
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
.header {
  .title {
    display: inline-block;
    p {
      font-size: 16px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 22px;
    }
  }
  .other-system {
    position: absolute;
    left: 180px;
    top: 0px;
    padding: 0 20px;
    z-index: 100;
    cursor: pointer;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    width: 131px;
    ul {
      width: 131px;
      list-style: none;
      padding: 0px;
      margin: 0px;
      padding-bottom: 10px;
      li {
        list-style: none;
        padding: 0px;
        margin: 0px;
        background-color: rgba(19, 30, 73, 1);
        font-size: 13px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.8);
        line-height: 24px;
        cursor: pointer;
      }
    }
  }
  .other-system:hover {
    background-color: rgba(19, 30, 73, 1);
  }
  .line {
    position: absolute;
    display: inline-block;
    width: 1px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    margin-left: 20px;
    margin-right: 36px;
    margin-top: 15px;
  }
  .location {
    display: inline-block;
    position: absolute;
    right: 150px;
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(210, 217, 229, 1);
      margin-left: 5px;
    }
  }
  .admin {
    display: inline-block;
    width: 104px;
    position: relative;
    padding: 0px 10px;
    z-index: 100;
    .imgIcon {
      display: inline-block;
      position: absolute;
      left: 10px;
      top: 8px;
      img {
        width: 24px;
        height: 24px;
        border-radius: 30px;
      }
    }
    .people {
      display: inline-block;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      .userName {
        display: inline-block;
        width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .d-icon {
        position: relative;
        top: -19px;
        margin-left: 5px;
      }
      ul {
        list-style: none;
        padding: 0px;
        margin: 0px;
        padding-bottom: 10px;
        width: 104px;
        margin-top: -18px;
        li {
          text-align: center;
          padding: 0px 10px;
          list-style: none;
          padding: 0px;
          margin: 0px;
          background-color: rgba(19, 30, 73, 1);
          font-size: 13px;
          font-family: MicrosoftYaHei;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
  .admin:hover {
    background: rgba(19, 30, 73, 1);
    box-shadow: 0px 2px 8px 0px rgba(31, 67, 128, 0.4);
  }
}
</style>

<script>
export default {
  data() {
    return {
      isShow: false,
      isShowLoginout: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
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

