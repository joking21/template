<template>
  <div class="block d-pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginationChild.current"
      :page-sizes="pageSizesArr"
      :page-size="paginationChild.pagesize"
      layout="prev, pager, next, sizes, jumper"
      :total="paginationChild.total"
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
  props: ["paginationPara", "getList"],
  computed: {
    paginationChild() {
      return this.paginationPara;
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.paginationChild.pagesize = val;
      this.getList(this.paginationChild);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.paginationChild.current = val;
      this.getList(this.paginationChild);
    }
  }
};
</script>

