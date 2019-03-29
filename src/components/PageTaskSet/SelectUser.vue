<template>
  <el-dialog title="选择用户" :visible="reversedMessage" @close="handleCancel" append-to-body>
    <div style="margin-bottom: 10px; padding-left: 46%;">
      <el-input placeholder="请输入姓名/用户名" v-model="getApprovalPara.keyWord" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchFun"></el-button>
      </el-input>
    </div>
    <el-table
      :data="approvalList"
      ref="multipleTable"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="real_name" label="姓名"></el-table-column>
      <el-table-column prop="user_name" label="用户名"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column prop="dept_name" label="所属组织"></el-table-column>
      <el-table-column prop="cell_phone_number" label="联系电话"></el-table-column>
    </el-table>
    <Pagination
      :paginationPara="getApprovalPara"
      :total="totalApprovalList"
      :getList="getApproval"
    />
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="selectApproval">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Pagination from "../Common/Pagination.vue";
export default {
  data() {
    return {
      getApprovalPara: {
        current: 1,
        pageSize: 10,
        keyWord: ""
      },
      totalApprovalList: "",
      multipleSelection: [],
      multipleList: [],
      approvalList: [], // 用户列表
      // reviewerListTemp: []
    };
  },
  props: ["changeParent", "approvalTableModel", "deptId", "reviewerListParent"],
  computed: {
    reversedMessage: function() {
      return this.approvalTableModel;
    },
    reviewerList: {
      get: function() {
        return this.reviewerListParent;
      },
      // set: function(newValue) {
      //   console.log(newValue);
      //   // debugger
      //   return (this.reviewerListTemp = newValue);
      // }
    }
  },
  created() {
    this.getApprovalPara.deptId = this.deptId;
    this.getApproval(this.getApprovalPara);
  },
  components: {
    Pagination
  },
  methods: {
    // 获取审核人
    getApproval(para) {
      this.$get("/deptOrUserQuery/getReviewerPage", para, data => {
        this.approvalList = data.page.records;
        this.totalApprovalList = data.page.total;
        // if (this.reviewerListTemp.length > 0) {
        //   this.playUp(this.reviewerListTemp);
        // } else if (this.reviewerList.length > 0) {
        //   this.playUp(this.reviewerList);
        // }
         if (this.reviewerList.length > 0) {
          this.playUp(this.reviewerList);
        }
      });
    },
    handleCancel() {
      this.changeParent("approvalTableModel", false);
    },
    // 搜索
    searchFun() {
      // this.reviewerList = this.reviewerListTemp.concat(this.multipleList);
      this.getApproval(this.getApprovalPara);
    },
    // 选择
    handleSelectionChange(val) {
      console.log("选择的", val);
      if (val.length > 5) {
        this.$message({
          message: "最多添加5个子指标项。",
          type: "warning"
        });
        this.$refs.multipleTable.toggleRowSelection(val[val.length - 1]);
        return;
      }
      this.multipleSelection = val;
      const temp = [];
      for (let i = 0; i < val.length; i++) {
        temp.push({ userId: val[i].id });
      }
      this.multipleList = temp;
      // console.log("最终拥有的", temp);
    },
    // 渲染
    playUp(list) {
      console.log(list);
      const temp = [];
      new Promise((resolve, reject) => {
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < this.approvalList.length; j++) {
            if (this.approvalList[j].id === list[i].userId) {
              temp.push(this.approvalList[j]);
            }
          }
        }
        resolve();
      }).then(() => {
        this.$refs.multipleTable.clearSelection();
        temp.forEach(temp => {
          this.$refs.multipleTable.toggleRowSelection(temp, true);
        });
      });
    },
    // 确定
    selectApproval() {
      const temp = this.multipleSelection;
      let tempArr = [];
      for (let i = 0; i < temp.length; i++) {
        tempArr.push(temp[i].real_name);
      }
      this.changeParent("multipleSelectionName", tempArr.join(","));
      this.changeParent("reviewerList", this.multipleList);
      this.handleCancel();
    }
  }
};
</script>

