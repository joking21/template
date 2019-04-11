<template>
  <el-dialog title="填报考核任务" :visible="reversedMessage" @close="handleCancel" width="70%">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="任务名称" width="100">
        <el-input style="width: 220px;" v-model="form.taskName" disabled placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="任务描述" width="180">
        <el-input type="textarea" v-model="form.taskDescribe" disabled></el-input>
      </el-form-item>
      <el-form-item label="考核信息" width="100">
        <TableTemp
          v-if="actualList.length !==0"
          :dataList="actualList"
          :startReport="true"
          :changeTotalScore="changeTotalScore"
          ref="tableTemp"
        />
        <div class="d-total">
          <span class="d-title">总分</span>
          <span class="d-score">{{totalScore}}</span>
        </div>
      </el-form-item>
      <p style="font-size: 12px; margin-top: 10px;">计算公式：子指标项得分=（实际值/期望值）*子指标项权重</p>
      <div v-if="form.historyReviewerList.length!==0" class="d-auditOpinion">
        <div v-for="(item, index) in  form.historyReviewerList" :key="index">
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
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="handleSubmit" :loading="canClick">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style lang="less" scoped>
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
}
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
</style>
<script>
import TableTemp from "../Common/TableTemp";
export default {
  data() {
    return {
      form: {
        taskName: "",
        taskDescribe: "",
        historyReviewerList: []
      },
      actualList: [],
      totalScore: 100,
      canClick: false,
    };
  },
  props: ["startReportModel", "changeParent", "checkId", "getList"],
  computed: {
    reversedMessage: function() {
      return this.startReportModel;
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
          this.form.taskDescribe = data.object.taskDescribe;
          this.form.historyReviewerList = data.object.historyReviewerList;
          this.actualList = data.object.actualList;
          this.totalScore = data.object.totalScore;
        }
      );
    },
    handleCancel() {
      this.changeParent("startReportModel", false);
    },
    changeTotalScore() {
      const tableData = this.$refs.tableTemp.tableData;
      let score = 0;
      for (let i = 0; i < tableData.length; i++) {
        const scoreChild = (
          (tableData[i].subIndexItemactualvalues /
            tableData[i].subIndexItemExpectations) *
          tableData[i].subIndexItemWeight
        ).toFixed(2);
        if (!isNaN(parseFloat(scoreChild))) {
          score += parseFloat(scoreChild);
        }
      }
      this.totalScore = score.toFixed(2);
    },
    handleSubmit() {
      this.canClick = true;
      const para = {
        id: this.checkId,
        totalScore: this.totalScore, //总分数
        actualList: []
      };
      const tableData = this.$refs.tableTemp.tableData;
      for (let i = 0; i < tableData.length; i++) {
        const temp = {
          id: tableData[i].subIndexActualId,
          actualScore: tableData[i].subIndexItemactualvalues, // 分数
          weightId: tableData[i].subIndexSaveId //指标项id
        };
        para.actualList.push(temp);
      }
      this.$post("/meEvaluateUserTask/auditOrFillTask", para, data => {
        this.getList();
        this.handleCancel();
        this.canClick = false;
      }, ()=>{
         this.canClick = false;
      });
    }
  }
};
</script>

