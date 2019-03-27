<template>
  <div class="block d-pagination">
    <el-pagination v-if="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginationChild.current"
      :page-sizes="pageSizesArr"
      :page-size="paginationChild.pagesize"
      layout="prev, pager, next, sizes, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<style lang="less">
@import "../../css/pagination.less";
</style>
<script>
export default {
  data() {
    return {
      pageSizesArr: [10, 20, 30, 40]
    };
  },
  props: ["paginationPara", "getList", "total"],
  computed: {
    paginationChild() {
      return this.paginationPara;
    }
  },
  mounted(){
    console.log(this.total);
    console.log(this.paginationPara);
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.paginationChild.pageSize = val;
      this.getList(this.paginationChild);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.paginationChild.currentPage = val;
      this.getList(this.paginationChild);
    }
  }
};
</script>

