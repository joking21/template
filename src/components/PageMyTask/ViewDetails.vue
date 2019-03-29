<template>
  <el-dialog title="考评任务详情" :visible="reversedMessage" @close="handleCancel" width="70%">
    <el-form ref="form" :model="form" label-width="100px">
      <el-col :span="24">
        <el-form-item label="任务名称">{{form.taskName}}</el-form-item>
      </el-col>
      <el-form-item label="任务描述">{{form.taskDescribe}}</el-form-item>
      <el-form-item label="考核信息">
        <TableTemp :preview="true" v-if="actualList.length !== 0" :dataList="actualList"/>
      </el-form-item>
      <p style="font-size: 12px; margin-top: 10px;">计算公式：子指标项得分=（实际值/期望值）*子指标项权重</p>
      <div class="d-auditOpinion">
        <el-form-item label="审核人" prop="region">{{form.reviewerName}}</el-form-item>
        <el-form-item label="审核结果" prop="region">{{form.reviewerStatus}}</el-form-item>
        <el-form-item label="审核意见" prop="desc">{{form.reviewerOpinion}}</el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style lang="less" scoped>
.d-auditOpinion {
  border: 1px dashed #eeeeee;
  min-height: 20px;
  margin-top: 20px;
}
</style>

<script>
import TableTemp from "../Common/TableTemp";
export default {
  data() {
    return {
      form: {
        taskName: "",
        taskDescribe: "",
        reviewerName: "",
        reviewerStatus: "",
        reviewerOpinion: ""
      },
      actualList: [],
    };
  },
  props: ["viewDetailsModel", "changeParent", "checkId"],
  computed: {
    reversedMessage: function() {
      return this.viewDetailsModel;
    }
  },
  components: {
    TableTemp
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 获取详情
    getDetail() {
      this.$get(
        `/meEvaluateUserTask/getTaskDetail/${this.checkId}`,
        null,
        data => {
          console.log(data);
          this.form.taskName = data.object.taskName;
          this.form.reviewerName = data.object.reviewerName;
          this.form.taskDescribe = data.object.taskDescribe;
          this.form.reviewerStatus = data.object.reviewerStatus;
          this.form.reviewerOpinion = data.object.reviewerOpinion;
          this.actualList =  data.object.actualList;
        }
      );
    },
    handleCancel() {
      this.changeParent("viewDetailsModel", false);
    }
  }
};
</script>

