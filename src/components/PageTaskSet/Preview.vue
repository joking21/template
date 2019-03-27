<template>
  <el-dialog title="查看任务" :visible="reversedMessage" @close="handleCancel">
    <el-form label-width="30%" class="preiewForm">
      <el-form-item label="任务名称">{{taskName}}</el-form-item>
      <el-form-item label="考评模板">{{templateName}}</el-form-item>
      <el-form-item label="考评对象">{{deptName}}</el-form-item>
      <el-form-item label="审核人">{{reviewersName}}</el-form-item>
      <el-form-item label="考评周期">【{{cycleRange}}】派发考评任务</el-form-item>
      <el-form-item label="任务生效期" style="padding-top: 4px; ">{{taskEffectRange}}</el-form-item>
      <el-form-item label="任务描述">{{taskDescribe}}</el-form-item>
    </el-form>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="handleCancel">确 定</el-button>
    </div> -->
  </el-dialog>
</template>
<style lang="less" scoped>
.preiewForm {
  .el-form-item {
    margin-bottom: 5px;
  }
}
</style>

<script>
export default {
  data() {
    return {
      taskName: "",
      taskName: "",
      templateName: "",
      deptName: "",
      reviewersName: "",
      cycleRange: "",
      taskEffectRange: "",
      taskDescribe: ""
    };
  },
  props: ["previewModel", "changeParent", "previewId"],
  computed: {
    reversedMessage: function() {
      return this.previewModel;
    }
  },
  created() {
    this.$get(`/MeEvaluateTask/getTaskInfo/${this.previewId}`, null, data => {
      const _obj = data.object;
      this.taskName = _obj.taskName;
      this.templateName = _obj.templateName;
      this.deptName = _obj.deptName;
      this.reviewersName = _obj.reviewersName;
      this.cycleRange = _obj.cycleRange;
      this.taskEffectRange = _obj.taskEffectRange;
      this.taskDescribe = _obj.taskDescribe;
    });
  },
  methods: {
    handleCancel() {
      this.changeParent("previewModel", false);
    }
  }
};
</script>

