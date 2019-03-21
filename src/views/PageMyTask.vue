<template>
  <div class="d-content">
    <div class="search" style="padding: 10px 14px 6px 14px;">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="任务状态">
          <el-select v-model="formInline.region">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="未填报" value="beijing"></el-option>
            <el-option label="已提交" value="beijing1"></el-option>
            <el-option label="待审核" value="beijing2"></el-option>
            <el-option label="审核通过" value="beijing3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考评截止日期" style="padding-top: 4px;">
          <el-date-picker
            v-model="formInline.date"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="formInline.name" placeholder="任务名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="任务名称"></el-table-column>
      <el-table-column prop="status" label="任务状态"></el-table-column>
      <el-table-column prop="status1" label="考评周期"></el-table-column>
      <el-table-column prop="status2" label="考评截止时间"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <a
            class="operator"
            v-if="scope.row.id===1"
            @click="handleStartReport(scope.$index, scope.row)"
          >开始填报</a>
          <a
            class="operator"
            v-if="scope.row.id===2"
            @click="handleEdit(scope.$index, scope.row)"
          >查看详情</a>
          <a
            class="operator"
            v-if="scope.row.id===3"
            @click="handlestartReview(scope.$index, scope.row)"
          >开始审核</a>
          <a
            class="operator"
            v-if="scope.row.id===4"
            @click="handleReReport(scope.$index, scope.row)"
          >重新填报</a>
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
    <StartReport :startReportModel="startReportModel" :changeParent="changeParent"/>
    <StartReview :startReviewVisible="startReviewVisible" :changeParent="changeParent"/>
    <ReReport :reReportVisible="reReportVisible" :changeParent="changeParent"/>
  </div>
</template>
<script>
import StartReport from "../components/PageMyTask/StartReport.vue";
import StartReview from "../components/PageMyTask/StartReview.vue";
import ReReport from "../components/PageMyTask/ReReport.vue";
export default {
  data() {
    return {
      formInline: {
        name: "",
        user: "",
        region: "",
        date: ""
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
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          id: 3
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          id: 4
        }
      ],
      startReportModel: false,
      startReviewVisible: false,
      reReportVisible: false
    };
  },
  components: {
    StartReport,
    StartReview,
    ReReport
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
      console.log(name, value);
      this[name] = value;
    },
    handleStartReport() {
      this.startReportModel = true;
    },
    handlestartReview() {
      this.startReviewVisible = true;
    },
    handleReReport() {
      this.reReportVisible = true;
    }
  }
};
</script>

