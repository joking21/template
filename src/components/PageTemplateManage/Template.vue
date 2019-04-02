<template>
  <el-dialog :title="templateTitle" :visible="reversedMessage" @close="handleCancel" width="70%">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="模板名称">
        <el-input style="width: 220px;" :disabled="isPreview" v-model="form.templateName"></el-input>
      </el-form-item>
      <el-form-item label="所属组织">
        <el-select
          v-model="form.deptId"
          :disabled="isPreview"
          style="width: 100%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in objectOfEvaluationData"
            :key="item.id"
            :label="item.deptStructureName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板描述">
        <el-input type="textarea" v-model="form.desc" :disabled="isPreview"></el-input>
      </el-form-item>
      <el-form-item label="选择指标项">
        <TableTemp v-if="isPreview" :templatePreview="true" :dataList="dataList"/>
        <TableTemp v-else ref="tableTemp" :templateEdit="true" :dataList="dataList"/>
      </el-form-item>
      <p style="font-size: 12px; margin-top: 10px;">计算公式：子指标项得分=（实际值/期望值）*子指标项权重</p>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import TableTemp from "../Common/TableTempSet.vue";
export default {
  data() {
    return {
      form: {
        templateName: "",
        templateDescribe: "",
        deptId: "" // 所属组织
      },
      dataList: []
    };
  },
  props: [
    "templateModel",
    "changeParent",
    "isTemplateEdit",
    "isPreview",
    "objectOfEvaluationData",
    "getList"
  ],
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
    },
    handleSubmit() {
      if (this.isPreview) {
        this.handleCancel();
        return;
      }
      const tableData = this.$refs.tableTemp.tableData;
      const name = this.$refs.tableTemp.columnArr;
      const meEvaluateTemplateWeightList = [];
      for (let i = 0; i < tableData.length; i++) {
        if (this.checkData(tableData[i], name, tableData)) {
          const _obj = {
            itemsId: tableData[i].indexSaveId, // 指标项id
            itemsWeight: this.getItemsWeight(tableData, tableData[i].indexItemId), // 指标项权重
            childItemsId: tableData[i].subIndexSaveId, // 子指标项id
            expectations: tableData[i].subIndexItemExpectations, // 子指标项期望值
            weight: tableData[i].subIndexItemWeight // 子指标项权重
          };
          meEvaluateTemplateWeightList.push(_obj);
        }
      }
      const para = {
        templateName: this.form.templateName,
        templateDescribe: this.form.templateDescribe,
        deptId: this.form.deptId, // 所属组织
        meEvaluateTemplateWeightList: meEvaluateTemplateWeightList
      };
      this.$post("/meEvaluateTemplate/save", para, ()=>{
        this.getList();
        this.handleCancel();
      })
    },
    // 因为指标项的权重如果是多条数据合并表单，则只有第一条数据有值
    getItemsWeight(list, id) {
      for (let j = 0; j < list.length; j++) {
        if (id === list[j].indexItemId && list[j].indexItemWeight !== undefined) {
            return list[j].indexItemWeight;
        }
      }
    },
    // 检查数据是否传给后台
    checkData(data, nameArr, list) {
      for (let i = 0; i < nameArr.length; i++) {
        const name = `name${nameArr[i]}`;
        if (data[name]) {
          const temp = [];
          for (let j = 0; j < list.length; j++) {
            if (
              data[`${name}Id`] === list[j][`${name}Id`] &&
              list[j][`${name}Checked`] === true
            ) {
              temp.push(1);
            }
          }
          if (temp.length === 0) return false;
        }
      }
      if (data.indexItemName) {
        const temp = [];
        for (let j = 0; j < list.length; j++) {
          if (
            data.indexItemId === list[j].indexItemId &&
            list[j].indexItemChecked === true
          ) {
            temp.push(1);
          }
        }
        if (temp.length === 0) return false;
      }
      if (!data.subIndexItemName || data.subIndexItemChecked === false) {
        return false;
      }
      return true;
    }
  }
};
</script>

