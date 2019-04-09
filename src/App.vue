<template>
  <div id="app">
    <el-container style="height: 100vh" v-if="$route.meta.keepAlive">
      <el-header height="50px">
        <Header />
      </el-header>
      <el-container>
        <el-aside width="auto">
          <Aside />
        </el-aside>
        <el-container>
          <Toobar />
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer height="40px">
            <!-- <Footer /> -->
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import Header from './components/Common/Header.vue';
import Aside from './components/Common/Aside.vue';
import Footer from './components/Common/Footer.vue';
import Toobar from './components/Common/Toobar.vue';
export default {
  name: "app",
  data() {
    return {};
  },
  components:{
    Header,
    Aside,
    Footer,
    Toobar
  }
};
</script>

