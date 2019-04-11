<template>
  <el-dialog
    :title="NewclassificationIsEdit?'编辑分类':'新增分类'"
    :visible="reversedMessage"
    @close="handleCancel"
    width="300"
  >
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="指标分类名称" width="100">
        <el-input style="width: 220px;"  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="上级指标分类" width="100">
        <el-select v-model="form.pId" disabled>
          <el-option :label="form.pIdName" :value="form.pId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" width="180">
        <el-input type="textarea" v-model="form.information"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="handleSubmit" :loading="canClick">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        information: "",
        pIdName: "",
        pId: ""
      },
      canClick: false,
    };
  },
  props: [
    "NewclassificationModel",
    "changeParent",
    "NewclassificationIsEdit",
    "selectData",
    "getList"
  ],
  computed: {
    reversedMessage: function() {
      return this.NewclassificationModel;
    }
  },
  created() {
    if (this.NewclassificationIsEdit) {
      this.form.name = this.selectData.name;
      this.form.pIdName = this.selectData.pIdName;
      this.form.pId = this.selectData.pId;
      // 获取详细信息
       this.$get(`/meIndicatorsCategory/info/${this.selectData.id}`, null , (data)=>{
         this.form.information = data.object.information;
       })
    } else {
      this.form.pIdName = this.selectData.name;
      this.form.pId = this.selectData.id;
    }
  },
  methods: {
    handleCancel() {
      this.changeParent("NewclassificationModel", false);
    },
    handleSubmit() {
      this.canClick = true;
      const para = {
        name: this.form.name,
        information: this.form.information,
        pId: this.form.pId
      };
      this.NewclassificationIsEdit ? (para.id = this.selectData.id) : null;
      const url = this.NewclassificationIsEdit
        ? "/meIndicatorsCategory/update"
        : "/meIndicatorsCategory/save";
      this.$post(url, para, () => {
        this.getList();
        this.handleCancel();
        this.canClick = false;
      },()=>{
        this.canClick = false;
      });
    }
  }
};
</script>

