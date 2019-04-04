<template>
  <div class="d-content">
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
        @node-click="handleNodeClick"
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
              <i
                class="el-icon-printer"
                @click="printFun"
                style="font-size: 20px; margin-top: 10px; cursor: pointer"
              ></i>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
      <el-table id="printf" :data="tableData" style="width: 100%">
        <el-table-column
          v-for="item in nameArr"
          :key="item"
          :prop="`name${item}`"
          :label="titleArr[`name${item}`]"
        ></el-table-column>
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
      nameArr: [],
      tableData: [],
      temp: {
        size: 10,
        list: [
          {
            name6: "2018年7月",
            name5: "2018年6月",
            name4: "2018年5月",
            name3: "2018年4月",
            name9: "平均分",
            name8: "2018年9月",
            name7: "2018年8月",
            name2: "2018年3月",
            name1: "2018年2月",
            name0: ""
          },
          {
            name6: 100,
            name5: 100,
            name4: 100,
            name3: 100,
            name9: 100,
            name8: 100,
            name7: 100,
            name2: 100,
            name1: 100,
            name0: "用户0"
          },
          {
            name6: 100,
            name5: 100,
            name4: 100,
            name3: 100,
            name9: 100,
            name8: 100,
            name7: 100,
            name2: 100,
            name1: 100,
            name0: "用户1"
          },
          {
            name6: 100,
            name5: 100,
            name4: 100,
            name3: 100,
            name9: 100,
            name8: 100,
            name7: 100,
            name2: 100,
            name1: 100,
            name0: "用户2"
          },
          {
            name6: 100,
            name5: 100,
            name4: 100,
            name3: 100,
            name9: 100,
            name8: 100,
            name7: 100,
            name2: 100,
            name1: 100,
            name0: "用户3"
          },
          {
            name6: 100,
            name5: 100,
            name4: 100,
            name3: 100,
            name9: 100,
            name8: 100,
            name7: 100,
            name2: 100,
            name1: 100,
            name0: "用户4"
          },
          {
            name6: 100,
            name5: 100,
            name4: 100,
            name3: 100,
            name9: 100,
            name8: 100,
            name7: 100,
            name2: 100,
            name1: 100,
            name0: "用户5"
          },
          {
            name6: 100,
            name5: 100,
            name4: 100,
            name3: 100,
            name9: 100,
            name8: 100,
            name7: 100,
            name2: 100,
            name1: 100,
            name0: "用户6"
          },
          {
            name6: 100,
            name5: 100,
            name4: 100,
            name3: 100,
            name9: 100,
            name8: 100,
            name7: 100,
            name2: 100,
            name1: 100,
            name0: "用户7"
          },
          {
            name6: 100,
            name5: 100,
            name4: 100,
            name3: 100,
            name9: 100,
            name8: 100,
            name7: 100,
            name2: 100,
            name1: 100,
            name0: "部门平均分"
          }
        ]
      },
      defaultProps: {
        children: "children",
        label: "deptShortName"
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
    this.getTableList();
  },
  methods: {
    // 获取表格
    getTableList() {
      const size = this.temp.size;
      let tempArr = [];
      for (let i = 0; i < size; i++) {
        tempArr.push(i);
      }
      this.nameArr = tempArr;
      this.titleArr = this.temp.list[0];
      this.tableData = this.temp.list.slice(1);
    },
    // 获取左边树的list
    getTreeList() {
      this.$get("/deptOrUserQuery/getLoginUserDeptList", null, data => {
        this.treeList = data.list;
        this.getUserInfo();
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
      console.log(data);
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

