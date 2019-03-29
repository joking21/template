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
        <el-select v-model="form.deptId" style="width: 80%;" placeholder="请选择"  @change="changeDeptId">
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
          :disabled="!form.deptId"
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
    <SelectUser
      v-if="approvalTableModel && form.deptId"
      :approvalTableModel="approvalTableModel"
      :changeParent="changeSelectUser"
      :deptId="form.deptId"
      :reviewerListParent="reviewerList"
      :multipleSelectionName="multipleSelectionName"
    />
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
import Vue from "vue";
import SelectUser from "./SelectUser.vue";
export default {
  data() {
    return {
      form: {
        taskName: "", // 任务名称
        templateId: "", // 考评模板
        deptId: "", // 考评对象
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
      approvalTableModel: false,
      multipleSelectionName: "",
      reviewerList: []
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
    // Pagination
    SelectUser
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
    changeSelectUser(name, value) {
      this[name] = value;
    },
    // 修改考评对象
    changeDeptId() {
      this.multipleSelectionName = "";
      this.reviewerList = []; // 审批人
    },
    // 编辑-获取详情
    getDetails() {
      this.$get(`/MeEvaluateTask/getTaskInfo/${this.editId}`, null, data => {
        const _obj = data.object;
        this.form = {
          taskName: _obj.taskName, // 任务名称
          templateId: _obj.templateId, // 考评模板
          deptId: _obj.deptId, // 考评对象
          evaluateType: _obj.evaluateType, // 考评周期
          date: [_obj.startCycle, _obj.endCycle],
          taskDescribe: _obj.taskDescribe // 任务描述
        };
        this.multipleSelectionName = _obj.reviewersName;
        const reviewersIds =
          (_obj.reviewersIds && _obj.reviewersIds.split(",")) || [];
        for (let item of reviewersIds) {
          this.reviewerList.push({ userId: item });
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
      });
    },
    handleCancel() {
      this.changeParent("taskModel", false);
    },
    submit() {
      const date = this.form.date;
      const para = {
        evaluateTask: {
          taskName: this.form.taskName,
          templateId: this.form.templateId,
          deptId: this.form.deptId,
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
          para.evaluateTask.taskGenerateRule = this.form[
            `radioChild${this.form.evaluateType}`
          ];
        } else {
          para.evaluateTask.taskGenerateRule = `${this.form.radioMonth}:${
            this.form.radioDay
          }`;
        }
      }
      this.isTaskEdit ? (para.evaluateTask.id = this.editId) : null;
      this.$post("/MeEvaluateTask/insertOrUpdate", para, () => {
        this.getList();
        this.handleCancel();
      });
    }
  },
  watch:{
  }
};
</script>

