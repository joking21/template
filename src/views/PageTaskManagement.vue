<template>
  <div class="d-content">
    <div class="search" style="padding: 10px 14px 6px 14px;">
      <el-row style="margin-bottom: 15px;">
        <el-button size="small" icon="el-icon-delete" type="danger" @click="deleteTemplateAll">删除任务</el-button>
      </el-row>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="考评对象">
          <el-select v-model="formInline.region" style="width: 180px;" placeholder="请选择">
            <el-option label="组1" value="beijing"></el-option>
            <el-option label="组2" value="beijing1"></el-option>
            <el-option label="组3" value="beijing2"></el-option>
            <el-option label="组4" value="beijing3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="formInline.region" style="width: 180px;" placeholder="请选择">
            <el-option label="组1" value="beijing"></el-option>
            <el-option label="组2" value="beijing1"></el-option>
            <el-option label="组3" value="beijing2"></el-option>
            <el-option label="组4" value="beijing3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="formInline.name" placeholder="请输入任务名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" :selectable="disabledFun"></el-table-column>
      <el-table-column prop="name" label="任务名称"></el-table-column>
      <el-table-column prop="status" label="考评对象"></el-table-column>
      <el-table-column prop="status11" label="填报人"></el-table-column>
      <el-table-column prop="status1" label="任务状态"></el-table-column>
      <el-table-column prop="status2" label="考评周期"></el-table-column>
      <el-table-column prop="status3" label="派发时间"></el-table-column>
      <el-table-column prop="status4" label="审核人"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <a
            class="operator"
            v-if="scope.row.id===1"
            @click="handleViewDetails(scope.$index, scope.row)"
          >查看详情</a>
          <a
            class="operator"
            v-if="scope.row.id===2"
            @click="handlestartReview(scope.$index, scope.row)"
          >开始审核</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="block d-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="prev, pager, next, sizes, jumper"
        :total="100"
      ></el-pagination>
    </div>
       <!-- 查看详情 -->
    <ViewDetails :viewDetailsModel="viewDetailsModel" :changeParent="changeParent"/>
        <!-- 开始审核 -->
    <StartReview :startReviewVisible="startReviewVisible" :changeParent="changeParent"/>
  </div>
</template>
<script>
import ViewDetails from "../components/PageMyTask/ViewDetails.vue";
import StartReview from "../components/PageMyTask/StartReview.vue";
import { debug } from 'util';
export default {
  data() {
    return {
      formInline: {
        name: "",
        region: "",
        region1: ""
      },
      currentPage: 1,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 1
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
          id: 2
        }
      ],
      multipleSelection: "",
      viewDetailsModel: false,
      startReviewVisible: false
    };
  },
  components: {
    ViewDetails,
    StartReview
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    changeParent(name, value) {
      this[name] = value;
    },
    handleViewDetails() {
      this.viewDetailsModel = true;
    },
    handlestartReview() {
      this.startReviewVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 禁用table选择框
    disabledFun(row, index) {
      if (row.id === 1) {
        return false;
      }
      return true;
    },
    // 删除选中的指标项
    deleteTemplateAll() {
      console.log(this.multipleSelection);
      this.$confirm("是否确定删除选中的任务", "删除任务", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    }
  }
};
</script>

