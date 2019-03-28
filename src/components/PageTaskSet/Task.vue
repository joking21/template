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
        <el-select
          v-model="getApprovalPara.deptId"
          style="width: 80%;"
          placeholder="请选择"
          @change="changeDeptId"
        >
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
          @focus="approvalTableModel=true"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="考评周期">
        <el-radio-group v-model="form.evaluateType">
          <el-radio :label="1">按月</el-radio>
          <el-radio :label="2">按季度</el-radio>
          <el-radio :label="3">按年</el-radio>
        </el-radio-group>
        <div class="d-setTaskInput" v-show="form.evaluateType===1">
          <el-radio-group v-model="form.radioChild1">
            <el-radio label="first">每月第一天</el-radio>
            <el-radio label="center">
              每月第
              <el-input-number
                :min="1"
                :max="31"
                v-model="form.radioDay"
                :controls="false"
                style="width: 60px;"
              ></el-input-number>天
            </el-radio>
            <el-radio label="last">每月最后一天</el-radio>
          </el-radio-group>
        </div>
        <div class="d-setTaskInput" v-show="form.evaluateType===2">
          <el-radio-group v-model="form.radioChild2">
            <el-radio label="first">每季第一天</el-radio>
            <el-radio label="center">
              第
              <el-input-number
                :min="1"
                :max="12"
                v-model="form.radioMonth"
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
            <el-radio label="last">每季最后一天</el-radio>
          </el-radio-group>
        </div>
        <div class="d-setTaskInput" v-show="form.evaluateType===3">
          <el-radio-group v-model="form.radioChild3">
            <el-radio label="first">每年第一天</el-radio>
            <el-radio label="center">
              第
              <el-input-number
                :min="1"
                :max="12"
                v-model="form.radioMonth"
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
            <el-radio label="last">每年最后一天</el-radio>
          </el-radio-group>
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
import { Promise } from "q";
import { debug, debuglog } from "util";
import { setTimeout } from "timers";
import Vue from "vue";
export default {
  data() {
    return {
      form: {
        taskName: "", // 任务名称
        templateId: "", // 考评模板
        evaluateType: 1, // 考评周期
        date: "",
        taskDescribe: "", // 任务描述
        radioMonth: "", // 第X月
        radioDay: "", // 第X天
        radioChild1: "first",
        radioChild2: "first",
        radioChild3: "first"
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
  props: [
    "taskModel",
    "changeParent",
    "isTaskEdit",
    "objectOfEvaluationData",
    "getList",
    "editId"
  ],
  computed: {
    reversedMessage: function() {
      return this.taskModel;
    }
  },
  components: {
    Pagination
  },
  created() {
    this.getTemplate();
    if (this.isTaskEdit) {
      this.getDetails();
    }
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
      });
    },
    // 编辑-获取详情
    getDetails() {
      this.$get(`/MeEvaluateTask/getTaskInfo/${this.editId}`, null, data => {
        const _obj = data.object;
        this.form = {
          taskName: _obj.taskName, // 任务名称
          templateId: _obj.templateId, // 考评模板
          evaluateType: _obj.evaluateType, // 考评周期
          date: [_obj.startCycle, _obj.endCycle],
          taskDescribe: _obj.taskDescribe // 任务描述
        };
        this.getApprovalPara.deptId = _obj.deptId;
        this.multipleSelectionName = _obj.reviewersName;
        const reviewersIds = (_obj.reviewersIds && _obj.reviewersIds.split(',')) || [];
        for(let item of reviewersIds){
          this.reviewerList.push({userId: item});
        }
        if (_obj.evaluateType == 1) {
          if (
            _obj.taskGenerateRule === "last" ||
            _obj.taskGenerateRule === "first"
          ) {
            Vue.set(this.form, "radioChild1", _obj.taskGenerateRule);
          } else {
            Vue.set(this.form, "radioChild1", "center");
            this.form.radioDay = _obj.taskGenerateRule;
          }
        } else {
          if (
            _obj.taskGenerateRule === "last" ||
            _obj.taskGenerateRule === "first"
          ) {
            Vue.set(
              this.form,
              `radioChild${_obj.evaluateType}`,
              _obj.taskGenerateRule
            );
          } else {
            Vue.set(this.form, `radioChild${_obj.evaluateType}`, "center");
            this.form.radioMonth = _obj.taskGenerateRule.split(":")[0];
            this.form.radioDay = _obj.taskGenerateRule.split(":")[1];
          }
        }
        this.getApproval(this.getApprovalPara);
      });
      // multipleSelection: [],
      // reviewerList: [] // 审批人
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
        tempArr.push(temp[i].real_name);
        selectArr.push({ userId: temp[i].id });
      }
      this.reviewerList = selectArr;
      this.multipleSelectionName = tempArr.join(",");
      this.approvalTableModel = false;
    },
    changeDeptId() {
      this.getApproval(this.getApprovalPara);
      this.multipleSelection = [];
      this.multipleSelectionName = "";
      this.reviewerList = []; // 审批人
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
      if (this.form.evaluateType == 1) {
        if (this.form.radioChild1 == "center") {
         para.evaluateTask.taskGenerateRule = this.form.radioDay;
        } else {
          para.evaluateTask.taskGenerateRule = this.form.radioChild1;
        }
      } else {
        if (
         this.form[`radioChild${this.form.evaluateType}`] === "last" ||
         this.form[`radioChild${this.form.evaluateType}`] === "first"
        ) {
          para.evaluateTask.taskGenerateRule = this.form[`radioChild${this.form.evaluateType}`];
        } else {
          para.evaluateTask.taskGenerateRule = `${this.form.radioMonth}:${this.form.radioDay}`;
        }
      }
      this.isTaskEdit ? (para.evaluateTask.id = this.editId) : null;
      this.$post("/MeEvaluateTask/insertOrUpdate", para, () => {
        this.getList();
        this.handleCancel();
      });
    },
  },
  watch: {
    approvalTableModel() {
      if (this.approvalTableModel === true) {
        const temp = [];
        new Promise((resolve, reject) => {
          for (let i = 0; i < this.reviewerList.length; i++) {
            for (let j = 0; j < this.approvalList.length; j++) {
              if (this.approvalList[j].id === this.reviewerList[i].userId) {
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
      }
    }
  }
};
</script>

