<template>
  <el-dialog :title="templateTitle" :visible="reversedMessage" @close="handleCancel" width="70%">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="模板名称">
        <el-input style="width: 220px;" :disabled="isPreview" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="所属组织">
        <el-select
          v-model="form.region"
          :disabled="isPreview"
          style="width: 220px;"
          placeholder="请选择"
        >
          <el-option label="组1" value="beijing"></el-option>
          <el-option label="组2" value="beijing1"></el-option>
          <el-option label="组3" value="beijing2"></el-option>
          <el-option label="组4" value="beijing3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板描述">
        <el-input type="textarea" v-model="form.desc" :disabled="isPreview"></el-input>
      </el-form-item>
      <el-form-item label="选择指标项">
        <TableTemp v-if="isPreview" :templatePreview="true" :dataList="dataList"/>
        <TableTemp v-else :templateEdit="true" :dataList="dataList"/>
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
import TableTemp from "../Common/TableTemp1.vue";
export default {
  data() {
    return {
      form: {
        name: "",
        desc: "",
        region: "" // 所属组织
      },
      dataList: []
    };
  },
  props: ["templateModel", "changeParent", "isTemplateEdit", "isPreview"],
  created() {
    this.getTableTemp();
  },
  computed: {
    reversedMessage() {
      return this.templateModel;
    },
    templateTitle() {
      if (this.isTemplateEdit) {
        return "编辑模板";
      }
      if (this.isPreview) {
        return "查看模板";
      }
      return "添加模板";
    }
  },
  components: {
    TableTemp
  },
  methods: {
    getTableTemp() {
      this.$get("/meIndicatorsCategory/treeAndIndicate", null, data => {
        console.log(data);
        this.dataList = data.list;
      });
    },
    handleCancel() {
      this.changeParent("templateModel", false);
    }
  }
};
</script>

