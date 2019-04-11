<template>
  <el-dialog
    title="查看详情"
    :visible="reversedMessage"
    @close="handleCancel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="form" :model="form" label-width="30%" class="preiewForm">
      <el-form-item label="指标项：">{{form.indicatorsName}}</el-form-item>
      <el-form-item label="指标来源：">{{form.indicatorsSource == 0 ? '人工': '其它'}}</el-form-item>
      <el-form-item label="指标描述：">{{form.indicatorsDescribe}}</el-form-item>
      <el-form-item
        v-for="(item, index) in form.meIndicatorsChildItemsList"
        :key="index"
        label="子指标项："
      >{{item.indicatorsLoverName}}</el-form-item>
    </el-form>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="handleCancel">确 定</el-button>
    </div>-->
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      form: {
        indicatorsName: "",
        indicatorsSource: 0,
        indicatorsDescribe: "",
        categoryId: "",
        meIndicatorsChildItemsList: []
      }
    };
  },
  props: ["previewModel", "changeParent", "editId"],
  computed: {
    reversedMessage: function() {
      return this.previewModel;
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$get(`/meIndicatorsItems/info/${this.editId}`, null, data => {
        this.form.indicatorsName = data.object.indicatorsName;
        this.form.indicatorsSource = data.object.indicatorsSource;
        this.form.indicatorsDescribe = data.object.indicatorsDescribe;
        this.form.categoryId = data.object.categoryId;
        this.form.meIndicatorsChildItemsList =
          data.object.meIndicatorsChildItemsList;
      });
    },
    handleCancel() {
      this.changeParent("previewModel", false);
    }
  }
};
</script>

