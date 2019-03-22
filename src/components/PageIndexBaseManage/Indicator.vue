<template>
  <el-dialog
    :title="IndicatorIsEdit?'编辑指标':'新增指标'"
    :visible="reversedMessage"
    @close="closeModel"
    width="300"
  >
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="指标项">
        <el-input style="width: 220px;" :disabled="IndicatorIsEdit" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="指标来源">
        <el-select v-model="form.type" disabled>
          <el-option label="指标一" value="shanghai"></el-option>
          <el-option label="指标二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指标描述">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" round @click="addSubIndicator">添加子指标项</el-button>
        <el-form-item
          v-for="(item, index) in form.subIndicatorName"
          :key="index"
          label="子指标项"
          label-width="73px"
          style="margin-bottom: 5px;"
        >
          <el-col :span="16">
            <el-input v-model="item.name"></el-input>
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
        name: "",
        type: "shanghai",
        desc: "",
        subIndicatorName: []
      }
    };
  },
  props: ["IndicatorModel", "changeParent", "IndicatorIsEdit"],
  computed: {
    reversedMessage: function() {
      return this.IndicatorModel;
    }
  },
  methods: {
    handleCancel() {
      this.changeParent("IndicatorModel", false);
      this.changeParent("NewclassificationIsEdit", false);
    },
    closeModel() {
      this.handleCancel();
      this.form = {
        name: "",
        type: "shanghai",
        desc: "",
        subIndicatorName: []
      };
    },
    addSubIndicator() {
      this.form.subIndicatorName.push({ name: "" });
    },
    deleteSubIndicator(index) {
      this.form.subIndicatorName.splice(index, 1);
      //   splice(index,len,[item])
    },
    submitFun() {
      console.log(this.form);
    }
  }
};
</script>

