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
      @select="selectionChange"
      @select-all="selectAll"
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
      approvalList: [], // 用户列表
      reviewerList: [],
      reviewerName: []
    };
  },
  props: [
    "changeParent",
    "approvalTableModel",
    "deptId",
    "reviewerListParent",
    "multipleSelectionName"
  ],
  computed: {
    reversedMessage: function() {
      return this.approvalTableModel;
    }
  },
  created() {
    this.reviewerList = JSON.parse(JSON.stringify(this.reviewerListParent));
    this.reviewerName =
      (this.multipleSelectionName && this.multipleSelectionName.split(",")) ||
      [];
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
      this.getApproval(this.getApprovalPara);
    },
    // 渲染
    playUp(list) {
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
    selectionChange(selection, row) {
      const temp = [];
      for (let i = 0; i < this.reviewerList.length; i++) {
        if (row.id === this.reviewerList[i].userId) {
          this.reviewerList.splice(i, 1);
          for (let k = 0; k < this.reviewerName.length; k++) {
            if (this.reviewerName[k] === row.real_name) {
              this.reviewerName.splice(k, 1);
            }
          }
          return;
        } else {
          temp.push(1);
        }
      }
      if (temp.length === this.reviewerList.length) {
        if (this.reviewerList.length >= 5) {
          this.$message({
            message: "最多添加5个子指标项。",
            type: "warning"
          });
          this.playUp(this.reviewerList);
          return;
        }
        this.reviewerList.push({ userId: row.id });
        this.reviewerName.push(row.real_name);
      }
    },
    selectAll(selection) {
      for (let i = 0; i < selection.length; i++) {
        const temp = [];
        for (let j = 0; j < this.reviewerList.length; j++) {
          if (selection[i].id !== this.reviewerList[j].userId) {
            temp.push(1);
          }
        }
        if (temp.length === this.reviewerList.length) {
          if (this.reviewerList.length >= 5) {
            this.$message({
              message: "最多添加5个子指标项。",
              type: "warning"
            });
            this.playUp(this.reviewerList);
            return;
          }
          this.reviewerList.push({ userId: selection[i].id });
          this.reviewerName.push(selection[i].real_name);
        }
      }
      this.playUp(this.reviewerList);
    },
    // 确定
    selectApproval() {
      this.changeParent("multipleSelectionName", this.reviewerName.join(","));
      this.changeParent("reviewerList", this.reviewerList);
      this.handleCancel();
    }
  }
};
</script>

