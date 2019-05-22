<template>
  <el-dialog
    title="考评任务详情"
    :visible="reversedMessage"
    @close="handleCancel"
    width="70%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="form" :model="form" label-width="100px">
      <el-col :span="24">
        <el-form-item label="任务名称">{{form.taskName}}</el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="考评填报人">{{form.fillInUserName}}</el-form-item>
      </el-col>
      <el-form-item label="任务描述">{{form.taskDescribe}}</el-form-item>
      <el-form-item label="考核信息">
        <TableTemp :preview="true" v-if="actualList.length !== 0" :dataList="actualList"/>
        <div class="d-total">
          <span class="d-title">总分</span>
          <span class="d-score">{{totalScore}}</span>
        </div>
      </el-form-item>
      <p style="font-size: 12px; margin-top: 10px;">计算公式：子指标项得分=（实际值/期望值）*子指标项权重</p>
      <div v-if="form.historyReviewerList.length!==0" class="d-auditOpinion">
        <div
          v-for="(item, index) in  form.historyReviewerList"
          :key="index"
          :class="index!==0?'line desc':'desc'"
        >
          <p>
            <span class="leftAuditOpinion">审核人</span>
            <span>{{item.reviewerName}}</span>
          </p>
          <p>
            <span class="leftAuditOpinion">审核结果</span>
            <span>{{item.reviewerStatus}}</span>
          </p>
          <p>
            <span class="leftAuditOpinion">审核意见</span>
            <span>{{item.reviewerOpinion}}</span>
          </p>
          <p>
            <span class="leftAuditOpinion">审核时间</span>
            <span>{{item.reviewerTime}}</span>
          </p>
        </div>
      </div>
    </el-form>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>-->
  </el-dialog>
</template>
<style lang="less" scoped>
.d-total {
  height: 36px;
  line-height: 36px;
  border: 1px solid #e9e9e9;
  font-size: 13px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #333333;
  border-top: none;
  .d-title {
    display: inline-block;
    padding-left: 15px;
    width: 84px;
    border-right: 1px solid #e9e9e9;
  }
  .d-score {
    display: inline-block;
    padding-left: 15px;
  }
}
.d-auditOpinion {
  border: 1px dashed #eeeeee;
  min-height: 20px;
  margin-top: 20px;
  line-height: 30px;
  .leftAuditOpinion {
    display: inline-block;
    width: 100px;
    text-align: right;
    margin-right: 10px;
  }
  .line {
    padding-top: 10px;
    border-top: 1px dashed #d5d5d5;
  }
  .desc {
    margin: 0 13px;
  }
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
        historyReviewerList: "",
        fillInUserName: ""
      },
      actualList: [],
      totalScore: ""
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
          this.form.taskName = data.object.taskName;
          this.form.fillInUserName = data.object.fillInUserName;
          this.form.taskDescribe = data.object.taskDescribe;
          this.form.historyReviewerList = data.object.historyReviewerList;
          this.totalScore = data.object.totalScore;
          this.actualList = data.object.actualList;
        }
      );
    },
    handleCancel() {
      this.changeParent("viewDetailsModel", false);
    }
  }
};
</script>

