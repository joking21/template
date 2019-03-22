<template>
  <div class="d-content">
    <div class="d-left" id="leftTree">
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
    </div>
    <div class="d-right">
      <div class="search">
        <el-row>
          <el-col :span="12">
             <label class="el-form-item__label">考评任务</label>
            <el-select v-model="region" style="width: 180px; padding-top: 5px;" placeholder="请选择">
            <el-option label="组1" value="beijing"></el-option>
            <el-option label="组2" value="beijing1"></el-option>
            <el-option label="组3" value="beijing2"></el-option>
            <el-option label="组4" value="beijing3"></el-option>
          </el-select>
          </el-col>
          <el-col :span="12" style="text-align: right;">
              <el-tooltip class="item" effect="dark" content="打印" placement="bottom">
                <!-- <el-button>下边</el-button> -->
                 <i class="el-icon-printer" @click="printFun" style="font-size: 20px; margin-top: 10px; cursor: pointer"></i>
             </el-tooltip>
          </el-col>
        </el-row>
      </div>
      <el-table
        id="printf"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="name" label="指标项"></el-table-column>
        <el-table-column prop="status" label="指标来源"></el-table-column>
        <el-table-column prop="status1" label="指标描述"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      region: "",
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
      openParentId: 1 // 默认选中的子节点
    };
  },
  mounted() {},
  methods: {
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
    // 打印
    printFun() {
      var tableToPrint = document.getElementById("printf"); //将要被打印的表格
      var newWin = window.open(""); //新打开一个空窗口
      newWin.document.write(tableToPrint.outerHTML); //将表格添加进新的窗口
      newWin.document.close(); //在IE浏览器中使用必须添加这一句
      newWin.focus(); //在IE浏览器中使用必须添加这一句
      newWin.print(); //打印
      newWin.close(); //关闭窗口
    }
  }
};
</script>

