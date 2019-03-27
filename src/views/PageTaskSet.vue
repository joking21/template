<template>
  <div class="d-content">
    <div class="search" style="padding: 10px 14px 6px 14px;">
      <el-row style="margin-bottom: 15px;">
        <el-button size="small" icon="el-icon-plus" type="primary" @click="addTemplate">新增任务</el-button>
        <el-button size="small" icon="el-icon-delete" type="danger" @click="deleteTemplateAll">删除任务</el-button>
      </el-row>
      <el-form :inline="true" :model="selectPara" class="demo-form-inline">
        <el-form-item label="考评对象">
          <el-select v-model="selectPara.deptId" style="width: 250px;" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in objectOfEvaluationData"
              :key="item.id"
              :label="item.deptName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="selectPara.taskStatus" style="width: 180px;" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option label="生效中" :value="1"></el-option>
            <el-option label="已生效" :value="2"></el-option>
            <el-option label="未生效" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="selectPara.taskName" placeholder="请输入任务名称" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="getList(selectPara)">查询</el-button>
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
      <el-table-column prop="taskStatus" label="任务状态"></el-table-column>
      <el-table-column prop="cycle" label="考评周期"></el-table-column>
      <el-table-column prop="createTime" label="任务创建时间"></el-table-column>
      <el-table-column prop="userName" label="任务创建人"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <a class="operator" @click="showPreview(scope.$index, scope.row)">查看</a>
          <a class="operator" @click="editTemplate(scope.$index, scope.row)">编辑</a>
          <a class="operator" @click="deleteTemplate(scope.$index, scope.row)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :paginationPara="selectPara" :total="total" :getList="getList"/>
    <Task
       v-if="taskModel"
      :taskModel="taskModel"
      :isTaskEdit="isTaskEdit"
      :editId="editId"
      :changeParent="changeParent"
      :objectOfEvaluationData="objectOfEvaluationData"
      :getList="getList"
    />
    <Preview  v-if="previewModel" :previewModel="previewModel" :previewId="previewId" :changeParent="changeParent"/>
  </div>
</template>
<script>
import Pagination from "../components/Common/Pagination.vue";
import Task from "../components/PageTaskSet/Task.vue";
import Preview from "../components/PageTaskSet/Preview.vue";
export default {
  data() {
    return {
      selectPara: {
        currentPage: 1,
        pageSize: 10,
        deptId: "", // 考评对象
        taskStatus: "", //任务状态
        taskName: "" // 任务名称
      },
      total: "",
      tableData: [],
      objectOfEvaluationData: [],
      taskModel: false,
      isTaskEdit: false,
      previewModel: false,
      multipleSelection: "",
      editId: "",
      previewId: "",
    };
  },
  components: {
    Task,
    Pagination,
    Preview
  },
  created() {
    this.getList(this.selectPara);
    this.getObjectOfEvaluation();
  },
  methods: {
    getList(para = this.selectPara) {
      this.$get("/MeEvaluateTask/getEvaluateTaskPage", para, data => {
        this.tableData = data.page && data.page.records;
        this.selectPara.currentPage = data.page && data.page.current;
        this.selectPara.pageSize = data.page && data.page.size;
        this.total = data.page && data.page.total;
      });
    },
    // 获取考评对象
    getObjectOfEvaluation() {
      this.$get("/deptOrUserQuery/getLoginUserDeptList", null, data => {
        this.objectOfEvaluationData = data.list;
      });
    },
    changeParent(name, value) {
      this[name] = value;
    },
    addTemplate() {
      this.taskModel = true;
      this.isTaskEdit = false;
    },
    editTemplate(index, row) {
      this.editId = row.id;
      this.taskModel = true;
      this.isTaskEdit = true;
    },
    showPreview(index, row) {
      this.previewId = row.id;
      this.previewModel = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除指标项
    deleteTemplate(index, row) {
      this.$confirm(`是否确定删除指标【${row.taskName}】`, "删除指标", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/MeEvaluateTask/deleteTask", [row.id], () => {
            this.getList(this.selectPara);
          });
        })
        .catch(() => {});
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
      this.$confirm("是否确定删除选中的指标项", "删除指标", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/MeEvaluateTask/deleteTask", idList, () => {
            this.getList(this.selectPara);
          });
        })
        .catch(() => {});
    }
  }
};
</script>

