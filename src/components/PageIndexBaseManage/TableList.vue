<template>
  <div>
    <div class="search">
        <el-row style="margin-bottom: 8px;">
          <el-button
            size="small"
            icon="el-icon-plus"
            type="primary"
            @click="handleAddIndicator"
          >新增指标</el-button>
          <el-button
            size="small"
            icon="el-icon-delete"
            type="danger"
            @click="handledeleteSelect"
          >删除指标</el-button>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="d-desc">分类名称：XXX</div>
          </el-col>
          <el-col :span="12">
            <div class="d-desc">上级分类：XXX</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="d-desc">描述信息：XXX</div>
          </el-col>
        </el-row>
      </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
    >
    <!-- @selection-change="handleSelectionChange" -->
      <el-table-column type="selection" width="55" :selectable="disabledFun"></el-table-column>
      <el-table-column prop="name" label="指标项"></el-table-column>
      <el-table-column prop="status" label="指标来源"></el-table-column>
      <el-table-column prop="status1" label="指标描述"></el-table-column>
      <el-table-column label="操作" width="120">
        <!-- v-if="scope.row.id===2" -->
        <template slot-scope="scope">
          <a class="operator">查看</a>
          <a class="operator" @click="handleEditIndicator(scope.$index, scope.row)">编辑</a>
          <a class="operator" @click="deleteIndicator(scope.$index, scope.row)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增编辑指标项 -->
    <Indicator
      :IndicatorModel="IndicatorModel"
      :IndicatorIsEdit="IndicatorIsEdit"
      :changeParent="changeParent"
    />
  </div>
</template>
<script>
import Indicator from "./Indicator.vue";
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
      IndicatorModel: false,
      IndicatorIsEdit: false
    };
  },
  mounted() {},
  created() {},
  components: {
    Indicator
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    changeParent(name, value) {
      this[name] = value;
    },

    // 禁用table选择框
    disabledFun(row, index) {
      if (row.id === 1) {
        return false;
      }
      return true;
    },

    //删除分类
    deleteType() {
      this.$confirm("是否确定删除指标分类【指标分类名称】", "删除分类", {
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
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    },
    // 删除指标项
    deleteIndicator(index, row) {
      console.log(index, row);
      this.$confirm("是否确定删除指标【指标名称】", "删除指标", {
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
    },
    // 删除选中的指标项
    handledeleteSelect() {
      console.log(this.multipleSelection);
      this.$confirm("是否确定删除选中的指标项", "删除指标", {
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
    },
    handleAddIndicator() {
      this.IndicatorIsEdit = false;
      this.IndicatorModel = true;
    },
    handleEditIndicator() {
      this.IndicatorIsEdit = true;
      this.IndicatorModel = true;
    }
  }
};
</script>

