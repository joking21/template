<template>
  <div class="d-content">
    <div class="search" style="padding: 10px 14px 6px 14px;">
      <el-row style="margin-bottom: 15px;">
        <el-button size="small" icon="el-icon-plus" type="primary" @click="addTemplate">新增模板</el-button>
        <el-button size="small" icon="el-icon-delete" type="danger" @click="deleteTemplateAll">删除模板</el-button>
      </el-row>
      <el-form :inline="true" :model="paginationPara" class="demo-form-inline">
        <el-form-item label="所属组织">
          <el-select v-model="paginationPara.depId" style="width: 180px;" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in objectOfEvaluationData"
              :key="item.id"
              :label="item.deptStructureName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" style="padding-top: 4px; ">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="changeDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="模板名称">
          <el-input
            v-model="paginationPara.templateName"
            placeholder="请输入模板名称"
            style="width: 150px;"
          ></el-input>
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
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="templateName" label="模板名称"></el-table-column>
      <el-table-column prop="deptName" label="所属组织"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="createUser" label="创建人"></el-table-column>
      <el-table-column prop="modifiedTime" label="最后修改时间"></el-table-column>
      <el-table-column prop="modifiedUser" label="修改人"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <a class="operator" @click="previewTemplate(scope.$index, scope.row)">查看</a>
          <a class="operator" @click="editTemplate(scope.$index, scope.row)">编辑</a>
          <a class="operator" @click="deleteTemplate(scope.$index, scope.row)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :paginationPara="paginationPara" :total="total" :getList="getList"/>
    <Template
      v-if="templateModel"
      :templateModel="templateModel"
      :isAdd="isAdd"
      :isTemplateEdit="isTemplateEdit"
      :isPreview="isPreview"
      :changeParent="changeParent"
      :objectOfEvaluationData="objectOfEvaluationData"
      :getList="getList"
      :selectedId="selectedId"
    />
  </div>
</template>
<script>
import Template from "../components/PageTemplateManage/Template.vue";
import Pagination from "../components/Common/Pagination.vue";
export default {
  data() {
    return {
      paginationPara: {
        currentPage: 1, // 当前页码
        pageSize: 10, //每页大小
        depId: "", //组织机构id
        startDate: "", // 派发任务开始
        endDate: "", //派发任务结束
        templateName: "" // 考评模板名字
      },
      date: "",
      total: 0,
      tableData: [],
      objectOfEvaluationData: [],
      templateModel: false,
      isTemplateEdit: false, // 编辑
      isPreview: false, // 查看
      isAdd: false,
      selectedId: '',
      multipleSelection: ""
    };
  },
  components: {
    Template,
    Pagination
  },
  created() {
    this.getList(this.paginationPara);
    this.getObjectOfEvaluation();
  },
  methods: {
    getList(para=this.paginationPara) {
      this.$get("/meEvaluateTemplate/list", para, data => {
        this.tableData = data.page.records;
        this.total = data.page.total;
        this.paginationPara.pageSize = data.page.size;
        this.paginationPara.currentPage = data.page.current;
      });
    },
      // 获取所属组织
    getObjectOfEvaluation() {
      this.$get("/deptOrUserQuery/getLoginUserDeptList", null, data => {
        this.objectOfEvaluationData = data.list;
      });
    },
    changeDate() {
      console.log(this.date);
      this.paginationPara.startDate = this.date[0];
      this.paginationPara.endDate = this.date[1];
    },
    changeParent(name, value) {
      this[name] = value;
    },
    addTemplate() {
      this.templateModel = true;
      this.isAdd = true;
      this.isTemplateEdit = false;
      this.isPreview = false;
    },
    editTemplate(index, row) {
      this.selectedId = row.id;
      this.templateModel = true;
      this.isAdd = false;
      this.isTemplateEdit = true;
      this.isPreview = false;
    },
    previewTemplate(index, row) {
      this.selectedId = row.id;
      this.templateModel = true;
      this.isAdd = false;
      this.isTemplateEdit = false;
      this.isPreview = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 禁用table选择框
    // :selectable="disabledFun"
    // disabledFun(row, index) {
    //   if (row.id === 1) {
    //     return false;
    //   }
    //   return true;
    // },
    // 删除模板
    deleteTemplate(index, row) {
      console.log(index, row);
      this.$confirm(`是否确定删除模板【${row.templateName}】？`, "删除模板", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/meEvaluateTemplate/delete", {ids:[row.id]}, () => {
            this.getList();
          });
        })
        .catch(() => {});
    },
    // 删除选中的模板
    deleteTemplateAll() {
       if (this.multipleSelection.length === 0) {
        return this.$message.error("请您先选择要删除的模板名称！");
      }
      const idList = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        idList.push(this.multipleSelection[i].id);
      }
      this.$confirm("是否确定删除选中的模板？", "删除模板", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/meEvaluateTemplate/delete", {ids:idList}, () => {
            this.getList();
          });
        })
        .catch(() => {});
    }
  }
};
</script>

