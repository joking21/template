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
        <el-table :data="tableData6" :span-method="objectSpanMethod" border>
          <el-table-column prop="amount1" label="指标分类" width="100"></el-table-column>
          <el-table-column prop="amount2" label="指标项" width="180"></el-table-column>
          <el-table-column prop="amount3" label="权重"></el-table-column>
           <el-table-column prop="amount4" label="子指标项" width="180"></el-table-column>
          <el-table-column prop="amount5" label="权重"></el-table-column>
          <el-table-column prop="amount6" label="期望值（%）"></el-table-column>
          <el-table-column label="实际值（%）" width="80">
            <template slot-scope="scope">
              <el-input v-model="scope.row.amount7"></el-input>
            </template>
          </el-table-column>
        </el-table>
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
      tableData6: [
        {
          amount1: "业务类",
          amount2: "数据资源共享考评",
          amount3: 100,
          amount4: "接入情况",
          amount5: "30",
          amount6: "90",
          amount7: "81",
          rowspan: 4
        },
        {
          amount1: "业务类",
          amount2: "数据资源共享考评",
          amount3: 100,
          amount4: "平台使用率",
          amount5: "30",
          amount6: "90",
          amount7: "81"
        },
        {
          amount1: "业务类",
          amount2: "数据资源共享考评",
          amount3: 100,
          amount4: "资源共享情况",
          amount5: "30",
          amount6: "90",
          amount7: "81"
        },
        {
          amount1: "业务类",
          amount2: "数据资源共享考评",
          amount3: 100,
          amount4: "资源目录系统",
          amount5: "30",
          amount6: "90",
          amount7: "81"
        },
        {
          amount1: "总分",
          amount2: "90",
          all: 1
        }
      ]
    };
  },
  props: ["viewDetailsModel", "changeParent"],
  computed: {
    reversedMessage: function() {
      return this.viewDetailsModel;
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
      this.changeParent("viewDetailsModel", false);
    }
  }
};
</script>

