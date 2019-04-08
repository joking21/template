<template>
  <div>
    <div class="search">
      <el-row style="margin-bottom: 8px;">
        <el-button size="small" icon="el-icon-plus" type="primary" :disabled="!treeData.level" @click="handleAddIndicator">新增指标</el-button>
        <el-button size="small" icon="el-icon-delete" type="danger" @click="handledeleteSelect">删除指标</el-button>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="d-desc">分类名称：{{treeData.name}}</div>
        </el-col>
        <el-col :span="24">
          <div class="d-desc">上级分类：{{treeData.pIdName || '---'}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="d-desc">描述信息：{{treeData.information || '---'}}</div>
        </el-col>
      </el-row>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="indicatorsName" label="指标项"></el-table-column>
      <el-table-column prop="indicatorsSource" label="指标来源">
        <template slot-scope="scope">{{scope.row.indicatorsSource == 0 ? '人工' : '其它'}}</template>
      </el-table-column>
      <el-table-column prop="indicatorsDescribe" label="指标描述"></el-table-column>
      <el-table-column label="操作" width="120">
        <!-- v-if="scope.row.id===2" -->
        <template slot-scope="scope">
          <a class="operator" @click="handlePreview(scope.$index, scope.row)">查看</a>
          <a class="operator" @click="handleEditIndicator(scope.$index, scope.row)">编辑</a>
          <a class="operator" @click="deleteIndicator(scope.$index, scope.row)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :paginationPara="paginationPara" :total="total" :getList="getList"/>
    <!-- 新增编辑指标项 -->
    <Indicator
      v-if="IndicatorModel"
      :getList="getList"
      :editId="editId"
      :categoryId="paginationPara.categoryId"
      :IndicatorModel="IndicatorModel"
      :IndicatorIsEdit="IndicatorIsEdit"
      :changeParent="changeParent"
    />
    <Preview
      v-if="previewModel"
      :editId="editId"
      :previewModel="previewModel"
      :changeParent="changeParent"
    />
  </div>
</template>
<script>
import Indicator from "./Indicator.vue";
import Preview from "./Preview.vue";
import Pagination from "../Common/Pagination.vue";
export default {
  data() {
    return {
      treeData: {
        name: "",
        pIdName: "",
        information: "",
        level: false,
      },
      paginationPara: {
        currentPage: 1,
        pageSize: 10,
        categoryId: "" // 指标类id
      },
      total: 0,
      tableData: [],
      multipleSelection: [],
      IndicatorModel: false,
      IndicatorIsEdit: false,
      editId: "",
      previewModel: ""
    };
  },
  mounted() {},
  created() {},
  props: ["treeId"],
  components: {
    Indicator,
    Pagination,
    Preview
  },
  methods: {
    // 获取列表
    getList(para = this.paginationPara) {
      this.$get("/meIndicatorsItems/list", para, data => {
        this.tableData = data.page.records;
        this.total = data.page.total;
        this.paginationPara.pageSize = data.page.size;
        this.paginationPara.currentPage = data.page.current;
      });
    },
    // 获取指标信息
    getTreeData(id) {
      this.$get(`/meIndicatorsCategory/info/${id}`, null, data => {
        this.treeData.name = data.object.name;
        this.treeData.pIdName = data.object.pIdName;
        this.treeData.information = data.object.information;
        this.treeData.level = data.object.level;
      });
    },
    changeParent(name, value) {
      this[name] = value;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除指标项
    deleteIndicator(index, row) {
      this.$confirm(`是否确定删除指标【${row.indicatorsName}】？`, "删除指标", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/meIndicatorsItems/delete", {ids:[row.id]}, () => {
            this.getList();
          });
        })
        .catch(() => {});
    },
    // 删除选中的指标项
    handledeleteSelect() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error("请您先选择要删除的任务名称！");
      }
      const idList = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        idList.push(this.multipleSelection[i].id);
      }
      this.$confirm("是否确定删除选中的指标项？", "删除指标", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post("/meIndicatorsItems/delete", {ids:idList}, () => {
            this.getList();
          });
        })
        .catch(() => {});
    },
    handleAddIndicator() {
      this.IndicatorIsEdit = false;
      this.IndicatorModel = true;
    },
    handleEditIndicator(index, row) {
      this.editId = row.id;
      this.IndicatorIsEdit = true;
      this.IndicatorModel = true;
    },
    handlePreview(index, row) {
      this.editId = row.id;
      this.previewModel = true;
    }
  },
  watch: {
    treeId() {
      this.paginationPara.categoryId = this.treeId;
      this.getList(this.paginationPara);
      this.getTreeData(this.treeId);
    }
  }
};
</script>

