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
          <el-select v-model="paginationPara.evaluateStatus" style="width: 180px;">
            <el-option
              v-for="(item, index) in form.typeArr"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="派发时间" style="padding-top: 4px;">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="changeDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="paginationPara.taskName" placeholder="任务名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchFun">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="taskName" label="任务名称"></el-table-column>
      <el-table-column prop="taskStatus" label="任务状态"></el-table-column>
      <el-table-column prop="evaluateCycle" label="考评周期"></el-table-column>
      <el-table-column prop="distributeDate" label="派发时间"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <a
            class="operator"
            v-if="scope.row.taskStatus==='待填报'"
            @click="handleStartReport(scope.$index, scope.row)"
          >开始填报</a>
          <a
            class="operator"
            v-if="scope.row.taskStatus==='已完成'"
            @click="handleViewDetails(scope.$index, scope.row)"
          >查看详情</a>
          <a
            class="operator"
            v-if="scope.row.taskStatus==='待审核'"
            @click="handlestartReview(scope.$index, scope.row)"
          >开始审核</a>
          <!-- <a
            class="operator"
            v-if="scope.row.id===4"
            @click="handleReReport(scope.$index, scope.row)"
          >重新填报</a> -->
        </template>
      </el-table-column>
    </el-table>
    <Pagination :paginationPara="paginationPara" :total="total" :getList="getList"/>
    <!-- 查看详情 -->
    <ViewDetails v-if="viewDetailsModel" :viewDetailsModel="viewDetailsModel" :changeParent="changeParent" :checkId='checkId'/>
    <!-- 开始填报 -->
    <StartReport  v-if="startReportModel" :getList="getList" :startReportModel="startReportModel" :changeParent="changeParent" :checkId='checkId'/>
    <!-- 开始审核 -->
    <StartReview v-if="startReviewVisible" :getList="getList" :startReviewVisible="startReviewVisible" :changeParent="changeParent" :checkId='checkId' />
    <!-- 重新填报 -->
    <!-- <ReReport :reReportVisible="reReportVisible" :changeParent="changeParent"/> -->
  </div>
</template>

<script>
import ViewDetails from "../components/PageMyTask/ViewDetails.vue";
import StartReport from "../components/PageMyTask/StartReport.vue";
import StartReview from "../components/PageMyTask/StartReview.vue";
// import ReReport from "../components/PageMyTask/ReReport.vue";
import Pagination from "../components/Common/Pagination.vue";
export default {
  data() {
    return {
      active: 1,
      form: {
        // type: "待填报",
        typeArr: [
          { name: "全部", id: "" },
          { name: "待填报", id: 0 },
          { name: "待审核", id: 1 },
          { name: "已完成", id: 3 }
        ],
        date: ""
      },
      tableData: [],
      total: 0,
      checkId: '',
      paginationPara: {
        currentPage: 1, // 当前页码
        pageSize: 10, //每页大小
        queryType: 1, //查询类型(1、我的代办填报，2、我的待办审核)
        evaluateStatus: 0, //任务状态(0、待填报，1、待审核，3、已完成)
        startDate: "", // 派发任务开始
        endDate: "", //派发任务结束
        taskName: "" // 任务名称
      },
      startReportModel: false,
      startReviewVisible: false,
      reReportVisible: false,
      viewDetailsModel: false
    };
  },
  created() {
    this.getList(this.paginationPara);
  },
  components: {
    StartReport,
    StartReview,
    // ReReport,
    ViewDetails,
    Pagination
  },
  methods: {
    // 获取列表
    getList(para=this.paginationPara) {
      this.$get("/meEvaluateUserTask/getTaskUserPage", para, data => {
        this.tableData = data.page.records;
        this.total = data.page.total;
        this.paginationPara.pageSize = data.page.size;
        this.paginationPara.currentPage = data.page.current;
      });
    },
    // 修改时间
    changeDate() {
      this.paginationPara.startDate = this.form.date[0];
      this.paginationPara.endDate = this.form.date[1];
    },
    changeParent(name, value) {
      this[name] = value;
    },
    // 查询
    searchFun() {
      this.getList(this.paginationPara);
    },
    handleViewDetails(index, row) {
      this.checkId = row.id;
      this.viewDetailsModel = true;
    },
    handleStartReport(index, row) {
      this.checkId = row.id;
      this.startReportModel = true;
    },
    handlestartReview(index, row) {
      this.checkId = row.id;
      this.startReviewVisible = true;
    },
    handleReReport() {
      this.reReportVisible = true;
    },
    // 代办填报
    handleFillIn() {
      this.active = 1;
      this.form = {
        typeArr: [
          { name: "全部", id: "" },
          { name: "待填报", id: 0 },
          { name: "待审核", id: 1 },
          { name: "已完成", id: 3 }
        ],
        date: ""
      };
      this.paginationPara.queryType = 1;
      this.paginationPara.evaluateStatus = 0;
      this.paginationPara.startDate = "";
      this.paginationPara.endDate = "";
      this.paginationPara.taskName = "";
      this.getList(this.paginationPara);
    },
    // 代办审核
    handleToExamine() {
      this.active = 2;
      this.form = {
        typeArr: [
          { name: "全部", id: "" },
          { name: "待审核", id: 1 },
          { name: "已完成", id: 3 }
        ],
        date: ""
      };
      this.paginationPara.queryType = 2;
      this.paginationPara.evaluateStatus = 1;
      this.paginationPara.startDate = "";
      this.paginationPara.endDate = "";
      this.paginationPara.taskName = "";
      this.getList(this.paginationPara);
    }
  }
};
</script>

