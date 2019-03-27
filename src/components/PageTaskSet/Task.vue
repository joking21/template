<template>
  <el-dialog :title="isTaskEdit?'编辑任务':'添加任务'" :visible="reversedMessage" @close="handleCancel">
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="任务名称">
        <el-input style="width: 80%;" v-model="form.taskName"></el-input>
      </el-form-item>
      <el-form-item label="考评模板">
        <el-select v-model="form.templateId" style="width: 80%;" placeholder="请选择考评模板">
          <el-option
            v-for="item in templateList"
            :key="item.id"
            :label="item.templateName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考评对象">
        <el-select v-model="getApprovalPara.deptId" style="width: 80%;" placeholder="请选择">
          <el-option
            v-for="item in objectOfEvaluationData"
            :key="item.id"
            :label="item.deptName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核人">
        <el-input
          style="width: 80%;"
          v-model="multipleSelectionName"
          @focus="approvalTableModel = true"
        ></el-input>
      </el-form-item>
      <el-form-item label="考评周期">
        <el-radio v-model="form.evaluateType" label="1">按月</el-radio>
        <el-radio v-model="form.evaluateType" label="2">按季度</el-radio>
        <el-radio v-model="form.evaluateType" label="3">按年</el-radio>
        <div class="d-setTaskInput" v-if="form.evaluateType==='1'">
          <el-col :span="8">
            <el-radio v-model="form.radioChild" label="first">每月第一天</el-radio>
          </el-col>
          <el-col :span="10">
            <el-radio v-model="form.radioChild" label="center">
              每月第
              <el-input-number
                :min="1"
                :max="31"
                v-model="form.radioDay"
                :step="1"
                :controls="false"
                style="width: 60px;"
              ></el-input-number>天
            </el-radio>
          </el-col>
          <el-col :span="6">
            <el-radio v-model="form.radioChild" label="last">每月最后一天</el-radio>
          </el-col>
        </div>
        <div class="d-setTaskInput" v-if="form.evaluateType==='2'">
          <el-col :span="6">
            <el-radio v-model="form.radioChild" label="first">每季第一天</el-radio>
          </el-col>
          <el-col :span="12">
            <el-radio v-model="form.radioChild" label="center">
              第
              <el-input-number
                :min="1"
                :max="12"
                v-model="form.radioMonth"
                :step="1"
                :controls="false"
                style="width: 60px;"
              ></el-input-number>月第
              <el-input-number
                :min="1"
                :max="31"
                v-model="form.radioDay"
                :step="1"
                :controls="false"
                style="width: 60px;"
              ></el-input-number>天
            </el-radio>
          </el-col>
          <el-col :span="6">
            <el-radio v-model="form.radioChild" label="last">每季最后一天</el-radio>
          </el-col>
        </div>
        <div class="d-setTaskInput" v-if="form.evaluateType==='3'">
          <el-col :span="6">
            <el-radio v-model="form.radioChild" label="first">每年第一天</el-radio>
          </el-col>
          <el-col :span="12">
            <el-radio v-model="form.radioChild" label="center">
              第
              <el-input-number
                :min="1"
                :max="12"
                v-model="form.radioMonth"
                :step="1"
                :controls="false"
                style="width: 60px;"
              ></el-input-number>月第
              <el-input-number
                :min="1"
                :max="31"
                v-model="form.radioDay"
                :step="1"
                :controls="false"
                style="width: 60px;"
              ></el-input-number>天
            </el-radio>
          </el-col>
          <el-col :span="6">
            <el-radio v-model="form.radioChild" label="last">每年最后一天</el-radio>
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="任务生效期" style="padding-top: 4px; ">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <p style="color: #ff0000;">系统会在生效期内按照考评周期定时派发任务。</p>
      </el-form-item>
      <el-form-item label="任务描述">
        <el-input type="textarea" v-model="form.taskDescribe"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="submit">确 定</el-button>
    </div>
    <el-dialog title="选择用户" :visible.sync="approvalTableModel" append-to-body>
      <div style="margin-bottom: 10px; padding-left: 46%;">
        <el-input placeholder="请输入姓名/用户名" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-table
        :data="approvalList"
        ref="multipleTable"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="status1" label="角色"></el-table-column>
        <el-table-column prop="status2" label="所属组织"></el-table-column>
        <el-table-column prop="status2" label="联系电话"></el-table-column>
      </el-table>
      <Pagination
        :paginationPara="getApprovalPara"
        :total="totalApprovalList"
        :getList="getApproval"
      />
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="approvalTableModel=false">取 消</el-button>
        <el-button size="medium" type="primary" @click="selectApproval">确 定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<style lang="less">
