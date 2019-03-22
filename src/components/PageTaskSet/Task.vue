<template>
  <el-dialog
    :title="isTaskEdit?'编辑模板':'添加模板'"
    :visible="reversedMessage"
    @close="handleCancel"
    width="300px"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="模板名称">
        <el-input style="width: 220px;" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="所属组织">
        <el-select v-model="form.region" style="width: 220px;" placeholder="请选择">
          <el-option label="组1" value="beijing"></el-option>
          <el-option label="组2" value="beijing1"></el-option>
          <el-option label="组3" value="beijing2"></el-option>
          <el-option label="组4" value="beijing3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板描述">
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
        desc: "",
        region: "" // 所属组织
      },
    };
  },
  props: ["taskModel", "changeParent", "isTaskEdit"],
  computed: {
    reversedMessage: function() {
      return this.taskModel;
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        row.rowspan &&
        (columnIndex === 0 || columnIndex === 1 || columnIndex === 2)
      ) {
        return {
          rowspan: row.rowspan,
          colspan: 1
        };
      } else if (row.all && columnIndex === 1) {
        return {
          rowspan: 1,
          colspan: 6
        };
      } else if (
        !(row.rowspan || row.all) &&
        (columnIndex === 0 || columnIndex === 1 || columnIndex === 2)
      ) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    handleCancel() {
      this.changeParent("taskModel", false);
    }
  }
};
</script>

