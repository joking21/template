<template>
  <el-dialog title="查看任务" :visible="reversedMessage" @close="handleCancel">
    <el-form label-width="30%" class="preiewForm">
      <el-form-item label="任务名称">
        ww
      </el-form-item>
      <el-form-item label="考评模板">
       cdfsf
      </el-form-item>
      <el-form-item label="考评对象">
        fdfdsfdsfd
      </el-form-item>
      <el-form-item label="审核人">
        
      </el-form-item>
      <el-form-item label="考评周期">
        
      </el-form-item>
      <el-form-item label="任务生效期" style="padding-top: 4px; ">
        
      </el-form-item>
      <el-form-item label="任务描述">
        eee
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="handleCancel">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style lang="less" scoped>
.preiewForm{
  .el-form-item{
    margin-bottom: 5px;
  }
}
</style>

<script>
export default {
  data() {
    return {

     
    };
  },
  props: ["previewModel", "changeParent",],
  computed: {
    reversedMessage: function() {
      return this.previewModel;
    }
  },
  created() {
    
  },
  methods: {
    // 获取审批人
    handleCancel() {
      this.changeParent("previewModel", false);
    },
  }
};
</script>

