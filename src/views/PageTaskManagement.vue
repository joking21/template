<template>
  <div class="d-content">
    <div class="search" style="padding: 10px 14px 6px 14px;">
      <el-row style="margin-bottom: 15px;">
        <el-button size="small" icon="el-icon-delete" type="danger" @click="deleteTemplateAll">删除任务</el-button>
      </el-row>
      <el-form :inline="true" :model="paginationPara" class="demo-form-inline">
        <el-form-item label="考评对象">
          <el-select v-model="paginationPara.deptId" style="width: 180px;" placeholder="请选择考评对象">
            <el-option label="全部" :value="''"></el-option>
            <el-option
              v-for="item in objectOfEvaluationData"
              :key="item.id"
              :label="item.deptStructureName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select
            v-model="paginationPara.taskStatus"
            style="width: 180px;"
            placeholder="请选择任务状态"
          >
            <el-option label="全部" :value="''"></el-option>
            <el-option label="待填报" :value="0"></el-option>
            <el-option label="待审核" :value="1"></el-option>
            <el-option label="已完成" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="paginationPara.taskName" placeholder="请输入任务名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchFun">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="taskName" label="任务名称"></el-table-column>
      <el-table-column prop="deptName" label="考评对象"></el-table-column>
      <el-table-column prop="fillUserName" label="填报人"></el-table-column>
      <el-table-column prop="taskStatus" label="任务状态"></el-table-column>
      <el-table-column prop="evaluateCycle" label="考评周期"></el-table-column>
      <el-table-column prop="distributeDate" label="派发时间"></el-table-column>
      <el-table-column prop="reviewerName" label="审核人"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <!-- <a
            class="operator"
            v-if="scope.row.id===1"
            @click="handleViewDetails(scope.$index, scope.row)"
          >查看详情</a>
          <a
            class="operator"
            v-if="scope.row.id===2"
            @click="handlestartReview(scope.$index, scope.row)"
          >开始审核</a>-->
          <!-- <a
            class="operator"
            v-if="scope.row.taskStatus==='待填报'"
            @click="handleViewDetails(scope.$index, scope.row)"
          >查看详情</a>-->
          <a
            class="operator"
            v-if="scope.row.taskStatus==='已完成' || scope.row.taskStatus==='待填报'"
            @click="handleViewDetails(scope.$index, scope.row)"
          >查看详情</a>
          <a
            class="operator"
            v-if="scope.row.taskStatus==='待审核'"
            @click="handlestartReview(scope.$index, scope.row)"
          >开始审核</a>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :paginationPara="paginationPara" :total="total" :getList="getList"/>
    <!-- 查看详情 -->
    <ViewDetails
      v-if="viewDetailsModel"
      :viewDetailsModel="viewDetailsModel"
      :changeParent="changeParent"
      :checkId="checkId"
    />
    <!-- 开始审核 -->
    <StartReview
      v-if="startReviewVisible"
      :getList="getList"
      :startReviewVisible="startReviewVisible"
      :changeParent="changeParent"
      :checkId="checkId"
    />
  </div>
</template>
<script>
import ViewDetails from "../components/PageMyTask/ViewDetails.vue";
import StartReview from "../components/PageMyTask/StartReview.vue";
import Pagination from "../components/Common/Pagination.vue";
export default {
  data() {
    return {
      currentPage: 1,
      tableData: [],
      multipleSelection: "",
      paginationPara: {
        currentPage: 1, // 当前页码
        pageSize: 10, //每页大小
        deptId: "", // 考评对象
        taskStatus: 1, //任务状态(0、待填报，1、待审核，3、已完成)
        taskName: "" // 任务名称
      },
      viewDetailsModel: false,
      startReviewVisible: false,
      objectOfEvaluationData: [], // 考评对象
      total: 0,
      checkId: ""
    };
  },
  components: {
    ViewDetails,
    StartReview,
    Pagination
  },
  created() {
    this.getObjectOfEvaluation();
    this.getList(this.paginationPara);
  },
  methods: {
    // 获取列表信息
    getList(para = this.paginationPara) {
      this.$get("/taskManager/getTaskPage", para, data => {
        this.tableData = data.page.records;
        this.total = data.page.total;
        this.paginationPara.pageSize = data.page.size;
        this.paginationPara.currentPage = data.page.current;
      });
    },
    // 获取考评对象
    getObjectOfEvaluation() {
      this.$get("/deptOrUserQuery/getLoginUserDeptList", null, data => {
        this.objectOfEvaluationData = data.list;
      });
    },
    searchFun() {
      this.getList(this.paginationPara);
    },

    changeParent(name, value) {
      this[name] = value;
    },
    handleViewDetails(index, row) {
      this.checkId = row.id;
      this.viewDetailsModel = true;
    },
    handlestartReview(index, row) {
      this.checkId = row.id;
      this.startReviewVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除选中的指标项
    deleteTemplateAll() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error("请您先选择要删除的任务名称！");
      }
      const idList = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        idList.push(this.multipleSelection[i].id);
      }
      this.$confirm("是否确定删除选中的任务？", "删除任务", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/taskManager/deleteUserTask", idList, () => {
            this.getList();
          });
        })
        .catch(() => {});
    }
  }
};
</script>

