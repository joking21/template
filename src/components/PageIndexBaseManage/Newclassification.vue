<template>
  <el-dialog
    :title="NewclassificationIsEdit?'编辑分类':'新增分类'"
    :visible="reversedMessage"
    @close="closeModel"
    width="300"
  >
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="指标分类名称" width="100">
        <el-input style="width: 220px;" :disabled="NewclassificationIsEdit" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="上级指标分类" width="100">
        <el-select v-model="form.type" disabled>
          <el-option label="指标一" value="shanghai"></el-option>
          <el-option label="指标二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" width="180">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        type: "shanghai",
        desc: ""
      }
    };
  },
  props: ["NewclassificationModel", "changeParent", "NewclassificationIsEdit"],
  computed: {
    reversedMessage: function() {
      return this.NewclassificationModel;
    }
  },
  methods: {
    handleCancel() {
      this.changeParent("NewclassificationModel", false);
    },
    closeModel() {
      this.handleCancel();
      this.form = {
        name: "",
        type: "shanghai",
        desc: ""
      };
    }
  }
};
</script>