.d-setTaskInput {
  .el-input__inner {
    height: 30px;
  }
}
</style>
<script>
import Pagination from "../Common/Pagination.vue";
export default {
  data() {
    return {
      form: {
        taskName: "", // 任务名称
        templateId: "", // 考评模板
        evaluateType: "", // 考评周期
        date: "",
        taskDescribe: "", // 任务描述
        radioMonth: "", // 第X月
        radioDay: "", // 第X天
        radioChild: "first"
      },
      templateList: [],
      approvalList: [],
      approvalTableModel: false,
      getApprovalPara: {
        current: 1,
        pageSize: 10,
        deptId: ""
      },
      totalApprovalList: "",
      multipleSelection: [],
      multipleSelectionName: "",
      reviewerList: [] // 审批人
    };
  },
  props: ["taskModel", "changeParent", "isTaskEdit", "objectOfEvaluationData", "getList"],
  computed: {
    reversedMessage: function() {
      return this.taskModel;
    },
    changeDeptId: function() {
      return this.getApprovalPara.deptId;
    }
  },
  components: {
    Pagination
  },
  created() {
    this.getTemplate();
    // this.getApproval(this.getApprovalPara);
  },
  methods: {
    // 获取考评模板
    getTemplate() {
      this.$get("/deptOrUserQuery/getTemList", null, data => {
        this.templateList = data.list;
      });
    },
    // 获取审批人
    getApproval(para) {
      para.pageNumber = para.current;
      this.$get("/deptOrUserQuery/getReviewerPage", para, data => {
        this.approvalList = data.page.records;
        this.totalApprovalList = data.page.total;
        console.log(this.approvalList);
      });
    },
    handleSelectionChange(val) {
      if (val.length > 5) {
        this.$message({
          message: "最多添加5个子指标项。",
          type: "warning"
        });
        this.$refs.multipleTable.toggleRowSelection(val[val.length - 1]);
        return;
      }
      this.multipleSelection = val;
    },
    handleCancel() {
      this.changeParent("taskModel", false);
    },
    selectApproval() {
      const temp = this.multipleSelection;
      let tempArr = [];
      let selectArr = [];
      for (let i = 0; i < temp.length; i++) {
        tempArr.push(temp[i].userName);
        selectArr.push({ userId: temp[i].id });
      }
      this.reviewerList = selectArr;
      this.multipleSelectionName = tempArr.join("、");
      this.approvalTableModel = false;
    },
    submit() {
      const date = this.form.date;
      const para = {
        evaluateTask: {
          taskName: this.form.taskName,
          templateId: this.form.templateId,
          deptId: this.getApprovalPara.deptId,
          evaluateType: this.form.evaluateType,
          taskDescribe: this.form.taskDescribe,
          startCycle: date[0],
          endCycle: date[1]
        },
        reviewerList: this.reviewerList
      };
      if (this.form.evaluateType == 1 && this.form.radioChild == "center") {
        para.evaluateTask.taskGenerateRule = this.form.radioDay;
      } else if (
        (this.form.evaluateType == 2 || this.form.evaluateType == 3) &&
        this.form.radioChild == "center"
      ) {
        para.evaluateTask.taskGenerateRule = `${this.form.radioMonth}:${
          this.form.radioDay
        }`;
      } else {
        para.evaluateTask.taskGenerateRule = this.form.radioChild;
      }
      // {evaluateTaskInsert: para}
      this.$post('/MeEvaluateTask/insertOrUpdate', para, ()=>{
        this.getList();
        this.handleCancel();
      })
    }
  },
  watch: {
    changeDeptId() {
      this.getApproval(this.getApprovalPara);
    }
  }
};
</script>

