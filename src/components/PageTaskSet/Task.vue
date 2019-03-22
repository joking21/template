<template>
  <el-dialog :title="isTaskEdit?'编辑任务':'添加任务'" :visible="reversedMessage" @close="handleCancel">
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="任务名称">
        <el-input style="width: 220px;" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="考评模板">
        <el-select v-model="form.region1" style="width: 220px;" placeholder="请选择">
          <el-option label="组1" value="beijing"></el-option>
          <el-option label="组2" value="beijing1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考评对象">
        <el-select v-model="form.region2" style="width: 220px;" placeholder="请选择">
          <el-option label="组1" value="beijing"></el-option>
          <el-option label="组2" value="beijing1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核人">
        <!-- 多选 -->
        <el-select v-model="form.region3" multiple :multiple-limit='5' placeholder="请选择">
          <el-option label="组1" value="beijing"></el-option>
          <el-option label="组2" value="beijing1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考评周期">
        <el-radio v-model="form.radio" label="1">按月</el-radio>
        <el-radio v-model="form.radio" label="2">按季度</el-radio>
        <el-radio v-model="form.radio" label="3">按年</el-radio>
        <div class="d-setTaskInput" v-if="form.radio==='1'">
          <el-col :span="6">
            <el-radio v-model="form.radioChild" label="1">每月第一天</el-radio>
          </el-col>
          <el-col :span="10">
            <el-radio v-model="form.radioChild" label="2">
              每月第
              <el-input v-model="form.radioDay" style="width: 60px;"></el-input>天
            </el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio v-model="form.radioChild" label="3">每月最后一天</el-radio>
          </el-col>
        </div>
        <div class="d-setTaskInput" v-if="form.radio==='2'">
          <el-col :span="6">
            <el-radio v-model="form.radioChild" label="4">每季第一天</el-radio>
          </el-col>
          <el-col :span="10">
            <el-radio v-model="form.radioChild" label="5">
              每季第
              <el-input v-model="form.radioDay" style="width: 60px;"></el-input>天
            </el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio v-model="form.radioChild" label="6">每季最后一天</el-radio>
          </el-col>
        </div>
        <div class="d-setTaskInput" v-if="form.radio==='3'">
          <el-col :span="6">
            <el-radio v-model="form.radioChild" label="7">每年第一天</el-radio>
          </el-col>
          <el-col :span="10">
            <el-radio v-model="form.radioChild" label="8">
              每年第
              <el-input v-model="form.radioDay" style="width: 60px;"></el-input>天
            </el-radio>
          </el-col>
          <el-col :span="8">
            <el-radio v-model="form.radioChild" label="9">每年最后一天</el-radio>
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="任务生效期" style="padding-top: 4px; ">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
        <p style="color: #ff0000;">系统会在生效期内按照考评周期定时派发任务。</p>
      </el-form-item>
      <el-form-item label="任务描述">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style lang="less">
.d-setTaskInput{
  .el-input__inner{
    height: 30px;
  }
}
</style>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        desc: "",
        region1: "", // 所属组织
        region2: "",
        region3: "",
        date: "",
        radio: "",
        radioChild: "",
        radioDay: "",
      }
    };
  },
  props: ["taskModel", "changeParent", "isTaskEdit"],
  computed: {
    reversedMessage: function() {
      return this.taskModel;
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        row.rowspan &&
        (columnIndex === 0 || columnIndex === 1 || columnIndex === 2)
      ) {
        return {
          rowspan: row.rowspan,
          colspan: 1
        };
      } else if (row.all && columnIndex === 1) {
        return {
          rowspan: 1,
          colspan: 6
        };
      } else if (
        !(row.rowspan || row.all) &&
        (columnIndex === 0 || columnIndex === 1 || columnIndex === 2)
      ) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    handleCancel() {
      this.changeParent("taskModel", false);
    }
  }
};
</script>

