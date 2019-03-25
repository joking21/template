<template>
  <el-dialog title="考评任务详情" :visible="reversedMessage" @close="handleCancel" width="70%">
    <el-form ref="form" :model="form" label-width="100px">
      <el-col :span="12">
        <el-form-item label="任务名称">
          <el-input style="width: 220px;" disabled v-model="form.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="考评填报人">
          <el-input style="width: 220px;" disabled v-model="form.reportName"></el-input>
        </el-form-item>
      </el-col>
      <el-form-item label="任务描述">
        <el-input type="textarea" disabled v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="考核信息">
        <TableTemp :preview='true' />
      </el-form-item>
      <p style="font-size: 12px; margin-top: 10px;">计算公式：子指标项得分=（实际值/期望值）*子指标项权重</p>
      <!-- <div class="d-auditOpinion">
        <el-form-item label="审核结果" prop="region">
          <el-select v-model="form.region">
            <el-option label="通过" value="shanghai"></el-option>
            <el-option label="驳回" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="desc">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </div> -->
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
import TableTemp from '../Common/TableTemp';
export default {
  data() {
    return {
      form: {
        name: "",
        desc: "",
        reportName: "111",
        region: "shanghai",
        desc: "",
      },
    };
  },
  props: ["viewDetailsModel", "changeParent"],
  computed: {
    reversedMessage: function() {
      return this.viewDetailsModel;
    }
  },
  components:{
    TableTemp,
  },
  methods: {
    handleCancel() {
      this.changeParent("viewDetailsModel", false);
    }
  }
};
</script>

