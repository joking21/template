<template>
  <el-dialog
    :title="IndicatorIsEdit?'编辑指标':'新增指标'"
    :visible="reversedMessage"
    @close="handleCancel"
    width="300"
  >
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="指标项">
        <el-input style="width: 220px;" :disabled="IndicatorIsEdit" v-model="form.indicatorsName"></el-input>
      </el-form-item>
      <el-form-item label="指标来源">
        <el-select v-model="form.indicatorsSource" disabled>
          <el-option label="人工" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指标描述">
        <el-input type="textarea" v-model="form.indicatorsDescribe"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" round @click="addSubIndicator">添加子指标项</el-button>
        <el-form-item
          v-for="(item, index) in form.meIndicatorsChildItemsList"
          :key="index"
          label="子指标项"
          label-width="73px"
          style="margin-bottom: 5px;"
        >
          <el-col :span="16">
            <el-input v-model="item.indicatorsLoverName"></el-input>
          </el-col>
          <el-col :span="8">
            <i
              class="el-icon-minus"
              @click="deleteSubIndicator(index)"
              style="font-size:18px; margin-left:10px; cursor:pointer;"
            ></i>
          </el-col>
        </el-form-item>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="submitFun">确 定</el-button>
    </div>
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
  props: [
    "IndicatorModel",
    "changeParent",
    "IndicatorIsEdit",
    "categoryId",
    "getList",
    "editId"
  ],
  computed: {
    reversedMessage: function() {
      return this.IndicatorModel;
    }
  },
  created() {
    if (this.IndicatorIsEdit) {
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      this.$get(`/meIndicatorsItems/info/${this.editId}`, null, data => {
        this.form.indicatorsName = data.object.indicatorsName;
        this.form.indicatorsSource = data.object.indicatorsSource;
        this.form.indicatorsDescribe = data.object.indicatorsDescribe;
        this.form.categoryId = data.object.categoryId;
        const list = data.object.meIndicatorsChildItemsList;
        for (let i = 0; i < list.length; i++) {
          this.form.meIndicatorsChildItemsList.push({
            indicatorsLoverName: list[i].indicatorsLoverName
          });
        }
      });
    },
    handleCancel() {
      this.changeParent("IndicatorModel", false);
    },
    addSubIndicator() {
      if (this.form.meIndicatorsChildItemsList.length >= 5) {
        return this.$message({
          message: "最多添加5个子指标项。",
          type: "warning"
        });
      }
      this.form.meIndicatorsChildItemsList.push({ indicatorsLoverName: "" });
    },
    deleteSubIndicator(index) {
      this.form.meIndicatorsChildItemsList.splice(index, 1);
    },
    submitFun() {
      this.form.categoryId = this.categoryId;
      this.IndicatorIsEdit ? (this.form.id = this.editId) : null;
      const url = this.IndicatorIsEdit
        ? "/meIndicatorsItems/update"
        : "/meIndicatorsItems/save";
      this.$post(url, this.form, () => {
        this.getList();
        this.handleCancel();
      });
    }
  }
};
</script>

