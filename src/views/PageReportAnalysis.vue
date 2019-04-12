<template>
  <div class="d-content d-flex">
    <div class="d-left" id="leftTree">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :highlight-current="true"
        :current-node-key="selectTreeId"
        :default-expanded-keys="[openParentId]"
        node-key="id"
        ref="tree"
        :auto-expand-parent="true"
        :check-on-click-node="true"
        :accordion="true"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        :render-content="renderContent"
      ></el-tree>
    </div>
    <div class="d-right">
      <div class="search">
        <el-row>
          <el-col :span="12">
            <label class="el-form-item__label">考评任务</label>
            <el-select
              v-model="region"
              style="width: 180px; padding-top: 5px;"
              placeholder="请选择"
              @change="handleChange"
            >
              <el-option
                v-for="item in taskList"
                :key="item.id"
                :label="item.taskName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-tooltip class="item" effect="dark" content="打印" placement="bottom">
              <i
                class="el-icon-printer"
                @click="printFun"
                style="font-size: 20px; margin-top: 10px; cursor: pointer"
              ></i>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>

      <div class="d-flex-div">
        <el-table id="printf" class="d-flex-table" :data="tableData" style="position:absolute; width:100%;">
          <el-table-column
            v-for="item in nameArr"
            :key="item"
            :prop="`name${item}`"
            :label="titleArr[`name${item}`]"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      region: "",
      currentPage: 1,
      nameArr: [],
      tableData: [],
      taskList: [],
      titleArr: [],
      defaultProps: {
        children: "children",
        label: "deptName"
      },
      treeData: [],
      selectTreeId: 2, // 默认选中的字节
      openParentId: 1, // 默认选中的子节点
      loginDeptId: "",
      firstPid: "",
      treeList: []
    };
  },
  created() {
    this.getTreeList();
  },
  methods: {
    renderContent(h, { node, data, store }) {
      let label = node.label;
      return (
        <span class="custom-tree-node">
          <span
            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; width: 180px;"
            class="el-tree-node__label"
            title={node.label}
          >
            {node.label}
          </span>
        </span>
      );
    },
    // 表格名字解析
    getTableList(tempList) {
      const size = tempList.size;
      if (size === 0) return;
      let tempArr = [];
      for (let i = 0; i < size; i++) {
        tempArr.push(i);
      }
      this.nameArr = tempArr;
      this.titleArr = tempList.list[0];
      this.tableData = tempList.list.slice(1);
      setTimeout(()=>{
        let one = document.querySelector(".d-flex-table").offsetHeight;
        document.querySelector(".d-flex-div").style.height = one+'px';
      },0)
    },
    // 获取表格
    getTemp(id) {
      this.$get(`/analysisReport/list/${id}`, null, data => {
        this.getTableList(data.object);
      });
    },
    // 获取左边树的list
    getTreeList() {
      this.$get("/deptOrUserQuery/getLoginUserDeptList", null, data => {
        this.treeList = data.list;
        this.getUserInfo();
      });
    },
    // 获取考评任务
    getTask(id) {
      this.$get("/MeEvaluateTask/getEvaluateTaskList", { deptId: id }, data => {
        this.taskList = data.object;
      });
    },
    // 获取登录用户的组织id  登录用户的组织id即为最顶层id
    getUserInfo() {
      this.$get("/user/loginUserInfo", null, data => {
        this.loginDeptId = data.object.deptId;
        new Promise((resolve, reject) => {
          this.handleTree(this.loginDeptId, this.treeList);
          resolve();
        }).then(() => {
          this.treeData = this.getTree(this.treeList, this.firstPid);
        });
      });
    },
    //转成树
    getTree(data, Pid) {
      let result = [];
      let temp;
      for (let i = 0; i < data.length; i++) {
        if (data[i].fid == Pid) {
          temp = this.getTree(data, data[i].id);
          if (temp.length > 0) {
            data[i].children = temp;
          }
          result.push(data[i]);
        }
      }
      return result;
    },
    // 找最顶层id的父元素
    handleTree(id, list) {
      const tempArr = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          this.firstPid = list[i].fid;
          return;
        }
      }
    },
    // 选择树
    handleNodeClick(data, node) {
      const id = data.id;
      this.nameArr = [];
      this.titleArr = [];
      this.tableData = [];
      this.region = "";
      document.querySelector(".d-flex-div").style.height = 60+'px';
      this.getTask(id);
    },
    // 选择考评任务
    handleChange(value) {
      this.nameArr = [];
      this.titleArr = [];
      this.tableData = [];
      document.querySelector(".d-flex-div").style.height = 60+'px';
      this.getTemp(value);
    },
    // 打印
    printFun() {
      let tableToPrint = document.getElementById("printf"); //将要被打印的表格
      let newWin = window.open(""); //新打开一个空窗口
      newWin.document.write(tableToPrint.outerHTML); //将表格添加进新的窗口
      let th = newWin.document.getElementsByTagName("th");
      let tr = newWin.document.getElementsByTagName("tr");
      for (let i = 0; i < th.length; i++) {
        th[i].setAttribute("style", "text-align: left");
      }
      for (let i = 0; i < tr.length; i++) {
        tr[i].setAttribute("style", "height: 36px");
        tr[i].setAttribute("style", "line-height: 36px");
      }
      newWin.document.close(); //在IE浏览器中使用必须添加这一句
      newWin.focus(); //在IE浏览器中使用必须添加这一句
      newWin.print(); //打印
      newWin.close(); //关闭窗口
    }
  }
};
</script>

