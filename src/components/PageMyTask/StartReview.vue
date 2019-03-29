<template>
  <el-dialog title="考评任务审核" :visible="reversedMessage" @close="handleCancel" width="70%">
    <el-form ref="form" :model="form" label-width="100px">
      <el-col :span="12">
        <el-form-item label="任务名称">
          <el-input style="width: 220px;" disabled v-model="form.taskName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="考评填报人">
          <el-input style="width: 220px;" disabled v-model="form.deptName"></el-input>
        </el-form-item>
      </el-col>
      <el-form-item label="任务描述">
        <el-input type="textarea" disabled v-model="form.taskDescribe"></el-input>
      </el-form-item>
      <el-form-item label="考核信息">
        <TableTemp
          v-if="actualList.length !==0"
          ref="tableTemp"
          :startReview="true"
          :dataList="actualList"
          :changeTotalScore="changeTotalScore"
        />
        <div class="d-total">
          <span class="d-title">总分</span>
          <span class="d-score">{{totalScore}}</span>
        </div>
      </el-form-item>
      <p style="font-size: 12px; margin-top: 10px;">计算公式：子指标项得分=（实际值/期望值）*子指标项权重</p>
      <div class="d-auditOpinion">
        <el-form-item label="审核结果" prop="region">
          <el-select v-model="form.evaluateStatus">
            <el-option label="通过" :value="3"></el-option>
            <el-option label="驳回" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="desc">
          <el-input type="textarea" v-model="form.reviewerOpinion"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style lang="less" scoped>
.d-auditOpinion {
  border: 1px dashed #eeeeee;
  min-height: 20px;
  margin-top: 20px;
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
        deptName: "",
        evaluateStatus: 3, //结果
        reviewerOpinion: "" //原因
      },
      actualList: [],
      totalScore: ""
    };
  },
  props: ["startReviewVisible", "changeParent", "checkId"],
  computed: {
    reversedMessage: function() {
      return this.startReviewVisible;
    }
  },
  components: {
    TableTemp
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$get(
        `/meEvaluateUserTask/getTaskDetail/${this.checkId}`,
        null,
        data => {
          this.form.taskName = data.object.taskName;
          this.form.reviewerName = data.object.reviewerName;
          this.form.deptName = data.object.deptName;
          this.actualList = data.object.actualList;
          this.totalScore = data.object.totalScore;
        }
      );
    },
    changeTotalScore() {
      const tableData = this.$refs.tableTemp.tableData;
      let score = 0;
      for (let i = 0; i < tableData.length; i++) {
        score += parseInt(tableData[i].subIndexItemactualvalues, 10);
      }
      this.totalScore = score;
    },
    handleCancel() {
      this.changeParent("startReviewVisible", false);
    },
    handleSubmit() {
      const para = {
        id: this.checkId,
        totalScore: this.totalScore, //总分数
        actualList: [],
        evaluateStatus: this.form.evaluateStatus,
        reviewerOpinion: this.form.reviewerOpinion
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
      this.$post('/meEvaluateUserTask/auditOrFillTask', para, (data)=>{
        this.handleCancel();
      })
    }
  }
};
</script>

