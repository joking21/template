<template>
  <el-dialog :title="templateTitle" :visible="reversedMessage" @close="handleCancel" width="70%">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="模板名称">
        <span v-if="isPreview">{{form.templateName}}</span>
        <el-input v-else style="width: 220px;" v-model="form.templateName"></el-input>
      </el-form-item>
      <el-form-item label="所属组织">
        <span v-if="isPreview">{{form.deptName}}</span>
        <el-select
          v-else
          v-model="form.deptId"
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
        <span v-if="isPreview">{{form.templateDescribe}}</span>
        <el-input v-else type="textarea" v-model="form.templateDescribe"></el-input>
      </el-form-item>
      <el-form-item label="选择指标项">
        <TableTemp v-if="isPreview && isShow" :templatePreview="true" :dataList="dataList"/>
        <TableTemp v-else-if="isShow" ref="tableTemp" :isAdd="isAdd" :templateEdit="true" :dataList="dataList"/>
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
        deptId: "", // 所属组织
        deptName: "",
      },
      dataList: [],
      isShow: false,
    };
  },
  props: [
    "templateModel",
    "changeParent",
    "isAdd",
    "isTemplateEdit",
    "isPreview",
    "objectOfEvaluationData",
    "getList",
    "selectedId",
  ],
  created() {
    if (this.isAdd) {
      this.getTableTemp();
    } else {
      this.getDetail();
    }
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
    // 新增的时候，获取表格模板
    getTableTemp() {
      this.$get("/meIndicatorsCategory/treeAndIndicate", null, data => {
        console.log(data);
        this.dataList = data.list;
        this.isShow = true;
      });
    },
    // 查看详情
    getDetail() {
      this.$get(`/meEvaluateTemplate/info/${this.selectedId}`, null, data => {
        console.log(data);
        this.form.templateName = data.object.templateName;
        this.form.templateDescribe = data.object.templateDescribe;
        this.form.deptId = data.object.deptId;
        this.form.deptName = data.object.deptName;
        this.isShow = true;
        this.dataList = data.object.templateTreeVos;
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
            itemsWeight: this.getItemsWeight(
              tableData,
              tableData[i].indexItemId
            ), // 指标项权重
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
      if(this.isTemplateEdit) para.id = this.selectedId;
      const url = this.isTemplateEdit?'/meEvaluateTemplate/update':'/meEvaluateTemplate/save';
      this.$post(url, para, () => {
        this.getList();
        this.handleCancel();
      });
    },
    // 因为指标项的权重如果是多条数据合并表单，则只有第一条数据有值
    getItemsWeight(list, id) {
      for (let j = 0; j < list.length; j++) {
        if (
          id === list[j].indexItemId &&
          list[j].indexItemWeight !== undefined
        ) {
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

