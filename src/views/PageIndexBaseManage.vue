<template>
  <div class="d-content">
    <div class="d-left" id="leftTree">
      <el-row style="margin-bottom: 20px;">
        <el-button size="mini" @click="handleNewclassification">新增</el-button>
        <el-button size="mini" @click="handleEditNewclassification">编辑</el-button>
        <el-button size="mini" @click="deleteType" type="danger">删除</el-button>
      </el-row>
      <el-tree
        :data="data"
        :props="defaultProps"
        :highlight-current="true"
        :current-node-key="selectTreeId"
        :default-expanded-keys="[openParentId]"
        node-key="id"
        ref="tree"
        :auto-expand-parent="true"
        :check-on-click-node="true"
        :accordion="true"
        @node-contextmenu="handleRightClick"
        @node-click="handleNodeClick"
        @check-change="handleChangeCurrentData"
      ></el-tree>
      <!-- <button @click="setCheckedKeys">选中</button> <button @click="getCurrentNode">看选择的是谁</button> -->
    </div>
    <div class="d-right">
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
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" :selectable="disabledFun"></el-table-column>
        <el-table-column prop="name" label="指标项"></el-table-column>
        <el-table-column prop="status" label="指标来源"></el-table-column>
        <el-table-column prop="status1" label="指标描述"></el-table-column>
        <el-table-column label="操作" width="120">
          <!-- v-if="scope.row.id===2" -->
          <template slot-scope="scope">
            <a class="operator" >查看</a>
            <a class="operator" @click="handleEditIndicator(scope.$index, scope.row)">编辑</a>
            <a class="operator" @click="deleteIndicator(scope.$index, scope.row)">删除</a>
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
    </div>
    <!-- 新增编辑分类 -->
    <Newclassification
      :NewclassificationModel="NewclassificationModel"
      :NewclassificationIsEdit="NewclassificationIsEdit"
      :changeParent="changeParent"
    />
    <!-- 新增编辑指标项 -->
    <Indicator
      :IndicatorModel="IndicatorModel"
      :IndicatorIsEdit="IndicatorIsEdit"
      :changeParent="changeParent"
    />
  </div>
</template>
<script>
import Newclassification from "../components/PageIndexBaseManage/Newclassification.vue";
import Indicator from "../components/PageIndexBaseManage/Indicator.vue";
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
      defaultProps: {
        children: "children",
        label: "label"
      },
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 2,
              label: "二级 1-1"
            },
            {
              id: 3,
              label: "二级 1-1"
            },
            {
              id: 4,
              label: "二级 1-1"
            }
          ]
        }
      ],
      selectTreeId: 2, // 默认选中的字节
      openParentId: 1, // 默认选中的子节点
      NewclassificationModel: false,
      NewclassificationIsEdit: false,
      IndicatorIsEdit: false,
      IndicatorModel: false,
      multipleSelection: []
    };
  },
  mounted() {},
  components: {
    Newclassification,
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
    // 选择树
    handleNodeClick(data, node) {
      console.log(data);
    },
    // 选中变化时
    handleChangeCurrentData(data, node) {
      console.log("改变时", data);
    },
    setCheckedKeys() {
      this.$refs.tree.setCurrentKey(3);
    },
    getCurrentNode() {
      console.log(this.$refs.tree.getCurrentNode());
    },
    handleRightClick(event, data, node) {
      console.log(event, data, node);
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
    handleNewclassification(index) {
      this.NewclassificationModel = true;
      this.NewclassificationIsEdit = false;
    },
    handleEditNewclassification() {
      this.NewclassificationModel = true;
      this.NewclassificationIsEdit = true;
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

