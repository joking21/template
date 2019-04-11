<template>
  <el-table :data="tableData" :span-method="objectSpanMethod" border class="d-temp-table">
    <!-- :label="`${item}级指标分类`" -->
    <el-table-column
      prop="name"
      v-for="item in columnArr"
      :key="item"
      label="指标分类"
      width="100"
    >
      <template slot-scope="scope">
        <!-- 查看详情、开始审核、开始填报、重新填报-->
        {{ scope.row[`name${item}`]}}
      </template>
    </el-table-column>
    <el-table-column prop="indexItem" label="指标项">
      <template slot-scope="scope">
        <!-- 查看 -->
       {{ scope.row.indexItemName}}
      </template>
    </el-table-column>
    <el-table-column prop="indexItemWeight" label="权重" width="80">
      <template slot-scope="scope">
        {{ scope.row.indexItemWeight}}
      </template>
    </el-table-column>
    <el-table-column prop="subIndexItem" label="子指标项">
      <template slot-scope="scope">
       {{ scope.row.subIndexItemName}}
      </template>
    </el-table-column>
    <el-table-column label="权重" width="80">
      <template slot-scope="scope">
        {{ scope.row.subIndexItemWeight}}
      </template>
    </el-table-column>
    <el-table-column prop="expectations" label="期望值" width="80">
      <template slot-scope="scope">
        {{ scope.row.subIndexItemExpectations}}
      </template>
    </el-table-column>
    <el-table-column
      label="实际值"
      width="80"
    >
      <template slot-scope="scope">
        <div v-if="preview">
          <span>{{ scope.row.subIndexItemactualvalues}}</span>
        </div>
        <div v-else>
          <el-input-number
            :min="0"
            v-model="scope.row.subIndexItemactualvalues"
            :controls="false"
            style="width: 60px"
            @change="changeTotal"
          ></el-input-number>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<style lang="less">
