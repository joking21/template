<template>
  <div class="d-content">
    <div class="d-tabs">
      <el-button size="small" :class="active===1?'d-active':''" @click="handleFillIn">待办填报</el-button>
      <el-button
        size="small"
        :class="active===2?'d-active':''"
        style="margin-left: 5px;"
        @click="handleToExamine"
      >待办审核</el-button>
    </div>
    <div class="search" style="padding: 10px 14px 6px 14px;">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="任务状态">
          <el-select v-model="form.type" style="width: 180px;">
            <el-option
              v-for="(item, index) in form.typeArr"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="派发时间" style="padding-top: 4px;">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="form.name" placeholder="任务名称" style="width: 150px;"></el-input>
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
            @click="handleViewDetails(scope.$index, scope.row)"
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
    <Pagination :paginationPara="paginationPara" :getList="getList" />
    <!-- 查看详情 -->
    <ViewDetails :viewDetailsModel="viewDetailsModel" :changeParent="changeParent"/>
    <!-- 开始填报 -->
    <StartReport :startReportModel="startReportModel" :changeParent="changeParent"/>
    <!-- 开始审核 -->
    <StartReview :startReviewVisible="startReviewVisible" :changeParent="changeParent"/>
    <!-- 重新填报 -->
    <ReReport :reReportVisible="reReportVisible" :changeParent="changeParent"/>
  </div>
</template>

<script>
import ViewDetails from "../components/PageMyTask/ViewDetails.vue";
import StartReport from "../components/PageMyTask/StartReport.vue";
import StartReview from "../components/PageMyTask/StartReview.vue";
import ReReport from "../components/PageMyTask/ReReport.vue";
import Pagination from "../components/Common/Pagination.vue";
export default {
  data() {
    return {
      active: 1,
      form: {
        name: "",
        type: "待填报",
        typeArr: [
          { name: "全部" },
          { name: "待填报" },
          { name: "待审核" },
          { name: "已完成" }
        ],
        date: ""
      },
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
      paginationPara: {
        total: 100,
        pagesize: 10,
        test: "11"
      },
      startReportModel: false,
      startReviewVisible: false,
      reReportVisible: false,
      viewDetailsModel: false
    };
  },
  created() {
    this.$get("/meEvaluateUserTask/list", null);
    // this.$get('/api/articles/new/article');
  },
  components: {
    StartReport,
    StartReview,
    ReReport,
    ViewDetails,
    Pagination
  },
  methods: {
    getList(para){
      console.log(para);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    changeParent(name, value) {
      console.log(name, value);
      this[name] = value;
    },
    handleViewDetails() {
      this.viewDetailsModel = true;
    },
    handleStartReport() {
      this.startReportModel = true;
    },
    handlestartReview() {
      this.startReviewVisible = true;
    },
    handleReReport() {
      this.reReportVisible = true;
    },
    // 代办填报
    handleFillIn() {
      this.active = 1;
      this.form = {
        name: "",
        type: "待填报",
        typeArr: [
          { name: "全部" },
          { name: "待填报" },
          { name: "待审核" },
          { name: "已完成" }
        ],
        date: ""
      };
    },
    // 代办审核
    handleToExamine() {
      this.active = 2;
      this.form = {
        name: "",
        type: "待审核",
        typeArr: [{ name: "全部" }, { name: "待审核" }, { name: "已完成" }],
        date: ""
      };
    }
  }
};
</script>

