<template>
  <el-dialog title="填报考核任务" :visible="reversedMessage" @close="handleCancel" width="70%">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="任务名称" width="100">
        <el-input style="width: 220px;" disabled v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="任务描述" width="180">
        <el-input type="textarea" disabled v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="考核信息" width="100">
         <TableTemp :reReport='true' ref="tableTemp" />
      </el-form-item>
      <p style="font-size: 12px; margin-top: 10px;">计算公式：子指标项得分=（实际值/期望值）*子指标项权重</p>
      <div class="d-auditOpinion">
        <div class="d-disagree">
          <p>
            <span class="title">审核人</span>
            <span>周XXX</span>
          </p>
          <p>
            <span class="title">审核结果</span>
            <span>审核不通过</span>
          </p>
          <p>
            <span class="title">审核意见</span>
            <span>你填写的数据不正确</span>
          </p>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style lang="less" scoped>
.d-auditOpinion {
  border: 1px dashed #eeeeee;
  min-height: 20px;
  margin-top: 20px;
  .d-disagree {
    padding: 15px;
    line-height: 30px;
    .title{
      display: inline-block;
      width: 120px;
      text-align: right;
    }
    span {
      font-size: 13px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin-right: 10px;
    }
  }
}
</style>
<script>
import TableTemp from '../Common/TableTemp';
export default {
  data() {
    return {
      form: {
        name: "不可填的任务名称",
        desc: "不可填的任务描述"
      },
    };
  },
  props: ["reReportVisible", "changeParent"],
  computed: {
    reversedMessage: function() {
      return this.reReportVisible;
    }
  },
  components: {
    TableTemp
  },
  methods: {
    handleCancel() {
      this.changeParent("reReportVisible", false);
    },
    submit(){
      console.log(this.$refs.tableTemp.tableData);
    }
  }
};
</script>

