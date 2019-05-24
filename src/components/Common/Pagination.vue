<template>
  <div class="block d-pagination">
    <el-pagination v-if="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginationChild.currentPage"
      :page-sizes="pageSizesArr"
      :page-size="paginationChild.pageSize"
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
  methods: {
    handleSizeChange(val) {
      this.paginationChild.pageSize = val;
      this.getList(this.paginationChild);
    },
    handleCurrentChange(val) {
      this.paginationChild.currentPage = val;
      this.getList(this.paginationChild);
    }
  }
};
</script>