.d-temp-table {
  .el-input-number.is-without-controls .el-input__inner {
    padding-left: 8px;
    padding-right: 8px;
  }
  .el-input__inner {
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style>

<script>
export default {
  data() {
    return {
      uniquenessId: 1,
      level: [], // 所有树枝深度
      columnArr: [], // 此表格应该有的级别数    1级指标分类->2级指标分类
      dataArr: [], // 如果后台传回来的是一颗树，则把树转换成单挑数据解析    【过程：计算数的深度、解析成单条数据->再把单条数据弄成表格想要的】
      tableData: [], // 表格最终数据
      maxLevel: 0, // 深度
      tempData: [] // 把单条数据里面的字段初始化【ps: 方便下一步的把父子关系的对象，合并成一条对象】,若要增删字段，则在处理这个数据时操作
    };
  },
  // preview:查看  startReview:开始审核  startReport :开始填报 reReport:重新填报  isTemplatePreview: 查看模板
  props: [
    "preview",
    "startReview",
    "startReport",
    "reReport",
    "templatePreview",
    "dataList",
    "changeTotalScore"
  ],
  created() {
     new Promise((resolve, reject) => {
      this.analyticTree(this.dataList); // 计算this.level  所有树支的深度 把树解析成一条单数据  this.dataArr
      resolve();
    })
      .then(() => {
        this.getMax(this.level); // 计算最深树枝的深度
      })
      .then(() => {
        this.analyticArr(this.dataArr); // 把所有有关联的数据合成一条
      })
      .then(() => {
        this.handleRowspan(); // 处理rowspan
      })
  },
  methods: {
    changeTotal() {
      this.changeTotalScore ? this.changeTotalScore() : null;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //  以下代码不要轻易改的，连顺序都是有要求的
      const maxLevel = this.maxLevel;
      const index = parseInt(columnIndex + 1, 10);
      if (column.property === "indexItemWeight" && row.indexItemName) {
        return {
          rowspan: row.indexItemNamerowspan,
          colspan: 1
        };
      }
      if (column.label == "权重" || column.property === "expectations") {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
      if (column.property === "indexItem" && row.indexItemName) {
        return {
          rowspan: row.indexItemNamerowspan,
          colspan: 1
        };
      }
      if (column.label == "subIndexItem") {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
      if (index <= maxLevel && row[`name${index}`]) {
        return {
          rowspan: row[`name${index}rowspan`],
          colspan: 1
        };
      }
    },
    analyticTree(data, index, level) {
      for (let i = 0; i < data.length; i++) {
        let tempLevel, tempIndex;
        tempLevel = level === undefined ? -1 : level;
        tempIndex = index === undefined ? -2 : index;
        const temp = {
          pid: tempIndex,
          id: this.uniquenessId,
          label: data[i].categoryName || data[i].itemName,
          level: tempLevel,
          rowspan: 1,
          itemId: data[i].itemId,
          actualScore: data[i].actualScore,
          itemExp: data[i].itemExp,
          itemWeight: data[i].itemWeight,
          actualId: data[i].actualId
        };
        this.uniquenessId += 1;
        this.dataArr.push(temp);
        if (data[i].itemList && data[i].itemList.length > 0) {
          tempLevel += 1;
          this.analyticTree(data[i].itemList, temp.id, tempLevel);
        }
        // else {
        //     delete data[i].children;   // 如果后台传回来的是pid的形式，则需要计算出最深的层级，然后把之前递归增加多出来的children清空
        // }
        this.level.push(tempLevel);
      }
    },
    // 取最大层级渲染表格
    getMax(arr) {
      arr.sort(function(a, b) {
        return a - b;
      });
      const max = arr[arr.length - 1];
      for (let i = 1; i <= max; i++) {
        this.columnArr.push(i);
      }
      this.maxLevel = max;
    },
    analyticArr(data) {
      let tempData = JSON.parse(JSON.stringify(data));
      const comData = JSON.parse(JSON.stringify(data));
      for (let i = 0; i < tempData.length; i++) {
        if (this.isSubIndexItem(tempData[i].id, comData)) {
          tempData[i].subIndexItemName = tempData[i].label; // label为后台传到前端的每条数据的名字
          tempData[i].subIndexItemWeight = tempData[i].itemWeight === null ? undefined : tempData[i].itemWeight; //权重   若后端有返回权重，就把这个权重赋值，否则为空权重
          tempData[i].subIndexItemExpectations = tempData[i].itemExp === null ? undefined : tempData[i].itemExp; // 期望值  逻辑同权重
          tempData[i].subIndexItemactualvalues = tempData[i].actualScore === null ? undefined : tempData[i].actualScore; // 实际值
          tempData[i].subIndexItemId = tempData[i].id;
          tempData[i].subIndexSaveId = tempData[i].itemId; // 要传的id
          tempData[i].subIndexActualId = tempData[i].actualId; // 审批时传的id
          tempData[i].subIndexItemNamerowspan = tempData[i].rowspan;
        } else if (this.isIndexItem(tempData[i].id, comData)) {
          tempData[i].indexItemId = tempData[i].id;
          tempData[i].indexSaveId = tempData[i].itemId;
          tempData[i].indexItemName = tempData[i].label; // label为后台传到前端的每条数据的名字
          tempData[i].indexItemNamerowspan = tempData[i].rowspan;
          tempData[i].indexItemWeight = tempData[i].itemWeight === null ? undefined : tempData[i].itemWeight; //权重   若后端有返回权重，就把这个权重赋值，否则为空权重
        } else {
          const name = `name${tempData[i].level + 2}`;
          tempData[i][name] = tempData[i].label;
          tempData[i][`${name}rowspan`] = tempData[i].rowspan;
          tempData[i][`${name}Id`] = tempData[i].id;
          tempData[i][`levelId-${tempData[i].id}`] = tempData[i].id;
        }
      }
      this.tempData = tempData;
      this.tableData = this.concatArr();
    },
    // 判断是否是指标项 -> 判断依据：子类是否还有子类
    isIndexItem(id, data) {
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        if (id === data[i].pid) {
          for (let j = 0; j < data.length; j++) {
            if (data[i].id === data[j].pid) {
              temp.push(1);
            }
          }
        }
      }
      if (temp.length !== 0) {
        return false;
      }
      return true;
    },
    isSubIndexItem(id, data) {
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        if (id === data[i].pid) {
          temp.push(1);
        }
      }
      if (temp.length !== 0) {
        return false;
      }
      return true;
    },
    // 合并多条数据
    concatArr() {
      let tempData = JSON.parse(JSON.stringify(this.tempData));
      let tempChild = [];
      let tempArr = [];
      for (let i = 0; i < tempData.length; i++) {
        for (let j = 0; j < tempData.length; j++) {
          if (tempData[i].id === tempData[j].pid) {
            tempArr.push(1);
          }
        }
        if (tempArr.length === 0) {
          tempChild.push(tempData[i]);
        }
        tempArr = [];
      }
      for (let m = 0; m < tempChild.length; m++) {
        this.findParent(tempChild[m]);
      }
      for (let i = 0; i < tempChild.length; i++) {
        tempChild[i].id = i;
      }
      return tempChild;
    },
    findParent(obj) {
      let tempData = JSON.parse(JSON.stringify(this.tempData));
      for (let i = 0; i < tempData.length; i++) {
        if (obj.pid === tempData[i].id) {
          obj = Object.assign(obj, tempData[i]);
          this.findParent(obj, tempData);
        }
      }
    },
    test(data, id) {
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        if (data.pid === id) {
          temp.push(i); // 找到对应位置
        }
      }
      return temp;
    },
    handleRowspan() {
      let data = this.tableData;
      let indexItemNamerowspanArr = [];
      let subIndexItemNamerowspanArr = [];
      let nameArr = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (
            data[i].indexItemId === data[j].indexItemId &&
            data[i].id !== data[j].id &&
            !data[i].indexItemFixed &&
            data[i].indexItemNamerowspan
          ) {
            data[i].indexItemNamerowspan++;
            data[j].indexItemNamerowspan = 0;
            data[j].indexItemFixed = true;
          }
          for (let k = 1; k <= this.maxLevel; k++) {
            const name = `name${k}`;
            if (
              data[i][`${name}Id`] === data[j][`${name}Id`] &&
              data[i].id !== data[j].id &&
              !data[i][`${name}Fixed`] &&
              data[i][`${name}rowspan`]
            ) {
              data[i][`${name}rowspan`]++;
              data[j][`${name}rowspan`] = 0;
              data[j][`${name}Fixed`] = true;
            }
          }
        }
      }
    }
  }
};
</script>

