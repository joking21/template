<template>
  <el-dialog title="填报考核任务" :visible="reversedMessage" @close="handleCancel" width="70%">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="任务名称" width="100">
        <el-input style="width: 220px;" v-model="form.name" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="任务描述" width="180">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="考核信息" width="100">
         <TableTemp :startReport='true' />
      </el-form-item>
      <p style="font-size: 12px; margin-top: 10px;">计算公式：子指标项得分=（实际值/期望值）*子指标项权重</p>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import TableTemp from '../Common/TableTemp';
export default {
  data() {
    return {
      form: {
        name: "",
        desc: ""
      },
    };
  },
  props: ["startReportModel", "changeParent"],
  computed: {
    reversedMessage: function() {
      return this.startReportModel;
    }
  },
  components: {
    TableTemp,
  },
  methods: {
    handleCancel() {
      this.changeParent("startReportModel", false);
    }
  }
};
</script>

